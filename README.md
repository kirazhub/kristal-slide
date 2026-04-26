# 💎 Kristal Krallığı

Candy Crush tarzı **3D kristal eşleştirme** mobil oyunu. iPhone + Android uyumlu PWA, 100 bölüm macera.

**🎮 Hemen Oyna:** **https://kirazhub.github.io/kristal-slide/**

![Aktif](https://img.shields.io/badge/durum-aktif-brightgreen) ![Mobil](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-blue) ![PWA](https://img.shields.io/badge/PWA-yes-purple)

---

## 📱 Nasıl Oynanır

### Mobil (iPhone / Android):
1. Telefondan yukarıdaki linke gir
2. **Safari** (iPhone) veya **Chrome** (Android):
   - iPhone: Paylaş → "Ana Ekrana Ekle"
   - Android: "Uygulamayı Yükle" bildirimine bas
3. Ana ekranda ikon belirir → **uygulama gibi** açılır
4. Internet yoksa bile çalışır (offline)

### Oyun Mantığı:
- **Parmakla kaydırarak** kristalleri değiştir
- 3+ aynı kristal yan yana/alt alta → patlar
- Her bölümün **farklı hedefi** var (TOPLA / PUAN / COMBO)
- 1-2-3 yıldız kazanabilirsin
- Biriken altınlarla güçler açılır

---

## 💎 6 Farklı Kristal

Hepsi Leonardo.ai ile üretilmiş **3D görünümlü, kendi renginde halesi olan** görseller:

| Şekil | Kristal | Renk |
|:---:|:---|:---|
| Yuvarlak | Elmas | Beyaz + pembe hale |
| Kalp | Yakut | Kırmızı + kırmızı hale |
| Üçgen | Zümrüt | Yeşil + yeşil hale |
| Kare | Safir | Mavi + mavi hale |
| Yıldız | Ametist | Mor + mor hale |
| Damla | Amber | Turuncu + altın hale |

---

## ✨ Özellikler

### 🎮 Oynanış
- **100 bölüm** — hardcore zorluk eğrisi
- **3 hedef tipi**: Belirli kristalden X tane topla / N puan yap / Süper combo yap
- **Yıldız sistemi** (1-2-3 yıldız)
- **Zincirleme combolar** (x2 GÜZEL, x3 SÜPER, x4 HARİKA, x5 EFSANE)
- **Özel güçler**: Çekiç, Karıştır, Bomba

### 📱 Mobil Kontrol
- **Parmak kaydırma (swipe)** — doğal mobil kontrolü
- **Tıklama** da çalışır (masaüstü için)
- **Titreşim** (patlama + combo + zafer)

### 🎵 Ses
- Web Audio API ile synthesize edilmiş sesler (harici dosya yok)
- Patlama, combo, zafer, kayıp sesleri
- Hafif arka plan müziği
- Ayarlardan açma/kapama

### 💾 Kayıt
- LocalStorage ile otomatik kayıt
- Açtığın bölümler, yıldızlar, altınlar, ayarlar
- Sıfırlama seçeneği

### 🌐 PWA (Progressive Web App)
- **Ana ekrana ekle** → uygulama gibi çalışır
- **Offline mod** → internet yoksa bile oyna
- **Tam ekran** → tarayıcı çubuğu görünmez
- **iOS + Android** uyumlu

---

## 🛠️ Teknolojiler

- **Vanilla JS** — hiçbir framework yok, ultra hafif
- **CSS3** — animasyonlar, gradyanlar, blur efektleri
- **Web Audio API** — synthesize edilmiş sesler
- **Service Worker** — offline destek
- **Leonardo.ai FLUX Dev** — tüm görseller AI ile üretildi
- **Capacitor** — Android/iOS native app derleme hazırlığı

---

## 📁 Proje Yapısı

```
KristalKralligi/
├── index.html              # Ana giriş noktası
├── css/
│   ├── ana.css             # Ortak stiller
│   ├── ekranlar.css        # Giriş + harita
│   └── oyun.css            # Oyun ekranı
├── js/
│   ├── kayit.js            # LocalStorage
│   ├── ses.js              # Web Audio
│   ├── oyun.js             # Oyun motoru
│   └── arayuz.js           # Ekran yönetimi
├── data/
│   └── bolumler.js         # 100 bölüm verisi
├── public/
│   ├── assets/             # 6 kristal PNG
│   └── ui/                 # Logo, kutular, güç ikonları
├── scripts/
│   ├── gorsel-uret.mjs     # Leonardo API kristal üretici
│   ├── ui-uret.mjs         # Leonardo API UI üretici
│   └── beyaz-seffaflastir.mjs  # Arka plan şeffaflaştırıcı
├── sw.js                   # Service Worker (offline)
├── manifest.json           # PWA manifest
├── capacitor.config.json   # Mobil app config
├── android/                # Native Android projesi (git'te yok)
├── ios/                    # Native iOS projesi (git'te yok)
└── MOBIL-REHBER.md         # Mobil uygulama derleme rehberi
```

---

## 🚀 Kurulum

### Sadece Oynamak İstiyorsan:
Hiçbir şey kurmana gerek yok. Linke gir: **https://kirazhub.github.io/kristal-slide/**

### Yerel Geliştirme:
```bash
git clone https://github.com/kirazhub/kristal-slide.git
cd kristal-slide
python3 -m http.server 8000
open http://localhost:8000
```

### AI Görsel Üretimi:
```bash
cp .env.example .env
# .env dosyasını Leonardo API anahtarınla doldur

node scripts/gorsel-uret.mjs          # Tüm kristalleri yeniden üret
node scripts/ui-uret.mjs              # UI elemanlarını yeniden üret
node scripts/beyaz-seffaflastir.mjs   # Beyaz arka planları şeffaflaştır
```

### Native App (Android/iOS):
`MOBIL-REHBER.md` dosyasına bak.

---

## 📝 Lisans

MIT. Kullan, değiştir, paylaş.

---

Made with 💜 by [kirazhub](https://github.com/kirazhub)
