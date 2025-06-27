const express = require('express');
const cors = require('cors'); // CORS'u etkinleştirir, tarayıcı güvenlik politikası için önemli
const app = express();
const port = 4200; // Arka ucunuzun bu portta çalışacağını belirtir

// CORS'u tüm isteklere uygulamak için ekleyin.
// Eğer spesifik bir ön uç URL'niz varsa, cors({ origin: 'http://localhost:8080' }) gibi
// daha spesifik bir ayar yapabilirsiniz. Şimdilik * tüm kaynaklardan gelen isteklere izin verir.
app.use(cors());

// Gelen JSON istek gövdelerini ayrıştırmak için Express middleware'i.
// Ön uçtan JSON olarak gönderilen verileri okuyabilmek için gereklidir.
app.use(express.json());

// Hesaplama mantığını içeren fonksiyon
async function hesaplamaYap(islem, sayi1, sayi2) {
    let sonuc;
    switch (islem) {
        case '+':
            sonuc = sayi1 + sayi2;
            break;
        case '-':
            sonuc = sayi1 - sayi2;
            break;
        case '*':
            sonuc = sayi1 * sayi2;
            break;
        case '/':
            if (sayi2 === 0) {
                // Sıfıra bölme hatasını döndür
                return { error: "Sıfıra bölme hatası!" };
            }
            sonuc = sayi1 / sayi2;
            break;
        default:
            // Geçersiz işlem hatasını döndür
            return { error: "Geçersiz işlem! (+, -, *, /) kullanın." };
    }
    // Başarılıysa sonucu döndür
    return { result: sonuc };
}

// API Uç Noktası: /calculate adresine POST isteklerini dinler
app.post('/calculate', async (req, res) => {
    // İstek gövdesinden verileri alın (ön uçtan gönderilen sayi1, sayi2, islem)
    const { sayi1, sayi2, islem } = req.body;

    // Gelen verilerin geçerliliğini kontrol edin
    if (typeof sayi1 !== 'number' || typeof sayi2 !== 'number' || typeof islem !== 'string') {
        return res.status(400).json({ error: "Geçersiz giriş. Sayılar ve işlem türü bekleniyor." });
    }

    // Hesaplama fonksiyonunu çağırın
    const calculationResult = await hesaplamaYap(islem, sayi1, sayi2);

    // Hesaplama sonucunu kontrol edin ve yanıt gönderin
    if (calculationResult.error) {
        // Hata varsa 400 (Bad Request) status kodu ile hata mesajını gönder
        return res.status(400).json({ error: calculationResult.error });
    } else {
        // Başarılıysa 200 (OK) status kodu ile sonucu gönder
        return res.status(200).json({ result: calculationResult.result });
    }
});

// Sunucuyu belirtilen portta başlat
app.listen(port, () => {
    console.log(`API Destekli Hesap Makinesi sunucusu http://localhost:${4200} adresinde çalışıyor.`);
    console.log(`Hesaplama için POST istekleri http://localhost:${4200}/calculate adresine gönderilebilir.`);
});

// Artık komut satırı etkileşimi için kullanılan readline kısmı kaldırılmıştır.
// require('dotenv').config(); // Eğer .env dosyanız varsa bu satırı tutabilirsiniz
// Diğer readline ve konsol çıktıları kaldırıldı çünkü bu bir web sunucusu.

