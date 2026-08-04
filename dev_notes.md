# Utopia - Geliştirme Durumu (Handover Notes)

## Proje Hakkında
Utopia, Next.js tabanlı, veritabanı olarak Prisma & SQLite kullanan bir strateji/diplomasi oyunudur. Oyun motoru (`game-engine.ts`), ülke seçimi, bütçe yönetimi, krizler ve diplomasi gibi mekanikleri barındırmaktadır.

## Mevcut Durum
- Projenin ilk sürümü GitHub'a başarıyla yüklendi.
- `dev.db` yerel veritabanı aktif olarak projede yer alıyor.
- Çevresel değişkenler için `.env.example` oluşturuldu.

## Yeni Bilgisayarda Kurulum Adımları
Projeyi indirdikten (clone) sonra şu adımlar uygulanmalıdır:
1. `npm install` (Bağımlılıkların yüklenmesi)
2. `.env.example` dosyasının adının `.env` olarak değiştirilmesi.
3. `npx prisma generate` (Prisma istemcisinin oluşturulması)
4. `npm run dev` (Geliştirme sunucusunun başlatılması)

## Sonraki Geliştirme Hedefleri
*Antigravity ile bir sonraki oturumda yapılabilecek geliştirmeler:*
- Oyun motorundaki (`game-engine.ts`) kaynak yönetimi, tur atlama ve diplomasi mantığının iyileştirilmesi.
- UI (Kullanıcı Arayüzü) tarafında `CountrySelect.tsx` vb. bileşenlerin tasarımının daha modern hale getirilmesi.
- Yeni `events` (olaylar), krizler ve bakanların yeteneklerinin sisteme entegre edilmesi.

> **Antigravity (Yapay Zeka) İçin Not:** Bu dosyayı okuyorsan, geliştirici projeyi yeni bir bilgisayara/ortama taşımış demektir. Yukarıdaki durum özetini baz alarak geliştiriciye nasıl yardımcı olabileceğini sor ve kodlamaya kaldığınız yerden devam et.
