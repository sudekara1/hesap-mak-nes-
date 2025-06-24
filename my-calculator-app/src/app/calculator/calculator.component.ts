import { Component } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
  display: string = '0'; 
  currentInput: string = '';
  operator: string | null = null;
  firstOperand: number | null = null;

  constructor() { }

  
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
    
      if (this.currentInput === '') {
        this.display = this.firstOperand?.toString() || '0';
        this.currentInput = this.display;
        this.operator = null;
        this.firstOperand = null;
        return;
      }
      return;
    }

    const secondOperand = parseFloat(this.currentInput);
    let result: number;

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
      default:
        return;
    }

    this.display = result.toString();
    this.firstOperand = result; 
    this.operator = null; 
    this.currentInput = this.display; 
  }

  clearDisplay() {
    this.display = '0';
    this.currentInput = '';
    this.operator = null;
    this.firstOperand = null;
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
    if (this.firstOperand !== null && this.operator !== null) {
      this.display = `${this.firstOperand} ${this.operator} ${this.currentInput}`;
    } else {
      this.display = this.currentInput || '0'; 
    }
  }

  private resetCalculator() {
    this.currentInput = '';
    this.operator = null;
    this.firstOperand = null;
  }
}