import { GameState } from "./types";
import { MEGA_PROJECTS } from "./mega-projects";
import { POLICIES } from "./policies";

export function generateNews(state: GameState): string[] {
  const news: string[] = [];
  const add = (text: string) => news.push(text);

  // Ekonomik Durum
  if (state.inflation > 20) {
    add("SON DAKİKA: Enflasyon uçtu! Vatandaş yarım simidi 36 ay taksitle alıyor.");
  } else if (state.inflation < 2) {
    add("EKONOMİ: Enflasyon o kadar düşük ki, esnaf para üstü verirken utanıyor.");
  }

  if (state.budget > 1000000) {
    add("HAZİNE TAŞIYOR: Merkez Bankası paraları sığdıracak yer bulamayınca stadyum kiraladı.");
  } else if (state.budget < 0) {
    add("İFLAS: Hazine tamtakır! Devlet dairelerinde çay bardakları zimmetlenmeye başlandı.");
  }

  // Popülarite
  if (state.popularity > 90) {
    add("SİYASET: Başkanın popülaritesi o kadar yüksek ki, muhalefet lideri bile ona oy vereceğini açıkladı.");
  } else if (state.popularity < 20) {
    add("ANKET: Halkın %80'i 'Başkanın yerine evdeki kedim yönetse daha iyi olur' dedi.");
  }

  // İstikrar & Mutluluk
  if (state.stability < 30) {
    add("ASAYİŞ: Şehirde kaos hakim! Trafik ışıklarında kırmızı yandığında bile kimse durmuyor.");
  }
  if (state.happiness < 30) {
    add("SOSYAL MEDYA: Ülkede en çok aratılan kelime 'Yurtdışına nasıl kaçılır' oldu.");
  }

  // Eğitim & Sağlık
  if (state.education > 80) {
    add("EĞİTİM: İlkokul çocukları teneffüslerde kuantum fiziği tartışıyor.");
  }
  if (state.health < 30) {
    add("SAĞLIK: Hastanelerde 'Google'a yazıp ilacınızı kendiniz bulun' dönemi resmen başladı.");
  }
  if (state.health > 80) {
    add("SAĞLIK: Ülkede hastalık kalmadı, doktorlar can sıkıntısından kendi kendilerini muayene ediyor.");
  }

  // Kaynaklar
  if (state.energy < 20) {
    add("ENERJİ: Elektrikler yine kesik! Vatandaş 'Mum ışığında romantizm yapıyoruz' diyerek kendini teselli ediyor.");
  } else if (state.energy > 900) {
    add("ENERJİ: Ülke o kadar çok enerji üretiyor ki, sokak lambaları gündüz bile kapatılmıyor.");
  }

  if (state.food < 20) {
    add("GIDA: Marketlerde makarna kuyrukları uzaydan görünür hale geldi.");
  } else if (state.food > 900) {
    add("GIDA: Silolarda yer kalmadı, devlet bedava patates dağıtıyor.");
  }

  // Savaş ve Diplomasi
  let diplomacyState: any = {};
  try { diplomacyState = JSON.parse(state.diplomacyState || "{}"); } catch { }

  let isAtWar = false;
  for (const [country, dip] of Object.entries(diplomacyState)) {
    if ((dip as any).type === 'war') {
      isAtWar = true;
      add(`SAVAŞ CEPHESİ: ${country} ile çatışmalar tüm şiddetiyle sürüyor. Halk gelişmeleri endişeyle takip ediyor.`);
    } else if ((dip as any).type === 'alliance') {
      add(`DİPLOMASİ: ${country} ile müttefiklik bağlarımız güçleniyor. İki ülke arasında dostluk rüzgarları esiyor.`);
    }
  }

  if (state.military > 80 && !isAtWar) {
    add("ORDU: Silahlı kuvvetler gücünün zirvesinde! Komşu ülkeler sınırda kuş uçurtmuyor.");
  } else if (state.military < 20 && isAtWar) {
    add("ORDU: Askeri teçhizat yetersiz! Cephedeki askerler 'Acaba sapanla mi savaşsak?' diye soruyor.");
  }

  // Mega Projeler
  let megaProjects: string[] = [];
  try { megaProjects = JSON.parse(state.megaProjects || "[]"); } catch { }

  if (megaProjects.includes("space_program")) {
    add("UZAY: Mars'a fırlatılan milli roketimiz yörüngeye başarıyla oturdu. 'Uzayda da çay demleriz!'");
  }
  if (megaProjects.includes("smart_city")) {
    add("TEKNOLOJİ: Akıllı Şehir projesi meyvelerini veriyor, çöp kutuları bile internete bağlı.");
  }

  // Yasalar
  let activeLaws: string[] = [];
  try { activeLaws = JSON.parse(state.activeLaws || "[]"); } catch { }

  if (activeLaws.includes("censorship")) {
    add("MEDYA: Ana haber bülteni yine 'Her Şey Harika' manşetiyle açıldı. Sansür tıkır tıkır işliyor.");
  }
  if (activeLaws.includes("open_borders")) {
    add("GÖÇMENLER: Açık sınır politikası nedeniyle sınır kapılarında izdiham yaşanıyor.");
  }

  // Bakan Yorumları (Kabine Dinamikleri)
  let activeMinisters: Record<string, string> = {};
  try { activeMinisters = JSON.parse(state.ministers || "{}"); } catch { }

  const ministerQuotes: string[] = [];

  // Ekonomi Bakanı
  if (activeMinisters.economy === "eco_socialist") {
    ministerQuotes.push("KABİNE (Ekonomi - Mox Bernie): 'Zenginin yatını batırıp, o parayla halka bedava tohum dağıtacağız. Merak etmeyin, bütçe eksiye düşse de gönlümüz zengin!'");
  } else if (activeMinisters.economy === "eco_capitalist") {
    ministerQuotes.push("KABİNE (Ekonomi - Ahmet Selim Arslantürk): 'Büyüme rakamları harika. Halkın mutsuzluğu mu? Serbest piyasa o problemi de çözer, yeter ki vergileri düşürelim.'");
  }

  // Savunma Bakanı
  if (activeMinisters.defense === "def_hawk") {
    ministerQuotes.push("KABİNE (Savunma - General Bard): 'Komşu ülkenin sınırda kuş uçurduğu tespit edildi. O kuşu füzeyle vurduk! Gerekirse bütçenin yarısını silaha yatırırız, barış zayıflıktır!'");
  } else if (activeMinisters.defense === "def_dove") {
    ministerQuotes.push("KABİNE (Savunma - Dr. Aris Thorne): 'Sorunları silahla değil, diyalogla çözeceğiz. Tankları satıp yerlerine barış güvercini heykeli dikiyoruz.'");
  }

  // İçişleri Bakanı
  if (activeMinisters.internal === "int_authoritarian") {
    ministerQuotes.push("KABİNE (İçişleri - Viktor Kael): 'Sokaklarda nizam sağlandı. Artık kimse itiraz etmiyor, çünkü itiraz etmeyi yasakladık. İstikrar her şeydir.'");
  } else if (activeMinisters.internal === "int_liberal") {
    ministerQuotes.push("KABİNE (İçişleri - Sarah Jenkins): 'İfade özgürlüğü tavan yaptı! Herkes istediğini söylüyor, gerçi sokaklar biraz karıştı ama olsun, özgürüz!'");
  }

  // Eğitim Bakanı
  if (activeMinisters.education === "edu_academic") {
    ministerQuotes.push("KABİNE (Eğitim - Prof. Dr. Ege Demirci): 'Gençler! Tik-tok yerine kuantum mekaniği videoları çekin! Yeni müfredatta beden eğitimi yerine uygulamalı astrofizik var, hadi bakalım!'");
  } else if (activeMinisters.education === "edu_vocational") {
    ministerQuotes.push("KABİNE (Eğitim - Usta Kemal): 'Okuyup ne olacaksınız? Memlekete tornacı lazım, kaynakçı lazım. Üniversiteleri kapatıp sanayiye çeviriyoruz.'");
  }

  // Çevre Bakanı
  if (activeMinisters.environment === "env_radical") {
    ministerQuotes.push("KABİNE (Çevre - Cemre Yeşil): 'Fabrika bacalarından duman mı çıkıyor? O fabrikayı kapatın! Bütçe umrumda değil, doğa anaya saygı duyacaksınız!'");
  } else if (activeMinisters.environment === "env_industrial") {
    ministerQuotes.push("KABİNE (Çevre - Sanayici Rıza): 'Ağaçlar oksijen üretiyorsa, biz daha çok üretiriz. O ormanı kesip oraya AVM yapalım, ülke kalkınsın yahu!'");
  }

  // Sağlık Bakanı
  if (activeMinisters.health === "hlt_social") {
    ministerQuotes.push("KABİNE (Sağlık - Zei Bernie): 'Tüm hastaneler bedava, ilaçlar devletten. Bütçe mi battı? Olsun, sağlıklı battık!'");
  } else if (activeMinisters.health === "hlt_private") {
    ministerQuotes.push("KABİNE (Sağlık - CEO Barkın): 'Hastaneleri 5 yıldızlı otel yaptık. Hastalar müşteri, hastalıklar ise fırsattır. Bütçe fazla veriyor, mükemmel!'");
  }

  // Dışişleri Bakanı
  if (activeMinisters.foreign === "for_globalist") {
    ministerQuotes.push("KABİNE (Dışişleri - Creed İpekci): 'Sınırlar kalkmalı, vizeler çöpe atılmalı. Global sermaye ülkemize akıyor, harika!'");
  } else if (activeMinisters.foreign === "for_nationalist") {
    ministerQuotes.push("KABİNE (Dışişleri - Ulrich Von Blitz): 'Dış mihraklar oyun oynuyor. Sınırları kapatın, kimseyle görüşmüyoruz. Biz bize yeteriz!'");
  }

  if (ministerQuotes.length > 0) {
    // Rastgele 1 veya 2 bakan yorumu ekle
    const shuffledQuotes = ministerQuotes.sort(() => 0.5 - Math.random());
    add(shuffledQuotes[0]);
    if (shuffledQuotes.length > 1 && Math.random() > 0.5) {
      add(shuffledQuotes[1]);
    }
  }

  // Yeni Bakan Yorumları
  if (activeMinisters.ai === "ai_luvi") {
    ministerQuotes.push("KABİNE (Yapay Zeka - Luvi Wright): 'Kodlara fısıldayan kadın olarak söylüyorum; eski usül bakanlıklara gerek yok. Siber altyapımız saat gibi işliyor, sadece birkaç işçiyi işten çıkardık.'");
  } else if (activeMinisters.ai === "ai_luddite") {
    ministerQuotes.push("KABİNE (Yapay Zeka - Dr. Aslı Data): 'Yapay zeka modellerinin fişini çekmeye ant içtim! Makineler insanlıktan üstün değildir. Mutluyuz ama bütçemiz biraz eksildi.'");
  }

  if (activeMinisters.social_media === "soc_viral") {
    ministerQuotes.push("KABİNE (Sosyal Medya - Berkecan Streamer): 'Yeni vergi paketini TikTok dansı eşliğinde açıkladık. 50 milyon izlendi, like'lara boğulduk!'");
  } else if (activeMinisters.social_media === "soc_censor") {
    ministerQuotes.push("KABİNE (Sosyal Medya - Güvenlikçi Turgut): 'Mizah amaçlı paylaşılan o kedi videosunda devlet otoritesini sarsıcı unsurlar tespit ettik, anında erişim engeli geldi.'");
  }

  if (activeMinisters.esports === "esp_gamer") {
    ministerQuotes.push("KABİNE (Espor - Emre 'Headshot' Kaya): 'Gençlik merkezlerindeki tüm PC'lere ekran kartı taktırdım! Eğitim düştü diyorlar, kardeşim asıl eğitim sunucuda hayatta kalmaktır.'");
  } else if (activeMinisters.esports === "esp_boomer") {
    ministerQuotes.push("KABİNE (Espor - Mürebbiye Hatice): 'Akşam 8'den sonra oyun oynamak yasak! Herkes doğa yürüyüşüne çıkacak, gözleri bozuldu çocukların!'");
  }

  // Rastgele genel magazin / espri
  const randomNewsPool = [
    "TEKNOLOJİ: Yerli otomobilin tekerleği nihayet icat edildi.",
    "MAGAZİN: Ünlü popçu, devlete olan vergi borcunu konser vererek ödemeyi teklif etti.",
    "SPOR: Milli takımımız, hiç gol atamadan 'centilmenlik' kontenjanından gruptan çıktı.",
    "BİLİM: Araştırmacılar, günde 10 saat oyun oynayan gençlerde 'Başkanlık' yeteneği keşfetti.",
    "SİBER GÜVENLİK: Bakanlık sistemlerine hack saldırısı yapıldı, şifrenin '123456' olduğu ortaya çıktı.",
    "YAPAY ZEKA: Devlet dairesinde işe başlayan AI, memurlarla birlikte çay molasına çıkmayı öğrendi.",
    "SOSYAL MEDYA: 'Devlet yıkılsa da canlı yayınım kesilmesin' diyen influencer gözaltına alındı.",
    "GÜNDEM: Sokakta röportaj veren dayı 'Çıkar telefonunu!' derken kendi telefonu akıllı çıkmayınca kaçtı.",
    "EKONOMİ (Mox Özel): 'Zenginin yatını batırma şenlikleri' için kayıtlar başladı, kontenjan sınırlı!",
    "SAVUNMA (Bard Özel): Ordu, düşman hatlarına barış güvercini yerine karga yollamaya karar verdi.",
    "TREND: Luvi Wright hayranları 'Silikon Vadisi Saç Modeli' için berberlerde kuyruk oluşturdu.",
    "TEKNOLOJİ: Sokak köpekleri çiple takip edilmek yerine, doğrudan kripto cüzdanı açmaya yönlendirildi.",
    "MAGAZİN: Bakanların kabine toplantısında gizlice 'Among Us' oynadığı iddiaları yalanlandı."
  ];

  // Haber sayısını tamamlamak için benzersiz (unique) rastgele haberler seç
  if (news.length < 5) {
    const needed = 5 - news.length;
    // Fisher-Yates shuffle
    const shuffledPool = [...randomNewsPool].sort(() => 0.5 - Math.random());
    for (let i = 0; i < Math.min(needed, shuffledPool.length); i++) {
      add(shuffledPool[i]);
    }
  }

  return news;
}
