// =============================================
// YourUtopia — 30+ Olay / Dilemma Verileri
// =============================================
import { GameEvent, GameState } from "./types";

export const EVENTS: GameEvent[] = [
  // ============================================
  // POZİTİF OLAYLAR (SÜRPRİZ KAZANÇLAR)
  // ============================================
  {
    id: "trend_digital_nomad",
    title: "Dijital Göçebeler Ülkeye Akın Ediyor",
    description: "Dünyanın dört bir yanından yazılımcılar ve freelancer'lar, güzel iklimimiz ve ucuz hayatımız için ülkemize yerleşmeye başladı. Ancak yerel halk kiraların artmasından şikayetçi.",
    category: "ekonomi",
    minTurn: 5,
    choices: [
      {
        label: "A",
        text: "Dijital Göçebe Vizesi ver (Tam destek).",
        effects: { budget: 1500, foreignRelations: 10, happiness: -10, stability: -5 },
        factionEffects: { capitalists: 15, workers: -15 },
        hint: "Bolca yabancı döviz girer ancak konut krizi yüzünden halk kızar. (+Bütçe Geliri)",
      },
      {
        label: "B",
        text: "Sadece belirli bölgelere yerleşmelerine izin ver.",
        effects: { budget: 500, foreignRelations: 5, stability: 5 },
        factionEffects: { capitalists: 10 },
        hint: "Orta karar bir kazanç ve daha güvenli bir yönetim. (+Bütçe Geliri)",
      },
      {
        label: "C",
        text: "Vize şartlarını zorlaştır, yerli halkı koru.",
        effects: { happiness: 15, stability: 10, budget: -500 },
        factionEffects: { nationalists: 20, workers: 15 },
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
        effects: { budget: -1500, happiness: 20, education: 5, stability: 10 },
        factionEffects: { nationalists: 15, workers: 20 },
        hint: "Çok masraflı ama halk bu hizmete bayılır."
      },
      {
        label: "B",
        text: "Girişimcilere sadece vergi indirimi sağla.",
        effects: { budget: -300, happiness: 10, education: 5 },
        factionEffects: { capitalists: 10 },
        hint: "Ucuz ve dengeli bir destek. (-Bütçe Gideri)",
      },
      {
        label: "C",
        text: "Gereksiz! Yabancı platformlara ek vergi koy.",
        effects: { budget: 800, happiness: -15, foreignRelations: -5 },
        factionEffects: { nationalists: 10, intellectuals: -15 },
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
        effects: { environment: 20, happiness: 10, budget: -1500, stability: 5 },
        factionEffects: { intellectuals: 20, capitalists: -5 },
        hint: "Doğa kurtulur, gençler sevinir ama sanayiciler büyük isyan eder. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Sadece sembolik ağaç dikme kampanyası başlat.",
        effects: { environment: 5, budget: -300, happiness: -5 },
        hint: "Ucuz bir göz boyama, ama aktivistler tatmin olmaz. (-Bütçe Gideri)",
      },
      {
        label: "C",
        text: "Grevi yasakla ve fabrikaları tam kapasite çalıştır.",
        effects: { budget: 1500, environment: -15, happiness: -20, stability: -10 },
        factionEffects: { capitalists: 25, intellectuals: -30 },
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
        effects: { budget: -800, education: 15, happiness: 5, foreignRelations: 10 },
        factionEffects: { intellectuals: 15 },
        marketEffects: { tech: 1.08 },
        hint: "Yenilikçi bir adım! Teknoloji hisseleri fırlar. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Sanal arsalardan 'Dijital Emlak Vergisi' al.",
        effects: { budget: 1500, happiness: -10, stability: 5 },
        
        hint: "Havadan iyi para kazanırsınız ama yatırımcılar küser. (+Bütçe Geliri)",
      },
      {
        label: "C",
        text: "Sanal dünya saçmalıktır, hepsini erişime kapat.",
        effects: { stability: 10, education: -10, happiness: -15 },
        factionEffects: { nationalists: 10, intellectuals: -15 },
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
        effects: { health: 15, happiness: -10, budget: -300 },
        factionEffects: { capitalists: -5, nationalists: 10 },
        hint: "Halk sağlığı kurtulur ancak şirketler tazminat davası açar. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Sadece +18 yaş sınırı getir.",
        effects: { health: 5, stability: 5, happiness: -5 },
        hint: "Dengeli ve makul bir çözüm."
      },
      {
        label: "C",
        text: "Dokunma, serbest piyasa. Sadece 'zararlıdır' yazısı eklet.",
        effects: { budget: 500, health: -15, happiness: 10 },
        factionEffects: { capitalists: 20, intellectuals: -15 },
        hint: "Bütçe ve vergi geliri akar ama hastaneler kalp krizi vakalarıyla dolar."
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
        effects: { budget: -800, happiness: 15, education: 5, foreignRelations: 10 },
        factionEffects: { intellectuals: 10 },
        marketEffects: { tech: 1.05 },
        hint: "Bütçeyi biraz sarsar ama gençlerin mutluluğu tavan yapar, Teknoloji sektörü uçar."
      },
      {
        label: "B",
        text: "Sadece mevcut salonları kullandır (Düşük Bütçe).",
        effects: { budget: -300, happiness: 5, foreignRelations: 5 },
        hint: "Risksiz, küçük bir mutluluk artışı. (-Bütçe Gideri)",
      },
      {
        label: "C",
        text: "Reddet, 'oyunla vakit kaybedecek zamanımız yok'.",
        effects: { happiness: -10, education: -5 },
        factionEffects: { nationalists: 5, intellectuals: -15 },
        hint: "Geleneksel kesim memnun olur ama gençler size öfkelenir."
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
        effects: { happiness: 10, stability: -5, budget: 0 },
        factionEffects: { capitalists: 15, workers: -5 },
        marketEffects: { tech: 1.08 },
        hint: "Mutluluk artar, teknoloji borsası patlar ama ülke istikrarı sarsılır."
      },
      {
        label: "B",
        text: "Devlet güvenceli Ulusal Kripto Borsa'sı kur ve vergilendir.",
        effects: { budget: 1500, stability: 5, happiness: -5 },
        factionEffects: { nationalists: 10},
        hint: "Güzel bir bütçe geliri elde edersiniz, ancak özgürlükçüler kızar."
      },
      {
        label: "C",
        text: "Kripto paraları tamamen yasakla!",
        effects: { stability: 10, happiness: -15, education: -5 },
        factionEffects: { nationalists: 15, intellectuals: -20 },
        hint: "Devlet kontrolü artar ama genç nesil isyan eder."
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
        effects: { budget: -800, education: 15, happiness: -5, stability: -5 },
        factionEffects: { capitalists: 20, workers: -20 },
        marketEffects: { tech: 1.12 },
        hint: "Geleceğe yatırım! Teknoloji hisseleri uçar ancak işçi sınıfı çok öfkelenir. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "İşsiz kalanlara 'Evrensel Temel Gelir' (UBI) bağla.",
        effects: { budget: -1500, happiness: 20, stability: 10 },
        factionEffects: { workers: 25},
        hint: "Halk sizi kahraman ilan eder ancak Hazine büyük yara alır. (-Bütçe Gideri)",
      },
      {
        label: "C",
        text: "Yapay zeka şirketlerine ağır vergiler ve kısıtlamalar getir.",
        effects: { budget: 800, happiness: 5, education: -10 },
        factionEffects: { workers: 15, intellectuals: -20 },
        hint: "Bütçe ve işçiler toparlanır, ancak ülke bilimsel olarak geri kalır."
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
        effects: { stability: 15, happiness: -25, foreignRelations: -10 },
        factionEffects: { nationalists: 20, intellectuals: -25 },
        hint: "Düzen sağlanır ama ülkenin prestiji çöker, gençler isyan eder."
      },
      {
        label: "B",
        text: "Sadece içerik üreticilerine ağır vergiler ve denetim getir.",
        effects: { budget: 800, stability: 5, happiness: -5 },
        factionEffects: { workers: 10},
        hint: "Devlete harika bir ek gelir kaynağı yaratır."
      },
      {
        label: "C",
        text: "Müdahale etme, özgürlüğü sonuna kadar savun.",
        effects: { happiness: 10, stability: -10, education: -5 },
        factionEffects: { intellectuals: 15, nationalists: -15 },
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
        effects: { budget: -2000, education: 25, happiness: 10, foreignRelations: 15 },
        factionEffects: { intellectuals: 30, nationalists: 15 },
        marketEffects: { tech: 1.15, minerals: 1.05 },
        hint: "Çok pahalı! Ancak ülkeyi bilim ve prestij şampiyonu yapar. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Daha küçük ölçekli, sadece uydu fırlatma projesi yap.",
        effects: { budget: -800, education: 10, foreignRelations: 5 },
        hint: "Makul bir bütçeyle güzel bir bilimsel ilerleme."
      },
      {
        label: "C",
        text: "Dünyadaki dertlerimiz bitmedi, uzayı boşver.",
        effects: { budget: 0, education: -10, happiness: -5 },
        factionEffects: { intellectuals: -15 },
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
        effects: { budget: -500, education: 10, happiness: 15 },
        factionEffects: { intellectuals: 15, capitalists: 10 },
        marketEffects: { tech: 1.03 },
        hint: "Hazine destek öder, ancak gençlerin umudu ve teknoloji borsası artar. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Sadece devlet destekli 'Milli ve Yerli' oyunları fonla.",
        effects: { budget: -300, stability: 5, happiness: 5 },
        factionEffects: { nationalists: 15, intellectuals: -5 },
        hint: "Milliyetçi kesim memnun olur ama küresel pazar kaçırılır. (-Bütçe Gideri)",
      },
      {
        label: "C",
        text: "Oyun yapmak bir iş değildir, herkes fabrikaya dönsün.",
        effects: { stability: 5, education: -5, happiness: -10 },
        factionEffects: { workers: 10, intellectuals: -15 },
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
        effects: { budget: 2500, stability: 5, environment: -5 },
        factionEffects: { workers: 10, nationalists: 10 },
        marketEffects: { minerals: 0.7 },
        hint: "Büyük gelir, ancak çevre kirliliği artar. Mineral fiyatları düşer."
      },
      {
        label: "B",
        text: "Özel sektöre ihale et — Yabancı yatırımcı gelsin.",
        effects: { budget: 2000, foreignRelations: 10, environment: -5 },
        factionEffects: { capitalists: 20, nationalists: -10 },
        hint: "Orta düzey gelir, uluslararası ilişkiler ve sermaye güçlenir."
      },
      {
        label: "C",
        text: "Madeni çevreye zarar vermemek için kapalı tut.",
        effects: { budget: 0, environment: 15, happiness: -5 },
        factionEffects: { intellectuals: 20},
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
        effects: { budget: 2000, foreignRelations: 5 },
        factionEffects: { capitalists: 10, nationalists: 10 },
        hint: "Bütçeye harika bir katkı sağlar."
      },
      {
        label: "B",
        text: "Geliri yerel esnafa ve halka kredi olarak dağıt.",
        effects: { budget: 500, happiness: 15, stability: 5 },
        factionEffects: { workers: 20},
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
        effects: { budget: 2000, foreignRelations: 5, education: 5 },
        factionEffects: { capitalists: 15, intellectuals: -5 },
        hint: "Bilimi paraya çevirirsiniz. (+Bütçe Geliri)",
      },
      {
        label: "B",
        text: "Patenti satma, ücretsiz olarak ülkende kullan.",
        effects: { budget: -500, environment: 15, health: 10, education: 15 },
        factionEffects: { intellectuals: 20, capitalists: -5 },
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
        effects: { budget: -500, happiness: 25, stability: 10 },
        factionEffects: { nationalists: 15, workers: 15 },
        hint: "Bütçeden biraz feda edip halkın kalbini fethedersiniz."
      },
      {
        label: "B",
        text: "Sadece resmi ve mütevazı bir tören yap.",
        effects: { budget: 0, happiness: 5, stability: 5 },
        factionEffects: { nationalists: 5 },
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
        effects: { budget: -300, education: 20, happiness: 10, foreignRelations: 10 },
        factionEffects: { capitalists: 20, intellectuals: 15, workers: -5 },
        hint: "Kısa vadede bütçeden yersiniz ama eğitim ve prestij uçar."
      },
      {
        label: "B",
        text: "Muafiyet yok, normal vergilerle yatırım yapsınlar.",
        effects: { budget: 1500, education: 5, happiness: 5 },
        factionEffects: { workers: 10 },
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
        effects: { budget: 2500, environment: -20, stability: 5 },
        factionEffects: { capitalists: 20, nationalists: 10, intellectuals: -20 },
        hint: "Çok büyük bir ekonomik sıçrama, ancak korkunç bir çevre felaketi. (+Bütçe Geliri)",
      },
      {
        label: "B",
        text: "Çevre dostu yavaş teknolojiyle çıkar.",
        effects: { budget: 800, environment: -5 },
        factionEffects: { capitalists: 10, intellectuals: 5 },
        hint: "Orta karar para, kabul edilebilir çevre hasarı. (+Bütçe Geliri)",
      },
      {
        label: "C",
        text: "Rezervi çıkarma, ormanları milli park ilan et.",
        effects: { budget: 0, environment: 15, happiness: 10 },
        factionEffects: { intellectuals: 20},
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
        effects: { budget: -1500, happiness: 25, foreignRelations: 25, stability: 10 },
        factionEffects: { nationalists: 20, capitalists: 15 },
        hint: "Pahalıdır ancak halkı sevince boğar ve küresel itibarınızı zirveye taşır. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Sadece mevcut tesisleri kullanarak mütevazı bir organizasyon yap.",
        effects: { budget: -300, happiness: 15, foreignRelations: 10 },
        factionEffects: { nationalists: 5 },
        hint: "Ekonomik ve güvenli. (-Bütçe Gideri)",
      },
      {
        label: "C",
        text: "Organizasyonu iptal et, bu parayı harcayamayız.",
        effects: { budget: 0, happiness: -15, foreignRelations: -15 },
        factionEffects: { nationalists: -20 },
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
        effects: { budget: 1500, foreignRelations: 5 },
        factionEffects: { capitalists: 15 },
        hint: "Hazineniz dolar. (+Bütçe Geliri)",
      },
      {
        label: "B",
        text: "Ürünleri iç piyasaya çok ucuza sat, enflasyonu düşür.",
        effects: { budget: 300, happiness: 15, health: 10 },
        factionEffects: { workers: 20},
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
        effects: { budget: 500, education: 15, happiness: 5 },
        factionEffects: { intellectuals: 20, workers: 10 },
        hint: "Eğitim ve ekonomi canlanır. (+Bütçe Geliri)",
      },
      {
        label: "B",
        text: "Uyduyu askeri istihbarat ve gözetleme için kullan.",
        effects: { military: 20, stability: 15, foreignRelations: -10 },
        factionEffects: { military: 25, nationalists: 10, intellectuals: -10 },
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
        effects: { budget: -800, education: 15, happiness: 10, stability: 5 },
        factionEffects: { intellectuals: 15, capitalists: 15 },
        hint: "Bütçeden yersiniz ama ülkenin geleceğini kurtaracak bir nesil yetişir."
      },
      {
        label: "B",
        text: "Hibe verme, sadece serbest piyasada gelişmelerine izin ver.",
        effects: { budget: 500, happiness: 5 },
        factionEffects: { capitalists: 10 },
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
        effects: { budget: -500, happiness: 20, foreignRelations: 15, education: 5 },
        factionEffects: { intellectuals: 20, nationalists: 15 },
        hint: "Halkınız gurur duyar, dış ilişkileriniz ve eğitim seviyeniz artar. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Bu popülerliği turizme çevirecek reklamlar yap.",
        effects: { budget: 800, happiness: 5, foreignRelations: 5 },
        factionEffects: { capitalists: 15 },
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
        effects: { budget: 2500, stability: -20, happiness: -25, environment: -20 },
        factionEffects: { capitalists: 30, workers: -40, nationalists: -40 },
        flagsToSet: ["CORPORATE_STATE"],
        hint: "İflastan kurtulursunuz ama ülke kalıcı hasar alır (Kelebek Etkisi!). (+Bütçe Geliri)",
      },
      {
        label: "B",
        text: "Reddet — Kendi başımıza batacağız ya da çıkacağız.",
        effects: { budget: 0, stability: 10, foreignRelations: -10 },
        factionEffects: { nationalists: 20 },
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
        effects: { military: -25, foreignRelations: 25, stability: -10, happiness: -10 },
        factionEffects: { military: -40, nationalists: -20, intellectuals: 20 },
        hint: "Ordu öfkelenecek ama ekonomi nefes alacak."
      },
      {
        label: "B",
        text: "Meydan Oku — Biz bize yeteriz!",
        effects: { budget: -2500, happiness: -20, stability: 10, military: 10 },
        factionEffects: { nationalists: 30, military: 20, capitalists: -5 },
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
        effects: { budget: -800, education: 15, stability: -5, foreignRelations: -5 },
        factionEffects: { intellectuals: 15, nationalists: -5 },
        flagsToSet: ["FUNDED_SUSPICIOUS_LAB"],
        hint: "Eğitim fırlar ama gelecekte büyük bir risk barındırır (Kelebek Etkisi!) (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Laboratuvarı derhal mühürle ve kapat.",
        effects: { budget: -300, stability: 5, health: 5, education: -5 },
        factionEffects: { intellectuals: -10, nationalists: 10 },
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
        effects: { budget: -500, happiness: -25, stability: -15, health: 15 },
        factionEffects: { workers: -20, nationalists: 15 },
        flagsToSet: ["VIRUS_CONTAINED"],
        hint: "Halk sizden nefret edecek ama virüs duracak. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Milyarlarca dolar harcayarak panzehir geliştir.",
        effects: { budget: -2500, health: 20, happiness: 10, education: 10 },
        factionEffects: { intellectuals: 20 },
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
        effects: { budget: -1500, stability: 10, happiness: 5 }, factionEffects: { workers: 10, nationalists: 10 },
        hint: "Bütçe ağır darbe alır, istikrar ve güven artar",
      },
      {
        label: "B",
        text: "Faiz oranlarını acil artır — enflasyonu kontrol et.",
        effects: { budget: -300, happiness: -10, stability: 5, education: -5 }, factionEffects: { capitalists: -5, workers: -10, intellectuals: -10, nationalists: 10 },
        hint: "Halk memnuniyetsizliği artar, istikrar biraz yükselir",
      },
      {
        label: "C",
        text: "Hiçbir müdahale yapma — serbest piyasaya güven.",
        effects: { budget: 0, stability: -15, happiness: -15, foreignRelations: -5 }, factionEffects: { capitalists: 10, workers: -10, nationalists: 10 },
        hint: "Bedava ama çok riskli — istikrar ve mutluluk çöker",
      },
      {
        label: "D",
        text: "Yabancı yatırımcılara vergi muafiyeti tanı — sermaye çek.",
        effects: { budget: -500, foreignRelations: 10, happiness: -5, education: 5 }, factionEffects: { capitalists: -5, workers: -10, intellectuals: 10 },
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
        effects: { budget: 800, foreignRelations: 15, happiness: -10, stability: -5 }, factionEffects: { capitalists: 10, workers: -10 },
        hint: "Gelir artar, diplomasi güçlenir ama halk tepkili",
      },
      {
        label: "B",
        text: "Sınırlı katılım — sadece belirli sektörlerde ticaret.",
        effects: { budget: 500, foreignRelations: 10, happiness: 0, stability: 0 }, factionEffects: { capitalists: 10 },
        hint: "Dengeli yaklaşım — orta düzey kazanç",
      },
      {
        label: "C",
        text: "Teklifi reddet — yerli üreticiyi koru.",
        effects: { budget: -300, foreignRelations: -10, happiness: 10, stability: 5 }, factionEffects: { capitalists: -5, workers: 10, nationalists: 10 },
        hint: "Halk mutlu ama diplomatik itibar düşer",
      },
      {
        label: "D",
        text: "Karşı teklif sun — lehine şartlar iste.",
        effects: { budget: 300, foreignRelations: -5, happiness: 5, education: 5 }, factionEffects: { capitalists: 10, workers: 10, intellectuals: 10, nationalists: 10 },
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
        effects: { budget: 500, happiness: 10, stability: -5, foreignRelations: -5 }, factionEffects: { capitalists: 10, workers: 10, nationalists: 10 },
        hint: "Halk sevinir, yatırımcılar kaçabilir",
      },
      {
        label: "B",
        text: "Düz vergi — herkesten aynı oran.",
        effects: { budget: 500, happiness: -5, stability: 5, foreignRelations: 5 }, factionEffects: { capitalists: 10, workers: -10, nationalists: 10 },
        hint: "Basit ve öngörülebilir ama halk tepkili",
      },
      {
        label: "C",
        text: "Vergileri düşür — tüketimi canlandır.",
        effects: { budget: -800, happiness: 15, stability: 5, education: -5 }, factionEffects: { workers: 10, intellectuals: -10, nationalists: 10 },
        hint: "Halk çok mutlu ama bütçe darbe alır",
      },
      {
        label: "D",
        text: "Vergi affi çıkar — kayıt dışı ekonomiyi kayda al.",
        effects: { budget: 500, happiness: 5, stability: -5, foreignRelations: 5 }, factionEffects: { capitalists: 10, workers: 10 },
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
        effects: { budget: 300, happiness: -15, foreignRelations: -10, stability: 5 }, factionEffects: { capitalists: 10, workers: -10, intellectuals: -10, nationalists: 10 },
        hint: "Gençler çok kızgın, istikrar korunur",
      },
      {
        label: "B",
        text: "Düzenle ve vergilendir — kontrollü serbestlik.",
        effects: { budget: 300, happiness: 5, stability: 5, education: 5 }, factionEffects: { capitalists: 10, workers: 10, intellectuals: 10, nationalists: 10 },
        hint: "Dengeli çözüm — herkes biraz memnun",
      },
      {
        label: "C",
        text: "Ulusal dijital para çıkar — CBDC projesi başlat.",
        effects: { budget: 1500, education: 10, foreignRelations: 10, stability: 5 }, factionEffects: { intellectuals: 10, nationalists: 10 },
        hint: "Başarılı bir dijital ekonomi atağı, bütçe geliri artar."
      },
      {
        label: "D",
        text: "Tamamen serbest bırak — müdahale etme.",
        effects: { budget: 0, happiness: 10, stability: -10, foreignRelations: -5 }, factionEffects: { capitalists: 10, workers: 10, nationalists: 10 },
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
        effects: { budget: -1500, happiness: 10, stability: 10, education: 5 }, factionEffects: { capitalists: -5, workers: 10, intellectuals: 10, nationalists: 10 },
        hint: "Çok pahalı ama halk rahatlar",
      },
      {
        label: "B",
        text: "Mesleki eğitim kampanyası — insanları yeniden eğit.",
        effects: { budget: -500, happiness: 5, education: 10, stability: 5 }, factionEffects: { capitalists: -5, workers: 10, intellectuals: 10, nationalists: 10 },
        hint: "Uzun vadeli çözüm, kısa vadede yetersiz",
      },
      {
        label: "C",
        text: "İşsizlik maaşını artır — sosyal yardım genişlet.",
        effects: { budget: -800, happiness: 10, stability: 5, education: -5 }, factionEffects: { capitalists: -5, workers: 10, intellectuals: -10, nationalists: 10 },
        hint: "Palyatif çözüm — bütçe eritir",
      },
      {
        label: "D",
        text: "Teşvik paketi — özel sektöre istihdam bonusu ver.",
        effects: { budget: -500, happiness: 5, stability: 5, foreignRelations: 5 }, factionEffects: { workers: 10, nationalists: 10 },
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
        effects: { budget: -2000, health: 10, happiness: 5, stability: 5 }, factionEffects: { capitalists: -5, workers: 10, military: -10, nationalists: 5 },
        hint: "Çok pahalı ama can kaybını minimize eder",
      },
      {
        label: "B",
        text: "Uluslararası yardım kabul et — BM koordinasyonuna izin ver.",
        effects: { budget: -500, foreignRelations: 10, happiness: 5, health: 5 }, factionEffects: { workers: 10 },
        hint: "Ekonomik ama egemenlik algısı zedelenebilir",
      },
      {
        label: "C",
        text: "Orduyu devreye sok — askeri lojistikle müdahale.",
        effects: { budget: -800, military: -10, health: 10, stability: 10 }, factionEffects: { capitalists: -5, workers: 10, military: -10, nationalists: 5 },
        hint: "Askeri güç düşer ama hızlı müdahale sağlanır",
      },
      {
        label: "D",
        text: "Özel sektör ve STK'larla koordine et — devlet minimal müdahale.",
        effects: { budget: -300, happiness: -10, health: 5, stability: -5 }, factionEffects: { capitalists: -5, workers: -10 },
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
        effects: { budget: -1500, happiness: -20, health: 15, stability: -10 }, factionEffects: { capitalists: -5, workers: -10, nationalists: 10 },
        hint: "Sağlık korunur ama ekonomi ve mutluluk çöker",
      },
      {
        label: "B",
        text: "Kısmi kısıtlamalar — maske zorunluluğu, mesafe kuralı.",
        effects: { budget: -500, health: 10, happiness: -10, stability: 5 }, factionEffects: { workers: -10, nationalists: 10 },
        hint: "Dengeli yaklaşım — her alanda orta etki",
      },
      {
        label: "C",
        text: "Aşı geliştirme programı başlat — Ar-Ge'ye yatırım.",
        effects: { budget: -800, education: 10, foreignRelations: 10, health: 5 }, factionEffects: { capitalists: -5, workers: 10, intellectuals: 10 },
        hint: "Uzun vadede çok değerli, kısa vadede yetersiz",
      },
      {
        label: "D",
        text: "Sürü bağışıklığı stratejisi — minimum müdahale.",
        effects: { budget: 0, health: -20, stability: -10, foreignRelations: -10 }, factionEffects: { capitalists: 10, workers: -10, nationalists: 10 },
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
        effects: { budget: -800, stability: 5, happiness: 5, environment: -5 }, factionEffects: { workers: 10, intellectuals: -10, nationalists: 10 },
        hint: "Geçici çözüm — 2-3 tur idare eder",
      },
      {
        label: "B",
        text: "Yenilenebilir enerji yatırımına geç — güneş ve rüzgar.",
        effects: { budget: -1500, environment: 15, education: 10, happiness: -5 }, factionEffects: { capitalists: -5, workers: -10, intellectuals: 10 },
        hint: "Uzun vadede mükemmel ama şu an acı çekersin",
      },
      {
        label: "C",
        text: "Alternatif tedarikçilerle acil anlaşma — daha pahalı.",
        effects: { budget: -1500, stability: 10, foreignRelations: 5, happiness: 5 }, factionEffects: { capitalists: -5, workers: 10, nationalists: 10 },
        hint: "Pahalı ama sorunu hızlı çözer",
      },
      {
        label: "D",
        text: "Nükleer enerji programı başlat.",
        effects: { budget: -2000, environment: -10, education: 10, stability: 5 }, factionEffects: { capitalists: -5, intellectuals: 0, nationalists: 10 },
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
        effects: { budget: -2000, happiness: 10, health: 10, stability: 5 }, factionEffects: { capitalists: -5, workers: 10, nationalists: 10 },
        hint: "Çok pahalı ama halk kendini güvende hisseder",
      },
      {
        label: "B",
        text: "Sel barajları ve altyapı projesi başlat — uzun vadeli çözüm.",
        effects: { budget: -1500, environment: 10, stability: 5, happiness: -5 }, factionEffects: { capitalists: -5, workers: -10, intellectuals: 10, nationalists: 10 },
        hint: "Gelecek felaketleri önler ama şu an yardım yetersiz",
      },
      {
        label: "C",
        text: "Uluslararası insani yardım çağrısı yap.",
        effects: { budget: -300, foreignRelations: 10, happiness: 5, health: 5 }, factionEffects: { capitalists: -5, workers: 10 },
        hint: "Ekonomik ama bağımsızlık algısı zedelenir",
      },
      {
        label: "D",
        text: "Bölgeyi boşalt ve yeniden iskana kapat — güvenlik öncelikli.",
        effects: { budget: -500, happiness: -10, stability: 10, environment: 5 }, factionEffects: { capitalists: -5, workers: -10, intellectuals: 10, nationalists: 10 },
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
        effects: { budget: -800, foreignRelations: -10, stability: 5, health: 5 }, factionEffects: { capitalists: -5, workers: -10, nationalists: 10 },
        hint: "Hızlı çözüm ama uluslararası prestij kaybı",
      },
      {
        label: "B",
        text: "Siber savunma birimi kur — sıfırdan yeniden inşa et.",
        effects: { budget: -1500, education: 10, stability: -10, military: 5 }, factionEffects: { capitalists: -5, military: 10, nationalists: 5, intellectuals: 10 },
        hint: "Pahalı ve acılı ama uzun vadede güçlenirsin",
      },
      {
        label: "C",
        text: "Müttefik ülkelerden teknik destek iste.",
        effects: { budget: -500, foreignRelations: 10, education: 5, stability: -5 }, factionEffects: { intellectuals: 10 },
        hint: "Ekonomik çözüm — diplomasi güçlenir",
      },
      {
        label: "D",
        text: "Karşı siber saldırı başlat — misilleme yap.",
        effects: { budget: -800, foreignRelations: -15, military: 10, stability: 5 }, factionEffects: { capitalists: -5, workers: 10, military: 10, nationalists: 15 },
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
        effects: { budget: -2000, military: 15, happiness: -15, stability: -10 }, factionEffects: { capitalists: -5, workers: -10, military: 10, nationalists: 15 },
        hint: "Güçlü caydırıcılık ama ülke gerilir",
      },
      {
        label: "B",
        text: "Diplomasi masasına otur — barış müzakereleri başlat.",
        effects: { budget: -300, foreignRelations: 10, stability: 5, happiness: 5 }, factionEffects: { capitalists: -5, workers: 10, military: -10, nationalists: 5 },
        hint: "Barışçıl ama zayıf görünme riski",
      },
      {
        label: "C",
        text: "NATO/müttefik desteği talep et — uluslararası baskı kur.",
        effects: { budget: -300, foreignRelations: 10, military: 5, stability: 5 }, factionEffects: { capitalists: -5, workers: 10, military: 10, nationalists: 15 },
        hint: "Güçlü hamle — bağımlılık riski",
      },
      {
        label: "D",
        text: "Önleyici askeri operasyon planla — sürpriz saldırı.",
        effects: { budget: -2000, foreignRelations: -25, military: -10, happiness: -10 }, factionEffects: { capitalists: -5, workers: -10, military: -10, nationalists: 5 },
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
        effects: { budget: -800, foreignRelations: 15, happiness: -10, stability: -10 }, factionEffects: { capitalists: -5, workers: -10 },
        hint: "İnsani ama toplumsal gerilim ve maliyet yüksek",
      },
      {
        label: "B",
        text: "Kontrollü kabul — kota belirle, güvenlik taraması yap.",
        effects: { budget: -500, foreignRelations: 5, happiness: -5, stability: 5 }, factionEffects: { capitalists: -5, workers: -10, nationalists: 10 },
        hint: "Dengeli çözüm — her tarafı biraz memnun eder",
      },
      {
        label: "C",
        text: "Sınırları kapat — ulusal güvenlik öncelikli.",
        effects: { budget: -300, foreignRelations: -15, stability: 10, happiness: 5 }, factionEffects: { workers: 10, military: 10, nationalists: 15 },
        hint: "Diplomatik bedeli ağır ama halk rahat",
      },
      {
        label: "D",
        text: "Uluslararası toplumu harekete geçir — yük paylaşımı iste.",
        effects: { budget: -300, foreignRelations: 10, stability: 5, happiness: 0 }, factionEffects: { capitalists: -5, nationalists: 10 },
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
        effects: { budget: -500, foreignRelations: 10, stability: 5, happiness: 5 }, factionEffects: { capitalists: -5, workers: 10, nationalists: 10 },
        hint: "Aktif diplomasi — sonuç garantisi yok",
      },
      {
        label: "B",
        text: "Taviz ver — BM taleplerini kısmen kabul et.",
        effects: { budget: -300, foreignRelations: 10, happiness: -10, stability: -5 }, factionEffects: { capitalists: -5, workers: -10, military: -10, nationalists: -5 },
        hint: "Barışçıl ama halk 'teslim olduk' der",
      },
      {
        label: "C",
        text: "Karara meydan oku — yaptırımları tanıma.",
        effects: { budget: 0, foreignRelations: -20, happiness: 10, military: 5 }, factionEffects: { capitalists: 10, workers: 10, military: 10, nationalists: 15 },
        hint: "Milliyetçi dalga yükselir, izolasyon artar",
      },
      {
        label: "D",
        text: "Alternatif ittifaklar kur — Doğu bloğuna yaklaş.",
        effects: { budget: 300, foreignRelations: -10, military: 5, stability: 5 }, factionEffects: { capitalists: 10, military: 10, nationalists: 15 },
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
        effects: { budget: 0, foreignRelations: -15, happiness: 10, stability: 5 }, factionEffects: { capitalists: 10, workers: 10, military: 10, nationalists: 15 },
        hint: "Sert yanıt — diplomatik kriz derinleşir",
      },
      {
        label: "B",
        text: "Sessiz diplomasi yürüt — arka kanal görüşmeleri.",
        effects: { budget: -300, foreignRelations: 5, stability: 5, happiness: -5 }, factionEffects: { capitalists: -5, workers: -10, nationalists: 10 },
        hint: "Yavaş ama güvenli — halk sabırsızlanabilir",
      },
      {
        label: "C",
        text: "Konuyu uluslararası mahkemeye taşı.",
        effects: { budget: -500, foreignRelations: 10, stability: 5, education: 5 }, factionEffects: { capitalists: -5, intellectuals: 10, nationalists: 10 },
        hint: "Hukuki süreç — uzun ama meşru",
      },
      {
        label: "D",
        text: "Ekonomik yaptırım uygula — ticaret ambargosuna git.",
        effects: { budget: -500, foreignRelations: -10, stability: 5, happiness: 5 }, factionEffects: { capitalists: -5, workers: 10, nationalists: 10 },
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
        effects: { budget: -800, environment: 15, foreignRelations: 10, happiness: -10 }, factionEffects: { capitalists: -5, workers: -10, intellectuals: 10 },
        hint: "Çevre şampiyonu olursun ama sanayi darbe alır",
      },
      {
        label: "B",
        text: "Kısmi taahhüt — %20 azaltma ve geçiş süresi iste.",
        effects: { budget: -500, environment: 10, foreignRelations: 5, stability: 5 }, factionEffects: { capitalists: -5, intellectuals: 10, nationalists: 10 },
        hint: "Dengeli — kimse çok memnun, kimse çok kızgın değil",
      },
      {
        label: "C",
        text: "Zirveyi boykot et — 'gelişmekte olan ülke hakkı' de.",
        effects: { budget: 0, foreignRelations: -15, environment: -5, happiness: 5 }, factionEffects: { capitalists: 10, workers: 10, intellectuals: -10, nationalists: 10 },
        hint: "Ucuz ama diplomatik itibar kaybı ciddi",
      },
      {
        label: "D",
        text: "Karbon vergisi öner — piyasa mekanizmasıyla çöz.",
        effects: { budget: 300, environment: 10, foreignRelations: 10, happiness: -5 }, factionEffects: { capitalists: 10, workers: -10, intellectuals: 10 },
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
        effects: { budget: -300, happiness: -20, stability: 10, foreignRelations: -10 }, factionEffects: { capitalists: -5, workers: -10, nationalists: 10 },
        hint: "Kısa vadede düzen, uzun vadede nefret",
      },
      {
        label: "B",
        text: "Diyalog masası kur — temsilcilerle görüş.",
        effects: { budget: -300, happiness: 10, stability: 5, foreignRelations: 5 }, factionEffects: { capitalists: -5, workers: 10, nationalists: 10 },
        hint: "Barışçıl ve akıllıca — zaman alır",
      },
      {
        label: "C",
        text: "Reform paketi açıkla — talepleri kısmen karşıla.",
        effects: { budget: -800, happiness: 15, stability: 10, education: 5 }, factionEffects: { capitalists: -5, workers: 10, intellectuals: 10, nationalists: 10 },
        hint: "Pahalı ama en etkili çözüm",
      },
      {
        label: "D",
        text: "Sosyal medyayı kısıtla — bilgi akışını kontrol et.",
        effects: { budget: -300, happiness: -15, foreignRelations: -10, stability: 5 }, factionEffects: { workers: -10, intellectuals: -10, nationalists: 10 },
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
        effects: { budget: -300, happiness: 10, stability: 5, foreignRelations: 10 }, factionEffects: { capitalists: -5, workers: 10, nationalists: 10 },
        hint: "Cesur ve doğru — parti içi bedeli olabilir",
      },
      {
        label: "B",
        text: "İç soruşturma başlat — 'yargı bağımsız çalışsın' de.",
        effects: { budget: -300, happiness: 5, stability: 5, foreignRelations: 5 }, factionEffects: { capitalists: -5, workers: 10, nationalists: 10 },
        hint: "Zaman kazandırır — halk ikna olmayabilir",
      },
      {
        label: "C",
        text: "Üstünü ört — medyayı başka konulara yönlendir.",
        effects: { budget: -300, happiness: -10, stability: -10, foreignRelations: -5 }, factionEffects: { capitalists: -5, workers: -10, nationalists: 10 },
        hint: "Her şey daha da kötüleşir",
      },
      {
        label: "D",
        text: "Kapsamlı anti-yolsuzluk yasası çıkar.",
        effects: { budget: -500, happiness: 10, stability: 10, education: 5 }, factionEffects: { workers: 10, intellectuals: 10, nationalists: 10 },
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
        effects: { budget: -1500, happiness: 20, stability: -5, education: -5 }, factionEffects: { workers: 10, intellectuals: -10 },
        hint: "Seçim kazanırsın ama bütçe çöker",
      },
      {
        label: "B",
        text: "Gerçekçi vaatler sun — 'bu vaatler yalanır' de.",
        effects: { budget: 0, happiness: -5, stability: 5, education: 5 }, factionEffects: { capitalists: 10, workers: -10, intellectuals: 10, nationalists: 10 },
        hint: "Dürüst ama seçim kaybetme riski",
      },
      {
        label: "C",
        text: "Güvenlik kartını oyna — 'tehditler var, biz koruruz'.",
        effects: { budget: -500, military: 10, happiness: 5, stability: 5 }, factionEffects: { capitalists: -5, workers: 10, military: 10, nationalists: 15 },
        hint: "Korku politikası — kısa vadede etkili",
      },
      {
        label: "D",
        text: "Ekonomik başarıları öne çıkar — somut verilerle kampanya.",
        effects: { budget: -300, happiness: 5, stability: 5, education: 5 }, factionEffects: { capitalists: -5, workers: 10, intellectuals: 10, nationalists: 10 },
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
        effects: { budget: -500, happiness: 10, foreignRelations: 10, stability: -5 }, factionEffects: { workers: 10, intellectuals: 10 },
        hint: "Demokratik ama sonuç belirsiz, istikrar sarsılabilir",
      },
      {
        label: "B",
        text: "Meclis komisyonu kur — uzlaşıyla değişiklik yap.",
        effects: { budget: -300, happiness: 5, stability: 5, foreignRelations: 5 }, factionEffects: { capitalists: -5, workers: 10, nationalists: 10 },
        hint: "Yavaş ama güvenli — herkes masada",
      },
      {
        label: "C",
        text: "Talebi reddet — 'şu an sırası değil' de.",
        effects: { budget: 0, happiness: -10, stability: 10, foreignRelations: -10 }, factionEffects: { capitalists: 10, workers: -10, nationalists: 10 },
        hint: "Ucuz ama halk ve uluslararası tepki çekersin",
      },
      {
        label: "D",
        text: "Kısmi reform paketi hazırla — temel hakları genişlet.",
        effects: { budget: -500, happiness: 10, foreignRelations: 10, stability: 5 }, factionEffects: { capitalists: -5, workers: 10, intellectuals: 10, nationalists: 10 },
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
        effects: { budget: -1500, environment: 10, health: 5, happiness: 5 }, factionEffects: { capitalists: -5, workers: 10, intellectuals: 10, nationalists: 10 },
        hint: "Pahalı ama çevreyi korursun",
      },
      {
        label: "B",
        text: "Orduyu devreye sok — askeri helikopterlerle söndür.",
        effects: { budget: -800, military: -5, environment: 5, health: 5 }, factionEffects: { capitalists: -5, workers: 10, military: -10, nationalists: -5, intellectuals: 10 },
        hint: "Askeri güç düşer ama etkili müdahale",
      },
      {
        label: "C",
        text: "Yağmur tohumu programı başlat — yapay yağmur.",
        effects: { budget: -500, environment: 10, education: 5, happiness: 0 }, factionEffects: { intellectuals: 10 },
        hint: "Bilimsel yaklaşım — şu anki yangına yavaş kalabilir",
      },
      {
        label: "D",
        text: "Tahliye öncelikli — can kaybını önle, ormanı feda et.",
        effects: { budget: -500, environment: -10, health: 10, happiness: -5 }, factionEffects: { capitalists: -5, workers: -10, intellectuals: -10, nationalists: 10 },
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
        effects: { budget: -2000, environment: -10, education: 10, happiness: -10 }, factionEffects: { capitalists: -5, workers: -10, intellectuals: 0, nationalists: 10 },
        marketEffects: { energy: 0.5 },
        hint: "Çok pahalı, çevre riski ama Enerji fiyatları borsada yarı yarıya düşer.",
      },
      {
        label: "B",
        text: "Yenilenebilir enerji yatırımı yap — güneş+rüzgar.",
        effects: { budget: -1500, environment: 15, education: 10, happiness: 10 }, factionEffects: { capitalists: -5, workers: 10, intellectuals: 10, nationalists: 10 },
        marketEffects: { energy: 0.8 },
        hint: "Pahalı ama herkes memnun. Enerji fiyatları ucuzlar.",
      },
      {
        label: "C",
        text: "Doğalgaz santrallerine yatır — hızlı ve ucuz.",
        effects: { budget: -500, environment: -10, stability: 5, happiness: 5 }, factionEffects: { workers: 10, intellectuals: -10, nationalists: 10 },
        hint: "Ucuz ama çevre zarar görür",
      },
      {
        label: "D",
        text: "Hiçbir şey yapma — enerji tasarrufu kampanyası başlat.",
        effects: { budget: -300, environment: 5, happiness: -5, stability: -5 }, factionEffects: { capitalists: -5, workers: -10, intellectuals: 10 },
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
        effects: { budget: -2000, health: 10, environment: 5, happiness: 5 }, factionEffects: { workers: 10, intellectuals: 10 },
        hint: "Kalıcı çözüm ama çok pahalı",
      },
      {
        label: "B",
        text: "Su kısıtlamaları getir — sanayi ve tarıma kota.",
        effects: { budget: 0, environment: 10, happiness: -10, stability: -5 }, factionEffects: { capitalists: 10, workers: -10, intellectuals: 10 },
        hint: "Bedava ama halk ve çiftçiler isyan eder",
      },
      {
        label: "C",
        text: "Komşu ülkeden su satın al — ithalat anlaşması.",
        effects: { budget: -800, foreignRelations: 5, health: 5, happiness: 5 }, factionEffects: { workers: 10, nationalists: 10 },
        hint: "Bağımlılık yaratır ama krizi çözer",
      },
      {
        label: "D",
        text: "Bulut tohumlama ve yapay yağmur programı.",
        effects: { budget: -500, education: 10, environment: 5, health: 5 }, factionEffects: { capitalists: -5, intellectuals: 10 },
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
        effects: { budget: 300, environment: 10, happiness: 10, stability: 5 }, factionEffects: { capitalists: 10, workers: 10, intellectuals: 10, nationalists: 10 },
        hint: "Gelir + çevre + halk memnuniyeti — win-win",
      },
      {
        label: "B",
        text: "Fabrikayı uyar ve filtreleme sistemi zorunlu kıl.",
        effects: { budget: -300, environment: 5, happiness: 0, stability: 5 }, factionEffects: { capitalists: -5, intellectuals: 10, nationalists: 10 },
        hint: "Ölçülü — sorun tamamen çözülmez",
      },
      {
        label: "C",
        text: "Görmezden gel — işsizlik ve ekonomi daha önemli.",
        effects: { budget: 0, environment: -10, happiness: -10, health: -10 }, factionEffects: { capitalists: 10, workers: -10, intellectuals: -10 },
        hint: "En kötü seçenek — her şey kötüleşir",
      },
      {
        label: "D",
        text: "Nehir temizleme projesi başlat — fabrikaya da süre ver.",
        effects: { budget: -800, environment: 10, health: 10, happiness: 5 }, factionEffects: { capitalists: -5, workers: 10, intellectuals: 10 },
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
        effects: { budget: -2000, military: 20, education: 5, happiness: -5 }, factionEffects: { workers: -10, military: 10, nationalists: 15, intellectuals: 10 },
        hint: "Çok pahalı ama ordu zirveye çıkar",
      },
      {
        label: "B",
        text: "Kademeli modernizasyon — öncelikli sistemleri yenile.",
        effects: { budget: -800, military: 10, education: 5 }, factionEffects: { military: 10, nationalists: 5, intellectuals: 10 },
        hint: "Dengeli — bütçeyi çok zorlama",
      },
      {
        label: "C",
        text: "Yerli savunma sanayii geliştir — milli üretim.",
        effects: { budget: -1500, military: 10, education: 10, happiness: 10 }, factionEffects: { capitalists: -5, workers: 10, military: 10, nationalists: 5, intellectuals: 10 },
        hint: "Uzun vadede mükemmel, kısa vadede yetersiz",
      },
      {
        label: "D",
        text: "Modernizasyonu ertele — diplomasiyi güçlendir.",
        effects: { budget: 0, foreignRelations: 10, military: -5, happiness: 5 }, factionEffects: { capitalists: 10, workers: 10, military: -10, nationalists: -5 },
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
        effects: { budget: -500, foreignRelations: -10, military: 5, stability: 5 }, factionEffects: { capitalists: -5, workers: 10, military: 10, nationalists: 15 },
        hint: "Sert ama orantılı — halk onaylar",
      },
      {
        label: "B",
        text: "Sessiz diplomasi — arka kapıdan uyar.",
        effects: { budget: 0, foreignRelations: 5, stability: 5, happiness: -5 }, factionEffects: { capitalists: 10, workers: -10, nationalists: 10 },
        hint: "Sakin ama halk 'neden bir şey yapmadık' der",
      },
      {
        label: "C",
        text: "Konuyu BM'ye taşı — uluslararası destek ara.",
        effects: { budget: -300, foreignRelations: 10, stability: 5, happiness: 5 }, factionEffects: { capitalists: -5, workers: 10, nationalists: 10 },
        hint: "Hukuki yol — yavaş ama meşru",
      },
      {
        label: "D",
        text: "Karşılıklı askeri tatbikat öner — gerilimi düşür.",
        effects: { budget: -500, foreignRelations: 10, military: 5, stability: 5 }, factionEffects: { capitalists: -5, workers: 10, military: 10, nationalists: 15 },
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
        effects: { budget: -800, happiness: 15, military: -10, education: 5 }, factionEffects: { capitalists: -5, workers: 10, military: -10, nationalists: -5, intellectuals: 10 },
        hint: "Gençler çok mutlu ama askeri güç düşer",
      },
      {
        label: "B",
        text: "Süreyi kısalt — 6 aya düşür.",
        effects: { budget: -300, military: -5, happiness: 10, education: 5 }, factionEffects: { capitalists: -5, workers: 10, military: -10, nationalists: -5, intellectuals: 10 },
        hint: "Herkes biraz memnun — orta yol",
      },
      {
        label: "C",
        text: "Mevcut sistemi koru — değişiklik yok.",
        effects: { budget: 0, military: 5, happiness: -10, education: -5 }, factionEffects: { capitalists: 10, workers: -10, military: 10, nationalists: 5, intellectuals: -10 },
        hint: "Bedava ama gençler kızgın",
      },
      {
        label: "D",
        text: "Hibrit model — kısa zorunlu eğitim + profesyonel çekirdek.",
        effects: { budget: -500, happiness: 10, military: 5, education: 5 }, factionEffects: { capitalists: -5, workers: 10, military: 10, nationalists: 15, intellectuals: 10 },
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
        effects: { budget: 1500, foreignRelations: -15, happiness: -10, military: 5 }, factionEffects: { capitalists: 10, workers: -10, military: 10, nationalists: 15 },
        hint: "Büyük gelir ama diplomatik kriz riski",
      },
      {
        label: "B",
        text: "Savunma amaçlı silahları sat, saldırı silahlarını satma.",
        effects: { budget: 800, military: 5, foreignRelations: -5, happiness: -5 }, factionEffects: { capitalists: 10, workers: -10, military: 10, nationalists: 15 },
        hint: "Orta yol — herkes biraz memnun",
      },
      {
        label: "C",
        text: "Teklifi reddet — insan hakları öncelikli.",
        effects: { budget: 0, foreignRelations: 10, happiness: 10, military: -5 }, factionEffects: { capitalists: 10, workers: 10, military: -10, nationalists: 5 },
        hint: "Etik ama gelir kaybı — halk ve dünya saygı duyar",
      },
      {
        label: "D",
        text: "Silah yerine eğitim ve teknik destek teklif et.",
        effects: { budget: 300, foreignRelations: 5, education: 5, happiness: 5 }, factionEffects: { capitalists: 10, workers: 10, intellectuals: 10 },
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
        effects: { budget: -1500, education: 20, happiness: 10, stability: 5 }, factionEffects: { capitalists: -5, workers: 10, intellectuals: 10, nationalists: 10 },
        hint: "Çok pahalı ama eğitim zirveye çıkar",
      },
      {
        label: "B",
        text: "Sadece öğretmen maaşlarını artır — motivasyon öncelikli.",
        effects: { budget: -500, education: 10, happiness: 5, stability: 5 }, factionEffects: { workers: 10, intellectuals: 10, nationalists: 10 },
        hint: "Etkili ama yetersiz — müfredat eski kalır",
      },
      {
        label: "C",
        text: "Teknoloji odaklı reform — tablet dağıt, dijital eğitime geç.",
        effects: { budget: -800, education: 10, happiness: 5, environment: -5 }, factionEffects: { capitalists: -5, workers: 10, intellectuals: 0 },
        hint: "Modern ama altyapı hazır olmayabilir",
      },
      {
        label: "D",
        text: "Özel sektöre aç — charter okullar ve rekabet.",
        effects: { budget: -300, education: 5, happiness: -5, stability: -5 }, factionEffects: { capitalists: -5, workers: -10, intellectuals: 10 },
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
        effects: { budget: -2000, health: 20, happiness: 15, stability: 5 }, factionEffects: { capitalists: -5, workers: 10, intellectuals: 10, nationalists: 10 },
        hint: "Çok pahalı ama sağlık ve mutluluk zirveye çıkar",
      },
      {
        label: "B",
        text: "Düşük gelirli ailelere ücretsiz sağlık — hedefli yardım.",
        effects: { budget: -800, health: 10, happiness: 10, stability: 5 }, factionEffects: { workers: 10, nationalists: 10 },
        hint: "Dengeli çözüm — ihtiyacı olana yardım",
      },
      {
        label: "C",
        text: "İlaç fiyatlarını düzenle — devlet kontrolü.",
        effects: { budget: -300, health: 10, happiness: 5, foreignRelations: -5 }, factionEffects: { capitalists: -5, workers: 10, nationalists: 10 },
        hint: "Ucuz çözüm — ilaç şirketleri kızar",
      },
      {
        label: "D",
        text: "Özel sağlık sektörünü teşvik et — rekabet fiyat düşürür.",
        effects: { budget: -300, health: 5, happiness: -5, stability: 5 }, factionEffects: { capitalists: -5, workers: -10, nationalists: 10 },
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
        effects: { budget: -800, happiness: 10, foreignRelations: 10, stability: 5 }, factionEffects: { capitalists: -5, workers: 10, nationalists: 10 },
        hint: "Pahalı ama diplomasi ve mutluluk artışı",
      },
      {
        label: "B",
        text: "Küçük çaplı yerel festival — bütçe dostu.",
        effects: { budget: -300, happiness: 5, stability: 5 }, factionEffects: { workers: 10, nationalists: 10 },
        hint: "Ucuz ve güvenli — büyük etki yok",
      },
      {
        label: "C",
        text: "Festivali iptal et — bütçeyi daha acil konulara yönelt.",
        effects: { budget: 0, happiness: -10, foreignRelations: -5, stability: -5 }, factionEffects: { capitalists: 10, workers: -10, nationalists: 10 },
        hint: "Bedava ama halk hayal kırıklığı yaşar",
      },
      {
        label: "D",
        text: "Özel sektör sponsorluğuyla festival — devlete yük yok.",
        effects: { budget: 300, happiness: 10, foreignRelations: 5, stability: 5 }, factionEffects: { capitalists: 10, workers: 10, nationalists: 10 },
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
        effects: { budget: -2000, education: 10, military: 5 },
        factionEffects: { intellectuals: 15, military: 10 },
        flagsToSet: ["AI_PROJECT_STARTED"],
        hint: "Büyük bir kumar (Kelebek Etkisi!) (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Projeyi durdur — Pandora'nın kutusunu açmaya gerek yok.",
        effects: { budget: 0, stability: 5, education: -5 },
        factionEffects: { intellectuals: -10, nationalists: 5 },
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
        effects: { budget: -1500, military: -15, education: -10, stability: 10 },
        factionEffects: { military: -20, intellectuals: -25, nationalists: 10 },
        flagsToSet: ["AI_CHAIN_RESOLVED"],
        hint: "Proje çöpe gider, büyük güç kaybedersiniz ama güvendesiniz. (-Bütçe Gideri)",
      },
      {
        label: "B",
        text: "Onunla Anlaş — YZ'ye sınırlı özerklik ver ve devleti yönetmesine izin ver.",
        effects: { stability: -20, happiness: -15, health: 15 },
        factionEffects: { intellectuals: 30, nationalists: -30, workers: -20 },
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
        effects: { health: 25, education: 25, stability: 25, happiness: -25 },
        factionEffects: { intellectuals: 50, workers: -50, nationalists: -50 },
        flagsToSet: ["AI_CHAIN_RESOLVED", "CYBERNETIC_STATE"],
        hint: "Mutluluk dibe vurur ama diğer tüm statler zirve yapar."
      },
      {
        label: "B",
        text: "İnsanlık Direnişi — YZ'ye karşı iç savaş başlat!",
        effects: { stability: -25, military: -25, budget: -2500, happiness: 20 },
        factionEffects: { nationalists: 50, workers: 30, intellectuals: -40 },
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
        effects: { happiness: -15, popularity: -10, stability: 5 },
        hint: "Gençler öfkeli ama kazalar durdu.",
      },
      {
        label: "B",
        text: "Kamu spotu yayınla ve uyar",
        effects: { budget: -800, education: 5, health: -5 },
        hint: "Masraflı ama özgürlüklere dokunulmadı.",
      },
      {
        label: "C",
        text: "Fenomenlerle anlaşıp karşı akım başlat",
        effects: { budget: -2000, popularity: 15, happiness: 10 },
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
        effects: { military: -5, stability: 10, happiness: -5 },
        hint: "Sert müdahale düzeni sağlar ama tepki çeker.",
      },
      {
        label: "B",
        text: "Belediye bütçesinden acil destek sağla",
        effects: { budget: -1500, health: 5, popularity: 5 },
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
        effects: { education: -10, happiness: 5, stability: 5 },
        hint: "Teknolojik gelişim yavaşlayabilir ama sanatçılar mutlu.",
      },
      {
        label: "B",
        text: "YZ şirketlerine tam destek ver",
        effects: { education: 15, happiness: -10, popularity: -10 },
        hint: "Gelecek teknolojide, ancak halkın bir kısmı işsiz kalmaktan korkuyor.",
      },
      {
        label: "C",
        text: "Özel bir 'YZ Telif Fonu' kur (Sanatçılara ödeme yap)",
        effects: { budget: -2500, happiness: 10, education: 5 },
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
        effects: { budget: -2500, popularity: 15, happiness: 15 },
        hint: "Ekonomi ağır darbe alır ama oylar garanti.",
      },
      {
        label: "B",
        text: "Sadece hukuki süreç başlat",
        effects: { stability: -10, happiness: -15, foreignRelations: 5 },
        hint: "Halk öfkeli, protestolar başlıyor.",
      },
      {
        label: "C",
        text: "Kripto paraları tamamen yasakla",
        effects: { stability: 15, education: -5, popularity: -15 },
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
        effects: { stability: 5, popularity: 5, happiness: 5 },
        hint: "Doğru olanı yaptın, itibar kurtarıldı.",
      },
      {
        label: "B",
        text: "Olayı örtbas etmeye çalış",
        effects: { budget: -2000, stability: -15, popularity: -20 },
        hint: "Medya her şeyi öğrendi, büyük bir fiyasko!",
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
        effects: { budget: -1500, happiness: 20, popularity: 15 },
        hint: "Milli gurur yaşandı, Z kuşağı seni çok seviyor.",
      },
      {
        label: "B",
        text: "Bütçe ayıramayız, evlerinden izlesinler",
        effects: { happiness: -10, popularity: -5 },
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
        effects: { budget: -3000, materials: -30, military: 25, education: 5, foreignRelations: -5 },
        factionEffects: { military: 20, nationalists: 15, intellectuals: 5 },
        flagsToSet: ["DRONE_PROGRAM_MAX"],
        hint: "Büyük materyal harcar ama ordu çağ atlar. (Uzun vadeli etkisi var)"
      },
      {
        label: "B",
        text: "Sadece yazılım Ar-Ge desteği ver",
        effects: { budget: -1000, education: 10, military: 10 },
        factionEffects: { military: 5, intellectuals: 10 },
        flagsToSet: ["DRONE_PROGRAM_MID"],
        hint: "Materyal tasarrufu sağlar ama üretim yavaş olur."
      },
      {
        label: "C",
        text: "Programı durdur, dışarıdan hazır sistem al",
        effects: { budget: -1500, military: 15, foreignRelations: 10, education: -5 },
        factionEffects: { military: 10, nationalists: -15 },
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
        effects: { budget: 8000, foreignRelations: 15, popularity: 10, tech: 20 },
        factionEffects: { capitalists: 20, nationalists: -5 },
        hint: "Devasa para ve itibar kazanırsın, ancak sırlar açığa çıkabilir."
      },
      {
        label: "B",
        text: "Satışı sadece stratejik müttefiklere yap",
        effects: { budget: 3000, foreignRelations: 10, military: 10, stability: 5 },
        factionEffects: { military: 10, nationalists: 10 },
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
        effects: { budget: -1000, military: 10, energy: 30, foreignRelations: -20, stability: -10 },
        factionEffects: { military: 15, nationalists: 20, capitalists: 10 },
        hint: "Enerji kaynaklarını güvenceye alırız ancak savaş riski artar."
      },
      {
        label: "B",
        text: "Komşu ülkeyle masaya oturup kaynakları paylaş",
        effects: { energy: 10, foreignRelations: 15, stability: 10, happiness: 5 },
        factionEffects: { military: -10, nationalists: -15 },
        hint: "Daha az enerji kazanırız ama barışçıl ve güvenli."
      },
      {
        label: "C",
        text: "Uluslararası mahkemeye taşı (Bekle)",
        effects: { foreignRelations: 5, stability: 5 },
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
        effects: { food: 40, happiness: 10, inflation: -5, budget: -1000 },
        factionEffects: { workers: 15, capitalists: -20 },
        hint: "Gıda güvenceye alınır, enflasyon düşer ama şirketler isyan eder."
      },
      {
        label: "B",
        text: "Serbest piyasaya müdahale etme",
        effects: { food: -30, inflation: 15, budget: 2000, happiness: -20 },
        factionEffects: { capitalists: 25, workers: -25 },
        marketEffects: { food: 1.5 },
        hint: "Şirketler ve hazine kazanır ancak halk açlık riski çeker."
      },
      {
        label: "C",
        text: "Stratejik rezervleri piyasaya sür",
        effects: { food: -10, inflation: 0, budget: -500 },
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
        effects: { budget: -4000, energy: 50, materials: -20, environment: 20, education: 5 },
        factionEffects: { intellectuals: 20, capitalists: 10 },
        hint: "Çok pahalı ama geleceği kurtarır."
      },
      {
        label: "B",
        text: "Kömür madenlerine ve fosil yakıtlara yüklen",
        effects: { budget: -500, energy: 30, environment: -25, health: -10 },
        factionEffects: { workers: 10, intellectuals: -30 },
        hint: "Ucuz enerji sağlar ama çevre ve sağlık çöker."
      },
      {
        label: "C",
        text: "Enerji tasarrufu yasası çıkar (Halka kısıtlama)",
        effects: { energy: 15, happiness: -15, popularity: -10 },
        hint: "Para harcamadan enerji korunur ama halk karanlıkta kalır."
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
      
      // Krizler asla ilk 12 turda çıkmasın (Oyun başında afet olmasın)
      if (e.category === "kriz") requiredTurn = Math.max(requiredTurn, 12);
      
      // Küresel ambargolar veya devasa cezalı/savaşlı olaylar en az 20. tur
      if (e.id === "global_embargo" || e.id === "kriz_1" || e.id.includes("ambargo")) {
        requiredTurn = Math.max(requiredTurn, 20);
      }
      
      // Pozitif olayların bazıları da erken çıkabilir, ama çok büyük olanları biraz geciktirebiliriz.
      // (Şimdilik ağırlığı negatif/zor olayları ileriye atmak için kullandık)

      if (state.turn < requiredTurn) return false;
    }

    return true;
  });

  const selectedEvents: GameEvent[] = [];
  
  // Eğer hiç uygun event yoksa veya istenenden azsa, fallback havuzundan çek
  let pool = [...availableEvents];
  
  for (let i = 0; i < count; i++) {
    if (pool.length === 0) {
      // Fallback havuzunu oluştur (Özel hikayeleri ve büyük krizleri tekrar ettirme)
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
        pool = pool.filter(e => e.id !== fallbackPool[randomIndex].id); // Yedek havuzdan aynı şeyi çekmesin
      }
    } else {
      // Çeşitliliği sağla: Aynı kategoriden çok fazla olay gelmesini engelle (Örn: Üst üste 3 ekonomi olayı gelmesin)
      const selectedCategories = selectedEvents.map(e => e.category);
      let filteredPool = pool;
      
      for (const cat of selectedCategories) {
        const tempPool = filteredPool.filter(e => e.category !== cat);
        // Eğer havuz tamamen boşalmıyorsa filtreyi uygula
        if (tempPool.length > 0) {
          filteredPool = tempPool;
        }
      }

      const randomIndex = Math.floor(Math.random() * filteredPool.length);
      const chosenEvent = filteredPool[randomIndex];
      selectedEvents.push(chosenEvent);
      
      // Çekilen olayı asıl havuzdan çıkar
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
