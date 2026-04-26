# 📱 Mobil Uygulama Derleme Rehberi

Oyunun **native iOS ve Android uygulaması olarak derlenmeye hazır**. İki seçeneğin var:

---

## 🚀 SEÇENEK 1: PWA Bu Haliyle Kullan (Hiçbir Şey Kurmana Gerek Yok)

Bu zaten aktif. Telefonundan:

### iPhone için:
1. Safari'de `https://kirazhub.github.io/kristal-slide/` adresini aç
2. Alt çubuktaki **Paylaş** butonuna (kare + ok) bas
3. **"Ana Ekrana Ekle"** seç
4. Artık ikonuyla ana ekrandan **uygulama gibi** açılır
5. Tarayıcı çubuğu görünmez, tam ekran açılır, offline çalışır

### Android için:
1. Chrome'da `https://kirazhub.github.io/kristal-slide/` adresini aç
2. Chrome sağ üstte "Uygulamayı Yükle" bildirimi verecek → bas
3. (Bildirim gelmezse: 3 nokta menüsünden "Ana ekrana ekle")

**Bu seçenek %99 oyuncuya yeterli.** App Store/Play Store gerekmez, para gerekmez.

---

## 🏪 SEÇENEK 2: Gerçek Native App (App Store / Play Store için)

Capacitor native projeleri zaten hazır: `android/` ve `ios/` klasörleri.

### Android APK için (en kolay):

**Adım 1: Android Studio kur**
- https://developer.android.com/studio adresinden indir (~1GB)
- Kurulum sihirbazını takip et (varsayılan ayarlarla)

**Adım 2: Projeyi aç**
```bash
cd /Users/kiraz/Desktop/PastaSefi
npx cap open android
```
Android Studio otomatik açılır. İlk kez açılınca bağımlılıkları indirir (~10 dk).

**Adım 3: APK oluştur**
- Menü: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
- Bitince "Locate" linkine bas
- `app-debug.apk` dosyasını telefona gönder → yükle

### iOS için (daha karmaşık):

1. **Xcode gerekli** (Mac App Store'dan ücretsiz, ~8GB)
2. **Apple Developer hesabı gerekli** (App Store için $99/yıl)
3. Komut:
   ```bash
   npx cap open ios
   ```
4. Xcode'da kendi telefonunu seç, ▶️ (Run) düğmesine bas

---

## 💡 EN KOLAY ALTERNATİF: PWABuilder

Hiç kurulum yapmak istemezsen:
1. https://www.pwabuilder.com/ adresine git
2. `https://kirazhub.github.io/kristal-slide/` URL'sini yapıştır
3. "Package For Stores" → Android seç
4. APK dosyasını indir
5. Play Store'a yükle (veya doğrudan telefonuna at)

---

## 🔄 Oyunu Güncelledikten Sonra

Web'de bir şey değiştirince mobil uygulamaya yansıtmak için:

```bash
cd /Users/kiraz/Desktop/PastaSefi
# 1. www klasörünü güncelle
cp -r index.html manifest.json sw.js css js data public sekiller.js www/

# 2. Native projeye kopyala
npx cap sync

# 3. APK'yı yeniden derle (Android Studio'da)
```

---

## 📊 Proje Yapısı

```
PastaSefi/
├── index.html, css/, js/, data/, public/   ← Web kaynak kodu
├── www/                                     ← Capacitor için kopya
├── android/                                 ← Native Android projesi
├── ios/                                     ← Native iOS projesi
├── capacitor.config.json                    ← Capacitor yapılandırması
└── package.json                             ← Node bağımlılıkları
```
