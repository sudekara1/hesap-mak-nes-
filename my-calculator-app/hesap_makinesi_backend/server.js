// calculator.js (Hesap makinenin frontend JavaScript dosyası)

// Backend sunucunun adresi
const BACKEND_URL = 'http://localhost:3000/api/calculate'; // Kendi port numaranı kullan

async function performCalculation() {
    // Hesap makinesinin ekranındaki veya belleğindeki sayıları ve operatörü al
    const num1 = parseFloat(document.getElementById('display').dataset.firstNumber); // Örnek, kendi yapına göre ayarla
    const operator = document.getElementById('display').dataset.operator; // Örnek
    const num2 = parseFloat(document.getElementById('display').innerText); // Örnek

    if (isNaN(num1) || isNaN(num2) || !operator) {
        alert("Lütfen geçerli bir işlem girin.");
        return;
    }

    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                num1: num1,
                operator: operator,
                num2: num2
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API hatası: ${errorData.error || response.statusText}`);
        }

        const data = await response.json();
        // API'dan gelen sonucu hesap makinesinin ekranına yaz
        // Bu kısım, harici API'dan dönen JSON yapısına göre değişir.
        // Örneğin, API'ın 'result' adında bir alan döndürdüğünü varsayalım.
        document.getElementById('display').innerText = data.result;

    } catch (error) {
        console.error("Hesaplama sırasında bir hata oluştu:", error);
        document.getElementById('display').innerText = "Hata!"; // Kullanıcıya hata göster
        alert(`Hesaplama hatası: ${error.message}`);
    }
}

// Örneğin, "=" tuşuna tıklandığında bu fonksiyonu çağırabilirsin
// document.getElementById('equals-button').addEventListener('click', performCalculation);