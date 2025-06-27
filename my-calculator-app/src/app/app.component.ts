import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorComponent } from './calculator/calculator.component';
import { HistoryService } from './services/history/history.service';
import { CalculateService } from './services/calculate/calculate.service';
import { HistoryItem } from './models/history-item.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CalculatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'My Calculator App';

  displayValue: string = '';
  history: HistoryItem[] = [];

  constructor(
    private historyService: HistoryService,
    private calculateService: CalculateService
  ) {}

  ngOnInit(): void {
    // Geçmiş aboneliği
    this.historyService.history$.subscribe(newHistory => {
      this.history = newHistory;
    });
  }

  appendToDisplay(value: string): void {
    this.displayValue += value;
  }

  clearDisplay(): void {
    this.displayValue = '';
  }

  calculateResult(): void {
    const result = this.calculateService.calculateResult(this.displayValue);

    if (typeof result === 'string') {
      this.displayValue = result;
      return;
    }

    const now = new Date();
    const historyItem: HistoryItem = {
      time: now.toLocaleTimeString(),
      operation: this.displayValue,
      result: result.toString()
    };

    this.historyService.addHistoryItem(historyItem);
    this.displayValue = result.toString();
  }

  /** ✅ Eksik olan clear fonksiyonu eklendi */
  clearAllHistory(): void {
    this.historyService.clearHistory(); // Eğer bu fonksiyon servis içinde varsa
  }
}
