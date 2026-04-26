# 💎 Kristal Krallığı (Crystal Kingdom)

Tarayıcıda oynanan, Candy Crush tarzı **3D görünümlü kristal eşleştirme oyunu**. AI üretimi (Leonardo.ai) görseller kullanır.

![Oyun durumu: aktif geliştirme](https://img.shields.io/badge/durum-aktif-brightgreen) ![Lisans: MIT](https://img.shields.io/badge/lisans-MIT-blue)

---

## 🎮 Nasıl Oynanır

1. `index.html` dosyasını **çift tıkla** → tarayıcıda açılır
2. Komşu iki kristale sırayla tıkla → yer değişirler
3. 3 veya daha fazla aynı kristal yan yana/alt alta gelirse patlarlar
4. Patlatılan her kristal 10 altın getirir, zincirleme combolar çarpanla çarpılır
5. 30 **elmas** topla → bölüm tamamlanır

---

## 💎 Kristaller

| Şekil | Kristal | Renk |
|:---:|:---|:---|
| Yuvarlak | Elmas | Beyaz-gümüş + pembe hale |
| Kalp | Yakut | Kırmızı + kırmızı hale |
| Üçgen | Zümrüt | Yeşil + yeşil hale |
| Kare | Safir | Mavi + mavi hale |
| Yıldız | Ametist | Mor + mor hale |
| Damla | Amber | Turuncu + altın hale |

---

## 🛠️ Teknolojiler

- **Vanilla HTML + CSS + JavaScript** — hiçbir framework yok, tarayıcıda direkt açılır
- **Leonardo.ai FLUX Dev** — tüm kristaller, UI çerçeveleri, logo AI ile üretildi
- **Saf JS PNG parser** — arka plan şeffaflaştırma (zlib ile, harici paket yok)
- **Google Fonts** — Fredoka (gövde) + Luckiest Guy (fantastik başlıklar)

---

## 📁 Proje Yapısı

```
KristalKralligi/
├── index.html              # Oyun — tek dosya, direkt açılır
├── sekiller.js             # Kristal görselleri haritalaması
├── public/
│   ├── assets/             # 6 kristal PNG (Leonardo ile üretilmiş)
│   └── ui/                 # Logo, kutular, güç ikonları
├── scripts/
│   ├── gorsel-uret.mjs     # Leonardo API ile kristal üretir
│   ├── ui-uret.mjs         # Leonardo API ile UI elemanları üretir
│   └── beyaz-seffaflastir.mjs  # Arka planı otomatik şeffaf yapar
├── docs/
│   └── specs/              # Tasarım belgeleri
└── .env.example            # API anahtarı şablonu
```

---

## 🤖 AI Görsel Üretimi

Oyundaki tüm görseller Leonardo.ai REST API ile üretildi:

```bash
# Tüm 6 kristali yeniden üret
node scripts/gorsel-uret.mjs

# Sadece bir kristali yenile (örn: yakut)
node scripts/gorsel-uret.mjs kurabiye

# UI elemanlarını üret
node scripts/ui-uret.mjs

# Üretilen görsellerin beyaz arka planını otomatik şeffaflaştır
node scripts/beyaz-seffaflastir.mjs         # assets klasörü
node scripts/beyaz-seffaflastir.mjs ui      # ui klasörü
```

### Kurulum

```bash
# 1. Projeyi klonla
git clone https://github.com/kirazhub/kristal-krallligi.git
cd kristal-krallligi

# 2. Leonardo.ai API anahtarı al (https://app.leonardo.ai/api-access)
cp .env.example .env
# .env dosyasını açıp LEONARDO_API_KEY'i doldur

# 3. Oyunu aç
open index.html
```

Görsel üretmek istemezsen adım 2'yi atla — hazır görseller `public/` klasöründe.

---

## ✨ Özellikler

### Oyun Mekaniği
- [x] 8x8 match-3 tahta (komşu takası)
- [x] Otomatik eşleşme algılama (yatay + dikey, 3+ kristal)
- [x] Zincirleme patlama + combo çarpanı (x2, x3, x4, x5)
- [x] Yerçekimi (patlayanlar aşağı kayar, yenileri yukarıdan doğar)
- [x] Geçersiz hamle geri alma

### Görsel
- [x] AI üretimi 3D kristaller (Leonardo.ai)
- [x] Her kristal için özgün şekil + renk halesi
- [x] Canlı mor-lacivert gradyan arka plan (dalgalanan)
- [x] Yağan parçacıklar (kalpler, yıldızlar)
- [x] Altın çerçeveli oyun tahtası
- [x] Patlama efektleri (renkli parçacık saçılımı)
- [x] Combo popup animasyonları ("GÜZEL!", "SÜPER!", "EFSANE!")
- [x] x3+ combo'da ekran sarsıntısı
- [x] Fantastik AI UI (logo, hedef panosu, güç ikonları)

### Yakında Eklenecek
- [ ] Güç butonlarının aktif çalışması (çekiç, karıştır, bomba)
- [ ] Çoklu bölüm sistemi (harita görünümü)
- [ ] LocalStorage ile ilerleme kaydı
- [ ] Ses efektleri ve müzik
- [ ] Pastane/dükkan ekranı (altınla alışveriş)
- [ ] Seviye/XP sistemi
- [ ] Mobile app (Capacitor ile Android/iOS)

---

## 🎨 Özelleştirme

Kristallerin görünümünü değiştirmek istersen:

1. `scripts/gorsel-uret.mjs` dosyasını aç
2. İstediğin kristalin `prompt` değerini değiştir (İngilizce metin)
3. `node scripts/gorsel-uret.mjs <isim>` komutunu çalıştır
4. `node scripts/beyaz-seffaflastir.mjs` ile şeffaflaştır
5. Tarayıcıda Cmd+R ile yenile

---

## 📝 Lisans

MIT. Kullan, değiştir, paylaş. Kristaller AI üretimi olduğu için Leonardo.ai kullanım şartlarına tabidir.

---

Made with 💜 by [kirazhub](https://github.com/kirazhub)
