// calculator/calculator.component.ts
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common'; // *ngIf ve *ngFor için gerekli
import { FormsModule } from '@angular/forms'; // [(ngModel)] için gerekli

@Component({
  selector: 'app-calculator',
  standalone: true, // Eğer standalone bir bileşen ise bu gerekli
  imports: [CommonModule, FormsModule], // Gerekli modülleri buraya ekledik
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
  display: string = '0';
  currentInput: string = '';
  operator: string | null = null;
  firstOperand: number | null = null;

  // 📌 İşlem geçmişi listesi
  history: { operation: string, result: string, time: string }[] = [];

  constructor() { }

  // 📌 KLAVYE OLAYLARINI DİNLEME HostListener ile
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;

    if (!isNaN(Number(key))) { // Sayılar (0-9)
      this.appendNumber(key);
      event.preventDefault(); // Varsayılan tarayıcı davranışını engelle
    } else if (key === '.' || key === ',') { // Ondalık nokta (hem nokta hem virgül kabul edilebilir)
      this.addDecimal();
      event.preventDefault();
    } else if (['+', '-', '*', '/'].includes(key)) { // Operatörler (+, -, *, /)
      this.setOperator(key);
      event.preventDefault();
    } else if (key === '%') { // Yüzde operatörü
      this.setOperator('%');
      event.preventDefault();
    } else if (key === 'Enter' || key === '=') { // Eşittir tuşu
      this.calculate();
      event.preventDefault();
    } else if (key === 'Backspace') { // Geri silme tuşu
      this.deleteLastChar();
      event.preventDefault();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') { // AC (All Clear) veya C tuşu
      this.clearDisplay();
      event.preventDefault();
    }
    // Diğer özel tuşlar için buraya if/else if ekleyebilirsiniz.
  }

  appendNumber(num: string) {
    if (this.display === 'Error') {
      this.clearDisplay();
    }

    if (this.operator !== null && this.currentInput === '' && num !== '.') {
        this.display = this.firstOperand?.toString() + ' ' + this.operator + ' ' + num;
        this.currentInput = num;
    } else if (this.currentInput === '0' && num !== '.') {
        this.currentInput = num;
        this.updateDisplay();
    } else {
        this.currentInput += num;
        this.updateDisplay();
    }
  }

  setOperator(op: string) {
    if (this.display === 'Error') {
        this.clearDisplay();
    }

    if (this.currentInput === '' && this.firstOperand === null && this.display !== '0') {
        this.firstOperand = parseFloat(this.display);
        this.operator = op;
        this.updateDisplay();
        this.currentInput = '';
        return;
    }

    if (this.currentInput === '' && this.firstOperand !== null) {
      this.operator = op;
      this.updateDisplay();
      return;
    }

    if (this.firstOperand === null) {
      this.firstOperand = parseFloat(this.currentInput);
    } else if (this.operator) {
      this.calculate();
      this.firstOperand = parseFloat(this.display);
    }

    this.operator = op;
    this.currentInput = '';
    this.updateDisplay();
  }

  calculate() {
    if (this.firstOperand === null || this.operator === null) {
      if (this.currentInput !== '') {
        this.display = this.currentInput;
        this.resetCalculator();
        return;
      }
      return;
    }

    const secondOperand = parseFloat(this.currentInput || this.display);
    let result: number;
    const operationText = `${this.firstOperand} ${this.operator} ${secondOperand}`;


    switch (this.operator) {
      case '+':
        result = this.firstOperand + secondOperand;
        break;
      case '-':
        result = this.firstOperand - secondOperand;
        break;
      case '*':
        result = this.firstOperand * secondOperand;
        break;
      case '/':
        if (secondOperand === 0) {
          this.display = 'Error';
          this.resetCalculator();
          return;
        }
        result = this.firstOperand / secondOperand;
        break;
      case '%':
        result = this.firstOperand * (secondOperand / 100);
        break;
      default:
        this.display = 'Error';
        this.resetCalculator();
        return;
    }

    this.display = result.toString();
    this.firstOperand = result;
    this.operator = null;
    this.currentInput = this.display;

    const now = new Date();
    const timeString = now.toLocaleTimeString('tr-TR') + ' - ' + now.toLocaleDateString('tr-TR');

    this.history.unshift({
      operation: operationText,
      result: result.toString(),
      time: timeString
    });

    if (this.history.length > 20) {
      this.history.pop();
    }
  }

  clearDisplay() {
    this.display = '0';
    this.currentInput = '';
    this.operator = null;
    this.firstOperand = null;
  }

  deleteLastChar() {
    if (this.display === 'Error') {
      this.clearDisplay();
      return;
    }

    if (this.currentInput.length > 0) {
      this.currentInput = this.currentInput.slice(0, -1);
      if (this.currentInput === '') {
        if (this.operator && this.firstOperand !== null) {
          this.display = `${this.firstOperand} ${this.operator}`;
        } else {
          this.display = '0';
        }
      } else {
        this.updateDisplay();
      }
    } else if (this.operator !== null) {
      this.operator = null;
      this.display = this.firstOperand?.toString() || '0';
    } else if (this.firstOperand !== null) {
      let tempFirstOperandStr = this.firstOperand.toString();
      if (tempFirstOperandStr.length > 1) {
        this.firstOperand = parseFloat(tempFirstOperandStr.slice(0, -1));
        this.currentInput = this.firstOperand.toString();
        this.display = this.firstOperand.toString();
      } else {
        this.clearDisplay();
      }
    } else {
      this.clearDisplay();
    }
  }

  addDecimal() {
    if (this.display === 'Error') {
      this.clearDisplay();
    }

    if (!this.currentInput.includes('.')) {
      if (this.currentInput === '') {
        this.currentInput = '0.';
      } else {
        this.currentInput += '.';
      }
      this.updateDisplay();
    }
  }

  toggleSign() {
    if (this.display === 'Error') {
      this.clearDisplay();
      return;
    }

    if (this.currentInput !== '') {
      const num = parseFloat(this.currentInput);
      this.currentInput = (num * -1).toString();
      this.updateDisplay();
    } else if (this.firstOperand !== null && this.operator === null) {
      this.firstOperand = this.firstOperand * -1;
      this.display = this.firstOperand.toString();
      this.currentInput = this.display;
    }
  }

  private updateDisplay() {
    if (this.firstOperand !== null && this.operator !== null && this.currentInput !== '') {
      this.display = `${this.firstOperand} ${this.operator} ${this.currentInput}`;
    } else if (this.firstOperand !== null && this.operator !== null) {
      this.display = `${this.firstOperand} ${this.operator}`;
    } else {
      this.display = this.currentInput || '0';
    }
  }

  private resetCalculator() {
    this.currentInput = '';
    this.operator = null;
    this.firstOperand = null;
  }

  clearHistory() {
    this.history = [];
  }

  trackByHistory(index: number, item: { operation: string, result: string, time: string }): string {
    return item.time + item.operation + index;
  }

  // Yeni butonlar için alert fonksiyonu (eğer HTML'de kullanıyorsanız)
  alert(message: string) {
    window.alert(message);
  }
}