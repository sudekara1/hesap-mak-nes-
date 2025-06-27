import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' 
})
export class CalculateService {

  constructor() {}

  /**
   * Verilen matematiksel ifadeyi değerlendirir ve sonucu döndürür.
   * Güvenli olmayan karakterler filtrelenir.
   *
   * @param expression Kullanıcıdan gelen matematiksel ifade
   * @returns Sayı sonucu (number) veya hata mesajı (string)
   */
  calculateResult(expression: string): number | string {
    // Sadece geçerli karakterlere izin ver (rakamlar, parantez, işleçler, nokta)
    const safeExpression = expression.replace(/[^0-9+\-*/().]/g, '');

    if (!safeExpression || safeExpression.trim() === '') {
      return 'Geçersiz İfade';
    }

    try {
      
      const result = new Function('return ' + safeExpression)();

      
      if (typeof result === 'number' && isFinite(result)) {
        return result;
      } else {
        return 'Hata';
      }
    } catch (error) {
      return 'Geçersiz İfade';
    }
  }

  
  add(num1: number, num2: number): number {
    return num1 + num2;
  }

  
  subtract(num1: number, num2: number): number {
    return num1 - num2;
  }

  
  multiply(num1: number, num2: number): number {
    return num1 * num2;
  }

  divide(num1: number, num2: number): number | string {
    if (num2 === 0) {
      return 'Sıfıra Bölünemez';
    }
    return num1 / num2;
  }
}