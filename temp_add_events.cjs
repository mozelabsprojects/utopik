const fs = require('fs');

const newEvents = [
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

const fileContent = fs.readFileSync('src/lib/events-data.ts', 'utf8');
const splitPoint = fileContent.lastIndexOf('];');

if (splitPoint !== -1) {
  const before = fileContent.substring(0, splitPoint);
  const after = fileContent.substring(splitPoint + 2);
  const cleanedBefore = before.trim().endsWith(',') ? before.trim() : before.trim() + ',';
  
  // Format the objects nicely without JSON.stringify adding quotes to keys
  const util = require('util');
  const eventsStr = util.inspect(newEvents, { showHidden: false, depth: null, maxArrayLength: null }).replace(/^\[/m, '').replace(/\]$/m, '');
  
  const newFileContent = cleanedBefore + '\n' + eventsStr + '\n];\n' + after;
  fs.writeFileSync('src/lib/events-data.ts', newFileContent);
}
