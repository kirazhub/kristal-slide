// ==========================================================
// ARAYÜZ YÖNETİCİSİ — Ekranlar, modallar, geçişler
// ==========================================================

class ArayuzYoneticisi {
  constructor() {
    this.aktifEkran = null;
    this.oyun = null;
  }

  ekranAc(ad) {
    document.querySelectorAll('.ekran').forEach(e => e.classList.remove('aktif'));
    const el = document.getElementById(ad + 'Ekrani');
    if (el) {
      el.classList.add('aktif');
      this.aktifEkran = ad;
      window.scrollTo(0, 0);
    }
  }

  // ==========================================================
  // GİRİŞ EKRANI
  // ==========================================================
  girisGoster() {
    this.ekranAc('giris');
    this.girisIstatistikleriGuncelle();
  }

  girisIstatistikleriGuncelle() {
    const kayit = window.KayitSistemi.yukle();
    const tamamlanan = Object.values(kayit.bolumYildizlari).filter(y => y > 0).length;
    const toplamYildiz = Object.values(kayit.bolumYildizlari).reduce((a, b) => a + b, 0);

    const elBolum = document.getElementById('girisBolumSayac');
    const elYildiz = document.getElementById('girisYildizSayac');
    const elAltin = document.getElementById('girisAltinSayac');
    if (elBolum) elBolum.textContent = tamamlanan;
    if (elYildiz) elYildiz.textContent = toplamYildiz;
    if (elAltin) elAltin.textContent = kayit.altin;
  }

  // ==========================================================
  // HARİTA EKRANI
  // ==========================================================
  haritaGoster() {
    this.ekranAc('harita');
    this.haritaDoldur();
  }

  haritaDoldur() {
    const kayit = window.KayitSistemi.yukle();
    const liste = document.getElementById('haritaListe');
    if (!liste) return;

    liste.innerHTML = '';
    window.BOLUMLER.forEach((bolum, idx) => {
      const no = idx + 1;
      const kart = document.createElement('div');
      kart.className = 'bolum-kart';

      const yildiz = kayit.bolumYildizlari[no] || 0;
      const kilitli = no > kayit.enYuksekBolum;
      const aktif = no === kayit.enYuksekBolum && yildiz === 0;

      if (kilitli) {
        kart.classList.add('kilitli');
      } else if (yildiz > 0) {
        kart.classList.add('tamamlandı');
      }
      if (aktif) kart.classList.add('aktif');

      if (kilitli) {
        kart.innerHTML = `<div class="bolum-kilit">🔒</div><div class="bolum-numara">${no}</div>`;
      } else {
        const yIşaretler = [1,2,3].map(i => `<span class="y ${i <= yildiz ? '' : 'bos'}">⭐</span>`).join('');
        kart.innerHTML = `
          <div class="bolum-numara">${no}</div>
          <div class="bolum-yildizlari">${yIşaretler}</div>
        `;
      }

      kart.addEventListener('click', () => {
        if (kilitli) {
          window.Ses?.sesHatali();
          return;
        }
        window.Ses?.sesTik();
        this.bolumBaslat(no);
      });

      liste.appendChild(kart);
    });

    // Altın güncelle
    const elAltin = document.getElementById('haritaAltin');
    if (elAltin) elAltin.textContent = kayit.altin;
  }

  // ==========================================================
  // OYUN EKRANI
  // ==========================================================
  bolumBaslat(bolumNo) {
    this.ekranAc('oyun');
    if (!this.oyun) {
      this.oyun = new window.Oyun();
      this.oyunDokunmaBagla();
    }
    this.oyun.baslat(bolumNo);
  }

  oyunDokunmaBagla() {
    const tahta = document.getElementById('tahta');
    if (!tahta) return;

    // Touch (mobil)
    tahta.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      const hedef = document.elementFromPoint(t.clientX, t.clientY);
      const hucre = hedef?.closest('.hucre');
      if (!hucre) return;
      const s = parseInt(hucre.dataset.s);
      const st = parseInt(hucre.dataset.st);
      this.oyun.dokunBaslangic(e, s, st);
    }, { passive: false });

    tahta.addEventListener('touchmove', (e) => this.oyun.dokunHareket(e), { passive: false });
    tahta.addEventListener('touchend', (e) => this.oyun.dokunBitis(e));

    // Mouse (masaüstü test)
    tahta.addEventListener('mousedown', (e) => {
      const hedef = document.elementFromPoint(e.clientX, e.clientY);
      const hucre = hedef?.closest('.hucre');
      if (!hucre) return;
      const s = parseInt(hucre.dataset.s);
      const st = parseInt(hucre.dataset.st);
      this.oyun.dokunBaslangic(e, s, st);
    });

    document.addEventListener('mousemove', (e) => {
      if (this.oyun?.dokunusBas) this.oyun.dokunHareket(e);
    });

    document.addEventListener('mouseup', (e) => {
      if (this.oyun?.dokunusBas) this.oyun.dokunBitis(e);
    });
  }

  // ==========================================================
  // MODALLAR — kazandı, kaybetti
  // ==========================================================
  kazandiGoster(bolumNo, yildiz, altin, puan) {
    const modal = document.getElementById('kazandiModal');
    const tum100 = window.BOLUMLER.length;
    const sonBolum = bolumNo >= tum100;

    document.getElementById('kazandiBolumNo').textContent = bolumNo;
    document.getElementById('kazandiPuan').textContent = puan.toLocaleString('tr-TR');
    document.getElementById('kazandiAltin').textContent = altin;

    // Yıldızları çiz
    const yEl = document.getElementById('kazandiYildizlar');
    yEl.innerHTML = [1,2,3].map(i => `<span class="yildiz ${i <= yildiz ? '' : 'bos'}" style="animation: yildiz-patla 0.5s ${i * 0.2}s both ease-out cubic-bezier(0.34, 1.56, 0.64, 1);">⭐</span>`).join('');

    // Son bölümse özel mesaj
    const sonrakiBtn = document.getElementById('kazandiSonrakiBtn');
    if (sonBolum) {
      sonrakiBtn.style.display = 'none';
    } else {
      sonrakiBtn.style.display = '';
      sonrakiBtn.onclick = () => {
        window.Ses?.sesTik();
        modal.classList.remove('aktif');
        this.bolumBaslat(bolumNo + 1);
      };
    }

    modal.classList.add('aktif');
  }

  kaybetGoster(bolumNo) {
    const modal = document.getElementById('kaybetModal');
    document.getElementById('kaybetBolumNo').textContent = bolumNo;
    modal.classList.add('aktif');
  }

  modalKapat(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('aktif');
  }
}

window.Arayuz = new ArayuzYoneticisi();
