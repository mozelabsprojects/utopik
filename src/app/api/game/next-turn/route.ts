import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processNextTurn, clampStat, calculateRelationship, checkAchievements } from "@/lib/game-engine";
import { GameState, MarketState, HistoryRecord } from "@/lib/types";
import { INITIAL_FACTIONS, modifyFactionSupport, FactionsState } from "@/lib/factions";
import { COUNTRIES } from "@/lib/countries-data";

export async function POST(request: Request) {
  try {
    const { gameId } = await request.json();

    const game = await prisma.game.findUnique({ 
      where: { id: gameId },
      include: {
        tradeAgreements: true,
        worldCountries: { orderBy: { name: 'asc' } },
      }
    });

    if (!game) {
      return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    }

    if (game.isGameOver) {
      return NextResponse.json({ error: "Oyun bitti" }, { status: 400 });
    }

    if (game.currentEventId) {
      return NextResponse.json(
        { error: "Önce mevcut olayda bir seçim yapmalısınız!" },
        { status: 400 }
      );
    }

    // Turn reports ve ticaret gelirleri
    let currentReports: string[] = [];
    try { currentReports = JSON.parse(game.turnReports); } catch {}

    let tradeIncome = 0;
    const activeAgreements = [];
    for (const trade of game.tradeAgreements) {
      if (trade.turnsRemaining > 0) {
        // Fluctuation: +/- 20% each turn
        const fluctuation = 0.8 + (Math.random() * 0.4); 
        const currentTurnIncome = Math.round(trade.incomePerTurn * fluctuation);
        
        tradeIncome += currentTurnIncome;
        
        // Push with original base income, just decrement turn
        activeAgreements.push({
          id: trade.id,
          turnsRemaining: trade.turnsRemaining - 1,
          incomePerTurn: trade.incomePerTurn // keep base
        });
      }
    }

    // Ticaret sürelerini güncelle (süresi 0 olanları sil, diğerlerini güncelle)
    const tradeOps = [];
    for (const active of activeAgreements) {
      if (active.turnsRemaining <= 0) {
        tradeOps.push(prisma.tradeAgreement.delete({ where: { id: active.id } }));
      } else {
        tradeOps.push(prisma.tradeAgreement.update({
          where: { id: active.id },
          data: { turnsRemaining: active.turnsRemaining }
        }));
      }
    }
    if (tradeOps.length > 0) {
      await prisma.$transaction(tradeOps);
    }

    let totalAiAttackDamage = 0;
    let aiFinancialAid = 0;
    let totalWarExhaustion = 0;
    let isAtWar = false;
    let activeAlliesCount = 0;
    const aiMessages: string[] = [];

    // Diplomacy ve Market State'lerini parse et
    let diplomacyState: any = {};
    try {
      diplomacyState = JSON.parse(game.diplomacyState); } catch {}
    
    // Fraksiyonları parse et (Savaş domino etkileri için)
    let factions: FactionsState = INITIAL_FACTIONS;
    try { factions = JSON.parse(game.factions); } catch { factions = INITIAL_FACTIONS; }
    if (Object.keys(factions).length === 0) factions = INITIAL_FACTIONS;

    let marketState: MarketState = { 
      prices: { energy: 100, food: 50, tech: 200, medical: 150, arms: 300, minerals: 80 }, 
      inventory: { energy: 0, food: 0, tech: 0, medical: 0, arms: 0, minerals: 0 },
      history: []
    };
    try {
      const parsedMarket = JSON.parse(game.marketState);
      if (parsedMarket.prices && parsedMarket.inventory) {
        marketState = {
          ...parsedMarket,
          prices: { ...marketState.prices, ...parsedMarket.prices },
          inventory: { ...marketState.inventory, ...parsedMarket.inventory },
          history: parsedMarket.history || []
        };
      }
    } catch {}

    let eventFlags: string[] = [];
    try { eventFlags = JSON.parse(game.eventFlags || "[]"); } catch {}

    // Borsa Fiyat Dalgalanması (Event'lere Göre Dinamik)
    const multipliers = { energy: 1, food: 1, tech: 1, medical: 1, arms: 1, minerals: 1 };
    
    // Uzman süresini düş ve manipülasyon riskini hesapla
    let triggeredInvestigation = false;
    if (marketState.expertTurnsRemaining && marketState.expertTurnsRemaining > 0) {
      const riskChance = marketState.activeExpertLevel === 3 ? 0.15 : (marketState.activeExpertLevel === 2 ? 0.10 : 0.05);
      if (Math.random() < riskChance) {
        triggeredInvestigation = true;
      }

      marketState.expertTurnsRemaining -= 1;
      if (marketState.expertTurnsRemaining === 0) {
        marketState.activeExpertLevel = 0;
      }
    }

    if (!marketState.trends) {
      marketState.trends = {};
    }

    // ------------------------------------------
    // YENİ EŞSİZ EMTİA PROFİLLERİ (Tiers & Risk)
    // ------------------------------------------
    const COMMODITY_PROFILES = {
      food: { min: 20, max: 300, volatility: 0.15 },      // Önceden 0.03'tü. Artık çok daha hareketli.
      minerals: { min: 50, max: 600, volatility: 0.18 },  // Önceden 0.06'ydı.
      energy: { min: 100, max: 1200, volatility: 0.22 },  // Önceden 0.10'du.
      medical: { min: 200, max: 2000, volatility: 0.25 }, // Önceden 0.12'ydi.
      arms: { min: 400, max: 3500, volatility: 0.28 },    // Önceden 0.18'di.
      tech: { min: 500, max: 5000, volatility: 0.35 }     // Çok ekstrem hareketler.
    };

    // Mevcut (Eski) fiyatları arşive al (Bu sayede yüzdelik değişim UX bug'ı çözülür)
    marketState.history.push({
      turn: game.turn,
      prices: { ...marketState.prices }
    });
    // Sadece son 30 turu tut (optimizasyon)
    if (marketState.history.length > 30) {
      marketState.history.shift();
    }

    // Trend tabanlı dalgalanma (Yeni Risk Profilleri ve Düzeltme/Crash Mantığı)
    const products = Object.keys(multipliers) as (keyof typeof multipliers)[];
    for (const key of products) {
      const currentPrice = marketState.prices[key] || 100;
      const profile = COMMODITY_PROFILES[key];
      
      // Mean Reversion (Düzeltme) Oranı Hesapla
      // Fiyat max sınıra ne kadar yakınsa çökme/düşme ihtimali o kadar artar
      const pricePercentile = (currentPrice - profile.min) / (profile.max - profile.min);
      
      // Trend yoksa veya süresi bittiyse yeni trend oluştur
      if (!marketState.trends[key] || marketState.trends[key]!.turnsRemaining <= 0) {
        const r = Math.random();
        let dir: 'up' | 'down' | 'flat' = 'flat';
        
        // Fiyat çok yüksekse düşüş ihtimalini artır (Crash riski)
        let upChance = 0.35;
        let downChance = 0.35;
        
        if (pricePercentile > 0.8) {
          downChance = 0.65; // %80'den pahalıysa %65 düşüş ihtimali
          upChance = 0.15;
        } else if (pricePercentile > 0.6) {
          downChance = 0.50;
          upChance = 0.25;
        } else if (pricePercentile < 0.2) {
          upChance = 0.60; // Çok ucuzsa yükseliş tepkisi
          downChance = 0.20;
        }

        if (r < downChance) {
          dir = 'down';
        } else if (r < downChance + upChance) {
          dir = 'up';
        }

        marketState.trends[key] = {
          direction: dir,
          turnsRemaining: Math.floor(Math.random() * 3) + 2 // 2 to 4 turns
        };
      } else {
        marketState.trends[key]!.turnsRemaining -= 1;
      }

      const dir = marketState.trends[key]!.direction;
      const vol = profile.volatility;
      
      if (dir === 'up') {
        multipliers[key] = 1.01 + (Math.random() * vol); 
      } else if (dir === 'down') {
        // Balon patlama (Crash) etkisi: Eğer fiyat çok yüksekse ve düşüş trendine girdiyse daha sert düşsün
        const crashFactor = pricePercentile > 0.75 ? 1.5 : 1.0; 
        multipliers[key] = 1.0 - (0.02 + Math.random() * (vol * crashFactor)); 
      } else {
        multipliers[key] = 1.0 + (Math.random() * (vol/2) - (vol/4)); 
      }
    }

    // Event etkileri
    // Event etkileri (Kısmi olarak yumuşatıldı)
    if (eventFlags.includes("ENERGY_CRISIS")) multipliers.energy *= 1.30;
    if (eventFlags.includes("WAR_PREPARATION") || isAtWar) multipliers.arms *= 1.35;
    if (eventFlags.includes("WAR_PREPARATION") || isAtWar) multipliers.food *= 1.15;
    if (eventFlags.includes("PANDEMIC") || eventFlags.includes("VIRUS_OUTBREAK")) multipliers.medical *= 1.40;
    if (eventFlags.includes("TECH_BOOM")) multipliers.tech *= 1.25;
    if (eventFlags.includes("MINING_STRIKE")) multipliers.minerals *= 1.30;
    if (eventFlags.includes("ECONOMIC_BOOM")) {
      multipliers.energy *= 1.15;
      multipliers.minerals *= 1.20;
      multipliers.tech *= 1.15;
    }

    for (const key of products) {
      const prof = COMMODITY_PROFILES[key];
      marketState.prices[key] = Math.min(prof.max, Math.max(prof.min, marketState.prices[key] * multipliers[key]));
    }

    // ARTIK TAM SAYIYA YUVARLAMA YAPMIYORUZ (Fiyatlar arka planda ondalıklı tutulacak)
    // Böylece küçük yüzdelik değişimler kaybolmayacak ve grafikler düz çizgi kalmayacak.
    
    const inv = marketState.inventory;

    // --- Borsa Envanteri Depo Bakım Masrafı (Hoarding Engeli) ---
    const totalInventory = Object.values(inv).reduce((sum, val) => sum + val, 0);
    if (totalInventory > 100) {
      // Her 10 birim ekstra mal için $5 bakım masrafı kesilir (veya her 100 için 50)
      const maintenanceCost = Math.floor(totalInventory / 10) * 5;
      game.budget = Math.max(0, game.budget - maintenanceCost);
      currentReports.push(`🏭 Depo Masrafı: Devasa borsa stoklarınızın (${totalInventory} birim) depolama ve lojistik masrafları için bütçeden $${maintenanceCost} kesildi.`);
    }
    // ------------------------------------------------

    // SPK Baskını (Piyasa Manipülasyonu Soruşturması)
    if (triggeredInvestigation) {
      currentReports.push(`🚨 SPK BASKINI: Borsada içeriden bilgi sızdırma (manipülasyon) tespit edildi! Ağır para cezası kesildi.`);
      game.budget = Math.max(0, game.budget - 15000);
      game.stability = Math.max(0, game.stability - 15);
      game.popularity = Math.max(0, game.popularity - 15);
    }

    // AI Ülkeleri ve Diplomasi simülasyonu
    const worldCountryOps = [];
    let totalPower = 0;
    let westPower = 0;
    let eastPower = 0;
    
    for (const ai of game.worldCountries) {
      if (!ai.isPlayer) {
        let newMilitary = clampStat(ai.military + (Math.random() * 4 - 2));
        let newBudget = Math.max(0, ai.budget + (Math.random() * 400 - 200));
        let newStability = clampStat(ai.stability + (Math.random() * 4 - 2));

        const relationship = calculateRelationship(game, ai);
        const dip = diplomacyState[ai.name];

        if (dip?.type === 'war') {
          isAtWar = true;
          dip.turnsRemaining--;
          const warDuration = Math.abs(dip.turnsRemaining);

          const playerMil = Math.max(1, game.military);
          const aiMil = Math.max(1, newMilitary);
          const ratio = aiMil / playerMil;

          const baseDamage = 10;
          const warDamage = Math.round(baseDamage * Math.min(3, Math.max(0.3, ratio)));
          
          totalAiAttackDamage += warDamage;
          aiFinancialAid -= 500;
          
          const aiLossMultiplier = 1 / Math.min(3, Math.max(0.3, ratio));
          newMilitary -= Math.round(10 * aiLossMultiplier);
          newBudget -= 300;
          newStability -= Math.round(10 * aiLossMultiplier);

          if (warDuration > 3) {
            totalWarExhaustion += (warDuration - 3);
          }

          const playerEffectiveMilitary = game.military - warDamage;
          if (playerEffectiveMilitary > newMilitary + 30) {
            aiMessages.push(`🏆 ZAFER! ${ai.name} orduları yenildi! Ganimet olarak $${Math.round(newBudget / 2)} ele geçirildi.`);
            aiFinancialAid += Math.round(newBudget / 2);
            newBudget = 0;
            newMilitary = 0;
            newStability = 0;
            delete diplomacyState[ai.name];
          } else if (newMilitary > playerEffectiveMilitary + 30) {
            aiMessages.push(`💀 HEZİMET! ${ai.name} orduları bizi ağır bir yenilgiye uğrattı. Devam eden savaş sona erdi, ancak savaş tazminatı ödemek zorunda kaldık!`);
            aiFinancialAid -= 2000;
            delete diplomacyState[ai.name];
          } else {
            aiMessages.push(`⚔️ CEPHE RAPORU: ${ai.name} ile savaş devam ediyor. Ağır askeri ve ekonomik kayıplarımız var.`);
          }
        } else if (dip?.type === 'alliance') {
          activeAlliesCount++;
          aiFinancialAid += 200;
          aiMessages.push(`🤝 İTTİFAK: ${ai.name} ile ortaklığımız ekonomiye $200 katkı sağladı.`);
          dip.turnsRemaining--;
          if (dip.turnsRemaining <= 0) {
            delete diplomacyState[ai.name];
            aiMessages.push(`📜 BİLGİ: ${ai.name} ile olan ittifak anlaşmamızın süresi doldu.`);
          }
        } else {
          if (relationship < 15 && newMilitary > game.military + 20) {
            if (Math.random() < 0.2) {
              diplomacyState[ai.name] = { type: 'war', turnsRemaining: -1 };
              aiMessages.push(`⚠️ BEKLENMEDİK SALDIRI: ${ai.name} bize savaş ilan etti! Ordularımız çatışmaya girdi.`);
            }
          }
        }

        worldCountryOps.push(prisma.worldCountry.update({
          where: { id: ai.id },
          data: {
            military: clampStat(newMilitary),
            happiness: clampStat(ai.happiness + (Math.random() * 4 - 2)),
            health: clampStat(ai.health + (Math.random() * 4 - 2)),
            environment: clampStat(ai.environment + (Math.random() * 4 - 2)),
            education: clampStat(ai.education + (Math.random() * 4 - 2)),
            stability: clampStat(newStability),
            budget: newBudget,
          }
        }));

        const powerScore = clampStat(newMilitary) + (newBudget / 1000) + clampStat(newStability);
        totalPower += powerScore;
        const cData = COUNTRIES.find(c => c.name === ai.name);
        if (cData?.alignment === 'western') westPower += powerScore;
        else if (cData?.alignment === 'eastern') eastPower += powerScore;
      }
    }

    // Oyuncu Güç Katkısı (İttifaklara Göre)
    const playerPowerScore = game.military + (game.budget / 1000) + game.stability;
    totalPower += playerPowerScore;
    
    let playerIsWestern = false;
    let playerIsEastern = false;
    Object.entries(diplomacyState).forEach(([name, _dip]) => {
      const dip = _dip as any;
      if (dip && dip.type === 'alliance') {
        const cd = COUNTRIES.find(c => c.name === name);
        if (cd?.alignment === 'western') playerIsWestern = true;
        if (cd?.alignment === 'eastern') playerIsEastern = true;
      }
    });

    if (playerIsWestern && !playerIsEastern) westPower += playerPowerScore;
    else if (playerIsEastern && !playerIsWestern) eastPower += playerPowerScore;

    if (totalPower > 0) {
      // Ignore activeEmbargoes type error by spreading existing or creating fresh
      const existingState = diplomacyState as any;
      diplomacyState = {
        ...existingState,
        westernRelations: Math.min(100, Math.max(0, (westPower / totalPower) * 100)),
        easternRelations: Math.min(100, Math.max(0, (eastPower / totalPower) * 100))
      } as any;
    }

    if (worldCountryOps.length > 0) {
      await prisma.$transaction(worldCountryOps);
    }

    // currentReports has already been initialized at the top
    
    if (isAtWar && activeAlliesCount > 0) {
      const damageReduction = Math.round(totalAiAttackDamage * (0.3 * Math.min(3, activeAlliesCount)));
      totalAiAttackDamage -= damageReduction;
      if (damageReduction > 0) {
        aiMessages.push(`🛡️ MÜTTEFİK DESTEĞİ: İttifak olduğumuz ülkeler cepheye destek göndererek savaş hasarımızı ${damageReduction} birim hafifletti!`);
      }
    }

    if (totalWarExhaustion > 0) {
      aiMessages.push(`⚠️ SAVAŞ YORGUNLUĞU: Uzayan savaşlar halkı canından bezdirdi (İstikrar ve Mutluluk -${totalWarExhaustion}).`);
    }

    if (isAtWar) {
      factions = modifyFactionSupport(factions, { military: 2, nationalists: 1, intellectuals: -2 });
    }

    currentReports.push(...aiMessages);

    // --- TAHVİL (BORÇ) ÖDEMELERİ KONTROLÜ ---
    let activeBonds: any[] = [];
    try { activeBonds = JSON.parse(game.activeBonds || "[]"); } catch {}
    
    let totalDebtToPay = 0;
    const remainingBonds = [];
    
    for (const bond of activeBonds) {
      // Eğer tahvilin vadesi (şimdi - ihraç edildiği tur) süresine eşit veya büyükse ÖDE
      if (game.turn - bond.turnIssued >= bond.duration) {
        totalDebtToPay += bond.totalToRepay;
        currentReports.push(`💸 TAHVİL ÖDEMESİ: Vadesi dolan tahvil için hazineden $${bond.totalToRepay.toLocaleString()} ödendi.`);
      } else {
        remainingBonds.push(bond); // Henüz vadesi gelmedi
      }
    }
    
    // Eğer borcu ödeyecek para yoksa TEMERRÜT (Çok Ağır Ceza)
    if (totalDebtToPay > 0 && game.budget + aiFinancialAid < totalDebtToPay) {
       currentReports.push(`🚨 DEVLET İFLASI (TEMERRÜT): Tahvil borçları ödenemedi! Küresel itibar ve istikrar yerle bir oldu.`);
       game.stability = Math.max(0, game.stability - 30);
       game.foreignRelations = Math.max(0, game.foreignRelations - 40);
       game.popularity = Math.max(0, game.popularity - 30);
       // Yine de borcu eksiye düşerek "öderler" (veya borç kalır, ama basitlik için ödenmiş ve eksiye düşülmüş sayıyoruz)
    }
    // --- FAZ 4: YAŞAYAN DÜNYA & AMBARGOLAR ---
    const tradeCancellationOps = [];
    for (const country of game.worldCountries) {
      if (country.isPlayer) continue;

      // 2. Ambargo İhtimali
      const existingTrade = game.tradeAgreements.find((t: any) => t.partnerName === country.name);
      if (existingTrade) {
        // İptal Şartı: Dış ilişkilerimiz düşükse ve askeri fark varsa iptal edebilir
        if (game.foreignRelations < 35 && Math.random() < 0.15) { // %15 ihtimal
          tradeCancellationOps.push(prisma.tradeAgreement.delete({ where: { id: existingTrade.id } }));
          currentReports.push(`🚫 KÜRESEL AMBARGO: Dış ilişkilerimizin gerginleşmesi nedeniyle ${country.name} tüm ticari anlaşmalarımızı tek taraflı feshedip ambargo uyguladı!`);
          game.stability = Math.max(0, game.stability - 5);
          
          if (!diplomacyState.activeEmbargoes) diplomacyState.activeEmbargoes = [];
          if (!diplomacyState.activeEmbargoes.includes(country.name)) {
             diplomacyState.activeEmbargoes.push(country.name);
          }
        }
      }
    }
    
    if (tradeCancellationOps.length > 0) {
      await prisma.$transaction(tradeCancellationOps);
    }
    // ----------------------------------------

    const currentState: GameState = {
      id: game.id,
      countryName: game.countryName,
      population: game.population,
      turn: game.turn,
      budget: game.budget + aiFinancialAid - totalDebtToPay,
      military: clampStat(game.military - Math.min(100, Math.max(0, totalAiAttackDamage))),
      happiness: clampStat(game.happiness - totalWarExhaustion),
      health: game.health,
      environment: game.environment,
      education: game.education,
      stability: clampStat(game.stability - Math.min(100, Math.max(0, totalAiAttackDamage / 2)) - totalWarExhaustion),
      foreignRelations: game.foreignRelations,
      energy: game.energy,
      food: game.food,
      materials: game.materials,
      popularity: game.popularity,
      politicalCapital: game.politicalCapital,
      nextElectionTurn: game.nextElectionTurn,
      activeQuests: game.activeQuests,
      isGameOver: game.isGameOver,
      gameOverReason: game.gameOverReason,
      isBankrupt: game.isBankrupt,
      bankruptTurns: game.bankruptTurns,
      currentEventId: game.currentEventId,
      turnReports: JSON.stringify(currentReports),
      activeCrises: game.activeCrises,
      factions: JSON.stringify(factions),
      activeLaws: game.activeLaws,
      megaProjects: game.megaProjects,
      ministers: game.ministers,
      activePetitions: game.activePetitions,
      diplomacyState: JSON.stringify(diplomacyState),
      marketState: JSON.stringify(marketState),
      researchPoints: game.researchPoints,
      unlockedTechs: game.unlockedTechs,
      inflation: game.inflation,
      activeBonds: JSON.stringify(remainingBonds),
      achievements: game.achievements,
    };

    // Tur hesaplamalarını çalıştır (usedEventIds ve eventFlags aktarılıyor)
    const usedIds: string[] = JSON.parse(game.usedEventIds || '[]');
    const turnResult = processNextTurn(currentState, tradeIncome, usedIds, eventFlags);
    const newState = turnResult.gameState;

    // Başarım Kontrolü
    const achievementResult = checkAchievements(newState);
    newState.achievements = achievementResult.updatedAchievementsStr;
    if (achievementResult.newAchievements.length > 0) {
      const reports = JSON.parse(newState.turnReports || "[]");
      achievementResult.newAchievements.forEach(a => {
        reports.push(`🏆 BAŞARIM KAZANILDI: ${a.icon} ${a.title} - ${a.description}`);
      });
      newState.turnReports = JSON.stringify(reports);
    }

    // Kullanılmış olay ID'lerini güncelle
    if (turnResult.newEvents && turnResult.newEvents.length > 0) {
      turnResult.newEvents.forEach(e => usedIds.push(e.id));
    }

    // Tarihçe verisini güncelle
    const history: HistoryRecord[] = JSON.parse(game.historicalData || "[]");
    history.push({
      turn: game.turn,
      budget: newState.budget,
      population: newState.population,
      inflation: newState.inflation || 5.0,
      stability: newState.stability,
      happiness: newState.happiness,
      taxIncome: turnResult.taxIncome
    });

    // Veritabanını güncelle
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        population: newState.population,
        historicalData: JSON.stringify(history),
        turn: game.turn + 1,
        budget: newState.budget,
        military: newState.military,
        happiness: newState.happiness,
        health: newState.health,
        environment: newState.environment,
        education: newState.education,
        stability: newState.stability,
        foreignRelations: newState.foreignRelations,
        popularity: newState.popularity,
        politicalCapital: newState.politicalCapital,
        energy: newState.energy,
        food: newState.food,
        materials: newState.materials,
        nextElectionTurn: newState.nextElectionTurn,
        isGameOver: newState.isGameOver,
        gameOverReason: newState.gameOverReason,
        isBankrupt: newState.isBankrupt,
        bankruptTurns: newState.bankruptTurns,
        currentEventId: newState.currentEventId,
        usedEventIds: JSON.stringify(usedIds),
        turnReports: newState.turnReports,
        activeCrises: newState.activeCrises,
        factions: newState.factions,
        activeLaws: newState.activeLaws,
        megaProjects: newState.megaProjects,
        ministers: newState.ministers,
        activePetitions: newState.activePetitions,
        diplomacyState: newState.diplomacyState,
        marketState: newState.marketState,
        researchPoints: newState.researchPoints,
        unlockedTechs: newState.unlockedTechs,
        inflation: newState.inflation,
        activeBonds: newState.activeBonds,
        achievements: newState.achievements,
      },
      include: {
        worldCountries: { orderBy: { name: 'asc' } },
        tradeAgreements: true,
        investments: true,
      }
    });

    // Oyuncunun worldCountry kaydını da güncelle
    const playerWorldCountry = game.worldCountries.find(c => c.isPlayer);
    if (playerWorldCountry) {
      await prisma.worldCountry.update({
        where: { id: playerWorldCountry.id },
        data: {
          budget: newState.budget,
          military: newState.military,
          happiness: newState.happiness,
          health: newState.health,
          environment: newState.environment,
          education: newState.education,
          stability: newState.stability,
          foreignRelations: newState.foreignRelations,
        }
      });
    }

    return NextResponse.json({
      game: updatedGame,
      turnResult: {
        taxIncome: turnResult.taxIncome,
        maintenanceCost: turnResult.maintenanceCost,
        dominoEffects: turnResult.dominoEffects,
        tradeIncome: turnResult.tradeIncome,
        newEvents: turnResult.newEvents,
      },
    });
  } catch (error) {
    console.error("Tur atlama hatası:", error);
    return NextResponse.json(
      { error: "Tur atlanamadı" },
      { status: 500 }
    );
  }
}
