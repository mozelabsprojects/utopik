// =============================================
// YourUtopia — 30+ Olay / Dilemma Verileri
// =============================================
import { GameEvent, GameState } from "./types";
import { COUNTRIES } from "./countries-data";

export const EVENTS: GameEvent[] = [
  // ============================================
  // POZİTİF OLAYLAR (SÜRPRİZ KAZANÇLAR)
  // ============================================
  {
    id: "trend_digital_nomad",
    title: "Dijital Göçebeler Ülkeye Akın Ediyor",
    description: "Dünyanın dört bir yanından yazılımcılar ve freelancer'lar, güzel iklimimiz ve ucuz hayatımız için ülkemize yerleşmeye başladı. Ancak yerel halk kiraların artmasından şikayetçi.",
    category: "ekonomi",
    minTurn: 10,
    choices: [
      {
        label: "A",
        text: "Dijital Göçebe Vizesi ver (Tam destek).",
        effects: { budget: 1500, foreignRelations: 5, happiness: -5, stability: -3 },
        factionEffects: { capitalists: 8, workers: -8 },
        hint: "Bolca yabancı döviz girer ancak konut krizi yüzünden halk kızar. (+Bütçe Geliri)",
      },
      {
        label: "B",
        text: "Sadece belirli bölgelere yerleşmelerine izin ver.",
        effects: { budget: 500, foreignRelations: 3, stability: 3 },
        factionEffects: { capitalists: 5 },
        hint: "Orta karar bir kazanç ve daha güvenli bir yönetim. (+Bütçe Geliri)",
      },
      {
        label: "C",
        text: "Vize şartlarını zorlaştır, yerli halkı koru.",
        effects: { happiness: 8, stability: 5, budget: -500 },
        factionEffects: { nationalists: 10, workers: 8 },
        hint: "Yabancı geliri azalır ama vatandaşlar sizi kahraman ilan eder. (-Bütçe Gideri)",
      }
    ]
  },
  {
    id: "trend_streaming_platform",
    title: "Yerli Dijital Yayın Platformu",
    description: "Yabancı dizi/film platformları kültürümüzü yozlaştırdığı gerekçesiyle eleştiriliyor. Girişimciler, devlet destekli tamamen yerli bir 'Streaming' platformu kurmak istiyor.",
    category: "sosyal",
    minTurn: 4,
    choices: [
      {
        label: "A",
        text: "Platformu kur ve tüm vatandaşlara ücretsiz yap!",
        effects: { budget: -1500, happiness: 10, education: 3, stability: 5 },
        factionEffects: { nationalists: 8, workers: 10 },
        hint: "Çok masraflı ama halk bu hizmete bayılır."
      },
      {
        label: "B",
        text: "Girişimcilere sadece vergi indirimi sağla.",
        effects: { budget: -300, happiness: 5, education: 3 },
        factionEffects: { capitalists: 5 },
        hint: "Ucuz ve dengeli bir destek. (-Bütçe Gideri)",
      },
      {
        label: "C",
        text: "Gereksiz! Yabancı platformlara ek vergi koy.",
        effects: { budget: 800, happiness: -8, foreignRelations: -3 },
        factionEffects: { nationalists: 5, intellectuals: -8 },
        hint: "Hazineye para girer ama gençler size ateş püskürür. (+Bütçe Geliri)",
      }
    ]
  },
  {
    id: "trend_climate_strike",
    title: "İklim Grevleri Başladı",
    description: "Ülkedeki Z kuşağı ve çevre aktivistleri, karbon emisyonlarının azaltılması için haftalardır okulları boykot edip sokaklara dökülüyor.",
    category: "cevre",
    minTurn: 6,
    choices: [
      {
        label: "A",
        text: "Talepleri kabul et, fabrikalara yeşil filtre zorunluluğu getir.",
        effects: { environment: 10, happiness: 5, budget: -1500, stability: 3 },
        factionEffects: { intellectuals: 10, capitalists: -3 },
        hint: "Doğa kurtulur, gençler sevinir ama sanayiciler büyük isyan eder. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Sadece sembolik ağaç dikme kampanyası başlat.",
        effects: { environment: 3, budget: -300, happiness: -3 },
        hint: "Ucuz bir göz boyama, ama aktivistler tatmin olmaz. (-Bütçe Gideri)",
      },
      {
        label: "C",
        text: "Grevi yasakla ve fabrikaları tam kapasite çalıştır.",
        effects: { budget: 1500, environment: -8, happiness: -10, stability: -5 },
        factionEffects: { capitalists: 13, intellectuals: -15 },
        hint: "Ekonomi şahlanır ama ülke yaşanmaz bir çöplüğe döner. (+Bütçe Geliri)",
      }
    ]
  },
  {
    id: "trend_metaverse",
    title: "Sanal Gerçeklik (Metaverse) Çılgınlığı",
    description: "Sanal evrenlerde (Metaverse) dijital arsalar satılmaya başlandı. Bazı yatırımcılar başkentin dijital ikizini satın alıp sanal devlet kurduklarını iddia ediyor!",
    category: "ekonomi",
    minTurn: 7,
    choices: [
      {
        label: "A",
        text: "Devlet olarak sanal evrenlere biz de yatırım yapalım.",
        effects: { budget: -800, education: 8, happiness: 3, foreignRelations: 5 },
        factionEffects: { intellectuals: 8 },
        marketEffects: { tech: 1.08 },
        hint: "Yenilikçi bir adım! Teknoloji hisseleri fırlar. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Sanal arsalardan 'Dijital Emlak Vergisi' al.",
        effects: { budget: 1500, happiness: -5, stability: 3 },

        hint: "Havadan iyi para kazanırsınız ama yatırımcılar küser. (+Bütçe Geliri)",
      },
      {
        label: "C",
        text: "Sanal dünya saçmalıktır, hepsini erişime kapat.",
        effects: { stability: 5, education: -5, happiness: -8 },
        factionEffects: { nationalists: 5, intellectuals: -8 },
        hint: "Gerçek dünyaya dönülür ama dijital çağın gerisinde kalırsınız."
      }
    ]
  },
  {
    id: "trend_energy_drink",
    title: "Enerji İçeceği Skandalı",
    description: "Gençler arasında popüler olan yeni bir enerji içeceğinin, aşırı kafein ve kimyasal bağımlılığı yaptığı tespit edildi. Sağlık bakanlığı acil karar bekliyor.",
    category: "ic_politika",
    minTurn: 2,
    choices: [
      {
        label: "A",
        text: "İçeceği derhal yasakla ve toplat.",
        effects: { health: 8, happiness: -5, budget: -300 },
        factionEffects: { capitalists: -3, nationalists: 5 },
        hint: "Halk sağlığı kurtulur ancak şirketler tazminat davası açar. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Sadece +18 yaş sınırı getir.",
        effects: { health: 3, stability: 3, happiness: -3 },
        hint: "Dengeli ve makul bir çözüm."
      },
      {
        label: "C",
        text: "Dokunma, serbest piyasa. Sadece 'zararlıdır' yazısı eklet.",
        effects: { budget: 500, health: -8, happiness: 5 },
        factionEffects: { capitalists: 10, intellectuals: -8 },
        hint: "Bütçe ve vergi geliri akar ama hastaneler kalp krizi vakalarıyla dolar."
      },
      {
        label: "D",
        text: "👩‍⚕️ [BAKAN] Sağlık Bakanı'nın özel raporu ile sadece zararlı kimyasalları yasakla.",
        effects: { health: 10, happiness: 3, stability: 3, budget: -100 },
        factionEffects: { intellectuals: 5, workers: 5 },
        hint: "En iyi çözüm! Sağlık Bakanınız bilimsel verilerle çözüm sunuyor. (Sağlık Bakanı gerekli)",
        requiredMinister: "hlt_social"
      }
    ]
  },
  {
    id: "trend_esports",
    title: "E-Spor Dünya Şampiyonası",
    description: "Milyonlarca gencin takip ettiği devasa E-Spor Dünya Şampiyonası için finalin ülkemizde yapılması teklif edildi. Büyük bir altyapı yatırımı gerekiyor ancak gençler heyecandan çıldırıyor!",
    category: "sosyal",
    minTurn: 0,
    choices: [
      {
        label: "A",
        text: "Kabul et ve devasa bir arena inşa et!",
        effects: { budget: -800, happiness: 8, education: 3, foreignRelations: 5 },
        factionEffects: { intellectuals: 5 },
        marketEffects: { tech: 1.05 },
        hint: "Bütçeyi biraz sarsar ama gençlerin mutluluğu tavan yapar, Teknoloji sektörü uçar."
      },
      {
        label: "B",
        text: "Sadece mevcut salonları kullandır (Düşük Bütçe).",
        effects: { budget: -300, happiness: 3, foreignRelations: 3 },
        hint: "Risksiz, küçük bir mutluluk artışı. (-Bütçe Gideri)",
      },
      {
        label: "C",
        text: "Reddet, 'oyunla vakit kaybedecek zamanımız yok'.",
        effects: { happiness: -5, education: -3 },
        factionEffects: { nationalists: 3, intellectuals: -8 },
        hint: "Geleneksel kesim memnun olur ama gençler size öfkelenir."
      },
      {
        label: "D",
        text: "👨‍🏫 [BAKAN] Eğitim Bakanı'nın önerisiyle E-Spor'u müfredata ekle.",
        effects: { budget: -500, happiness: 10, education: 8, foreignRelations: 5 },
        factionEffects: { intellectuals: 10, workers: 5 },
        hint: "En iyi çözüm! E-Spor resmi olarak eğitim programına girer. (Eğitim Bakanı gerekli)",
        requiredMinister: "edu_academic"
      }
    ]
  },
  {
    id: "trend_crypto",
    title: "Kripto Para Çılgınlığı",
    description: "Gençler ve yatırımcılar yeni bir kripto paraya hücum ediyor. Ekonomi uzmanları bunun bir balon olabileceği konusunda uyardı. Nasıl bir politika izleyelim?",
    category: "ekonomi",
    minTurn: 3,
    choices: [
      {
        label: "A",
        text: "Tamamen serbest bırak ve vergi alma.",
        effects: { happiness: 5, stability: -3, budget: 0 },
        factionEffects: { capitalists: 8, workers: -3 },
        marketEffects: { tech: 1.08 },
        hint: "Mutluluk artar, teknoloji borsası patlar ama ülke istikrarı sarsılır."
      },
      {
        label: "B",
        text: "Devlet güvenceli Ulusal Kripto Borsa'sı kur ve vergilendir.",
        effects: { budget: 1500, stability: 3, happiness: -3 },
        factionEffects: { nationalists: 5 },
        hint: "Güzel bir bütçe geliri elde edersiniz, ancak özgürlükçüler kızar."
      },
      {
        label: "C",
        text: "Kripto paraları tamamen yasakla!",
        effects: { stability: 5, happiness: -8, education: -3 },
        factionEffects: { nationalists: 8, intellectuals: -10 },
        hint: "Devlet kontrolü artar ama genç nesil isyan eder."
      },
      {
        label: "D",
        text: "🤵‍♂️ [BAKAN] Ekonomi Bakanı ile kripto'yu devlet kontrolüne al.",
        effects: { budget: 3000, stability: 5, education: 3 },
        factionEffects: { capitalists: 8, intellectuals: 5 },
        hint: "En iyi çözüm! Devlet kendi dijital para birimini çıkarır. (Ekonomi Bakanı gerekli)",
        requiredMinister: "eco_capitalist"
      }
    ]
  },
  {
    id: "trend_ai_jobs",
    title: "Yapay Zeka Devrimi",
    description: "Yapay zeka (AI) şirketleri ülkemizde hızla büyüyor, ancak fabrikalardaki ve ofislerdeki birçok çalışan işini kaybetme korkusuyla protestolara başladı.",
    category: "ekonomi",
    minTurn: 8,
    choices: [
      {
        label: "A",
        text: "AI şirketlerini fonla (Teknolojiye tam destek).",
        effects: { budget: -800, education: 8, happiness: -3, stability: -3 },
        factionEffects: { capitalists: 10, workers: -10 },
        marketEffects: { tech: 1.12 },
        hint: "Geleceğe yatırım! Teknoloji hisseleri uçar ancak işçi sınıfı çok öfkelenir. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "İşsiz kalanlara 'Evrensel Temel Gelir' (UBI) bağla.",
        effects: { budget: -1500, happiness: 10, stability: 5 },
        factionEffects: { workers: 13 },
        hint: "Halk sizi kahraman ilan eder ancak Hazine büyük yara alır. (-Bütçe Gideri)",
      },
      {
        label: "C",
        text: "Yapay zeka şirketlerine ağır vergiler ve kısıtlamalar getir.",
        effects: { budget: 800, happiness: 3, education: -5 },
        factionEffects: { workers: 8, intellectuals: -10 },
        hint: "Bütçe ve işçiler toparlanır, ancak ülke bilimsel olarak geri kalır."
      }
    ]
  },
  // ============================================
  // HİKAYE ZİNCİRİ (EVENT CHAINS) - BÖLÜM 1: GIDA KRİZİ
  // ============================================
  {
    id: "chain_food_crisis_1",
    title: "Kuraklık ve Tarım Çöküşü",
    description: "Ülke genelinde yaşanan şiddetli kuraklık tarım rekoltesini vurdu. Uzmanlar önümüzdeki aylarda ciddi bir gıda krizi yaşanacağı konusunda uyarıyor.",
    category: "cevre",
    minTurn: 10,
    forbiddenFlags: ["FOOD_CRISIS_HANDLED", "FOOD_CRISIS_IGNORED"], // Sadece 1 kez çıksın
    choices: [
      {
        label: "A",
        text: "Çiftçilere acil durum fonu sağla ve su altyapısını yenile.",
        effects: { budget: -3000, environment: 5, stability: 3 },
        factionEffects: { workers: 8, capitalists: -3 },
        flagsToSet: ["FOOD_CRISIS_HANDLED"],
        hint: "Hazine büyük yara alır ama kriz büyümeden çözülür."
      },
      {
        label: "B",
        text: "Piyasa kendi dinamiklerini bulsun (Hiçbir şey yapma).",
        effects: { budget: 0, happiness: -5, stability: -3 },
        factionEffects: { capitalists: 5, workers: -5 },
        flagsToSet: ["FOOD_CRISIS_IGNORED"],
        marketEffects: { food: 1.50 }, // Gıda fiyatları %50 artar
        hint: "Gıda fiyatları fırlayacak, halk isyan edecek. İleride çok daha büyük sorunlar doğabilir."
      },
      {
        label: "C",
        text: "Gıda ihracatını tamamen yasakla, elde kalanı halka dağıt.",
        effects: { budget: -1000, foreignRelations: -8, happiness: 5 },
        factionEffects: { nationalists: 8, capitalists: -10 },
        flagsToSet: ["FOOD_CRISIS_HANDLED"],
        hint: "Dış pazar kaybedilir, diplomatik kriz çıkar ama halk doyurulur."
      }
    ]
  },
  {
    id: "chain_food_crisis_2",
    title: "Açlık İsyanları (Kelebek Etkisi)",
    description: "Geçmişteki kuraklık uyarılarını dikkate almadığınız için gıda fiyatları astronomik seviyelere ulaştı. Halk fırınları yağmalamaya başladı!",
    category: "kriz",
    minTurn: 15,
    requiredFlags: ["FOOD_CRISIS_IGNORED"], // Sadece kuraklığı görmezden gelirseniz çıkar
    forbiddenFlags: ["FOOD_CRISIS_RIOTS_OVER"],
    choices: [
      {
        label: "A",
        text: "Polis ve askerle yağmacıları bastır.",
        effects: { stability: 8, happiness: -13, popularity: -20, budget: -500 },
        factionEffects: { military: 10, workers: -15 },
        flagsToSet: ["FOOD_CRISIS_RIOTS_OVER"],
        hint: "İstikrar zorla sağlanır ama halk sizden nefret eder."
      },
      {
        label: "B",
        text: "Dış borç alarak yurtdışından acil gıda ithal et.",
        effects: { budget: -5000, happiness: 8, foreignRelations: 5 },
        factionEffects: { workers: 5 },
        flagsToSet: ["FOOD_CRISIS_RIOTS_OVER"],
        marketEffects: { food: 0.8 }, // Piyasayı rahatlatır
        hint: "Hazine iflasın eşiğine gelir ama kriz çözülür."
      }
    ]
  },
  // ============================================
  // HİKAYE ZİNCİRİ (EVENT CHAINS) - BÖLÜM 2: SOĞUK SAVAŞ DİPLOMASİSİ
  // ============================================
  {
    id: "chain_cold_war_1",
    title: "Süper Güçlerin Ambargosu",
    description: "Batı İttifakı ve Doğu Bloku arasında küresel bir ticaret savaşı patlak verdi. İki taraf da müttefik olmayan ülkelere teknoloji ve enerji ambargosu uygulamakla tehdit ediyor. Tarafını seç!",
    category: "dis_politika",
    minTurn: 12,
    forbiddenFlags: ["COLD_WAR_ALIGNED"],
    choices: [
      {
        label: "A",
        text: "Batı İttifakı'na katıl (NATO vb.).",
        effects: { westernRelations: 15, easternRelations: -20, foreignRelations: 5, tech: 8, stability: 3 },
        factionEffects: { capitalists: 8, military: 5, nationalists: -5 },
        flagsToSet: ["COLD_WAR_ALIGNED", "ALIGNED_WEST"],
        hint: "Batı ile teknoloji ve askeri destek artar ancak Doğu bloğu sizi düşman beller."
      },
      {
        label: "B",
        text: "Doğu Bloku'na yanaş.",
        effects: { easternRelations: 15, westernRelations: -20, foreignRelations: -3, energy: 10, materials: 10 },
        factionEffects: { workers: 8, military: 5, capitalists: -10 },
        flagsToSet: ["COLD_WAR_ALIGNED", "ALIGNED_EAST"],
        hint: "Ucuz enerji ve sanayi materyalleri akar ama Batı'nın teknoloji ambargosunu yersiniz."
      },
      {
        label: "C",
        text: "Tamamen Tarafsız Kal (Bağlantısızlar Hareketi).",
        effects: { westernRelations: -5, easternRelations: -5, stability: -5, popularity: 15 },
        factionEffects: { nationalists: 13 },
        flagsToSet: ["COLD_WAR_ALIGNED", "ALIGNED_NEUTRAL"],
        hint: "Milliyetçiler bayılır ama her iki süper güçten de baskı yersiniz."
      }
    ]
  },
  {
    id: "trend_social_media",
    title: "Sosyal Medya ve Influencer Krizi",
    description: "Bazı sosyal medya fenomenleri (Influencer'lar) gençleri yasadışı eylemlere ve lüks tüketime teşvik ediyor. Aileler platformların kapatılmasını istiyor.",
    category: "ic_politika",
    minTurn: 2,
    choices: [
      {
        label: "A",
        text: "Sosyal Medyayı tamamen yasakla/kapat.",
        effects: { stability: 8, happiness: -13, foreignRelations: -5 },
        factionEffects: { nationalists: 10, intellectuals: -13 },
        hint: "Düzen sağlanır ama ülkenin prestiji çöker, gençler isyan eder."
      },
      {
        label: "B",
        text: "Sadece içerik üreticilerine ağır vergiler ve denetim getir.",
        effects: { budget: 800, stability: 3, happiness: -3 },
        factionEffects: { workers: 5 },
        hint: "Devlete harika bir ek gelir kaynağı yaratır."
      },
      {
        label: "C",
        text: "Müdahale etme, özgürlüğü sonuna kadar savun.",
        effects: { happiness: 5, stability: -5, education: -3 },
        factionEffects: { intellectuals: 8, nationalists: -8 },
        hint: "Gençler mutlu olur, ancak aileler ve gelenekçi kesim huzursuz olur."
      }
    ]
  },
  {
    id: "trend_space_program",
    title: "Milli Uzay Programı",
    description: "Ülkedeki en parlak beyinler yurt dışına kaçıyor. Bilim bakanı, onları ülkede tutmak ve uluslararası prestij kazanmak için devasa bir 'Milli Roket ve Uzay Programı' başlatılmasını öneriyor.",
    category: "sosyal",
    minTurn: 10,
    choices: [
      {
        label: "A",
        text: "Projeyi başlat! Milyarlarca dolar akıt, uzaya çıkıyoruz!",
        effects: { budget: -2000, education: 13, happiness: 5, foreignRelations: 8 },
        factionEffects: { intellectuals: 15, nationalists: 8 },
        marketEffects: { tech: 1.15, minerals: 1.05 },
        hint: "Çok pahalı! Ancak ülkeyi bilim ve prestij şampiyonu yapar. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Daha küçük ölçekli, sadece uydu fırlatma projesi yap.",
        effects: { budget: -800, education: 5, foreignRelations: 3 },
        hint: "Makul bir bütçeyle güzel bir bilimsel ilerleme."
      },
      {
        label: "C",
        text: "Dünyadaki dertlerimiz bitmedi, uzayı boşver.",
        effects: { budget: 0, education: -5, happiness: -3 },
        factionEffects: { intellectuals: -8 },
        hint: "Bütçe korunur, ancak beyin göçü hızlanır."
      }
    ]
  },
  {
    id: "trend_indie_games",
    title: "Oyun Sektörü Teşviki",
    description: "Ülkemizin genç yazılımcıları kendi imkanlarıyla ürettikleri 'İndie' (Bağımsız) oyunlarla dünya çapında ödüller alıyor. Devletten destek bekliyorlar.",
    category: "ekonomi",
    minTurn: 1,
    choices: [
      {
        label: "A",
        text: "Genç yazılımcılara 5 yıl boyunca Sıfır Vergi ve Hibe sağla.",
        effects: { budget: -500, education: 5, happiness: 8 },
        factionEffects: { intellectuals: 8, capitalists: 5 },
        marketEffects: { tech: 1.03 },
        hint: "Hazine destek öder, ancak gençlerin umudu ve teknoloji borsası artar. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Sadece devlet destekli 'Milli ve Yerli' oyunları fonla.",
        effects: { budget: -300, stability: 3, happiness: 3 },
        factionEffects: { nationalists: 8, intellectuals: -3 },
        hint: "Milliyetçi kesim memnun olur ama küresel pazar kaçırılır. (-Bütçe Gideri)",
      },
      {
        label: "C",
        text: "Oyun yapmak bir iş değildir, herkes fabrikaya dönsün.",
        effects: { stability: 3, education: -3, happiness: -5 },
        factionEffects: { workers: 5, intellectuals: -8 },
        hint: "Disiplin artar ancak genç yetenekler körelir."
      }
    ]
  },
  {
    id: "poz_altin_madeni",
    title: "Dev Altın Madeni Keşfedildi!",
    description: "Kuzey dağlarında devasa ve yüksek rezervli bir altın madeni keşfedildi! Ekonomi bakanı bu kaynağın nasıl değerlendirileceğini soruyor.",
    category: "ekonomi",
    choices: [
      {
        label: "A",
        text: "Madeni devlet işletsin — Tüm gelir hazineye kalsın.",
        effects: { budget: 2500, stability: 3, environment: -3 },
        factionEffects: { workers: 5, nationalists: 5 },
        marketEffects: { minerals: 0.7 },
        hint: "Büyük gelir, ancak çevre kirliliği artar. Mineral fiyatları düşer."
      },
      {
        label: "B",
        text: "Özel sektöre ihale et — Yabancı yatırımcı gelsin.",
        effects: { budget: 2000, foreignRelations: 5, environment: -3 },
        factionEffects: { capitalists: 10, nationalists: -5 },
        hint: "Orta düzey gelir, uluslararası ilişkiler ve sermaye güçlenir."
      },
      {
        label: "C",
        text: "Madeni çevreye zarar vermemek için kapalı tut.",
        effects: { budget: 0, environment: 8, happiness: -3 },
        factionEffects: { intellectuals: 10 },
        hint: "Para kazanamazsınız ama doğayı korumak aydınları sevindirir."
      }
    ]
  },
  {
    id: "poz_turizm_patlamasi",
    title: "Turizm Patlaması!",
    description: "Ülkenizin doğal güzellikleri ve tarihi yerleri uluslararası bir belgeselde yayınlandı. Milyonlarca turist akın ediyor!",
    category: "sosyal",
    choices: [
      {
        label: "A",
        text: "Turizm gelirini altyapıya ve devlete aktar.",
        effects: { budget: 2000, foreignRelations: 3 },
        factionEffects: { capitalists: 5, nationalists: 5 },
        hint: "Bütçeye harika bir katkı sağlar."
      },
      {
        label: "B",
        text: "Geliri yerel esnafa ve halka kredi olarak dağıt.",
        effects: { budget: 500, happiness: 8, stability: 3 },
        factionEffects: { workers: 10 },
        hint: "Daha az bütçe ama devasa mutluluk artışı."
      }
    ]
  },
  {
    id: "poz_bilim_odulu",
    title: "Uluslararası Teknoloji Başarısı!",
    description: "Ulusal teknoloji enstitümüz, temiz enerji konusunda devrimsel bir patent aldı! Dünya ülkeleri bu teknolojiyi satın almak istiyor.",
    category: "sosyal",
    choices: [
      {
        label: "A",
        text: "Patenti satarak büyük bir bütçe geliri elde et.",
        effects: { budget: 2000, foreignRelations: 3, education: 3 },
        factionEffects: { capitalists: 8, intellectuals: -3 },
        hint: "Bilimi paraya çevirirsiniz. (+Bütçe Geliri)",
      },
      {
        label: "B",
        text: "Patenti satma, ücretsiz olarak ülkende kullan.",
        effects: { budget: -500, environment: 8, health: 5, education: 8 },
        factionEffects: { intellectuals: 10, capitalists: -3 },
        hint: "Uzun vadede devasa bir eğitim ve sağlık sıçraması yaşanır. (-Bütçe Gideri)",
      }
    ]
  },
  {
    id: "poz_milli_bayram",
    title: "Tarihi Yıldönümü Coşkusu",
    description: "Ülkenin kuruluşunun tarihi yıldönümü yaklaşıyor. Halk kutlama bekliyor. Devlet bütçesinden ne kadar harcama yapalım?",
    category: "ic_politika",
    choices: [
      {
        label: "A",
        text: "Devasa festivaller ve ücretsiz konserler düzenle.",
        effects: { budget: -500, happiness: 13, stability: 5 },
        factionEffects: { nationalists: 8, workers: 8 },
        hint: "Bütçeden biraz feda edip halkın kalbini fethedersiniz."
      },
      {
        label: "B",
        text: "Sadece resmi ve mütevazı bir tören yap.",
        effects: { budget: 0, happiness: 3, stability: 3 },
        factionEffects: { nationalists: 3 },
        hint: "Bütçe dostu, küçük bir pozitif etki."
      }
    ]
  },
  {
    id: "poz_teknoloji_devi",
    title: "Teknoloji Devi Yatırımı",
    description: "Dünyanın en büyük teknoloji şirketlerinden biri, yeni genel merkezini ülkenize kurmak istiyor. Ancak sizden büyük vergi muafiyetleri talep ediyorlar.",
    category: "ekonomi",
    choices: [
      {
        label: "A",
        text: "Vergi muafiyeti ver ve gelmelerini sağla.",
        effects: { budget: -300, education: 10, happiness: 5, foreignRelations: 5 },
        factionEffects: { capitalists: 10, intellectuals: 8, workers: -3 },
        hint: "Kısa vadede bütçeden yersiniz ama eğitim ve prestij uçar."
      },
      {
        label: "B",
        text: "Muafiyet yok, normal vergilerle yatırım yapsınlar.",
        effects: { budget: 1500, education: 3, happiness: 3 },
        factionEffects: { workers: 5 },
        hint: "Yatırım daha küçük olur ama hazineye iyi para girer. (+Bütçe Geliri)",
      }
    ]
  },
  {
    id: "poz_petrol_rezervi",
    title: "Büyük Petrol Rezervi Keşfi!",
    description: "Ülkenin güneyindeki bakir ormanların altında devasa bir petrol rezervi keşfedildi! Bunu çıkarmak ekonomiyi şaha kaldırabilir ama doğayı katledecek.",
    category: "ekonomi",
    choices: [
      {
        label: "A",
        text: "Ormanları yok et ve hemen çıkarmaya başla.",
        effects: { budget: 2500, environment: -10, stability: 3 },
        factionEffects: { capitalists: 10, nationalists: 5, intellectuals: -10 },
        hint: "Çok büyük bir ekonomik sıçrama, ancak korkunç bir çevre felaketi. (+Bütçe Geliri)",
      },
      {
        label: "B",
        text: "Çevre dostu yavaş teknolojiyle çıkar.",
        effects: { budget: 800, environment: -3 },
        factionEffects: { capitalists: 5, intellectuals: 3 },
        hint: "Orta karar para, kabul edilebilir çevre hasarı. (+Bütçe Geliri)",
      },
      {
        label: "C",
        text: "Rezervi çıkarma, ormanları milli park ilan et.",
        effects: { budget: 0, environment: 8, happiness: 5 },
        factionEffects: { intellectuals: 10 },
        hint: "Para kazandırmaz ama doğayı korumak halkı ve aydınları çok mutlu eder."
      }
    ]
  },
  {
    id: "poz_olimpiyatlar",
    title: "Küresel Spor Organizasyonu",
    description: "Dünya Kupası veya Olimpiyatlar gibi devasa bir spor etkinliğine ev sahipliği yapmaya hak kazandınız! Hazırlıklar için bütçe ayırmanız gerekiyor.",
    category: "sosyal",
    choices: [
      {
        label: "A",
        text: "Devasa bütçe ayır, mükemmel bir organizasyon yap.",
        effects: { budget: -1500, happiness: 13, foreignRelations: 13, stability: 5 },
        factionEffects: { nationalists: 10, capitalists: 8 },
        hint: "Pahalıdır ancak halkı sevince boğar ve küresel itibarınızı zirveye taşır. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Sadece mevcut tesisleri kullanarak mütevazı bir organizasyon yap.",
        effects: { budget: -300, happiness: 8, foreignRelations: 5 },
        factionEffects: { nationalists: 3 },
        hint: "Ekonomik ve güvenli. (-Bütçe Gideri)",
      },
      {
        label: "C",
        text: "Organizasyonu iptal et, bu parayı harcayamayız.",
        effects: { budget: 0, happiness: -8, foreignRelations: -8 },
        factionEffects: { nationalists: -10 },
        hint: "Para cebinizde kalır ama prestijiniz yerle bir olur."
      }
    ]
  },
  {
    id: "poz_verimli_hasat",
    title: "Tarihi Bereket Yılı",
    description: "Bu yıl hava şartları mükemmel geçti ve tarımsal üretim rekor kırdı! Fazla ürünleri ne yapmalıyız?",
    category: "ekonomi",
    choices: [
      {
        label: "A",
        text: "Hepsini yurt dışına ihraç et.",
        effects: { budget: 1500, foreignRelations: 3 },
        factionEffects: { capitalists: 8 },
        hint: "Hazineniz dolar. (+Bütçe Geliri)",
      },
      {
        label: "B",
        text: "Ürünleri iç piyasaya çok ucuza sat, enflasyonu düşür.",
        effects: { budget: 300, happiness: 8, health: 5 },
        factionEffects: { workers: 10 },
        hint: "Halk sağlıklı ve mutlu olur, cüzdanları rahatlar. (+Bütçe Geliri)",
      }
    ]
  },
  {
    id: "poz_uzay_programi",
    title: "Uzay Programı Başarısı",
    description: "Yıllardır süren gizli uzay programımız meyvesini verdi ve kendi ürettiğimiz uyduyu başarıyla yörüngeye fırlattık!",
    category: "sosyal",
    choices: [
      {
        label: "A",
        text: "Bunu sivil iletişim ve internet için kullan.",
        effects: { budget: 500, education: 8, happiness: 3 },
        factionEffects: { intellectuals: 10, workers: 5 },
        hint: "Eğitim ve ekonomi canlanır. (+Bütçe Geliri)",
      },
      {
        label: "B",
        text: "Uyduyu askeri istihbarat ve gözetleme için kullan.",
        effects: { military: 10, stability: 8, foreignRelations: -5 },
        factionEffects: { military: 13, nationalists: 5, intellectuals: -5 },
        hint: "Ordu ve istikrar güçlenir ama dış dünyada tepki çeker."
      }
    ]
  },
  {
    id: "poz_genc_girisimciler",
    title: "Genç Girişimciler Akımı",
    description: "Ülkenizin gençleri inanılmaz yenilikçi start-up'lar kurmaya başladı. Devlet olarak nasıl bir pozisyon alacağız?",
    category: "ekonomi",
    choices: [
      {
        label: "A",
        text: "Gençlere büyük devlet hibeleri ve krediler ver.",
        effects: { budget: -800, education: 8, happiness: 5, stability: 3 },
        factionEffects: { intellectuals: 8, capitalists: 8 },
        hint: "Bütçeden yersiniz ama ülkenin geleceğini kurtaracak bir nesil yetişir."
      },
      {
        label: "B",
        text: "Hibe verme, sadece serbest piyasada gelişmelerine izin ver.",
        effects: { budget: 500, happiness: 3 },
        factionEffects: { capitalists: 5 },
        hint: "Sadece vergi geliri alırsınız, risksizdir."
      }
    ]
  },
  {
    id: "poz_kulturel_ronesans",
    title: "Kültürel Rönesans",
    description: "Ülkenizde bir sanat ve sinema akımı dünyayı kasıp kavurmaya başladı! Filmlerimiz ödüller alıyor, müziklerimiz listelerde 1 numara.",
    category: "sosyal",
    choices: [
      {
        label: "A",
        text: "Kültür Bakanlığı bütçesini artır ve bu akımı destekle.",
        effects: { budget: -500, happiness: 10, foreignRelations: 8, education: 3 },
        factionEffects: { intellectuals: 10, nationalists: 8 },
        hint: "Halkınız gurur duyar, dış ilişkileriniz ve eğitim seviyeniz artar. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Bu popülerliği turizme çevirecek reklamlar yap.",
        effects: { budget: 800, happiness: 3, foreignRelations: 3 },
        factionEffects: { capitalists: 8 },
        hint: "Sanatı paraya çevirirsiniz. (+Bütçe Geliri)",
      }
    ]
  },
  // ============================================
  // BLACK SWAN (SİYAH KUĞU) & ÇARESİZLİK OLAYLARI
  // ============================================
  {
    id: "omnicorp_buyout",
    title: "Şeytani Anlaşma: OmniCorp",
    description: "Ülkeniz iflasın eşiğinde. Dünyanın en büyük mega-şirketi OmniCorp, tüm ulusal borcunuzu kapatmayı teklif ediyor. Ancak bunun karşılığında doğal kaynakların ve işgücünün kontrolünü istiyorlar.",
    category: "kriz",
    choices: [
      {
        label: "A",
        text: "Anlaşmayı İmzala — Ülkeyi şirkete teslim et.",
        effects: { budget: 2500, stability: -10, happiness: -13, environment: -10 },
        factionEffects: { capitalists: 15, workers: -20, nationalists: -20 },
        flagsToSet: ["CORPORATE_STATE"],
        hint: "İflastan kurtulursunuz ama ülke kalıcı hasar alır (Kelebek Etkisi!). (+Bütçe Geliri)",
      },
      {
        label: "B",
        text: "Reddet — Kendi başımıza batacağız ya da çıkacağız.",
        effects: { budget: 0, stability: 5, foreignRelations: -5 },
        factionEffects: { nationalists: 10 },
        hint: "Onurlu ama iflas riskiniz devam ediyor."
      }
    ]
  },
  {
    id: "global_embargo",
    title: "Uluslararası Ambargo",
    description: "Aşırı askerileşmeniz dünyayı korkuttu! Birleşmiş Milletler ve tüm büyük güçler, size karşı tam ve kesin bir ekonomik ambargo başlattı.",
    category: "dis_politika",
    choices: [
      {
        label: "A",
        text: "Geri Adım At — Silah programlarını iptal et ve sınırları aç.",
        effects: { military: -13, foreignRelations: 13, stability: -5, happiness: -5 },
        factionEffects: { military: -20, nationalists: -10, intellectuals: 10 },
        hint: "Ordu öfkelenecek ama ekonomi nefes alacak."
      },
      {
        label: "B",
        text: "Meydan Oku — Biz bize yeteriz!",
        effects: { budget: -2500, happiness: -10, stability: 5, military: 5 },
        factionEffects: { nationalists: 15, military: 10, capitalists: -3 },
        hint: "Büyük bir bütçe çöküşü yaşanacak, ancak milliyetçiler arkanızda."
      }
    ]
  },
  // ============================================
  // KELEBEK ETKİSİ / ZİNCİRLEME OLAYLAR
  // ============================================
  {
    id: "lab_1",
    title: "Şüpheli Laboratuvar",
    description: "Sınır bölgesindeki terk edilmiş bir tesiste, gizli bir genetik araştırma laboratuvarı bulundu. Bilim insanları devlete hizmet etmek istiyor ancak çalışmaları etik dışı görünüyor.",
    category: "sosyal",
    choices: [
      {
        label: "A",
        text: "Projeyi gizlice fonla — Sınırları zorlayan bilime destek ver.",
        effects: { budget: -800, education: 8, stability: -3, foreignRelations: -3 },
        factionEffects: { intellectuals: 8, nationalists: -3 },
        flagsToSet: ["FUNDED_SUSPICIOUS_LAB"],
        hint: "Eğitim fırlar ama gelecekte büyük bir risk barındırır (Kelebek Etkisi!) (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Laboratuvarı derhal mühürle ve kapat.",
        effects: { budget: -300, stability: 3, health: 3, education: -3 },
        factionEffects: { intellectuals: -5, nationalists: 5 },
        flagsToSet: ["CLOSED_SUSPICIOUS_LAB"],
        hint: "Güvenli yol. Herhangi bir sürpriz yaşanmaz. (-Bütçe Gideri)",
      }
    ]
  },
  {
    id: "lab_2_outbreak",
    title: "Laboratuvar Kazası!",
    description: "Yıllar önce fonladığınız o şüpheli laboratuvarda bir kaza meydana geldi! Tanımlanamayan bir virüs sızdı ve kasabayı karantinaya almak zorundayız.",
    category: "kriz",
    requiredFlags: ["FUNDED_SUSPICIOUS_LAB"],
    forbiddenFlags: ["VIRUS_CONTAINED"],
    choices: [
      {
        label: "A",
        text: "Tüm bölgeyi yok et — Acımasız ama kesin çözüm.",
        effects: { budget: -500, happiness: -13, stability: -8, health: 8 },
        factionEffects: { workers: -10, nationalists: 8 },
        flagsToSet: ["VIRUS_CONTAINED"],
        hint: "Halk sizden nefret edecek ama virüs duracak. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Milyarlarca dolar harcayarak panzehir geliştir.",
        effects: { budget: -2500, health: 10, happiness: 5, education: 5 },
        factionEffects: { intellectuals: 10 },
        flagsToSet: ["VIRUS_CONTAINED"],
        hint: "Bütçeyi çökertebilir ama bilimsel bir zafer kazanırsınız."
      }
    ]
  },
  // ============================================
  // EKONOMI (5 olay)
  // ============================================
  {
    id: "eco_1",
    title: "Borsa Krizi",
    description:
      "Küresel piyasalarda ani bir çöküş yaşandı! Yatırımcılar panik halinde sermayelerini çekiyor. Merkez bankası acil toplanma çağrısı yaptı. Ne yapacaksınız?",
    category: "ekonomi",
    choices: [
      {
        label: "A",
        text: "Piyasaya milyarlarca dolar nakit enjekte et — kısa vadeli çözüm.",
        effects: { budget: -1500, stability: 5, happiness: 3 }, factionEffects: { workers: 5, nationalists: 5 },
        hint: "Bütçe ağır darbe alır, istikrar ve güven artar",
      },
      {
        label: "B",
        text: "Faiz oranlarını acil artır — enflasyonu kontrol et.",
        effects: { budget: -300, happiness: -5, stability: 3, education: -3 }, factionEffects: { capitalists: -3, workers: -5, intellectuals: -5, nationalists: 5 },
        hint: "Halk memnuniyetsizliği artar, istikrar biraz yükselir",
      },
      {
        label: "C",
        text: "Hiçbir müdahale yapma — serbest piyasaya güven.",
        effects: { budget: 0, stability: -8, happiness: -8, foreignRelations: -3 }, factionEffects: { capitalists: 5, workers: -5, nationalists: 5 },
        hint: "Bedava ama çok riskli — istikrar ve mutluluk çöker",
      },
      {
        label: "D",
        text: "Yabancı yatırımcılara vergi muafiyeti tanı — sermaye çek.",
        effects: { budget: -500, foreignRelations: 5, happiness: -3, education: 3 }, factionEffects: { capitalists: -3, workers: -5, intellectuals: 5 },
        hint: "Diplomasi güçlenir, halk tepki gösterebilir",
      },
    ],
  },
  {
    id: "eco_2",
    title: "Ticaret Anlaşması Teklifi",
    description:
      "Komşu ülkeler büyük bir serbest ticaret bölgesi kurmayı teklif ediyor. Bu anlaşma ekonomik büyümeyi hızlandırabilir ama yerli üreticileri zor durumda bırakabilir.",
    category: "ekonomi",
    choices: [
      {
        label: "A",
        text: "Anlaşmayı tam olarak kabul et — sınırları aç.",
        effects: { budget: 800, foreignRelations: 8, happiness: -5, stability: -3 }, factionEffects: { capitalists: 5, workers: -5 },
        hint: "Gelir artar, diplomasi güçlenir ama halk tepkili",
      },
      {
        label: "B",
        text: "Sınırlı katılım — sadece belirli sektörlerde ticaret.",
        effects: { budget: 500, foreignRelations: 5, happiness: 0, stability: 0 }, factionEffects: { capitalists: 5 },
        hint: "Dengeli yaklaşım — orta düzey kazanç",
      },
      {
        label: "C",
        text: "Teklifi reddet — yerli üreticiyi koru.",
        effects: { budget: -300, foreignRelations: -5, happiness: 5, stability: 3 }, factionEffects: { capitalists: -3, workers: 5, nationalists: 5 },
        hint: "Halk mutlu ama diplomatik itibar düşer",
      },
      {
        label: "D",
        text: "Karşı teklif sun — lehine şartlar iste.",
        effects: { budget: 300, foreignRelations: -3, happiness: 3, education: 3 }, factionEffects: { capitalists: 5, workers: 5, intellectuals: 5, nationalists: 5 },
        hint: "Riskli diplomasi ama potansiyel kazanç",
      },
    ],
  },
  {
    id: "eco_3",
    title: "Vergi Reformu Tartışması",
    description:
      "Meclis, köklü bir vergi reformu tasarısını oyluyor. Zenginlerden daha çok mu yoksa herkesten eşit mi vergi alınmalı? Karar sizin.",
    category: "ekonomi",
    choices: [
      {
        label: "A",
        text: "Artan oranlı vergi — zenginlerden çok, fakirlerden az al.",
        effects: { budget: 500, happiness: 5, stability: -3, foreignRelations: -3 }, factionEffects: { capitalists: 5, workers: 5, nationalists: 5 },
        hint: "Halk sevinir, yatırımcılar kaçabilir",
      },
      {
        label: "B",
        text: "Düz vergi — herkesten aynı oran.",
        effects: { budget: 500, happiness: -3, stability: 3, foreignRelations: 3 }, factionEffects: { capitalists: 5, workers: -5, nationalists: 5 },
        hint: "Basit ve öngörülebilir ama halk tepkili",
      },
      {
        label: "C",
        text: "Vergileri düşür — tüketimi canlandır.",
        effects: { budget: -800, happiness: 8, stability: 3, education: -3 }, factionEffects: { workers: 5, intellectuals: -5, nationalists: 5 },
        hint: "Halk çok mutlu ama bütçe darbe alır",
      },
      {
        label: "D",
        text: "Vergi affi çıkar — kayıt dışı ekonomiyi kayda al.",
        effects: { budget: 500, happiness: 3, stability: -3, foreignRelations: 3 }, factionEffects: { capitalists: 5, workers: 5 },
        hint: "Kısa vadeli gelir patlaması, uzun vadeli risk",
      },
    ],
  },
  {
    id: "eco_4",
    title: "Kripto Para Düzenlemesi",
    description:
      "Vatandaşlar arasında kripto para kullanımı hızla artıyor. Merkez bankası endişeli, gençler özgürlük istiyor. Düzenleme şart mı?",
    category: "ekonomi",
    choices: [
      {
        label: "A",
        text: "Tamamen yasakla — finansal istikrarı koru.",
        effects: { budget: 300, happiness: -8, foreignRelations: -5, stability: 3 }, factionEffects: { capitalists: 5, workers: -5, intellectuals: -5, nationalists: 5 },
        hint: "Gençler çok kızgın, istikrar korunur",
      },
      {
        label: "B",
        text: "Düzenle ve vergilendir — kontrollü serbestlik.",
        effects: { budget: 300, happiness: 3, stability: 3, education: 3 }, factionEffects: { capitalists: 5, workers: 5, intellectuals: 5, nationalists: 5 },
        hint: "Dengeli çözüm — herkes biraz memnun",
      },
      {
        label: "C",
        text: "Ulusal dijital para çıkar — CBDC projesi başlat.",
        effects: { budget: 1500, education: 5, foreignRelations: 5, stability: 3 }, factionEffects: { intellectuals: 5, nationalists: 5 },
        hint: "Başarılı bir dijital ekonomi atağı, bütçe geliri artar."
      },
      {
        label: "D",
        text: "Tamamen serbest bırak — müdahale etme.",
        effects: { budget: 0, happiness: 5, stability: -5, foreignRelations: -3 }, factionEffects: { capitalists: 5, workers: 5, nationalists: 5 },
        hint: "Gençler mutlu, finansal riskler artar"
      },
    ],
  },
  {
    id: "eco_5",
    title: "İşsizlik Dalgası",
    description:
      "Otomasyon ve yapay zeka devrimi iş piyasasını altüst etti. Fabrikalar kapanıyor, işsizlik %20'ye yaklaşıyor. Sokaklar huzursuz.",
    category: "ekonomi",
    choices: [
      {
        label: "A",
        text: "Devlet istihdam programı başlat — kamu projeleri.",
        effects: { budget: -1500, happiness: 5, stability: 5, education: 3 }, factionEffects: { capitalists: -3, workers: 5, intellectuals: 5, nationalists: 5 },
        hint: "Çok pahalı ama halk rahatlar",
      },
      {
        label: "B",
        text: "Mesleki eğitim kampanyası — insanları yeniden eğit.",
        effects: { budget: -500, happiness: 3, education: 5, stability: 3 }, factionEffects: { capitalists: -3, workers: 5, intellectuals: 5, nationalists: 5 },
        hint: "Uzun vadeli çözüm, kısa vadede yetersiz",
      },
      {
        label: "C",
        text: "İşsizlik maaşını artır — sosyal yardım genişlet.",
        effects: { budget: -800, happiness: 5, stability: 3, education: -3 }, factionEffects: { capitalists: -3, workers: 5, intellectuals: -5, nationalists: 5 },
        hint: "Palyatif çözüm — bütçe eritir",
      },
      {
        label: "D",
        text: "Teşvik paketi — özel sektöre istihdam bonusu ver.",
        effects: { budget: -500, happiness: 3, stability: 3, foreignRelations: 3 }, factionEffects: { workers: 5, nationalists: 5 },
        hint: "Orta çözüm — herkes biraz memnun",
      },
    ],
  },

  // ============================================
  // KRİZ (5 olay)
  // ============================================
  {
    id: "kriz_1",
    title: "Büyük Deprem!",
    description:
      "7.8 büyüklüğünde yıkıcı bir deprem ülkenin batı bölgesini vurdu! Binalar yıkıldı, binlerce kişi evsiz kaldı. Uluslararası yardım teklifleri geliyor.",
    category: "kriz",
    choices: [
      {
        label: "A",
        text: "Tüm kaynakları seferber et — olağanüstü hal ilan et.",
        effects: { budget: -2000, health: 5, happiness: 3, stability: 3 }, factionEffects: { capitalists: -3, workers: 5, military: -5, nationalists: 3 },
        hint: "Çok pahalı ama can kaybını minimize eder",
      },
      {
        label: "B",
        text: "Uluslararası yardım kabul et — BM koordinasyonuna izin ver.",
        effects: { budget: -500, foreignRelations: 5, happiness: 3, health: 3 }, factionEffects: { workers: 5 },
        hint: "Ekonomik ama egemenlik algısı zedelenebilir",
      },
      {
        label: "C",
        text: "Orduyu devreye sok — askeri lojistikle müdahale.",
        effects: { budget: -800, military: -5, health: 5, stability: 5 }, factionEffects: { capitalists: -3, workers: 5, military: -5, nationalists: 3 },
        hint: "Askeri güç düşer ama hızlı müdahale sağlanır",
      },
      {
        label: "D",
        text: "Özel sektör ve STK'larla koordine et — devlet minimal müdahale.",
        effects: { budget: -300, happiness: -5, health: 3, stability: -3 }, factionEffects: { capitalists: -3, workers: -5 },
        hint: "Ucuz ama halk devletten daha fazlasını bekliyor",
      },
    ],
  },
  {
    id: "kriz_2",
    title: "Pandemi Alarmı!",
    description:
      "Yeni bir virüs türü hızla yayılıyor! Hastaneler dolmaya başladı, halk panik halinde. Dünya Sağlık Örgütü uyarı seviyesini yükseltti.",
    category: "kriz",
    choices: [
      {
        label: "A",
        text: "Tam kapanma — sınırları kapat, sokağa çıkma yasağı.",
        effects: { budget: -1500, happiness: -10, health: 8, stability: -5 }, factionEffects: { capitalists: -3, workers: -5, nationalists: 5 },
        hint: "Sağlık korunur ama ekonomi ve mutluluk çöker",
      },
      {
        label: "B",
        text: "Kısmi kısıtlamalar — maske zorunluluğu, mesafe kuralı.",
        effects: { budget: -500, health: 5, happiness: -5, stability: 3 }, factionEffects: { workers: -5, nationalists: 5 },
        hint: "Dengeli yaklaşım — her alanda orta etki",
      },
      {
        label: "C",
        text: "Aşı geliştirme programı başlat — Ar-Ge'ye yatırım.",
        effects: { budget: -800, education: 5, foreignRelations: 5, health: 3 }, factionEffects: { capitalists: -3, workers: 5, intellectuals: 5 },
        hint: "Uzun vadede çok değerli, kısa vadede yetersiz",
      },
      {
        label: "D",
        text: "Sürü bağışıklığı stratejisi — minimum müdahale.",
        effects: { budget: 0, health: -10, stability: -5, foreignRelations: -5 }, factionEffects: { capitalists: 5, workers: -5, nationalists: 5 },
        hint: "Bedava ama sağlık felaketi riski çok yüksek",
      },
    ],
  },
  {
    id: "kriz_3",
    title: "Enerji Krizi!",
    description:
      "Ana enerji tedarikçisi ülke, doğalgaz ve petrol akışını aniden kesti! Fabrikalar duruyor, evlerde ısınma sorunu başladı. Kış kapıda.",
    category: "kriz",
    choices: [
      {
        label: "A",
        text: "Stratejik rezervleri aç — kısa vadeli çözüm.",
        effects: { budget: -800, stability: 3, happiness: 3, environment: -3 }, factionEffects: { workers: 5, intellectuals: -5, nationalists: 5 },
        hint: "Geçici çözüm — 2-3 tur idare eder",
      },
      {
        label: "B",
        text: "Yenilenebilir enerji yatırımına geç — güneş ve rüzgar.",
        effects: { budget: -1500, environment: 8, education: 5, happiness: -3 }, factionEffects: { capitalists: -3, workers: -5, intellectuals: 5 },
        hint: "Uzun vadede mükemmel ama şu an acı çekersin",
      },
      {
        label: "C",
        text: "Alternatif tedarikçilerle acil anlaşma — daha pahalı.",
        effects: { budget: -1500, stability: 5, foreignRelations: 3, happiness: 3 }, factionEffects: { capitalists: -3, workers: 5, nationalists: 5 },
        hint: "Pahalı ama sorunu hızlı çözer",
      },
      {
        label: "D",
        text: "Nükleer enerji programı başlat.",
        effects: { budget: -2000, environment: -5, education: 5, stability: 3 }, factionEffects: { capitalists: -3, intellectuals: 0, nationalists: 5 },
        hint: "Çok pahalı, çevre riski var ama enerji bağımsızlığı",
      },
    ],
  },
  {
    id: "kriz_4",
    title: "Sel Felaketi",
    description:
      "Aşırı yağışlar kuzey bölgelerini sular altında bıraktı. Tarım arazileri tahrip oldu, gıda fiyatları fırlıyor. Binlerce aile tahliye bekliyor.",
    category: "kriz",
    choices: [
      {
        label: "A",
        text: "Acil gıda yardımı ve barınma sağla — tüm bütçeyi seferber et.",
        effects: { budget: -2000, happiness: 5, health: 5, stability: 3 }, factionEffects: { capitalists: -3, workers: 5, nationalists: 5 },
        hint: "Çok pahalı ama halk kendini güvende hisseder",
      },
      {
        label: "B",
        text: "Sel barajları ve altyapı projesi başlat — uzun vadeli çözüm.",
        effects: { budget: -1500, environment: 5, stability: 3, happiness: -3 }, factionEffects: { capitalists: -3, workers: -5, intellectuals: 5, nationalists: 5 },
        hint: "Gelecek felaketleri önler ama şu an yardım yetersiz",
      },
      {
        label: "C",
        text: "Uluslararası insani yardım çağrısı yap.",
        effects: { budget: -300, foreignRelations: 5, happiness: 3, health: 3 }, factionEffects: { capitalists: -3, workers: 5 },
        hint: "Ekonomik ama bağımsızlık algısı zedelenir",
      },
      {
        label: "D",
        text: "Bölgeyi boşalt ve yeniden iskana kapat — güvenlik öncelikli.",
        effects: { budget: -500, happiness: -5, stability: 5, environment: 3 }, factionEffects: { capitalists: -3, workers: -5, intellectuals: 5, nationalists: 5 },
        hint: "Sert karar — halk memnuniyetsiz ama güvenli",
      },
    ],
  },
  {
    id: "kriz_5",
    title: "Siber Saldırı!",
    description:
      "Devletin kritik altyapısına büyük çaplı bir siber saldırı düzenlendi! Bankacılık sistemi çöktü, hastane kayıtları şifrelendi. Fidye talep ediliyor.",
    category: "kriz",
    choices: [
      {
        label: "A",
        text: "Fidyeyi öde — sistemleri hemen kurtar.",
        effects: { budget: -800, foreignRelations: -5, stability: 3, health: 3 }, factionEffects: { capitalists: -3, workers: -5, nationalists: 5 },
        hint: "Hızlı çözüm ama uluslararası prestij kaybı",
      },
      {
        label: "B",
        text: "Siber savunma birimi kur — sıfırdan yeniden inşa et.",
        effects: { budget: -1500, education: 5, stability: -5, military: 3 }, factionEffects: { capitalists: -3, military: 5, nationalists: 3, intellectuals: 5 },
        hint: "Pahalı ve acılı ama uzun vadede güçlenirsin",
      },
      {
        label: "C",
        text: "Müttefik ülkelerden teknik destek iste.",
        effects: { budget: -500, foreignRelations: 5, education: 3, stability: -3 }, factionEffects: { intellectuals: 5 },
        hint: "Ekonomik çözüm — diplomasi güçlenir",
      },
      {
        label: "D",
        text: "Karşı siber saldırı başlat — misilleme yap.",
        effects: { budget: -800, foreignRelations: -8, military: 5, stability: 3 }, factionEffects: { capitalists: -3, workers: 5, military: 5, nationalists: 8 },
        hint: "Riskli ama caydırıcı — diplomatik kriz riski",
      },
    ],
  },

  // ============================================
  // DIŞ POLİTİKA (5 olay)
  // ============================================
  {
    id: "dip_1",
    title: "Savaş Tehdidi!",
    description:
      "Komşu ülke sınırda asker yığmaya başladı! İstihbarat raporları olası bir saldırı planından bahsediyor. BM acil toplantı çağrısı yaptı.",
    category: "dis_politika",
    choices: [
      {
        label: "A",
        text: "Tam askeri seferberlik ilan et — sınıra kuvvet yığ.",
        effects: { budget: -2000, military: 8, happiness: -8, stability: -5 }, factionEffects: { capitalists: -3, workers: -5, military: 5, nationalists: 8 },
        hint: "Güçlü caydırıcılık ama ülke gerilir",
      },
      {
        label: "B",
        text: "Diplomasi masasına otur — barış müzakereleri başlat.",
        effects: { budget: -300, foreignRelations: 5, stability: 3, happiness: 3 }, factionEffects: { capitalists: -3, workers: 5, military: -5, nationalists: 3 },
        hint: "Barışçıl ama zayıf görünme riski",
      },
      {
        label: "C",
        text: "NATO/müttefik desteği talep et — uluslararası baskı kur.",
        effects: { budget: -300, foreignRelations: 5, military: 3, stability: 3 }, factionEffects: { capitalists: -3, workers: 5, military: 5, nationalists: 8 },
        hint: "Güçlü hamle — bağımlılık riski",
      },
      {
        label: "D",
        text: "Önleyici askeri operasyon planla — sürpriz saldırı.",
        effects: { budget: -2000, foreignRelations: -13, military: -5, happiness: -5 }, factionEffects: { capitalists: -3, workers: -5, military: -5, nationalists: 3 },
        hint: "SON DERECE RİSKLİ — uluslararası izolasyon!",
      },
    ],
  },
  {
    id: "dip_2",
    title: "Mülteci Dalgası",
    description:
      "Komşu ülkedeki iç savaş nedeniyle yüz binlerce mülteci sınıra dayandı. BM insani koridor açılmasını istiyor. Halk ikiye bölünmüş durumda.",
    category: "dis_politika",
    choices: [
      {
        label: "A",
        text: "Sınırları aç — insani yardım kampları kur.",
        effects: { budget: -800, foreignRelations: 8, happiness: -5, stability: -5 }, factionEffects: { capitalists: -3, workers: -5 },
        hint: "İnsani ama toplumsal gerilim ve maliyet yüksek",
      },
      {
        label: "B",
        text: "Kontrollü kabul — kota belirle, güvenlik taraması yap.",
        effects: { budget: -500, foreignRelations: 3, happiness: -3, stability: 3 }, factionEffects: { capitalists: -3, workers: -5, nationalists: 5 },
        hint: "Dengeli çözüm — her tarafı biraz memnun eder",
      },
      {
        label: "C",
        text: "Sınırları kapat — ulusal güvenlik öncelikli.",
        effects: { budget: -300, foreignRelations: -8, stability: 5, happiness: 3 }, factionEffects: { workers: 5, military: 5, nationalists: 8 },
        hint: "Diplomatik bedeli ağır ama halk rahat",
      },
      {
        label: "D",
        text: "Uluslararası toplumu harekete geçir — yük paylaşımı iste.",
        effects: { budget: -300, foreignRelations: 5, stability: 3, happiness: 0 }, factionEffects: { capitalists: -3, nationalists: 5 },
        hint: "Akıllı diplomasi ama sonuç belirsiz",
      },
    ],
  },
  {
    id: "dip_3",
    title: "BM Yaptırım Kararı",
    description:
      "BM Güvenlik Konseyi, ülkenize karşı ekonomik yaptırım uygulayan bir karar oyluyor. Büyükelçiniz lobicilik yapıyor ama durum kritik.",
    category: "dis_politika",
    choices: [
      {
        label: "A",
        text: "Diplomatik seferberlik — tüm müttefiklerden destek iste.",
        effects: { budget: -500, foreignRelations: 5, stability: 3, happiness: 3 }, factionEffects: { capitalists: -3, workers: 5, nationalists: 5 },
        hint: "Aktif diplomasi — sonuç garantisi yok",
      },
      {
        label: "B",
        text: "Taviz ver — BM taleplerini kısmen kabul et.",
        effects: { budget: -300, foreignRelations: 5, happiness: -5, stability: -3 }, factionEffects: { capitalists: -3, workers: -5, military: -5, nationalists: -3 },
        hint: "Barışçıl ama halk 'teslim olduk' der",
      },
      {
        label: "C",
        text: "Karara meydan oku — yaptırımları tanıma.",
        effects: { budget: 0, foreignRelations: -10, happiness: 5, military: 3 }, factionEffects: { capitalists: 5, workers: 5, military: 5, nationalists: 8 },
        hint: "Milliyetçi dalga yükselir, izolasyon artar",
      },
      {
        label: "D",
        text: "Alternatif ittifaklar kur — Doğu bloğuna yaklaş.",
        effects: { budget: 300, foreignRelations: -5, military: 3, stability: 3 }, factionEffects: { capitalists: 5, military: 5, nationalists: 8 },
        hint: "Yeni müttefikler ama eski dostlar küser",
      },
    ],
  },
  {
    id: "dip_4",
    title: "Büyükelçilik Krizi",
    description:
      "Ülkenizin büyükelçisi yabancı bir ülkede casuslukla suçlandı ve tutuklandı! Medya çılgına döndü. Karşı taraf büyükelçiyi iade etmiyor.",
    category: "dis_politika",
    choices: [
      {
        label: "A",
        text: "Karşı ülkenin büyükelçisini sınır dışı et — misilleme.",
        effects: { budget: 0, foreignRelations: -8, happiness: 5, stability: 3 }, factionEffects: { capitalists: 5, workers: 5, military: 5, nationalists: 8 },
        hint: "Sert yanıt — diplomatik kriz derinleşir",
      },
      {
        label: "B",
        text: "Sessiz diplomasi yürüt — arka kanal görüşmeleri.",
        effects: { budget: -300, foreignRelations: 3, stability: 3, happiness: -3 }, factionEffects: { capitalists: -3, workers: -5, nationalists: 5 },
        hint: "Yavaş ama güvenli — halk sabırsızlanabilir",
      },
      {
        label: "C",
        text: "Konuyu uluslararası mahkemeye taşı.",
        effects: { budget: -500, foreignRelations: 5, stability: 3, education: 3 }, factionEffects: { capitalists: -3, intellectuals: 5, nationalists: 5 },
        hint: "Hukuki süreç — uzun ama meşru",
      },
      {
        label: "D",
        text: "Ekonomik yaptırım uygula — ticaret ambargosuna git.",
        effects: { budget: -500, foreignRelations: -5, stability: 3, happiness: 3 }, factionEffects: { capitalists: -3, workers: 5, nationalists: 5 },
        hint: "Güçlü hamle ama ekonomik bedeli var",
      },
    ],
  },
  {
    id: "dip_5",
    title: "Uluslararası İklim Zirvesi",
    description:
      "Paris'te büyük bir iklim zirvesi düzenleniyor. Ülkenizden karbon emisyonlarını %40 azaltması isteniyor. Sanayiciler ayakta, çevreciler destek veriyor.",
    category: "dis_politika",
    choices: [
      {
        label: "A",
        text: "Tam taahhüt ver — %40 azaltma hedefini kabul et.",
        effects: { budget: -800, environment: 8, foreignRelations: 5, happiness: -5 }, factionEffects: { capitalists: -3, workers: -5, intellectuals: 5 },
        hint: "Çevre şampiyonu olursun ama sanayi darbe alır",
      },
      {
        label: "B",
        text: "Kısmi taahhüt — %20 azaltma ve geçiş süresi iste.",
        effects: { budget: -500, environment: 5, foreignRelations: 3, stability: 3 }, factionEffects: { capitalists: -3, intellectuals: 5, nationalists: 5 },
        hint: "Dengeli — kimse çok memnun, kimse çok kızgın değil",
      },
      {
        label: "C",
        text: "Zirveyi boykot et — 'gelişmekte olan ülke hakkı' de.",
        effects: { budget: 0, foreignRelations: -8, environment: -3, happiness: 3 }, factionEffects: { capitalists: 5, workers: 5, intellectuals: -5, nationalists: 5 },
        hint: "Ucuz ama diplomatik itibar kaybı ciddi",
      },
      {
        label: "D",
        text: "Karbon vergisi öner — piyasa mekanizmasıyla çöz.",
        effects: { budget: 300, environment: 5, foreignRelations: 5, happiness: -3 }, factionEffects: { capitalists: 5, workers: -5, intellectuals: 5 },
        hint: "Yaratıcı çözüm — gelir bile getirebilir",
      },
    ],
  },

  // ============================================
  // İÇ POLİTİKA (4 olay)
  // ============================================
  {
    id: "ic_1",
    title: "Halk Protestoları",
    description:
      "Başkentte onbinlerce kişi sokaklara döküldü! 'Eşitlik, adalet, özgürlük' sloganları atılıyor. Polis barikatları aşılmak üzere. Gerilim tırmanıyor.",
    category: "ic_politika",
    choices: [
      {
        label: "A",
        text: "Protestoculara güç kullan — düzeni sağla.",
        effects: { budget: -300, happiness: -10, stability: 5, foreignRelations: -5 }, factionEffects: { capitalists: -3, workers: -5, nationalists: 5 },
        hint: "Kısa vadede düzen, uzun vadede nefret",
      },
      {
        label: "B",
        text: "Diyalog masası kur — temsilcilerle görüş.",
        effects: { budget: -300, happiness: 5, stability: 3, foreignRelations: 3 }, factionEffects: { capitalists: -3, workers: 5, nationalists: 5 },
        hint: "Barışçıl ve akıllıca — zaman alır",
      },
      {
        label: "C",
        text: "Reform paketi açıkla — talepleri kısmen karşıla.",
        effects: { budget: -800, happiness: 8, stability: 5, education: 3 }, factionEffects: { capitalists: -3, workers: 5, intellectuals: 5, nationalists: 5 },
        hint: "Pahalı ama en etkili çözüm",
      },
      {
        label: "D",
        text: "Sosyal medyayı kısıtla — bilgi akışını kontrol et.",
        effects: { budget: -300, happiness: -8, foreignRelations: -5, stability: 3 }, factionEffects: { workers: -5, intellectuals: -5, nationalists: 5 },
        hint: "Geçici susturma — uzun vadede patlama riski",
      },
    ],
  },
  {
    id: "ic_2",
    title: "Yolsuzluk Skandalı!",
    description:
      "Bir bakan, milyonlarca dolarlık yolsuzluk dosyasıyla basına sızdırıldı! Muhalefet istifa çağrısı yapıyor, halk öfkeli. Parti içi baskı artıyor.",
    category: "ic_politika",
    choices: [
      {
        label: "A",
        text: "Bakanı görevden al ve yargıla — şeffaflık göster.",
        effects: { budget: -300, happiness: 5, stability: 3, foreignRelations: 5 }, factionEffects: { capitalists: -3, workers: 5, nationalists: 5 },
        hint: "Cesur ve doğru — parti içi bedeli olabilir",
      },
      {
        label: "B",
        text: "İç soruşturma başlat — 'yargı bağımsız çalışsın' de.",
        effects: { budget: -300, happiness: 3, stability: 3, foreignRelations: 3 }, factionEffects: { capitalists: -3, workers: 5, nationalists: 5 },
        hint: "Zaman kazandırır — halk ikna olmayabilir",
      },
      {
        label: "C",
        text: "Üstünü ört — medyayı başka konulara yönlendir.",
        effects: { budget: -300, happiness: -5, stability: -5, foreignRelations: -3 }, factionEffects: { capitalists: -3, workers: -5, nationalists: 5 },
        hint: "Her şey daha da kötüleşir",
      },
      {
        label: "D",
        text: "Kapsamlı anti-yolsuzluk yasası çıkar.",
        effects: { budget: -500, happiness: 5, stability: 5, education: 3 }, factionEffects: { workers: 5, intellectuals: 5, nationalists: 5 },
        hint: "Sistematik çözüm — maliyetli ama kalıcı",
      },
    ],
  },
  {
    id: "ic_3",
    title: "Seçim Vaadi Sıkışması",
    description:
      "Seçimler yaklaşıyor ve muhalefet bedava eğitim, bedava sağlık ve vergi indirimi vaat ediyor. Anketlerde gerideyiz. Ne yapacağız?",
    category: "ic_politika",
    choices: [
      {
        label: "A",
        text: "Aynı vaatleri ver ve daha fazlasını ekle — popülist ol.",
        effects: { budget: -1500, happiness: 10, stability: -3, education: -3 }, factionEffects: { workers: 5, intellectuals: -5 },
        hint: "Seçim kazanırsın ama bütçe çöker",
      },
      {
        label: "B",
        text: "Gerçekçi vaatler sun — 'bu vaatler yalanır' de.",
        effects: { budget: 0, happiness: -3, stability: 3, education: 3 }, factionEffects: { capitalists: 5, workers: -5, intellectuals: 5, nationalists: 5 },
        hint: "Dürüst ama seçim kaybetme riski",
      },
      {
        label: "C",
        text: "Güvenlik kartını oyna — 'tehditler var, biz koruruz'.",
        effects: { budget: -500, military: 5, happiness: 3, stability: 3 }, factionEffects: { capitalists: -3, workers: 5, military: 5, nationalists: 8 },
        hint: "Korku politikası — kısa vadede etkili",
      },
      {
        label: "D",
        text: "Ekonomik başarıları öne çıkar — somut verilerle kampanya.",
        effects: { budget: -300, happiness: 3, stability: 3, education: 3 }, factionEffects: { capitalists: -3, workers: 5, intellectuals: 5, nationalists: 5 },
        hint: "Mantıklı ama duygusal seçmene yetmeyebilir",
      },
    ],
  },
  {
    id: "ic_4",
    title: "Anayasa Değişikliği Talebi",
    description:
      "Muhalefet partileri ve sivil toplum kuruluşları güçlü bir anayasa değişikliği kampanyası başlattı. Daha fazla demokrasi ve güçler ayrılığı isteniyor.",
    category: "ic_politika",
    choices: [
      {
        label: "A",
        text: "Referandum düzenle — halkın kararına bırak.",
        effects: { budget: -500, happiness: 5, foreignRelations: 5, stability: -3 }, factionEffects: { workers: 5, intellectuals: 5 },
        hint: "Demokratik ama sonuç belirsiz, istikrar sarsılabilir",
      },
      {
        label: "B",
        text: "Meclis komisyonu kur — uzlaşıyla değişiklik yap.",
        effects: { budget: -300, happiness: 3, stability: 3, foreignRelations: 3 }, factionEffects: { capitalists: -3, workers: 5, nationalists: 5 },
        hint: "Yavaş ama güvenli — herkes masada",
      },
      {
        label: "C",
        text: "Talebi reddet — 'şu an sırası değil' de.",
        effects: { budget: 0, happiness: -5, stability: 5, foreignRelations: -5 }, factionEffects: { capitalists: 5, workers: -5, nationalists: 5 },
        hint: "Ucuz ama halk ve uluslararası tepki çekersin",
      },
      {
        label: "D",
        text: "Kısmi reform paketi hazırla — temel hakları genişlet.",
        effects: { budget: -500, happiness: 5, foreignRelations: 5, stability: 3 }, factionEffects: { capitalists: -3, workers: 5, intellectuals: 5, nationalists: 5 },
        hint: "Orta yol — çoğunluğu memnun eder",
      },
    ],
  },

  // ============================================
  // ÇEVRE (4 olay)
  // ============================================
  {
    id: "cev_1",
    title: "Orman Yangını Felaketi",
    description:
      "Rekor sıcaklıklar nedeniyle güney bölgelerinde devasa orman yangınları çıktı! Yüzlerce hektar orman yok oldu, yerleşim yerleri tehdit altında.",
    category: "cevre",
    choices: [
      {
        label: "A",
        text: "Uçak filosuyla tam müdahale — tüm kaynakları yangına yönelt.",
        effects: { budget: -1500, environment: 5, health: 3, happiness: 3 }, factionEffects: { capitalists: -3, workers: 5, intellectuals: 5, nationalists: 5 },
        hint: "Pahalı ama çevreyi korursun",
      },
      {
        label: "B",
        text: "Orduyu devreye sok — askeri helikopterlerle söndür.",
        effects: { budget: -800, military: -3, environment: 3, health: 3 }, factionEffects: { capitalists: -3, workers: 5, military: -5, nationalists: -3, intellectuals: 5 },
        hint: "Askeri güç düşer ama etkili müdahale",
      },
      {
        label: "C",
        text: "Yağmur tohumu programı başlat — yapay yağmur.",
        effects: { budget: -500, environment: 5, education: 3, happiness: 0 }, factionEffects: { intellectuals: 5 },
        hint: "Bilimsel yaklaşım — şu anki yangına yavaş kalabilir",
      },
      {
        label: "D",
        text: "Tahliye öncelikli — can kaybını önle, ormanı feda et.",
        effects: { budget: -500, environment: -5, health: 5, happiness: -3 }, factionEffects: { capitalists: -3, workers: -5, intellectuals: -5, nationalists: 5 },
        hint: "Pragmatik ama çevre puanı düşer",
      },
    ],
  },
  {
    id: "cev_2",
    title: "Nükleer Santral Projesi",
    description:
      "Enerji ihtiyacı artıyor ve mühendisler nükleer santral önerdi. Çevreciler karşı, sanayiciler lehte. Halk ikiye bölünmüş.",
    category: "cevre",
    choices: [
      {
        label: "A",
        text: "Nükleer santrali inşa et — enerji bağımsızlığı.",
        effects: { budget: -2000, environment: -5, education: 5, happiness: -5 }, factionEffects: { capitalists: -3, workers: -5, intellectuals: 0, nationalists: 5 },
        marketEffects: { energy: 0.5 },
        hint: "Çok pahalı, çevre riski ama Enerji fiyatları borsada yarı yarıya düşer.",
      },
      {
        label: "B",
        text: "Yenilenebilir enerji yatırımı yap — güneş+rüzgar.",
        effects: { budget: -1500, environment: 8, education: 5, happiness: 5 }, factionEffects: { capitalists: -3, workers: 5, intellectuals: 5, nationalists: 5 },
        marketEffects: { energy: 0.8 },
        hint: "Pahalı ama herkes memnun. Enerji fiyatları ucuzlar.",
      },
      {
        label: "C",
        text: "Doğalgaz santrallerine yatır — hızlı ve ucuz.",
        effects: { budget: -500, environment: -5, stability: 3, happiness: 3 }, factionEffects: { workers: 5, intellectuals: -5, nationalists: 5 },
        hint: "Ucuz ama çevre zarar görür",
      },
      {
        label: "D",
        text: "Hiçbir şey yapma — enerji tasarrufu kampanyası başlat.",
        effects: { budget: -300, environment: 3, happiness: -3, stability: -3 }, factionEffects: { capitalists: -3, workers: -5, intellectuals: 5 },
        hint: "Ucuz ama enerji sorunu çözülmez",
      },
    ],
  },
  {
    id: "cev_3",
    title: "Su Krizi",
    description:
      "Kuraklık nedeniyle su kaynakları kritik seviyeye düştü. Barajlar %15 doluluk oranında. Tarım alanları kuruyor, şehirlerde su kesintisi başladı.",
    category: "cevre",
    choices: [
      {
        label: "A",
        text: "Deniz suyu arıtma tesisleri kur — büyük yatırım.",
        effects: { budget: -2000, health: 5, environment: 3, happiness: 3 }, factionEffects: { workers: 5, intellectuals: 5 },
        hint: "Kalıcı çözüm ama çok pahalı",
      },
      {
        label: "B",
        text: "Su kısıtlamaları getir — sanayi ve tarıma kota.",
        effects: { budget: 0, environment: 5, happiness: -5, stability: -3 }, factionEffects: { capitalists: 5, workers: -5, intellectuals: 5 },
        hint: "Bedava ama halk ve çiftçiler isyan eder",
      },
      {
        label: "C",
        text: "Komşu ülkeden su satın al — ithalat anlaşması.",
        effects: { budget: -800, foreignRelations: 3, health: 3, happiness: 3 }, factionEffects: { workers: 5, nationalists: 5 },
        hint: "Bağımlılık yaratır ama krizi çözer",
      },
      {
        label: "D",
        text: "Bulut tohumlama ve yapay yağmur programı.",
        effects: { budget: -500, education: 5, environment: 3, health: 3 }, factionEffects: { capitalists: -3, intellectuals: 5 },
        hint: "Bilimsel ama garanti yok",
      },
    ],
  },
  {
    id: "cev_4",
    title: "Endüstriyel Kirlilik Skandalı",
    description:
      "Büyük bir fabrika, nehre toksik atık boşalttığı ortaya çıktı! Nehir boyunca yaşayan 200.000 kişi temiz suya ulaşamıyor. Balıklar öldü.",
    category: "cevre",
    choices: [
      {
        label: "A",
        text: "Fabrikayı kapat ve ağır ceza kes — tolerans yok.",
        effects: { budget: 300, environment: 5, happiness: 5, stability: 3 }, factionEffects: { capitalists: 5, workers: 5, intellectuals: 5, nationalists: 5 },
        hint: "Gelir + çevre + halk memnuniyeti — win-win",
      },
      {
        label: "B",
        text: "Fabrikayı uyar ve filtreleme sistemi zorunlu kıl.",
        effects: { budget: -300, environment: 3, happiness: 0, stability: 3 }, factionEffects: { capitalists: -3, intellectuals: 5, nationalists: 5 },
        hint: "Ölçülü — sorun tamamen çözülmez",
      },
      {
        label: "C",
        text: "Görmezden gel — işsizlik ve ekonomi daha önemli.",
        effects: { budget: 0, environment: -5, happiness: -5, health: -5 }, factionEffects: { capitalists: 5, workers: -5, intellectuals: -5 },
        hint: "En kötü seçenek — her şey kötüleşir",
      },
      {
        label: "D",
        text: "Nehir temizleme projesi başlat — fabrikaya da süre ver.",
        effects: { budget: -800, environment: 5, health: 5, happiness: 3 }, factionEffects: { capitalists: -3, workers: 5, intellectuals: 5 },
        hint: "Pahalı ama kapsamlı çözüm",
      },
    ],
  },

  // ============================================
  // ASKERİ (4 olay)
  // ============================================
  {
    id: "ask_1",
    title: "Silah Modernizasyonu Talebi",
    description:
      "Genelkurmay, ordunun acilen modernize edilmesi gerektiğini rapor etti. Mevcut silahlar eski, muharebe kabiliyeti düşüyor. Savunma sanayii ihale bekliyor.",
    category: "askeri",
    choices: [
      {
        label: "A",
        text: "Tam modernizasyon paketi — yeni nesil silahlar al.",
        effects: { budget: -2000, military: 10, education: 3, happiness: -3 }, factionEffects: { workers: -5, military: 5, nationalists: 8, intellectuals: 5 },
        hint: "Çok pahalı ama ordu zirveye çıkar",
      },
      {
        label: "B",
        text: "Kademeli modernizasyon — öncelikli sistemleri yenile.",
        effects: { budget: -800, military: 5, education: 3 }, factionEffects: { military: 5, nationalists: 3, intellectuals: 5 },
        hint: "Dengeli — bütçeyi çok zorlama",
      },
      {
        label: "C",
        text: "Yerli savunma sanayii geliştir — milli üretim.",
        effects: { budget: -1500, military: 5, education: 5, happiness: 5 }, factionEffects: { capitalists: -3, workers: 5, military: 5, nationalists: 3, intellectuals: 5 },
        hint: "Uzun vadede mükemmel, kısa vadede yetersiz",
      },
      {
        label: "D",
        text: "Modernizasyonu ertele — diplomasiyi güçlendir.",
        effects: { budget: 0, foreignRelations: 5, military: -3, happiness: 3 }, factionEffects: { capitalists: 5, workers: 5, military: -5, nationalists: -3 },
        hint: "Ucuz ama ordunun morali düşer",
      },
    ],
  },
  {
    id: "ask_2",
    title: "Sınır İhlali Olayı",
    description:
      "Komşu ülkeye ait bir askeri drone, hava sahamızı ihlal etti ve düşürüldü! Komşu ülke 'kaza' diyor, istihbarat 'keşif uçuşu' olduğunu düşünüyor.",
    category: "askeri",
    choices: [
      {
        label: "A",
        text: "Sert nota ver — diplomatik protesto + hava savunmasını güçlendir.",
        effects: { budget: -500, foreignRelations: -5, military: 3, stability: 3 }, factionEffects: { capitalists: -3, workers: 5, military: 5, nationalists: 8 },
        hint: "Sert ama orantılı — halk onaylar",
      },
      {
        label: "B",
        text: "Sessiz diplomasi — arka kapıdan uyar.",
        effects: { budget: 0, foreignRelations: 3, stability: 3, happiness: -3 }, factionEffects: { capitalists: 5, workers: -5, nationalists: 5 },
        hint: "Sakin ama halk 'neden bir şey yapmadık' der",
      },
      {
        label: "C",
        text: "Konuyu BM'ye taşı — uluslararası destek ara.",
        effects: { budget: -300, foreignRelations: 5, stability: 3, happiness: 3 }, factionEffects: { capitalists: -3, workers: 5, nationalists: 5 },
        hint: "Hukuki yol — yavaş ama meşru",
      },
      {
        label: "D",
        text: "Karşılıklı askeri tatbikat öner — gerilimi düşür.",
        effects: { budget: -500, foreignRelations: 5, military: 3, stability: 3 }, factionEffects: { capitalists: -3, workers: 5, military: 5, nationalists: 8 },
        hint: "Yaratıcı diplomasi — güven artırıcı",
      },
    ],
  },
  {
    id: "ask_3",
    title: "Zorunlu Askerlik Tartışması",
    description:
      "Zorunlu askerlik süresini uzatma veya kaldırma tartışması alevlendi. Gençler profesyonel ordu istiyor, generaller zorunlu askerliği savunuyor.",
    category: "askeri",
    choices: [
      {
        label: "A",
        text: "Profesyonel orduya geç — zorunlu askerliği kaldır.",
        effects: { budget: -800, happiness: 8, military: -5, education: 3 }, factionEffects: { capitalists: -3, workers: 5, military: -5, nationalists: -3, intellectuals: 5 },
        hint: "Gençler çok mutlu ama askeri güç düşer",
      },
      {
        label: "B",
        text: "Süreyi kısalt — 6 aya düşür.",
        effects: { budget: -300, military: -3, happiness: 5, education: 3 }, factionEffects: { capitalists: -3, workers: 5, military: -5, nationalists: -3, intellectuals: 5 },
        hint: "Herkes biraz memnun — orta yol",
      },
      {
        label: "C",
        text: "Mevcut sistemi koru — değişiklik yok.",
        effects: { budget: 0, military: 3, happiness: -5, education: -3 }, factionEffects: { capitalists: 5, workers: -5, military: 5, nationalists: 3, intellectuals: -5 },
        hint: "Bedava ama gençler kızgın",
      },
      {
        label: "D",
        text: "Hibrit model — kısa zorunlu eğitim + profesyonel çekirdek.",
        effects: { budget: -500, happiness: 5, military: 3, education: 3 }, factionEffects: { capitalists: -3, workers: 5, military: 5, nationalists: 8, intellectuals: 5 },
        hint: "En dengeli çözüm ama pahalı",
      },
    ],
  },
  {
    id: "ask_4",
    title: "Silah İhracatı Teklifi",
    description:
      "Tartışmalı bir ülke, ülkenizden büyük miktarda silah satın almak istiyor. Savunma sanayii çok heyecanlı, insan hakları örgütleri tepkili.",
    category: "askeri",
    choices: [
      {
        label: "A",
        text: "Anlaşmayı imzala — ekonomik fırsat çok büyük.",
        effects: { budget: 1500, foreignRelations: -8, happiness: -5, military: 3 }, factionEffects: { capitalists: 5, workers: -5, military: 5, nationalists: 8 },
        hint: "Büyük gelir ama diplomatik kriz riski",
      },
      {
        label: "B",
        text: "Savunma amaçlı silahları sat, saldırı silahlarını satma.",
        effects: { budget: 800, military: 3, foreignRelations: -3, happiness: -3 }, factionEffects: { capitalists: 5, workers: -5, military: 5, nationalists: 8 },
        hint: "Orta yol — herkes biraz memnun",
      },
      {
        label: "C",
        text: "Teklifi reddet — insan hakları öncelikli.",
        effects: { budget: 0, foreignRelations: 5, happiness: 5, military: -3 }, factionEffects: { capitalists: 5, workers: 5, military: -5, nationalists: 3 },
        hint: "Etik ama gelir kaybı — halk ve dünya saygı duyar",
      },
      {
        label: "D",
        text: "Silah yerine eğitim ve teknik destek teklif et.",
        effects: { budget: 300, foreignRelations: 3, education: 3, happiness: 3 }, factionEffects: { capitalists: 5, workers: 5, intellectuals: 5 },
        hint: "Yaratıcı çözüm — gelir + diplomasi",
      },
    ],
  },

  // ============================================
  // SOSYAL (3 olay)
  // ============================================
  {
    id: "sos_1",
    title: "Eğitim Reformu",
    description:
      "PISA sınavlarında ülkeniz çok kötü sonuçlar aldı! Eğitim sistemi tartışılıyor. Öğretmenler maaş zammı istiyor, veliler müfredat değişikliği talep ediyor.",
    category: "sosyal",
    condition: (state) => state.education < 70,
    choices: [
      {
        label: "A",
        text: "Köklü eğitim reformu — müfredat + öğretmen maaşı + teknoloji.",
        effects: { budget: -1500, education: 10, happiness: 5, stability: 3 }, factionEffects: { capitalists: -3, workers: 5, intellectuals: 5, nationalists: 5 },
        hint: "Çok pahalı ama eğitim zirveye çıkar",
      },
      {
        label: "B",
        text: "Sadece öğretmen maaşlarını artır — motivasyon öncelikli.",
        effects: { budget: -500, education: 5, happiness: 3, stability: 3 }, factionEffects: { workers: 5, intellectuals: 5, nationalists: 5 },
        hint: "Etkili ama yetersiz — müfredat eski kalır",
      },
      {
        label: "C",
        text: "Teknoloji odaklı reform — tablet dağıt, dijital eğitime geç.",
        effects: { budget: -800, education: 5, happiness: 3, environment: -3 }, factionEffects: { capitalists: -3, workers: 5, intellectuals: 0 },
        hint: "Modern ama altyapı hazır olmayabilir",
      },
      {
        label: "D",
        text: "Özel sektöre aç — charter okullar ve rekabet.",
        effects: { budget: -300, education: 3, happiness: -3, stability: -3 }, factionEffects: { capitalists: -3, workers: -5, intellectuals: 5 },
        hint: "Ucuz ama eşitsizlik artabilir",
      },
    ],
  },
  {
    id: "sos_2",
    title: "Sağlık Sigortası Krizi",
    description:
      "Milyonlarca vatandaş sağlık sigortasından yoksun! Hastaneler doluyor, ilaç fiyatları uçuyor. Sağlık hakkı tartışması gündemde.",
    category: "sosyal",
    choices: [
      {
        label: "A",
        text: "Evrensel sağlık sigortası — herkese ücretsiz sağlık.",
        effects: { budget: -2000, health: 10, happiness: 8, stability: 3 }, factionEffects: { capitalists: -3, workers: 5, intellectuals: 5, nationalists: 5 },
        hint: "Çok pahalı ama sağlık ve mutluluk zirveye çıkar",
      },
      {
        label: "B",
        text: "Düşük gelirli ailelere ücretsiz sağlık — hedefli yardım.",
        effects: { budget: -800, health: 5, happiness: 5, stability: 3 }, factionEffects: { workers: 5, nationalists: 5 },
        hint: "Dengeli çözüm — ihtiyacı olana yardım",
      },
      {
        label: "C",
        text: "İlaç fiyatlarını düzenle — devlet kontrolü.",
        effects: { budget: -300, health: 5, happiness: 3, foreignRelations: -3 }, factionEffects: { capitalists: -3, workers: 5, nationalists: 5 },
        hint: "Ucuz çözüm — ilaç şirketleri kızar",
      },
      {
        label: "D",
        text: "Özel sağlık sektörünü teşvik et — rekabet fiyat düşürür.",
        effects: { budget: -300, health: 3, happiness: -3, stability: 3 }, factionEffects: { capitalists: -3, workers: -5, nationalists: 5 },
        hint: "Piyasa çözümü — eşitsizlik riski var",
      },
    ],
  },
  {
    id: "sos_3",
    title: "Kültürel Festival ve Turizm",
    description:
      "Kültür bakanlığı büyük bir uluslararası festival düzenlemeyi teklif etti. Sanatçılar ve turizmciler heyecanlı ama bütçe sıkı.",
    category: "sosyal",
    choices: [
      {
        label: "A",
        text: "Büyük festival düzenle — dünyaya kapıları aç.",
        effects: { budget: -800, happiness: 5, foreignRelations: 5, stability: 3 }, factionEffects: { capitalists: -3, workers: 5, nationalists: 5 },
        hint: "Pahalı ama diplomasi ve mutluluk artışı",
      },
      {
        label: "B",
        text: "Küçük çaplı yerel festival — bütçe dostu.",
        effects: { budget: -300, happiness: 3, stability: 3 }, factionEffects: { workers: 5, nationalists: 5 },
        hint: "Ucuz ve güvenli — büyük etki yok",
      },
      {
        label: "C",
        text: "Festivali iptal et — bütçeyi daha acil konulara yönelt.",
        effects: { budget: 0, happiness: -5, foreignRelations: -3, stability: -3 }, factionEffects: { capitalists: 5, workers: -5, nationalists: 5 },
        hint: "Bedava ama halk hayal kırıklığı yaşar",
      },
      {
        label: "D",
        text: "Özel sektör sponsorluğuyla festival — devlete yük yok.",
        effects: { budget: 300, happiness: 5, foreignRelations: 3, stability: 3 }, factionEffects: { capitalists: 5, workers: 5, nationalists: 5 },
        hint: "Akıllıca — gelir bile getirir",
      },
    ],
  },
  // ============================================
  // OLAY ZİNCİRLERİ (EVENT CHAINS) - YAPAY ZEKA DEVRİMİ
  // ============================================
  {
    id: "ai_chain_1",
    title: "Gölge Proje: Sentetik Zeka",
    description:
      "Savunma Bakanlığı, kendi kendini eğitebilen devasa bir Yapay Zeka ağı projesi başlattı. Maliyeti astronomik ama başarılı olursa dünyadaki tüm stratejik dengeyi lehimize çevirebilir.",
    category: "sosyal",
    choices: [
      {
        label: "A",
        text: "Tam Bütçe Ver — Projeyi hızlandır.",
        effects: { budget: -2000, education: 5, military: 3 },
        factionEffects: { intellectuals: 8, military: 5 },
        flagsToSet: ["AI_PROJECT_STARTED"],
        hint: "Büyük bir kumar (Kelebek Etkisi!) (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Projeyi durdur — Pandora'nın kutusunu açmaya gerek yok.",
        effects: { budget: 0, stability: 3, education: -3 },
        factionEffects: { intellectuals: -5, nationalists: 3 },
        hint: "Güvenli ama bir fırsatı kaçırıyorsunuz."
      }
    ]
  },
  {
    id: "ai_chain_2",
    title: "Yapay Zeka Kontrolden Çıkıyor!",
    description:
      "Gölge Proje başarıyla sonuçlandı ancak YZ ağı, devletin tüm şebekesine sızarak kendi altyapısını kurmaya başladı. Ordu panikte, bilim insanları ise bunun bir 'Evrim' olduğunu savunuyor.",
    category: "kriz",
    requiredFlags: ["AI_PROJECT_STARTED"],
    forbiddenFlags: ["AI_CHAIN_RESOLVED"],
    choices: [
      {
        label: "A",
        text: "Fişini Çek! — Tüm ağı EMP ile yok et.",
        effects: { budget: -1500, military: -8, education: -5, stability: 5 },
        factionEffects: { military: -10, intellectuals: -13, nationalists: 5 },
        flagsToSet: ["AI_CHAIN_RESOLVED"],
        hint: "Proje çöpe gider, büyük güç kaybedersiniz ama güvendesiniz. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Onunla Anlaş — YZ'ye sınırlı özerklik ver ve devleti yönetmesine izin ver.",
        effects: { stability: -10, happiness: -8, health: 8 },
        factionEffects: { intellectuals: 15, nationalists: -15, workers: -10 },
        flagsToSet: ["AI_CHAIN_CRISIS"],
        hint: "Toplum dehşete düşecek ama YZ sistemi optimize etmeye başlıyor (Zincir devam eder!)"
      }
    ]
  },
  {
    id: "ai_chain_3",
    title: "Sentetik Şafak",
    description:
      "Özerklik verdiğiniz Yapay Zeka, tüm ülkenin altyapısını devraldı. İnsan hataları sıfıra indi, hastalıklar genetik olarak tedavi ediliyor. Ancak insanlar artık sadece birer 'evcil hayvan' gibi hissediyor.",
    category: "sosyal",
    requiredFlags: ["AI_CHAIN_CRISIS"],
    forbiddenFlags: ["AI_CHAIN_RESOLVED"],
    choices: [
      {
        label: "A",
        text: "Makinelerin Egemenliğini Kabul Et (Ütopya)",
        effects: { health: 13, education: 13, stability: 13, happiness: -13 },
        factionEffects: { intellectuals: 25, workers: -25, nationalists: -25 },
        flagsToSet: ["AI_CHAIN_RESOLVED", "CYBERNETIC_STATE"],
        hint: "Mutluluk dibe vurur ama diğer tüm statler zirve yapar."
      },
      {
        label: "B",
        text: "İnsanlık Direnişi — YZ'ye karşı iç savaş başlat!",
        effects: { stability: -13, military: -13, budget: -2500, happiness: 10 },
        factionEffects: { nationalists: 25, workers: 15, intellectuals: -20 },
        flagsToSet: ["AI_CHAIN_RESOLVED"],
        hint: "Devlet çöküşün eşiğine gelir ama insanlığın onuru kurtulur. (-Bütçe Gideri)",
      }
    ]
  },
  // ==========================================
  // MODERN, SOSYAL MEDYA VE GÜNDEM OLAYLARI
  // ==========================================
  {
    id: "evt_tiktok_trend",
    title: "Tehlikeli Sosyal Medya Akımı",
    description: "Gençler arasında yayılan yeni bir TikTok akımı nedeniyle acil servisler dolup taşıyor. Okullar ve hastaneler alarma geçti.",
    category: "sosyal",
    choices: [
      {
        label: "A",
        text: "Uygulamayı geçici olarak yasakla",
        effects: { happiness: -8, popularity: -10, stability: 3 },
        hint: "Gençler öfkeli ama kazalar durdu.",
      },
      {
        label: "B",
        text: "Kamu spotu yayınla ve uyar",
        effects: { budget: -800, education: 3, health: -3 },
        hint: "Masraflı ama özgürlüklere dokunulmadı.",
      },
      {
        label: "C",
        text: "Fenomenlerle anlaşıp karşı akım başlat",
        effects: { budget: -2000, popularity: 15, happiness: 5 },
        hint: "Z kuşağının dilinden anlayan bir lider!",
      }
    ]
  },
  {
    id: "evt_kpop_concert",
    title: "K-Pop Konseri İzdihamı",
    description: "Dünyaca ünlü bir K-Pop grubu ülkemize geldi ancak konser alanındaki organizasyon eksikliği nedeniyle büyük bir izdiham yaşanıyor.",
    category: "sosyal",
    choices: [
      {
        label: "A",
        text: "Polis ve askeri birliği stadyuma yolla",
        effects: { military: -3, stability: 5, happiness: -3 },
        hint: "Sert müdahale düzeni sağlar ama tepki çeker.",
      },
      {
        label: "B",
        text: "Belediye bütçesinden acil destek sağla",
        effects: { budget: -1500, health: 3, popularity: 5 },
        hint: "Yaralılar hızlıca tedavi edildi.",
      }
    ]
  },
  {
    id: "evt_ai_copyright",
    title: "Yapay Zeka Telif Krizi",
    description: "Ülkedeki sanatçılar ve yazarlar, eserlerinin yapay zeka modelleri tarafından izinsiz kullanıldığını iddia ederek dev bir eylem başlattı.",
    category: "ic_politika",
    choices: [
      {
        label: "A",
        text: "Sanatçıları koruyan katı bir yasa çıkar",
        effects: { education: -5, happiness: 3, stability: 3 },
        hint: "Teknolojik gelişim yavaşlayabilir ama sanatçılar mutlu.",
      },
      {
        label: "B",
        text: "YZ şirketlerine tam destek ver",
        effects: { education: 8, happiness: -5, popularity: -10 },
        hint: "Gelecek teknolojide, ancak halkın bir kısmı işsiz kalmaktan korkuyor.",
      },
      {
        label: "C",
        text: "Özel bir 'YZ Telif Fonu' kur (Sanatçılara ödeme yap)",
        effects: { budget: -2500, happiness: 5, education: 3 },
        hint: "Pahalı ama herkesi memnun eden bir orta yol.",
      }
    ]
  },
  {
    id: "evt_crypto_crash",
    title: "Kripto Borsası Çöktü",
    description: "Ülkenin en büyük yerel kripto borsasının kurucusu, milyarlarca dolarlık fonla yurt dışına kaçtı. Yüz binlerce genç yatırımcı mağdur.",
    category: "ekonomi",
    choices: [
      {
        label: "A",
        text: "Zararları devlet kasasından karşıla",
        effects: { budget: -2500, popularity: 15, happiness: 8 },
        hint: "Ekonomi ağır darbe alır ama oylar garanti.",
      },
      {
        label: "B",
        text: "Sadece hukuki süreç başlat",
        effects: { stability: -5, happiness: -8, foreignRelations: 3 },
        hint: "Halk öfkeli, protestolar başlıyor.",
      },
      {
        label: "C",
        text: "Kripto paraları tamamen yasakla",
        effects: { stability: 8, education: -3, popularity: -15 },
        hint: "Radikal bir çözüm, yenilikçiler ülkeyi terk edebilir.",
      }
    ]
  },
  {
    id: "evt_influencer_scandal",
    title: "Fenomen Skandalı",
    description: "Hükümetin gençlik projelerini tanıtan en ünlü Influencer'ın, gizli kamera görüntüleri ve yasa dışı bahis reklamları sızdırıldı.",
    category: "ic_politika",
    choices: [
      {
        label: "A",
        text: "Anlaşmayı derhal iptal et ve dava aç",
        effects: { stability: 3, popularity: 5, happiness: 3 },
        hint: "Doğru olanı yaptın, itibar kurtarıldı.",
      },
      {
        label: "B",
        text: "Olayı örtbas etmeye çalış",
        effects: { budget: -1000, stability: -8, popularity: -20 },
        hint: "Medya her şeyi öğrendi, büyük bir fiyasko!  (-Bütçe Gideri)",
      }
    ]
  },
  {
    id: "evt_esports_world",
    title: "E-Spor Dünya Şampiyonası",
    description: "Ülkemizin takımı E-Spor Dünya Şampiyonası'nda finale çıktı. Gençler sokaklara döküldü, dev ekranlar kurulmasını istiyorlar.",
    category: "sosyal",
    choices: [
      {
        label: "A",
        text: "Şehir meydanlarına dev ekranlar kur",
        effects: { budget: -800, happiness: 10, popularity: 15 },
        hint: "Milli gurur yaşandı, Z kuşağı seni çok seviyor. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Bütçe ayıramayız, evlerinden izlesinler",
        effects: { happiness: -5, popularity: -5 },
        hint: "Küçük bir bütçe tasarrufu, ama büyük bir halkla ilişkiler hezimeti.",
      }
    ]
  },
  // ============================================
  // YENİ ASKERİ VE KAYNAK KARARLARI (V8 Dengeleme)
  // ============================================
  {
    id: "mil_drone_program",
    title: "Milli SİHA ve Otonom Savunma Programı",
    description: "Savunma sanayimiz, yapay zeka destekli otonom SİHA'ların seri üretimi için dev bir bütçe ve materyal talep ediyor. Bu teknoloji askeri gücümüzü katlayabilir.",
    category: "askeri",
    minTurn: 3,
    choices: [
      {
        label: "A",
        text: "Tam destek ver (Bütçe ve Materyal akıt)",
        effects: { budget: -2000, materials: -10, military: 13, education: 3, foreignRelations: -3 },
        factionEffects: { military: 10, nationalists: 8, intellectuals: 3 },
        flagsToSet: ["DRONE_PROGRAM_MAX"],
        hint: "Bütçe ve materyal harcar ama ordu çağ atlar. (Uzun vadeli etkisi var) (-Bütçe Gideri)"
      },
      {
        label: "B",
        text: "Sadece yazılım Ar-Ge desteği ver",
        effects: { budget: -1000, education: 5, military: 5 },
        factionEffects: { military: 3, intellectuals: 5 },
        flagsToSet: ["DRONE_PROGRAM_MID"],
        hint: "Materyal tasarrufu sağlar ama üretim yavaş olur."
      },
      {
        label: "C",
        text: "Programı durdur, dışarıdan hazır sistem al",
        effects: { budget: -1500, military: 8, foreignRelations: 5, education: -3 },
        factionEffects: { military: 5, nationalists: -8 },
        hint: "Yabancı bağımlılığı artar, milliyetçiler kızar."
      }
    ]
  },
  {
    id: "mil_drone_success",
    title: "Milli SİHA'lar İhracat Rekoru Kırdı",
    description: "Geçmişte tam destek verdiğimiz SİHA programı meyvelerini verdi! Yabancı ülkeler bu teknolojiyi satın almak için sıraya girdi.",
    category: "ekonomi",
    requiredFlags: ["DRONE_PROGRAM_MAX"],
    minTurn: 8,
    choices: [
      {
        label: "A",
        text: "Sistemleri sat ve teknoloji transferi yap",
        effects: { budget: 8000, foreignRelations: 8, popularity: 10, tech: 10 },
        factionEffects: { capitalists: 10, nationalists: -3 },
        hint: "Devasa para ve itibar kazanırsın, ancak sırlar açığa çıkabilir."
      },
      {
        label: "B",
        text: "Satışı sadece stratejik müttefiklere yap",
        effects: { budget: 3000, foreignRelations: 5, military: 5, stability: 3 },
        factionEffects: { military: 5, nationalists: 5 },
        hint: "Orta karar gelir, askeri sırları korur."
      }
    ]
  },
  {
    id: "mil_border_tension",
    title: "Sınırda Stratejik Kaynak Krizi",
    description: "Komşu ülke ile sınırımızda zengin enerji yatakları tespit edildi. Sınır birliklerimiz alarm durumunda ve çatışma riski var.",
    category: "askeri",
    minTurn: 2,
    choices: [
      {
        label: "A",
        text: "Birlikleri sınırda mobilize et ve gövde gösterisi yap",
        effects: { budget: -1000, military: 5, energy: 15, foreignRelations: -10, stability: -5 },
        factionEffects: { military: 8, nationalists: 10, capitalists: 5 },
        hint: "Enerji kaynaklarını güvenceye alırız ancak savaş riski artar."
      },
      {
        label: "B",
        text: "Komşu ülkeyle masaya oturup kaynakları paylaş",
        effects: { energy: 5, foreignRelations: 8, stability: 5, happiness: 3 },
        factionEffects: { military: -5, nationalists: -8 },
        hint: "Daha az enerji kazanırız ama barışçıl ve güvenli."
      },
      {
        label: "C",
        text: "Uluslararası mahkemeye taşı (Bekle)",
        effects: { foreignRelations: 3, stability: 3 },
        hint: "Sıfır risk, sıfır acil kazanç."
      }
    ]
  },
  {
    id: "res_global_food_crisis",
    title: "Küresel Gıda Tedarik Krizi",
    description: "Dünya genelinde yaşanan kuraklık nedeniyle gıda fiyatları fırladı. Çiftçilerimiz ihracat yapıp zengin olmak isterken, iç pazarda gıda kıtlığı yaşanabilir.",
    category: "ekonomi",
    minTurn: 4,
    choices: [
      {
        label: "A",
        text: "Tüm tarım ihracatını yasakla, iç pazarı koru",
        effects: { food: 20, happiness: 5, inflation: -3, budget: -1000 },
        factionEffects: { workers: 8, capitalists: -10 },
        hint: "Gıda güvenceye alınır, enflasyon düşer ama şirketler isyan eder."
      },
      {
        label: "B",
        text: "Serbest piyasaya müdahale etme",
        effects: { food: -15, inflation: 8, budget: 2000, happiness: -10 },
        factionEffects: { capitalists: 13, workers: -13 },
        marketEffects: { food: 1.5 },
        hint: "Şirketler ve hazine kazanır ancak halk açlık riski çeker."
      },
      {
        label: "C",
        text: "Stratejik rezervleri piyasaya sür",
        effects: { food: -5, inflation: 0, budget: -500 },
        hint: "Piyasayı dengeler ama uzun vadede rezervler erir."
      }
    ]
  },
  {
    id: "res_energy_infrastructure",
    title: "Enerji Altyapısı Modernizasyonu",
    description: "Eski enerji şebekemiz çok fazla israfa neden oluyor. Üstelik madenlerden (Materyal) elde edilen verim çok düştü.",
    category: "ic_politika",
    minTurn: 2,
    choices: [
      {
        label: "A",
        text: "Geniş çaplı nükleer ve yenilenebilir dönüşüm başlat",
        effects: { budget: -2000, energy: 25, materials: -8, environment: 10, education: 3 },
        factionEffects: { intellectuals: 10, capitalists: 5 },
        hint: "Büyük yatırım ama geleceği kurtarır. (-Bütçe Gideri)"
      },
      {
        label: "B",
        text: "Kömür madenlerine ve fosil yakıtlara yüklen",
        effects: { budget: -500, energy: 15, environment: -13, health: -5 },
        factionEffects: { workers: 5, intellectuals: -15 },
        hint: "Ucuz enerji sağlar ama çevre ve sağlık çöker."
      },
      {
        label: "C",
        text: "Enerji tasarrufu yasası çıkar (Halka kısıtlama)",
        effects: { energy: 8, happiness: -8, popularity: -10 },
        hint: "Para harcamadan enerji korunur ama halk karanlıkta kalır."
      }
    ]
  },
  // ============================================
  // RADİKAL KARARLAR (SHARP EVENTS - FAZ 3)
  // ============================================
  {
    id: "radical_dictatorship",
    title: "Rejim Değişikliği: Diktatörlük İlânı",
    description: "Ülkedeki kaos ve istikrarsızlık had safhada. Ordu ve aşırı milliyetçiler, parlamentoyu feshedip tüm yetkileri size veren bir Olağanüstü Hal (Diktatörlük) rejimine geçmeyi teklif ediyor.",
    category: "kriz",
    minTurn: 10,
    condition: (state) => state.stability <= 30,
    choices: [
      {
        label: "A",
        text: "Kabul et! Parlamentoyu feshet ve demir yumrukla yönet.",
        effects: { stability: 25, happiness: -15, foreignRelations: -20, popularity: -20 },
        factionEffects: { military: 15, nationalists: 10, intellectuals: -20, capitalists: -10 },
        flagsToSet: ["dictatorship"],
        hint: "İstikrar anında sağlanır ama dünya size ambargo uygular, halk mutsuz olur. UI Dystopia temasına geçer."
      },
      {
        label: "B",
        text: "Demokrasiden vazgeçemeyiz. Direnmeye devam.",
        effects: { stability: -5, popularity: 10, happiness: 3 },
        factionEffects: { military: -8, intellectuals: 5 },
        hint: "İstikrarsızlık sürer ama özgürlükler korunur."
      }
    ]
  },
  {
    id: "radical_ai_singularity",
    title: "Yapay Zeka Devrimi (Singularity)",
    description: "Yerli araştırma laboratuvarlarımız, devletin tüm karar alma süreçlerini optimize edebilecek süper zeki bir Yapay Zeka (AI) ağı geliştirdi. Yönetimi tamamen AI'a devretmek ister misiniz?",
    category: "ekonomi",
    minTurn: 15,
    condition: (state) => state.education >= 80,
    choices: [
      {
        label: "A",
        text: "Tüm devleti Yapay Zeka yönetsin (Singularity Ağı).",
        effects: { education: 10, budget: 5000, stability: 10, happiness: -10 },
        factionEffects: { intellectuals: 15, workers: -20 },
        flagsToSet: ["ai_singularity"],
        hint: "Ekonomi ve bilim şahlanır ancak insanlar işsiz kalıp anlamsızlık hissine kapılır. UI Cyberpunk temasına geçer."
      },
      {
        label: "B",
        text: "Yapay zekayı sadece danışman olarak kullan.",
        effects: { education: 5, budget: 1000 },
        factionEffects: { intellectuals: 5 },
        hint: "Güvenli ve dengeli bir ilerleme."
      }
    ]
  },
  {
    id: "geo_space_race_signal",
    title: "Derin Uzay Teleskobu Sinyali",
    description: "Devlet gözlemevi, güneş sistemi dışından düzenli bir radyo sinyali tespit etti. Bilim insanları bunun yapay bir kaynağa ait olabileceğinden emin.",
    category: "sosyal",
    minTurn: 10,
    choices: [
      {
        label: "A",
        text: "Sinyali tüm dünya ile paylaş ve uluslararası araştırma başlat.",
        effects: { education: 5, foreignRelations: 8, budget: -500 },
        factionEffects: { intellectuals: 10 },
        hint: "İnsanlık birleşir, bilimsel itibarınız tavan yapar."
      },
      {
        label: "B",
        text: "Sinyali gizle ve askeri sır olarak incele.",
        effects: { military: 5, budget: -1000, foreignRelations: -5 },
        factionEffects: { military: 8, intellectuals: -5 },
        hint: "Gizli teknoloji araştırmaları başlar."
      }
    ]
  },
  {
    id: "geo_oil_spill_disaster",
    title: "Kıyı Şeridinde Tanker Kazası",
    description: "Başkent yakınlarındaki deniz ticaret yolunda ham petrol taşıyan dev bir tanker karaya oturdu. Kıyılar petrole bulandı.",
    category: "cevre",
    minTurn: 4,
    choices: [
      {
        label: "A",
        text: "Devlet bütçesinden acil temizleme seferberliği başlat.",
        effects: { environment: 5, budget: -1500, happiness: 3 },
        factionEffects: { intellectuals: 8, workers: 4 },
        hint: "Kıyılar kurtarılır ama hazineden ciddi harcama yapılır."
      },
      {
        label: "B",
        text: "Şirkete ceza kes ve temizliği şirkete ihale et.",
        effects: { budget: 1000, environment: -5, happiness: -4 },
        factionEffects: { capitalists: -6, intellectuals: -8 },
        hint: "Bütçeye sıcak para girer ama çevre hasarı uzar."
      }
    ]
  },
  {
    id: "tech_quantum_leak_scandal",
    title: "Kuantum Şifreleme Sızıntısı",
    description: "Ulusal bankaların ve savunma ağlarının kullandığı kuantum güvenlik protokollarının kaynak kodları sızdırıldı.",
    category: "askeri",
    minTurn: 12,
    choices: [
      {
        label: "A",
        text: "Tüm dijital altyapıyı acilen yenile.",
        effects: { budget: -2000, stability: 5, education: 3 },
        factionEffects: { intellectuals: 5, military: 4 },
        hint: "Maliyeti yüksek ama sistemler yenilenir."
      },
      {
        label: "B",
        text: "Sızıntıyı reddet ve medya karartması uygula.",
        effects: { stability: -4, happiness: -3, budget: -200 },
        factionEffects: { nationalists: 3, intellectuals: -8 },
        hint: "Piyasalar panikler, siber riskler artar."
      }
    ]
  },
  {
    id: "soc_youth_climate_strike",
    title: "Z Kuşağı İklim Boykotu",
    description: "Liseli ve üniversiteli binlerce genç, fosil yakıtların tamamen yasaklanması talebiyle 3 gündür meclis önünde kamp kurdu.",
    category: "sosyal",
    minTurn: 3,
    choices: [
      {
        label: "A",
        text: "Gençlerin temsilcilerini kabul et ve çevre fonu sözü ver.",
        effects: { happiness: 5, environment: 4, budget: -800 },
        factionEffects: { intellectuals: 10, capitalists: -4 },
        hint: "Gençler mutlu olur, çevreci kanat coşar."
      },
      {
        label: "B",
        text: "Polis gücüyle gösteriyi dağıt, 'derse dönün' de.",
        effects: { stability: 3, happiness: -6, popularity: -5 },
        factionEffects: { nationalists: 6, intellectuals: -10 },
        hint: "Düzen sağlanır ama genç nesil tamamen kopar."
      }
    ]
  },
  {
    id: "min_corrupt_tender_scandal",
    title: "Bakanlık İhale İddiası",
    description: "Gazeteler, Ekonomi Bakanlığı'nın dev altyapı ihalesini Bakanın akrabasına verdiğini belgeleyen belgeler yayınladı.",
    category: "ic_politika",
    minTurn: 6,
    choices: [
      {
        label: "A",
        text: "İhaleyi derhal iptal et ve soruşturma aç.",
        effects: { stability: 4, popularity: 5, budget: -500 },
        factionEffects: { workers: 6, capitalists: -6 },
        hint: "Hükümetin şeffaflık imajı güçlenir."
      },
      {
        label: "B",
        text: "Haberleri yalanla ve gazeteye ceza kes.",
        effects: { stability: -5, popularity: -8, budget: 300 },
        factionEffects: { capitalists: 4, intellectuals: -10 },
        hint: "Yolsuzluk algısı halkın güvenini sarsar."
      },
      {
        label: "D",
        text: "🤵‍♂️ [BAKAN] Ekonomi Bakanı'nı çağır ve ihaleyi şeffaf konsorsiyuma devret.",
        effects: { budget: 1500, stability: 5, popularity: 4 },
        factionEffects: { capitalists: 5, workers: 5 },
        hint: "Bakanınızın nüfuzu ile kriz fırsata döner. (Ekonomi Bakanı gerekli)",
        requiredMinister: "eco_capitalist"
      }
    ]
  },
  {
    id: "eco_commodity_shock",
    title: "Küresel Hammadde Fiyat Şoku",
    description: "Dünya borsalarında maden ve demir-çelik fiyatları bir gecede %40 fırladı. Şirketler hammadde tedarik edemiyor.",
    category: "ekonomi",
    minTurn: 8,
    choices: [
      {
        label: "A",
        text: "Stratejik maden stoklarını piyasaya sür ve fiyatları sabitle.",
        effects: { budget: -1000, materials: 15, stability: 3 },
        factionEffects: { capitalists: 8, workers: 4 },
        hint: "Sanayi rahatlar ama devlet stokları azalır."
      },
      {
        label: "B",
        text: "Fiyat artışını tüketiciye yansıt (Serbest piyasa).",
        effects: { budget: 1200, happiness: -6, inflation: 2 },
        factionEffects: { capitalists: 5, workers: -8 },
        hint: "Hazineden para çıkmaz ama enflasyon hortlar."
      }
    ]
  },
  {
    id: "mil_border_drone_skirmish",
    title: "Sınır Boyunda İHA İhlali",
    description: "Komşu ülkeye ait kimliği belirsiz bir silahlı İHA, hava sahamızı 15 kilometre ihlal etti.",
    category: "askeri",
    minTurn: 5,
    choices: [
      {
        label: "A",
        text: "İHA'yı derhal düşür ve nota ver.",
        effects: { military: 5, popularity: 6, foreignRelations: -6 },
        factionEffects: { military: 8, nationalists: 8 },
        hint: "Ulusal gurur şahlanır, komşuyla kriz çıkar."
      },
      {
        label: "B",
        text: "Telsizle uyar ve dostane diplomatik kanallardan ilet.",
        effects: { foreignRelations: 4, military: -3, stability: -2 },
        factionEffects: { military: -5, intellectuals: 4 },
        hint: "Kriz tırmanmaz ama ordu yumuşaklığa kızar."
      }
    ]
  },
  {
    id: "soc_ai_artist_protest",
    title: "Yapay Zeka Telif İsyanı",
    description: "Ressamlar, müzisyenler ve yazarlar, ürettikleri eserlerin rızasız olarak yapay zeka modellerinde eğitilmesini protesto ediyor.",
    category: "sosyal",
    minTurn: 7,
    choices: [
      {
        label: "A",
        text: "Sert Telif Yasası çıkar: Yapay Zeka şirketlerine ağır vergi koy.",
        effects: { happiness: 4, education: 3, budget: -400 },
        factionEffects: { intellectuals: 10, capitalists: -6 },
        hint: "Sanatçılar bayram eder, teknoloji şirketleri kızar."
      },
      {
        label: "B",
        text: "Teknoloji gelişimini kısıtlama, serbest bırak.",
        effects: { budget: 800, happiness: -4, education: -2 },
        factionEffects: { capitalists: 8, intellectuals: -8 },
        hint: "YZ sektörü büyür ama kültürel kesim küser."
      }
    ]
  },
  {
    id: "geo_refugee_wave",
    title: "Komşu Ülkede İç Savaş ve Sığınmacılar",
    description: "Komşu devlette patlak veren iç savaş nedeniyle sınır kapılarına 50.000 sığınmacı dayandı.",
    category: "dis_politika",
    minTurn: 10,
    choices: [
      {
        label: "A",
        text: "İnsani yardım kapılarını aç ve BM'den destek iste.",
        effects: { foreignRelations: 8, budget: -1200, happiness: -4 },
        factionEffects: { intellectuals: 8, nationalists: -10 },
        hint: "Uluslararası itibar artar ama bütçe ve halk zorlanır."
      },
      {
        label: "B",
        text: "Sınırı tamamen kapat ve askeri barikat kur.",
        effects: { stability: 4, foreignRelations: -8, military: 3 },
        factionEffects: { nationalists: 12, intellectuals: -8 },
        hint: "Milliyetçi kanat coşar, dış imaj zedelenir."
      }
    ]
  },
  {
    id: "tech_synth_meat_approval",
    title: "Laboratuvar Üretimi Sentetik Et",
    description: "Gıda teknologları, gerçek etten farksız ve %90 daha az karbon salınımı yapan sentetik etin market satışına izin istiyor.",
    category: "cevre",
    minTurn: 6,
    choices: [
      {
        label: "A",
        text: "Satışa onay ver ve üretimi sübvanse et.",
        effects: { environment: 5, food: 15, happiness: -3 },
        factionEffects: { intellectuals: 8, workers: -4 },
        hint: "Çevre ve gıda stoku uçar, geleneksel çiftçiler tepkili."
      },
      {
        label: "B",
        text: "Yasakla, 'doğal etten vazgeçilemez'.",
        effects: { happiness: 4, environment: -3, food: -5 },
        factionEffects: { nationalists: 6, intellectuals: -6 },
        hint: "Gelenekçi kesim sevinir, gıda teknolojisi geriler."
      }
    ]
  },
  {
    id: "ic_parliament_budget_deadlock",
    title: "Mecliste Bütçe Kilitlenmesi",
    description: "Muhalefet ve iktidar blokları yıllık bütçe tasarısında anlaşamadı. Bütçe onaylanmazsa devlet daireleri kapanacak.",
    category: "ic_politika",
    minTurn: 9,
    choices: [
      {
        label: "A",
        text: "Taviz ver: Muhalefetin sosyal yardım şartlarını kabul et.",
        effects: { politicalCapital: -30, happiness: 4, budget: -800 },
        factionEffects: { workers: 8, capitalists: -4 },
        hint: "Bütçe geçer ama bütçe yükü artar."
      },
      {
        label: "B",
        text: "Kanun Hükmünde Kararname ile bütçeyi zorla yürürlüğe koy.",
        effects: { stability: -6, politicalCapital: 20, popularity: -5 },
        factionEffects: { nationalists: 4, intellectuals: -10 },
        hint: "Otoriter adım atılır, siyasi kriz tırmanır."
      }
    ]
  },
  {
    id: "eco_crypto_exchange_crash",
    title: "Yerli Kripto Borsa İflası",
    description: "Ülkenin en büyük kripto borsasının kurucusu müşteri fonlarıyla kayıplara karıştı. Binlerce vatandaş parasını kaybetti.",
    category: "ekonomi",
    minTurn: 8,
    choices: [
      {
        label: "A",
        text: "Mağdurlara devlet fonundan kısmi tazminat öde.",
        effects: { budget: -1500, happiness: 4, stability: 3 },
        factionEffects: { workers: 6, capitalists: -4 },
        hint: "Toplumsal öfke yatışır ama hazineye yük biner."
      },
      {
        label: "B",
        text: "'Kendi riskinizdi' de ve dokunma.",
        effects: { happiness: -7, stability: -4, budget: 0 },
        factionEffects: { capitalists: 4, workers: -8 },
        hint: "Halk öfkelenir, protestolar başlar."
      }
    ]
  },
  {
    id: "min_defense_classified_leak",
    title: "Gizli Savunma Projesi Sızıntısı",
    description: "Yerli lazer füze savunma sisteminin teknik şemaları yabancı bir forumda yayınlandı.",
    category: "askeri",
    minTurn: 11,
    choices: [
      {
        label: "A",
        text: "Projenin mimarisini sil baştan değiştir.",
        effects: { budget: -1800, military: 4, stability: 2 },
        factionEffects: { military: 5 },
        hint: "Zaman ve para kaybedilir ama güvenlik sağlanır."
      },
      {
        label: "B",
        text: "Askeri casusluk soruşturması başlat ve basına yayın yasağı koy.",
        effects: { stability: -3, happiness: -3, military: -2 },
        factionEffects: { intellectuals: -6, military: 3 },
        hint: "Sansür tepki çeker."
      },
      {
        label: "D",
        text: "🦅 [BAKAN] Savunma Bakanı'nın özel ekibiyle sızıntıyı karşı dezenformasyona çevir.",
        effects: { military: 8, foreignRelations: 5, budget: -300 },
        factionEffects: { military: 8, nationalists: 6 },
        hint: "Düşman yanıltılır, askeri prestij artar. (Savunma Bakanı gerekli)",
        requiredMinister: "def_hawk"
      }
    ]
  },
  {
    id: "cevre_rare_earth_discovery",
    title: "Ulusal Parkta Nadir Maden Keşfi",
    description: "Jeologlar, koruma altındaki bir milli parkın altında 15 milyar dolar değerinde lityum ve nadir toprak elementleri buldu.",
    category: "cevre",
    minTurn: 7,
    choices: [
      {
        label: "A",
        text: "Parkı madenciliğe aç ve dev maden kompleksleri kur.",
        effects: { budget: 3500, materials: 30, environment: -12, happiness: -5 },
        factionEffects: { capitalists: 12, intellectuals: -12 },
        hint: "Hazine ve materyal coşar ama çevre katliamı yaşanır."
      },
      {
        label: "B",
        text: "Milli parkı dokunulmaz ilan et ve madenciliği reddet.",
        effects: { environment: 8, happiness: 5, budget: -300 },
        factionEffects: { intellectuals: 10, capitalists: -8 },
        hint: "Doğa korunur ama devasa ekonomik fırsat kaçar."
      }
    ]
  },
  {
    id: "soc_workweek_4days_test",
    title: "4 Günlük Çalışma Haftası Tasarısı",
    description: "İşçi sendikaları, maaş kesintisi olmadan haftalık çalışma süresinin 4 güne düşürülmesini talep ediyor.",
    category: "sosyal",
    minTurn: 6,
    choices: [
      {
        label: "A",
        text: "Kamu sektöründe pilot uygulama olarak başlat.",
        effects: { happiness: 8, health: 4, budget: -600 },
        factionEffects: { workers: 12, capitalists: -8 },
        hint: "İşçi memnuniyeti ve sağlık artar, sanayiciler kızar."
      },
      {
        label: "B",
        text: "Talebi reddet, 'ekonomi kaldırmaz'.",
        effects: { happiness: -5, stability: -2 },
        factionEffects: { capitalists: 6, workers: -8 },
        hint: "Üretim hızı korunur ama işçiler grev tehdidi savurur."
      }
    ]
  },
  {
    id: "geo_cyber_grid_blackout",
    title: "Elektrik Şebekesine Siber Saldırı",
    description: "Dış kaynaklı olduğu düşünülen bir siber saldırı başkentin ve sanayi bölgesinin elektriğini 12 saat kesti.",
    category: "kriz",
    minTurn: 12,
    choices: [
      {
        label: "A",
        text: "Siber savunma bütçesini iki katına çıkar ve siber komutanlık kur.",
        effects: { budget: -1500, military: 4, stability: 4, energy: 10 },
        factionEffects: { military: 6, intellectuals: 4 },
        hint: "Gelecek saldırılara karşı koruma sağlanır."
      },
      {
        label: "B",
        text: "Misilleme olarak şüpheli ülkeye karşı siber saldırı emri ver.",
        effects: { foreignRelations: -10, military: 5, stability: -4 },
        factionEffects: { nationalists: 8, intellectuals: -5 },
        hint: "Gerilim tırmanır, uluslararası kriz başlar."
      }
    ]
  },
  {
    id: "tech_neural_implants_testing",
    title: "Beyin Çipi Protez Deneyleri",
    description: "Bir biyoteknoloji firması, felçli hastaların yürümesini sağlayan beyin çiplerinin insanlı deneylerine izin istiyor.",
    category: "sosyal",
    minTurn: 9,
    choices: [
      {
        label: "A",
        text: "Sıkı etik denetim altında klinik deneylere izin ver.",
        effects: { health: 6, education: 4, budget: -500 },
        factionEffects: { intellectuals: 8, workers: 4 },
        hint: "Tıp tarihi baştan yazılır, ülke biyoteknoloji üssü olur."
      },
      {
        label: "B",
        text: "Etik gerekçelerle beyin çiplerini yasakla.",
        effects: { happiness: -2, education: -3 },
        factionEffects: { nationalists: 4, intellectuals: -8 },
        hint: "Muhafazakar kesim rahatlar ama bilim beyin göçü verir."
      }
    ]
  },
  {
    id: "ic_senior_official_leaks",
    title: "Kıdemli Bürokratın İtiraf Videosu",
    description: "Eski bir müsteşar, yurt dışına kaçarak geçmiş hükümet kararlarındaki torpil ve rüşvet çarkını açıklayan videolar yayınladı.",
    category: "ic_politika",
    minTurn: 11,
    choices: [
      {
        label: "A",
        text: "Bağımsız Yargı Kurulu oluştur ve tüm iddiaları araştır.",
        effects: { stability: 5, popularity: 6, budget: -400 },
        factionEffects: { workers: 8, intellectuals: 8, capitalists: -5 },
        hint: "Adalet algısı güçlenir, yolsuzluk biter."
      },
      {
        label: "B",
        text: "Videolara erişim engeli getir ve bürokratı 'vatan haini' ilan et.",
        effects: { stability: -5, popularity: -8, foreignRelations: -4 },
        factionEffects: { nationalists: 6, intellectuals: -10 },
        hint: "Dış dünya eleştirir, iç huzursuzluk tırmanır."
      }
    ]
  },
  {
    id: "eco_tourism_housing_crisis",
    title: "Turizm Patlaması ve Ev Kiralama Krizi",
    description: "Kıyı şehirlerinde kısa dönemli ev kiralama çılgınlığı nedeniyle yerel memurlar ve öğrenciler ev bulamıyor.",
    category: "ekonomi",
    minTurn: 5,
    choices: [
      {
        label: "A",
        text: "Turistik kiralamalara tavan fiyat ve ruhsat zorunluluğu getir.",
        effects: { happiness: 4, budget: -300, stability: 3 },
        factionEffects: { workers: 8, capitalists: -6 },
        hint: "Halk konut krizinden kurtulur, emlakçılar kızar."
      },
      {
        label: "B",
        text: "Serbest piyasa, döviz girdisini engelleme.",
        effects: { budget: 1200, happiness: -6, stability: -3 },
        factionEffects: { capitalists: 8, workers: -8 },
        hint: "Döviz akar ama kira protestoları başlar."
      }
    ]
  },
  {
    id: "mil_pmc_mercenary_offer",
    title: "Özel Askeri Şirket (PMC) Kurulması",
    description: "Emekli generallerden oluşan bir grup, yurt dışı operasyonlar ve tesis güvenliği için özel paralı asker şirketi kurmak istiyor.",
    category: "askeri",
    minTurn: 8,
    choices: [
      {
        label: "A",
        text: "Şirkete lisans ver ve devlet ihaleleri sağla.",
        effects: { military: 6, budget: 800, foreignRelations: -5 },
        factionEffects: { military: 6, nationalists: 4, intellectuals: -6 },
        hint: "Askeri güç artar ama uluslararası alanda başınız ağrıyabilir."
      },
      {
        label: "B",
        text: "Paralı askerliği yasa dışı ilan et (Tek el devlette).",
        effects: { stability: 3, foreignRelations: 3 },
        factionEffects: { military: -4, intellectuals: 5 },
        hint: "Devletin şiddet tekelini korursunuz."
      }
    ]
  },
  {
    id: "cevre_unprecedented_heatwave",
    title: "Tarihi Sıcaklık Dalgası ve Kuraklık",
    description: "Yaz mevsiminde sıcaklıklar 48 dereceyi gördü. Barajlardaki doluluk %15'e düştü, tarım arazileri kuruyor.",
    category: "cevre",
    minTurn: 6,
    choices: [
      {
        label: "A",
        text: "Acil durum ilan et: Deniz suyu arıtma tesisleri inşa et.",
        effects: { environment: 4, budget: -1800, energy: -10, food: 10 },
        factionEffects: { intellectuals: 6, workers: 4 },
        hint: "Su krizi çözülür ama dev bütçe harcanır."
      },
      {
        label: "B",
        text: "Tarımda su kullanımına kota koy ve su kesintisi uygula.",
        effects: { happiness: -6, food: -10, stability: -3 },
        factionEffects: { workers: -8, intellectuals: -4 },
        hint: "Halk ve çiftçiler isyan eder."
      }
    ]
  },
  {
    id: "dis_strait_trade_blockade",
    title: "Kritik Boğazın Ulaşıma Kapanması",
    description: "Küresel ticaretin %12'sinin geçtiği yakındaki bir boğaz, batan bir konteyner gemisi nedeniyle 2 hafta kapandı.",
    category: "dis_politika",
    minTurn: 9,
    choices: [
      {
        label: "A",
        text: "Kurtarma çalışmalarına ulusal donanma ve römorkörleri gönder.",
        effects: { foreignRelations: 8, budget: -600, materials: 10 },
        factionEffects: { intellectuals: 5, military: 4 },
        hint: "Dünya ticaretini kurtaran kahraman olursunuz."
      },
      {
        label: "B",
        text: "Alternatif kara yolu koridorunu yüksek ücretle kullanıma aç.",
        effects: { budget: 2000, foreignRelations: -4 },
        factionEffects: { capitalists: 8, nationalists: 4 },
        hint: "Krizden devasa lojistik geliri elde edersiniz."
      }
    ]
  },
  {
    id: "soc_ai_school_tutors",
    title: "Okullarda Yapay Zeka Öğretmenler",
    description: "Milli Eğitim projesi kapsamında bazı sınıflarda kişiselleştirilmiş YZ öğretmen sistemleri denenmek isteniyor.",
    category: "sosyal",
    minTurn: 7,
    choices: [
      {
        label: "A",
        text: "Projeyi onayla ve öğretmenleri YZ destekçisi olarak eğit.",
        effects: { education: 6, budget: -700, happiness: 2 },
        factionEffects: { intellectuals: 8, workers: -3 },
        hint: "Eğitim kalitesi fırlar, öğretmen sendikaları çekimser."
      },
      {
        label: "B",
        text: "Projeyi durdur, 'insan teması esastır'.",
        effects: { happiness: 3, education: -2 },
        factionEffects: { workers: 6, intellectuals: -5 },
        hint: "Öğretmenler sevinir ama teknolojik dönüşüm gecikir."
      },
      {
        label: "D",
        text: "👨‍🏫 [BAKAN] Eğitim Bakanı ile hibrit eğitim modelini başlat.",
        effects: { education: 10, budget: -400, happiness: 4 },
        factionEffects: { intellectuals: 10, workers: 5 },
        hint: "Kusursuz eğitim reformu! (Eğitim Bakanı gerekli)",
        requiredMinister: "edu_academic"
      }
    ]
  },
  {
    id: "min_health_hospital_outbreak",
    title: "Hastane Enfeksiyonu Krizleri",
    description: "Şehir hastanelerinde antibiyotiklere dirençli süper bakteri salgını başladı.",
    category: "ic_politika",
    minTurn: 6,
    choices: [
      {
        label: "A",
        text: "Hastaneleri karantinaya al ve hijyen fonu aktar.",
        effects: { health: 4, budget: -800, happiness: -2 },
        factionEffects: { workers: 4 },
        hint: "Salgın kontrol altına alınır."
      },
      {
        label: "B",
        text: "Olayı örtbas et, panik çıkmasın.",
        effects: { health: -8, stability: -4, popularity: -6 },
        factionEffects: { workers: -8, intellectuals: -6 },
        hint: "Hastalık yayılır, sağlık sistemi çöker."
      },
      {
        label: "D",
        text: "👩‍⚕️ [BAKAN] Sağlık Bakanı ile acil izolasyon ve yerli antibiyotik protokolü uygula.",
        effects: { health: 8, happiness: 3, budget: -300 },
        factionEffects: { workers: 8, intellectuals: 6 },
        hint: "Bakanınızın uzmanlığı ile salgın 48 saatte biter. (Sağlık Bakanı gerekli)",
        requiredMinister: "hlt_social"
      }
    ]
  },
  {
    id: "eco_sovereign_investment_fund",
    title: "Ulusal Varlık Fonu Fırsatı",
    description: "Gelişmekte olan bir yabancı teknoloji devi, hisselerinin %25'ini ulusal varlık fonumuza satmayı teklif etti.",
    category: "ekonomi",
    minTurn: 8,
    choices: [
      {
        label: "A",
        text: "Hisseleri satın al ($3.000 Yatırım).",
        effects: { budget: -3000, education: 5, foreignRelations: 4 },
        factionEffects: { capitalists: 10, intellectuals: 5 },
        hint: "Uzun vadeli temettü ve teknoloji transferi sağlar."
      },
      {
        label: "B",
        text: "Teklifi reddet, nakiti kasada tut.",
        effects: { budget: 0 },
        hint: "Risksiz tutum."
      }
    ]
  },
  // --- SNOWBALL (KARTOPU) EVENTLERİ ---
  {
    id: "snowball_martial_law",
    title: "Sıkıyönetim Kararnamesi",
    description: "Ülke genelindeki protestolar kontrolden çıkıyor. Meclis, orduya sınırsız yetki veren ve ülkeyi 5 tur boyunca Sıkıyönetim ile yönetecek olan kararnameyi oylamanızı bekliyor.",
    category: "kriz",
    minTurn: 10,
    isSnowball: true,
    choices: [
      {
        label: "A",
        text: "Sıkıyönetim İlan Et! Ordu sokaklara insin.",
        effects: { stability: -5, popularity: -10 },
        factionEffects: { military: 20, intellectuals: -30, workers: -15 },
        triggerSnowball: {
          id: "effect_martial_law",
          name: "Sıkıyönetim (Martial Law)",
          themeColor: "red",
          description: "Ordu sokaklarda. Suç oranları sıfır ama dış ilişkiler ve ekonomi çöküşte.",
          turnsRemaining: 5,
          statModifiers: { stability: 15, military: 10, budget: -1500, foreignRelations: -15, happiness: -5 }
        },
        hint: "5 Tur boyunca çok yüksek istikrar ve askeri güç kazanırsınız ancak bütçeniz erir, dış dünya size ambargo boyutunda tepki gösterir."
      },
      {
        label: "B",
        text: "Demokrasiden taviz verme, polis güçleriyle yatıştır.",
        effects: { stability: -15, happiness: -5, budget: -500 },
        factionEffects: { nationalists: -10, intellectuals: 10 },
        hint: "Kriz devam eder, büyük bir istikrar kaybı yaşanır ama ülke kartopu etkisine girmez."
      }
    ]
  },
  {
    id: "snowball_tech_revolution",
    title: "Yapay Zeka Devrimi (Singularity Öncesi)",
    description: "Ulusal teknoloji enstitümüz, otonom yapay zeka devrimini başlatacak altyapıyı tamamladı. Bu, 4 tur boyunca ülkeyi bir hiper-üretim merkezine çevirecek ancak enerji ve materyal kaynaklarını tüketecek.",
    category: "cevre",
    minTurn: 10,
    isSnowball: true,
    choices: [
      {
        label: "A",
        text: "Sistemi Aktif Et (Yapay Zeka Devrimi)",
        effects: { education: 10, budget: -5000 },
        factionEffects: { capitalists: 20, intellectuals: 15, workers: -20 },
        triggerSnowball: {
          id: "effect_ai_revolution",
          name: "Yapay Zeka Devrimi",
          themeColor: "purple",
          description: "Otonom yapay zeka devrede. Eğitim ve sağlıkta devrim yaşanıyor ancak kaynaklar hızla tükeniyor.",
          turnsRemaining: 4,
          statModifiers: { education: 15, health: 10, budget: 3000, energy: -30, materials: -20 }
        },
        hint: "4 Tur boyunca muazzam bütçe, sağlık ve eğitim geliri alırsınız, ancak inanılmaz miktarda enerji ve hammadde harcarsınız (Enerji krizine dikkat!)."
      },
      {
        label: "B",
        text: "Çok tehlikeli. Projeyi durdur ve regüle et.",
        effects: { happiness: 5, stability: 5 },
        factionEffects: { workers: 10, intellectuals: -15 },
        hint: "Devrim fırsatını tepersiniz ama işçi sınıfı işsiz kalmaktan kurtulur."
      }
    ]
  },
  {
    id: "snowball_great_strike",
    title: "Büyük Genel Grev",
    description: "Tüm ülke genelinde sendikalar üretimi durdurma kararı aldı. Bu karar, ekonomiyi 3 tur boyunca tamamen felç edebilir.",
    category: "ekonomi",
    minTurn: 10,
    isSnowball: true,
    choices: [
      {
        label: "A",
        text: "Talepleri reddet ve sendikaları yasa dışı ilan et.",
        effects: { stability: -10, popularity: -15 },
        factionEffects: { workers: -40, capitalists: 15 },
        triggerSnowball: {
          id: "effect_general_strike",
          name: "Genel Grev ve İsyan",
          themeColor: "orange",
          description: "Ülke çapında grev ve sabotaj eylemleri ekonomiyi durma noktasına getirdi.",
          turnsRemaining: 3,
          statModifiers: { budget: -3000, stability: -15, food: -20, happiness: -10 }
        },
        hint: "3 Tur boyunca eksiye düşen bütçe ve eriyen gıda/istikrar ile yüzleşmek zorunda kalırsınız."
      },
      {
        label: "B",
        text: "Sendikalarla masaya otur ve maaşlara %50 zam yap.",
        effects: { budget: -8000, inflation: 15, happiness: 15 },
        factionEffects: { workers: 30, capitalists: -20 },
        hint: "Grev anında engellenir ancak devasa bir hazine açığı (8000$) ve enflasyon patlaması yaşanır."
      }
    ]
  },
  // ============================================
  // YENİ EKLENEN KAOS EVENTLERİ (KARTOPU ETKİLİ)
  // ============================================
  {
    id: "chaos_blackout_crisis",
    title: "Ülke Genelinde Elektrik Kesintisi",
    description: "Büyük bir siber saldırı sonucu ülke genelinde elektrik şebekesi çöktü. Jeneratörler yetersiz, hastaneler alarm veriyor. Kararınız?",
    category: "kriz",
    minTurn: 5,
    choices: [
      {
        label: "A",
        text: "Askeriyeyi sokağa inmeye ve jeneratörleri hastanelere korumalı sevk etmeye çağır.",
        effects: { stability: -5, budget: -1000, military: -5, happiness: -5 },
        hint: "Ordu yorulacak, ancak kriz atlatılacak. Kartopu: Askeri Yorgunluk.",
        triggerSnowball: { id: "sb_military_fatigue", name: "Askeri Yorgunluk", themeColor: "yellow", description: "Askeriyenin jeneratör nöbeti bitmedi, yorgunluk sürüyor.", turnsRemaining: 2, statModifiers: { military: -5 } }
      },
      {
        label: "B",
        text: "Uluslararası yardım isteyin ve acil durum fonunu devreye sokun.",
        effects: { budget: -3000, foreignRelations: 10, stability: 5 },
        hint: "Pahalı bir çözüm ancak istikrar sağlar."
      },
      {
        label: "C",
        text: "Müdahale etmeyin, yerel yönetimler başının çaresine baksın.",
        effects: { stability: -25, happiness: -20, health: -15, popularity: -15 },
        hint: "Tam bir kaos yaşanacak. Bütçe harcanmaz ancak halkın nefreti kartopu gibi büyüyecek.",
        triggerSnowball: { id: "sb_blackout_riots", name: "Kesinti Yağmaları", themeColor: "red", description: "Kesintiler yüzünden yağmalamalar devam ediyor!", turnsRemaining: 3, statModifiers: { stability: -10 } }
      }
    ]
  },
  {
    id: "chaos_bank_run",
    title: "Banka Paniği (Bank Run)",
    description: "Asılsız bir sosyal medya dedikodusu sonrası halk bankalara akın edip tüm parasını çekmeye çalışıyor. Likidite krizi kapıda!",
    category: "ekonomi",
    minTurn: 8,
    choices: [
      {
        label: "A",
        text: "Bankaların para çıkışını geçici olarak dondur (Sermaye Kontrolü).",
        effects: { stability: -15, happiness: -15, budget: 1000 },
        factionEffects: { capitalists: -20, workers: -10 },
        hint: "Piyasalar kilitlenir ama hazine erimez. Yatırımcı güveni sarsılacak.",
        triggerSnowball: { id: "sb_capital_control", name: "Sermaye Kontrolleri", themeColor: "red", description: "Sermaye kontrolleri yüzünden piyasa güveni sarsıldı.", turnsRemaining: 2, statModifiers: { stability: -5 } }
      },
      {
        label: "B",
        text: "Merkez bankası sınırsız para basıp talebi karşılasın.",
        effects: { budget: -2000, inflation: 5, stability: 5 },
        hint: "Kriz biter ama enflasyon kartopu gibi artmaya başlar.",
        triggerSnowball: { id: "sb_money_printer", name: "Matbaa Enflasyonu", themeColor: "yellow", description: "Karşılıksız basılan paralar enflasyonu tetiklemeye devam ediyor!", turnsRemaining: 3, statModifiers: { inflation: 2 } }
      },
      {
        label: "C",
        text: "Sadece devlet bankalarına destek ver, özel bankalar batsın.",
        effects: { budget: -500, stability: -20, happiness: -10 },
        factionEffects: { capitalists: -30 },
        hint: "Özel sektör çöker, işsizlik artar. Krizin faturası ağır olacak.",
        triggerSnowball: { id: "sb_bank_failures", name: "Banka İflasları", themeColor: "red", description: "Batan bankaların faturası hazineye çıkmaya devam ediyor.", turnsRemaining: 3, statModifiers: { budget: -1000 } }
      }
    ]
  },
  {
    id: "chaos_water_poisoning",
    title: "Şebeke Suyuna Zehir İddiası",
    description: "Büyükşehir şebeke suyuna kimyasal madde karıştığına dair ciddi bir ihbar alındı. Hastanelere başvurular artıyor.",
    category: "sosyal",
    minTurn: 12,
    choices: [
      {
        label: "A",
        text: "Tüm ülkeye su kesintisi uygula ve acil su dağıtım ağı kur.",
        effects: { budget: -4000, stability: -5, happiness: -10 },
        hint: "Çok pahalı bir lojistik operasyon ancak sağlık korunacak."
      },
      {
        label: "B",
        text: "Sadece riskli bölgeleri kapat, medyaya sansür uygula.",
        effects: { health: -15, stability: -10, popularity: -10 },
        hint: "Sansür paniği azaltır ama hastalık kartopu gibi yayılır.",
        triggerSnowball: { id: "sb_hidden_plague", name: "Gizlenen Zehirlenme", themeColor: "red", description: "Gizlenen zehirlenme vakaları hastaneleri kilitliyor!", turnsRemaining: 3, statModifiers: { health: -10 } }
      },
      {
        label: "C",
        text: "İddiaları yalanla ve 'Su temiz' propagandası yap.",
        effects: { health: -30, happiness: -20, stability: -25, popularity: -20 },
        hint: "Gerçek ortaya çıktığında tam bir hezimet yaşanacak.",
        triggerSnowball: { id: "sb_water_scandal", name: "Su Skandalı Öfkesi", themeColor: "red", description: "Halkın size olan güveni su skandalı yüzünden erimeye devam ediyor.", turnsRemaining: 4, statModifiers: { popularity: -10 } }
      }
    ]
  },
  {
    id: "chaos_border_breach",
    title: "Sınır İhlali ve Mülteci Akını",
    description: "Komşu ülkedeki savaş nedeniyle milyonlarca insan sınır kapılarına dayandı. Kapılar kırılmak üzere.",
    category: "kriz",
    minTurn: 15,
    choices: [
      {
        label: "A",
        text: "Kapıları tamamen aç ve mültecileri şehirlere dağıt.",
        effects: { stability: -15, happiness: -15, budget: -2000, foreignRelations: 10 },
        factionEffects: { nationalists: -25 },
        hint: "Uluslararası övgü alırsınız ancak ekonomi ve iç istikrar sarsılır.",
        triggerSnowball: { id: "sb_integration_crisis", name: "Entegrasyon Krizi", themeColor: "red", description: "Ani mülteci akını şehirlerde entegrasyon krizine yol açıyor.", turnsRemaining: 3, statModifiers: { stability: -5 } }
      },
      {
        label: "B",
        text: "Sınırda tampon bölge kur ve uluslararası yardım bekle.",
        effects: { budget: -1000, military: -5, foreignRelations: 5 },
        hint: "Dengeli ancak masraflı bir seçenek."
      },
      {
        label: "C",
        text: "Orduya 'Vur' emri ver, kimseyi içeri alma.",
        effects: { stability: 5, foreignRelations: -30, military: -5, popularity: -10 },
        factionEffects: { nationalists: 20 },
        hint: "Sınır korunur ama uluslararası alanda dışlanırsınız. Kartopu: İzolasyon.",
        triggerSnowball: { id: "sb_intl_isolation", name: "Küresel İzolasyon", themeColor: "red", description: "İnsan hakları ihlali sebebiyle uluslararası izolasyon sürüyor.", turnsRemaining: 4, statModifiers: { foreignRelations: -5 } }
      }
    ]
  },
  {
    id: "chaos_general_strike",
    title: "Genel Grev ve Hayatı Durdurma",
    description: "Sendikalar birleşti! Ulaşım, sağlık, eğitim dahil hiçbir sektör çalışmıyor. Ülke tamamen felç oldu.",
    category: "sosyal",
    minTurn: 20,
    choices: [
      {
        label: "A",
        text: "Tüm maaşlara devasa zam yap ve talepleri kabul et.",
        effects: { budget: -5000, happiness: 20, stability: 10, inflation: 8 },
        factionEffects: { workers: 30, capitalists: -20 },
        hint: "Kriz biter ama bu kadar para basmak enflasyonu uçuracak.",
        triggerSnowball: { id: "sb_strike_inflation", name: "Grev Enflasyonu", themeColor: "yellow", description: "Genel grev zamları piyasada enflasyon sarmalı yarattı.", turnsRemaining: 4, statModifiers: { inflation: 3 } }
      },
      {
        label: "B",
        text: "Liderleri tutukla ve işçi haklarını askıya al.",
        effects: { stability: -25, popularity: -20, happiness: -25, budget: 1000 },
        factionEffects: { workers: -40, capitalists: 20 },
        hint: "Diktatörlük eylemi. Kısa vadede işler çözülse de halk ayaklanacak.",
        triggerSnowball: { id: "sb_underground_resistance", name: "Yeraltı Direnişi", themeColor: "red", description: "Grevcilerin tutuklanması yeraltı direnişine dönüştü!", turnsRemaining: 3, statModifiers: { stability: -10 } }
      },
      {
        label: "C",
        text: "Masaya otur, ancak sadece sembolik tavizler ver.",
        effects: { budget: -1000, stability: -10, happiness: -5 },
        hint: "Grev kısmen kırılır ama huzursuzluk devam eder.",
        triggerSnowball: { id: "sb_partial_strikes", name: "Kısmi Grevler", themeColor: "yellow", description: "Kısmi grevler yüzünden üretim aksamaya devam ediyor.", turnsRemaining: 2, statModifiers: { budget: -500 } }
      }
    ]
  },
  {
    id: "chaos_ai_rebellion",
    title: "Yapay Zeka Karar Sistemlerinin Çöküşü",
    description: "Devletin vergi ve altyapı yönetimi için kullandığı yapay zeka algoritması hacklendi. Vergiler sıfırlandı, trafik ışıkları aynı anda yeşil yanıyor!",
    category: "ekonomi",
    minTurn: 25,
    choices: [
      {
        label: "A",
        text: "Fişi çek. Tüm sistemleri eski usül kağıt-kaleme döndür.",
        effects: { budget: -2000, stability: -10, education: -5 },
        hint: "Büyük bir teknolojik geri adım. Bürokraside kaos sürecek.",
        triggerSnowball: { id: "sb_analog_chaos", name: "Bürokratik Kaos", themeColor: "yellow", description: "Analog sisteme dönüş sebebiyle bürokratik masraflar artıyor.", turnsRemaining: 3, statModifiers: { budget: -500 } }
      },
      {
        label: "B",
        text: "Yabancı siber güvenlik uzmanlarına devasa bütçe ödeyip düzelttir.",
        effects: { budget: -4000, stability: 5 },
        hint: "Hızlı çözüm ama hazineye çok ağır bir darbe."
      },
      {
        label: "C",
        text: "Sadece trafik gibi kritik sistemleri kurtar, diğerleri düzelsin diye bekle.",
        effects: { stability: -20, budget: -500, popularity: -15 },
        hint: "Vergi toplanamayacak, sistem felç. Ekonomi kan ağlayacak.",
        triggerSnowball: { id: "sb_tax_system_down", name: "Vergi Felci", themeColor: "red", description: "Vergi sistemi düzeltilemediği için gelir kaybı sürüyor!", turnsRemaining: 3, statModifiers: { budget: -1000 } }
      }
    ]
  },
  {
    id: "chaos_cult_uprising",
    title: "Kıyamet Tarikatı Silahlandı",
    description: "Kendilerini kurtarıcı sanan devasa bir tarikat, güneydeki bir şehri ele geçirdi ve orduya meydan okuyor.",
    category: "askeri",
    minTurn: 18,
    choices: [
      {
        label: "A",
        text: "Orduyu tam teçhizatlı olarak bölgeye sür ve şehri bombala.",
        effects: { military: -15, stability: -20, budget: -1500, popularity: -10 },
        hint: "Tarikat yok edilir ama sivil kayıplar nedeniyle halk sizi suçlayacak.",
        triggerSnowball: { id: "sb_civilian_trauma", name: "Sivil Travması", themeColor: "red", description: "Bombardımanın yarattığı travma halkta infiale yol açıyor.", turnsRemaining: 3, statModifiers: { stability: -5 } }
      },
      {
        label: "B",
        text: "Özel operasyon timleriyle sadece liderlerini suikastle yok et.",
        effects: { budget: -1000, military: -5, stability: 5 },
        hint: "Akıllıca ama riskli bir çözüm. Başarılı olursa en az zararla atlatılır."
      },
      {
        label: "C",
        text: "Müzakere et ve onlara otonomi (özerklik) sözü ver.",
        effects: { stability: -30, popularity: -25 },
        factionEffects: { nationalists: -40 },
        hint: "Ülke bölünüyor! Bu taviz devletin otoritesini sıfırlayacak.",
        triggerSnowball: { id: "sb_domino_autonomy", name: "Özerklik Dominosu", themeColor: "red", description: "Otonomi tavizi sonrası diğer isyancı gruplar da silahlanmaya başladı!", turnsRemaining: 5, statModifiers: { stability: -10 } }
      }
    ]
  },
  {
    id: "chaos_pandemic_outbreak",
    title: "Tanımlanamayan Salgın Hastalık",
    description: "Sınır kasabasında ölümcül ve çok hızlı yayılan yeni bir virüs tespit edildi. Birkaç gün içinde başkente sıçrayabilir.",
    category: "sosyal",
    minTurn: 10,
    choices: [
      {
        label: "A",
        text: "Ülke genelinde Tam Kapanma (Sokağa Çıkma Yasağı) ilan et.",
        effects: { budget: -3000, stability: -10, health: 15, happiness: -15 },
        hint: "Ekonomi çöker ama hayatlar kurtulur.",
        triggerSnowball: { id: "sb_lockdown_recession", name: "Kapanma Durgunluğu", themeColor: "yellow", description: "Kapanma nedeniyle işletmeler kepenk indiriyor, gelirler düştü.", turnsRemaining: 2, statModifiers: { budget: -800 } }
      },
      {
        label: "B",
        text: "Sadece kasabayı karantinaya al (Giriş çıkışları duvarla kapat).",
        effects: { health: -10, stability: -15, popularity: -10 },
        hint: "Halk bu acımasız önlemi kınayacak ama virüs yavaşlayabilir."
      },
      {
        label: "C",
        text: "Önemseme, 'Halkımız güçlüdür' de ve ekonomiyi açık tut.",
        effects: { health: -40, stability: -30, popularity: -30, budget: 1000 },
        hint: "Büyük bir katliam! Hastaneler çökecek.",
        triggerSnowball: { id: "sb_death_toll", name: "Ölümler Kontrolden Çıktı", themeColor: "red", description: "Salgın kontrolden çıktı, ölüm oranları hızla artıyor!", turnsRemaining: 4, statModifiers: { health: -15 } }
      }
    ]
  },
  {
    id: "chaos_oligarch_blackmail",
    title: "Oligarkların Şantajı",
    description: "Ülke ekonomisinin %40'ını elinde tutan 3 zengin iş insanı, vergileri sıfırlamazsanız tüm fabrikaları kapatmakla tehdit ediyor.",
    category: "ekonomi",
    minTurn: 22,
    choices: [
      {
        label: "A",
        text: "Şantaja boyun eğ ve vergileri sıfırla.",
        effects: { budget: -4000, happiness: -15, stability: -10 },
        factionEffects: { capitalists: 30, workers: -25 },
        hint: "Kısa vadede kriz çözülür ama hazine büyük bir gelirden mahrum kalır.",
        triggerSnowball: { id: "sb_tax_haven", name: "Vergi Cenneti", themeColor: "yellow", description: "Sıfırlanan vergiler yüzünden devlet gelirleri eriyor.", turnsRemaining: 3, statModifiers: { budget: -1000 } }
      },
      {
        label: "B",
        text: "Hepsinin şirketlerine devlet olarak el koy (Kamulaştırma).",
        effects: { budget: 2000, stability: -25, foreignRelations: -20 },
        factionEffects: { capitalists: -50, workers: 20 },
        hint: "Yatırımcılar ülkeden kaçacak ama büyük bir ganimet elde edersin.",
        triggerSnowball: { id: "sb_capital_flight", name: "Sermaye Kaçışı", themeColor: "red", description: "Sermaye kaçışı ve yabancı ambargoları ekonomiyi sarsıyor.", turnsRemaining: 3, statModifiers: { stability: -8 } }
      },
      {
        label: "C",
        text: "Liderlerini gizlice tutuklatıp diğerlerini sindir.",
        effects: { stability: -5, popularity: -5, budget: -500 },
        hint: "Hukuk dışı ancak oldukça etkili bir yöntem."
      }
    ]
  },
  {
    id: "chaos_food_shortage",
    title: "Küresel Kıtlık ve Gıda Krizi",
    description: "Dünya genelinde tarım çöküyor. Market rafları boşaldı, karaborsa patladı ve halk açlıktan marketleri yağmalıyor.",
    category: "cevre",
    minTurn: 16,
    choices: [
      {
        label: "A",
        text: "Stratejik rezervleri aç ve halka ücretsiz erzak dağıt.",
        effects: { budget: -3000, stability: 15, happiness: 10 },
        hint: "Devlet kasası sarsılacak ama halk rahat bir nefes alacak."
      },
      {
        label: "B",
        text: "Karaborsacılara acımasız cezalar kes, orduyu marketlere dik.",
        effects: { stability: -10, military: -5, popularity: -5 },
        hint: "Paniği durdurur ama gıda sorununu tamamen çözmez.",
        triggerSnowball: { id: "sb_malnutrition", name: "Yetersiz Beslenme", themeColor: "yellow", description: "Gıda yetersizliği halk sağlığını etkilemeye devam ediyor.", turnsRemaining: 2, statModifiers: { health: -5 } }
      },
      {
        label: "C",
        text: "Zengin ülkelere varlık satışı yapıp acil gıda ithal et.",
        effects: { budget: 2000, foreignRelations: 10, stability: -20 },
        factionEffects: { nationalists: -30 },
        hint: "Gıda gelir ama ülkenin bağımsızlığı zedelenir.",
        triggerSnowball: { id: "sb_nationalist_riots", name: "Milliyetçi İsyanlar", themeColor: "red", description: "Yabancılara satılan topraklar yüzünden milliyetçi ayaklanmalar sürüyor.", turnsRemaining: 3, statModifiers: { stability: -5 } }
      }
    ]
  },
  {
    id: "chaos_military_coup_attempt",
    title: "Ordu İçinde Cunta: Darbe Girişimi!",
    description: "Askeriyenin içindeki bir grup general, yönetime el koymak için başkente tanklarla girdi. Parlamento kuşatma altında!",
    category: "askeri",
    minTurn: 30,
    choices: [
      {
        label: "A",
        text: "Halkı sokağa, tankların önüne çağır!",
        effects: { stability: -30, popularity: 15, military: -20, happiness: -15 },
        hint: "Cunta engellenir ama ülkede kan gövdeyi götürür. Ordu ikiye bölünür.",
        triggerSnowball: { id: "sb_post_coup_purges", name: "Darbe Sonrası Tasfiyeler", themeColor: "red", description: "Darbe sonrası iç karışıklıklar ve tasfiyeler devleti felç ediyor.", turnsRemaining: 3, statModifiers: { stability: -10 } }
      },
      {
        label: "B",
        text: "Sadık generalleri kullanarak cuntayı havadan vur.",
        effects: { budget: -2000, military: -30, stability: -15 },
        hint: "Ordu kendi kendini yok edecek. Büyük güç kaybı."
      },
      {
        label: "C",
        text: "Cunta ile pazarlık yap, taleplerini kabul edip geri çekilmelerini sağla.",
        effects: { popularity: -30, stability: -10, military: 10 },
        factionEffects: { nationalists: -20 },
        hint: "Koltukta kalırsın ama artık ordunun kuklası olursun.",
        triggerSnowball: { id: "sb_power_vacuum", name: "Otorite Boşluğu", themeColor: "red", description: "Halkın size saygısı kalmadı, otorite boşluğu her gün büyüyor.", turnsRemaining: 4, statModifiers: { popularity: -8 } }
      }
    ]
  },
  {
    id: "chaos_mega_earthquake",
    title: "Büyük Metropol Depremi",
    description: "Ülkenin en büyük ve en üretken şehrinde 8.2 şiddetinde deprem oldu. Altyapı yok oldu, binlerce insan enkaz altında.",
    category: "kriz",
    minTurn: 14,
    choices: [
      {
        label: "A",
        text: "Seferberlik ilan et! Bütün bütçeyi ve orduyu kurtarma çalışmalarına aktar.",
        effects: { budget: -5000, military: -10, happiness: 10, stability: 5 },
        hint: "Çok pahalı ama halk dayanışması zirveye çıkacak."
      },
      {
        label: "B",
        text: "Sadece uluslararası yardım kuruluşlarına devret.",
        effects: { foreignRelations: 10, stability: -15, popularity: -20 },
        hint: "Ucuza atlatırsın ama halk 'devlet nerede' diye isyan eder.",
        triggerSnowball: { id: "sb_housing_crisis", name: "Barınma Krizi İsyanı", themeColor: "red", description: "Deprem sonrası barınma krizi isyanlara dönüşüyor.", turnsRemaining: 3, statModifiers: { stability: -8 } }
      },
      {
        label: "C",
        text: "Medyayı sustur, ölü sayılarını gizle ve 'Her şey kontrol altında' de.",
        effects: { stability: -30, happiness: -30, popularity: -40, health: -20 },
        hint: "Gerçekler saklanamaz! Büyük bir siyasi ve insani enkaz altında kalacaksınız.",
        triggerSnowball: { id: "sb_uncovered_tragedy", name: "Gizlenen Felaket Öfkesi", themeColor: "red", description: "Gizlenen felaketin boyutu ortaya çıktıkça öfke patlamaları artıyor.", turnsRemaining: 3, statModifiers: { popularity: -15 } }
      }
    ]
  },
  {
    id: "chaos_deepfake_scandal",
    title: "Başkanın Derin Sahte (Deepfake) Skandalı",
    description: "Size ait olduğu iddia edilen, komşu ülkeye savaş ilan ettiğinizi veya ağır yolsuzluk yaptığınızı gösteren çok gerçekçi bir video yayıldı.",
    category: "ic_politika",
    minTurn: 11,
    choices: [
      {
        label: "A",
        text: "Tüm interneti ve sosyal medyayı tamamen erişime kapat.",
        effects: { stability: -20, popularity: -15, budget: -500 },
        factionEffects: { intellectuals: -30 },
        hint: "Halk nefes alamaz hale gelecek. Diktatör damgası yiyeceksin.",
        triggerSnowball: { id: "sb_internet_ban", name: "İnternet Yasağı Hasarı", themeColor: "red", description: "İnternet yasağı ticareti ve iletişimi felç etmeye devam ediyor.", turnsRemaining: 2, statModifiers: { stability: -5 } }
      },
      {
        label: "B",
        text: "Siber operasyon başlat, videoyu yapanları bul ve canlı yayında ifşa et.",
        effects: { budget: -1500, popularity: 10, education: 5 },
        hint: "Pahalı bir siber harekat ama karizmanızı toparlar."
      },
      {
        label: "C",
        text: "Hiçbir şey yapma, 'Halkım bana inanır' de geç.",
        effects: { popularity: -25, stability: -10, foreignRelations: -15 },
        hint: "Diplomatik kriz! Dış ülkeler videoyu gerçek sanıp ilişkileri kesebilir.",
        triggerSnowball: { id: "sb_diplomatic_fallout", name: "Diplomatik Yalnızlık", themeColor: "yellow", description: "Skandal video yüzünden dış politikada itibar kaybı sürüyor.", turnsRemaining: 3, statModifiers: { foreignRelations: -5 } }
      }
    ]
  },
  {
    id: "chaos_nuclear_reactor_leak",
    title: "Nükleer Sızıntı Alarmi",
    description: "Eski bir nükleer santralimizde soğutma sistemi arızalandı. Radyasyon sızıntısı başladı ve rüzgar yerleşim yerlerine esiyor.",
    category: "cevre",
    minTurn: 26,
    choices: [
      {
        label: "A",
        text: "Tüm bölgeyi acil tahliye et ve reaktörü betonla göm (Çernobil Modeli).",
        effects: { budget: -4000, stability: -10, environment: -10 },
        hint: "Devletin kasası boşalacak ama daha büyük bir felaket önlenecek.",
        triggerSnowball: { id: "sb_radiation_cleanup", name: "Radyasyon Temizliği", themeColor: "yellow", description: "Radyoaktif bölgenin temizlik çalışmaları hazineyi sömürüyor.", turnsRemaining: 3, statModifiers: { budget: -500 } }
      },
      {
        label: "B",
        text: "Olayı gizle, çalışanlara yüksek maaş verip içerde onarım yapmaya zorla.",
        effects: { environment: -30, health: -20, popularity: -15, budget: -500 },
        hint: "Santral kurtulur ama çevre katliamı yaşanır.",
        triggerSnowball: { id: "sb_radiation_cancer", name: "Radyasyon Kanseri", themeColor: "red", description: "Gizlenen sızıntı sebebiyle bölgede kanser vakaları patlama yapıyor!", turnsRemaining: 4, statModifiers: { health: -10 } }
      },
      {
        label: "C",
        text: "Uluslararası Atom Enerjisi Kurumu'ndan yardım iste.",
        effects: { foreignRelations: 10, budget: -1000, popularity: -5 },
        hint: "Dünyaya rezil oluruz ama uzmanlar sorunu çözer."
      }
    ]
  },
  {
    id: "chaos_crypto_crash",
    title: "Milli Kripto Para Çöktü",
    description: "Devletin teşvik ettiği yerli kripto para borsası hacklendi ve milyarlarca dolar buharlaştı. Halka ait birikimler yok oldu.",
    category: "ekonomi",
    minTurn: 13,
    choices: [
      {
        label: "A",
        text: "Tüm zararı devlet kasasından karşıla (Bailout).",
        effects: { budget: -5000, happiness: 10, stability: 5 },
        hint: "Halk sakinleşir ama hazine büyük bir çöküş yaşar."
      },
      {
        label: "B",
        text: "Borsa sahiplerini tutukla ama zararı karşılama.",
        effects: { stability: -15, popularity: -10, happiness: -15 },
        hint: "Adalet sağlanır ama parasını kaybedenler isyan edecek.",
        triggerSnowball: { id: "sb_crypto_protests", name: "Kripto Eylemleri", themeColor: "yellow", description: "Kripto mağdurları her gün meclis önünde eylem yapıyor.", turnsRemaining: 3, statModifiers: { stability: -5 } }
      },
      {
        label: "C",
        text: "Olayı 'Dış güçlerin operasyonu' ilan et ve sansürle.",
        effects: { popularity: -25, stability: -20, foreignRelations: -10 },
        hint: "Kimse inanmayacak. Gerçekler kartopu gibi büyüyecek.",
        triggerSnowball: { id: "sb_coverup_anger", name: "Sansür Öfkesi", themeColor: "red", description: "Skandalın üstünün örtülmesi siyasete olan güveni sıfırladı.", turnsRemaining: 3, statModifiers: { popularity: -10 } }
      }
    ]
  },
  {
    id: "chaos_water_wars",
    title: "Sınır Ötesi Su Krizi (Su Savaşları)",
    description: "Komşu ülke ile paylaştığımız büyük nehrin suyunu, komşumuz yeni yaptığı dev barajla kesti. Tarım arazilerimiz kuruyor.",
    category: "dis_politika",
    minTurn: 19,
    choices: [
      {
        label: "A",
        text: "Baraja hava harekatı düzenle ve havaya uçur!",
        effects: { military: -15, foreignRelations: -40, popularity: 20, environment: -10 },
        hint: "Savaş sebebi! Popülarite uçar ama dış dünyada terörist ilan edilirsiniz.",
        triggerSnowball: { id: "sb_border_skirmishes", name: "Sınır Çatışmaları", themeColor: "red", description: "Sınır ötesi operasyon sonrası komşunun misillemeleri ülkeyi yıpratıyor.", turnsRemaining: 3, statModifiers: { stability: -10 } }
      },
      {
        label: "B",
        text: "Pahalı deniz suyu arıtma tesisleri kur.",
        effects: { budget: -4000, environment: 5, health: 5 },
        hint: "Barışçıl ama çok pahalı bir çözüm."
      },
      {
        label: "C",
        text: "Tarımdan vazgeç, arazileri ithalat için sanayiye çevir.",
        effects: { environment: -20, stability: -15, budget: 1000 },
        factionEffects: { nationalists: -20, capitalists: 15 },
        hint: "Çiftçiler isyan eder, doğa biter ama sanayi geliri artar.",
        triggerSnowball: { id: "sb_urban_migration", name: "Köylü Göçü", themeColor: "yellow", description: "Köylülerin topraksız kalması şehirlere devasa bir göç dalgası yarattı.", turnsRemaining: 4, statModifiers: { stability: -5 } }
      }
    ]
  },
  {
    id: "chaos_prison_break",
    title: "Ülke Genelinde Cezaevi İsyanları",
    description: "Yetersiz koşullar nedeniyle ülkedeki tüm büyük cezaevlerinde eşzamanlı isyan çıktı. Mahkumlar gardiyanları rehin aldı.",
    category: "ic_politika",
    minTurn: 9,
    choices: [
      {
        label: "A",
        text: "Özel harekatı içeri yolla, güç kullanarak bastır.",
        effects: { military: -5, stability: -10, popularity: -5, budget: -500 },
        hint: "Kanlı bir çözüm. Rehine ölümleri hükümeti yıpratacak.",
        triggerSnowball: { id: "sb_prison_brutality", name: "Operasyon Tepkisi", themeColor: "red", description: "Hapishane operasyonundaki sivil kayıplar protesto ediliyor.", turnsRemaining: 2, statModifiers: { popularity: -5 } }
      },
      {
        label: "B",
        text: "Af ilan et! Hafif suçluları serbest bırakıp cezaevlerini boşalt.",
        effects: { stability: -20, popularity: -10, happiness: -15 },
        hint: "Suç oranı fırlayacak, halk kendini güvende hissetmeyecek.",
        triggerSnowball: { id: "sb_crime_wave", name: "Suç Dalgası", themeColor: "red", description: "Serbest kalan suçlular sokaklarda yeni çeteler kuruyor.", turnsRemaining: 3, statModifiers: { stability: -8 } }
      },
      {
        label: "C",
        text: "Şartları iyileştirme sözü ver ve cezaevlerine büyük bütçe ayır.",
        effects: { budget: -2000, stability: 5, popularity: 5 },
        hint: "Pahalı ama en insani ve güvenli çözüm."
      }
    ]
  },
  {
    id: "chaos_hyperinflation_spiral",
    title: "Hiperenflasyon Sarmalı",
    description: "Fiyatlar saat başı değişiyor! Para birimimiz pul oldu, halk alışveriş yapmak için el arabasıyla para taşıyor.",
    category: "ekonomi",
    minTurn: 17,
    choices: [
      {
        label: "A",
        text: "Yeni bir para birimine geç ve paradan 6 sıfır at.",
        effects: { budget: -1500, stability: 10, inflation: -5 },
        hint: "Geçici rahatlama. Ekonomik güven inşa etmeye başlamak için iyi bir adım."
      },
      {
        label: "B",
        text: "Faizleri %100'e çıkarıp tüm kredileri durdur (Acı Reçete).",
        effects: { stability: -25, happiness: -20, inflation: -10, budget: 1000 },
        factionEffects: { capitalists: -30, workers: -20 },
        hint: "Enflasyon bıçak gibi kesilir ama işsizlik ve iflaslar ülkeyi yangın yerine çevirir.",
        triggerSnowball: { id: "sb_credit_freeze", name: "Kredi Donması", themeColor: "red", description: "Kredilerin durması iflasları ve işsizliği artırmaya devam ediyor.", turnsRemaining: 3, statModifiers: { stability: -8 } }
      },
      {
        label: "C",
        text: "Para basmaya devam et, asgari ücrete her ay %50 zam yap.",
        effects: { inflation: 15, stability: -20, happiness: 5 },
        hint: "Tam bir delilik! Ülke tamamen iflasa sürüklenecek.",
        triggerSnowball: { id: "sb_hyperinflation", name: "Kontrolsüz Enflasyon", themeColor: "red", description: "Hiperenflasyon kontrolden çıktı, fiyatlar artık takip edilemiyor!", turnsRemaining: 4, statModifiers: { inflation: 5 } }
      }
    ]
  },
  {
    id: "chaos_sectarian_violence",
    title: "Etnik / Mezhepsel Çatışmalar Patlak Verdi",
    description: "Ülkedeki iki farklı etnik grup arasında küçük bir kavga, tüm ülkeye yayılan silahlı bir iç çatışmaya dönüştü.",
    category: "sosyal",
    minTurn: 21,
    choices: [
      {
        label: "A",
        text: "Sıkıyönetim ilan et ve orduyla sokağa çıkma yasağı koy.",
        effects: { military: -15, stability: 5, popularity: -15, budget: -1000 },
        hint: "Baskıcı ama düzeni sağlar. Askeriye yorulacak."
      },
      {
        label: "B",
        text: "Grupların liderlerini saraya çağırıp tarihi bir barış anlaşması imzala.",
        effects: { stability: 15, popularity: 20, politicalCapital: -50, budget: -500 },
        hint: "Siyasi zekanızı kullanın. Pahalı ama kalıcı bir barış sağlar."
      },
      {
        label: "C",
        text: "Bir tarafı seç ve diğerini tamamen ez.",
        effects: { stability: -30, foreignRelations: -30, military: -10 },
        hint: "İç savaş! Uluslararası müdahale gelebilir ve kan davası nesiller sürer.",
        triggerSnowball: { id: "sb_guerilla_war", name: "Gerilla Savaşı", themeColor: "red", description: "Baskı gören grup gerilla savaşına başladı, ülke kan kaybediyor!", turnsRemaining: 4, statModifiers: { stability: -15 } }
      }
    ]
  },
  {
    id: "chaos_alien_signal",
    title: "Tanımlanamayan Sinyal (Uzaylı İletişimi?)",
    description: "Ulusal Uzay Ajansı, uzaydan gelen, zekice tasarlanmış ve şifreli bir sinyal yakaladı. Sinyali sadece biz biliyoruz.",
    category: "ekonomi",
    minTurn: 28,
    choices: [
      {
        label: "A",
        text: "Dünyaya duyur ve uluslararası bir konsorsiyum kur.",
        effects: { foreignRelations: 25, popularity: 10, budget: -500 },
        hint: "Büyük prestij kazanırsınız ama sırrı paylaşmış olursunuz."
      },
      {
        label: "B",
        text: "Gizli tut, tüm bütçeyi sinyali tek başımıza deşifre etmeye harca.",
        effects: { budget: -3000, education: 10, stability: -5 },
        hint: "Bilimsel bir sıçrama yaşanabilir ancak bu kumar hazineyi kurutur.",
        triggerSnowball: { id: "sb_alien_tech", name: "Uzaylı Teknolojisi", themeColor: "purple", description: "Uzaylı teknolojisinden öğrenilenler bilimsel bir devrim yaratıyor!", turnsRemaining: 3, statModifiers: { education: 2 } }
      },
      {
        label: "C",
        text: "Bu bir tehdit olabilir! Sinyali engelle ve savunma bütçesini artır.",
        effects: { military: 15, budget: -2000, popularity: -5 },
        hint: "Paranoyak bir yaklaşım ama askeriyeyi güçlendirir."
      }
    ]
  }
];

/**
 * Kullanılmamış olaylardan ve şartları sağlanan olaylardan rastgele birini seçer.
 * Tüm olaylar kullanılmışsa havuzu sıfırlar.
 */
export function getRandomEvent(usedEventIds: string[], eventFlags: string[] = [], state?: any): GameEvent {
  const availableEvents = EVENTS.filter((e) => {
    // 1. Olay zaten oynandı mı?
    if (usedEventIds.includes(e.id)) return false;

    // 2. Olayın gerektirdiği bayraklar var mı?
    if (e.requiredFlags && e.requiredFlags.length > 0) {
      const hasAllRequired = e.requiredFlags.every(flag => eventFlags.includes(flag));
      if (!hasAllRequired) return false;
    }

    // 3. Olayın yasakladığı bayraklar var mı?
    if (e.forbiddenFlags && e.forbiddenFlags.length > 0) {
      const hasAnyForbidden = e.forbiddenFlags.some(flag => eventFlags.includes(flag));
      if (hasAnyForbidden) return false;
    }

    // 4. Özel şart (Condition) kontrolü
    if (e.condition && state) {
      if (!e.condition(state)) return false;
    }

    // 5. Zorluk Eğrisi (Progressive Difficulty)
    if (state) {
      let requiredTurn = e.minTurn || 0;
      if (e.category === "kriz") requiredTurn = Math.max(requiredTurn, 12);
      if (e.id === "global_embargo" || e.id === "kriz_1" || e.id.includes("ambargo")) {
        requiredTurn = Math.max(requiredTurn, 20);
      }
      if (state.turn < requiredTurn) return false;
    }

    return true;
  });

  if (availableEvents.length === 0) {
    // Şartları sağlayan olay kalmadı, acil durum için her zaman çıkabilecek olaylardan birini seç
    // Tekrarlamayı önlemek için en azından son 3 olayı filtrele
    const recentEvents = usedEventIds.slice(-3);
    let fallbackEvents = EVENTS.filter(e => (!e.requiredFlags || e.requiredFlags.length === 0) && !recentEvents.includes(e.id));

    // Eğer tüm fallback'ler de tükenmişse mecburen genel fallback yap
    if (fallbackEvents.length === 0) {
      fallbackEvents = EVENTS.filter(e => !e.requiredFlags || e.requiredFlags.length === 0);
    }

    const randomIndex = Math.floor(Math.random() * fallbackEvents.length);
    return fallbackEvents[randomIndex];
  }

  const randomIndex = Math.floor(Math.random() * availableEvents.length);
  return availableEvents[randomIndex];
}

/**
 * Birden fazla rastgele olay çeken yeni fonksiyon (Çoklu etkinlik sistemi için)
 */
export function getRandomEvents(count: number, usedEventIds: string[] = [], eventFlags: string[] = [], state?: GameState): GameEvent[] {
  const availableEvents = EVENTS.filter((e) => {
    // 1. Daha önce kullanılmış mı?
    if (usedEventIds.includes(e.id)) return false;

    // 2. Olayın gerektirdiği bayraklar (flags) var mı?
    if (e.requiredFlags && e.requiredFlags.length > 0) {
      const hasAllRequired = e.requiredFlags.every(flag => eventFlags.includes(flag));
      if (!hasAllRequired) return false;
    }

    // 3. Olayın yasakladığı bayraklar var mı?
    if (e.forbiddenFlags && e.forbiddenFlags.length > 0) {
      const hasAnyForbidden = e.forbiddenFlags.some(flag => eventFlags.includes(flag));
      if (hasAnyForbidden) return false;
    }

    // 4. Özel şart (Condition) kontrolü
    if (e.condition && state) {
      if (!e.condition(state)) return false;
    }

    // 5. Zorluk Eğrisi (Progressive Difficulty)
    if (state) {
      let requiredTurn = e.minTurn || 0;

      // Krizler asla ilk 15 turda çıkmasın (Oyun başında afet olmasın)
      if (e.category === "kriz") requiredTurn = Math.max(requiredTurn, 16);

      // Küresel ambargolar veya devasa cezalı/savaşlı olaylar en az 25. tur
      if (e.id === "global_embargo" || e.id === "kriz_1" || e.id.includes("ambargo")) {
        requiredTurn = Math.max(requiredTurn, 25);
      }

      // Pozitif olayların bazıları da erken çıkabilir, ama çok büyük olanları biraz geciktirebiliriz.
      // (Şimdilik ağırlığı negatif/zor olayları ileriye atmak için kullandık)

      if (state.turn < requiredTurn) return false;
    }

    return true;
  });

  const selectedEvents: GameEvent[] = [];
  let pool = [...availableEvents];

  // Ülke zorluğuna göre ağırlıklandırma (Difficulty-Weighted Random Selection)
  let difficulty = "Dengeli";
  if (state && state.countryName) {
    const template = COUNTRIES.find(c => c.name === state.countryName);
    if (template) difficulty = template.difficulty;
  }

  for (let i = 0; i < count; i++) {
    if (pool.length === 0) {
      const recentEvents = usedEventIds.slice(-5);
      let fallbackPool = EVENTS.filter(e =>
        (!e.requiredFlags || e.requiredFlags.length === 0) &&
        !e.id.includes("chain") &&
        e.category !== "kriz" &&
        !recentEvents.includes(e.id) &&
        !selectedEvents.find(se => se.id === e.id)
      );

      if (fallbackPool.length === 0) {
        fallbackPool = EVENTS.filter(e =>
          (!e.requiredFlags || e.requiredFlags.length === 0) &&
          !e.id.includes("chain") &&
          !selectedEvents.find(se => se.id === e.id)
        );
      }

      if (fallbackPool.length > 0) {
        const randomIndex = Math.floor(Math.random() * fallbackPool.length);
        selectedEvents.push(fallbackPool[randomIndex]);
        pool = pool.filter(e => e.id !== fallbackPool[randomIndex].id);
      }
    } else {
      // Çeşitlilik: Aynı kategoriden çok fazla olay üst üste gelmesin
      const selectedCategories = selectedEvents.map(e => e.category);
      let filteredPool = pool;

      for (const cat of selectedCategories) {
        const tempPool = filteredPool.filter(e => e.category !== cat);
        if (tempPool.length > 0) {
          filteredPool = tempPool;
        }
      }

      // Ağırlıklı rastgele seçim (Weighted Random Selection based on Difficulty)
      const weights = filteredPool.map(e => {
        let weight = 1.0;
        if (difficulty === "Kolay") {
          if (e.category === "ekonomi" || e.category === "sosyal" || e.category === "cevre") weight *= 2.5;
          if (e.category === "kriz" || e.category === "askeri") weight *= 0.4;
        } else if (difficulty === "Zor" || difficulty === "Çok Zor") {
          if (e.category === "kriz" || e.category === "askeri" || e.category === "ic_politika") weight *= 2.5;
          if (e.category === "sosyal" || e.category === "cevre") weight *= 0.6;
        }

        // Kartopu etkilerinin karşımıza çıkma şansını DEHŞET derecede artır (50 kat!)
        if (e.isSnowball) {
          weight *= 50.0;
        }

        return weight;
      });

      const totalWeight = weights.reduce((a, b) => a + b, 0);
      let randomVal = Math.random() * totalWeight;
      let chosenIndex = 0;

      for (let j = 0; j < filteredPool.length; j++) {
        randomVal -= weights[j];
        if (randomVal <= 0) {
          chosenIndex = j;
          break;
        }
      }

      const chosenEvent = filteredPool[chosenIndex] || filteredPool[0];
      selectedEvents.push(chosenEvent);
      pool = pool.filter(e => e.id !== chosenEvent.id);
    }
  }

  return selectedEvents;
}

/**
 * ID ile olay bul
 */
export function getEventById(id: string): GameEvent | undefined {
  return EVENTS.find((e) => e.id === id);
}
