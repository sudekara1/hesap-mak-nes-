import { Component, OnInit, HostListener } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { CalculateService } from '../services/calculate/calculate.service';
import { HistoryService } from '../services/history/history.service';
import { ButtonComponent } from '../shared/button/button.component';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent], 
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit { 

  display: string = '0'; 
  currentOperation: string = ''; 
  lastResult: number | string = 0; 

  
  constructor(
    private calculateService: CalculateService,
    private historyService: HistoryService
  ) {}

  ngOnInit(): void {
  
  }

  
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key; 

    
    if (/[0-9]/.test(key)) {
      this.onButtonClick(key);
      event.preventDefault(); 
    }
  
    else if (['+', '-', '*', '/'].includes(key)) {
      this.onOperatorClick(key);
      event.preventDefault();
    }
    
    else if (key === '.') {
      this.onButtonClick('.');
      event.preventDefault();
    }
   
    else if (key === 'Enter') {
      this.calculate();
      event.preventDefault();
    }
  
    else if (key === 'Escape' || key === 'Backspace') {
      this.clear();
      event.preventDefault();
    }
  }

 
  onButtonClick(value: string): void {
  
    if (this.display === '0' && value !== '.' || this.display === 'Error') {
      this.display = value;
      this.currentOperation = value;
    } else {
      
      const lastChar = this.currentOperation.slice(-1);
      const isLastCharOperator = ['+', '-', '*', '/'].includes(lastChar);
      const endsWithOperator = isLastCharOperator && this.currentOperation.length > 1;

      if (this.currentOperation === this.lastResult.toString() && !endsWithOperator) {
         
         this.display = value;
         this.currentOperation = value;
      } else {
         this.display += value;
         this.currentOperation += value;
      }
    }
  }


  clear(): void {
    this.display = '0';
    this.currentOperation = '';
    this.lastResult = 0;
  }


  calculate(): void {
    if (this.currentOperation === '') return;

    try {
      const result = this.calculateService.calculateResult(this.currentOperation);
      this.lastResult = result;
      this.display = result.toString();

      
      this.historyService.addHistoryItem({
        time: new Date().toLocaleTimeString('tr-TR'),
        operation: this.currentOperation,
        result: result
      });

      this.currentOperation = result.toString(); 
    } catch (e) {
        this.display = 'Error';
        this.currentOperation = '';
        this.lastResult = 0;
        console.error("Hesaplama hatası:", e);
    }
  }

  
  onOperatorClick(operator: string): void {
   
    if (this.display === '0' && operator === '.') {
      this.display = '0.';
      this.currentOperation = '0.';
      return;
    }

   
    const lastChar = this.currentOperation.slice(-1);
    const isLastCharOperator = ['+', '-', '*', '/'].includes(lastChar);

    if (isLastCharOperator) {
     
      this.currentOperation = this.currentOperation.slice(0, -1) + operator;
      this.display = this.currentOperation; 
    } else {
      
      this.currentOperation += operator;
      this.display = this.currentOperation; 
    }
  }
}