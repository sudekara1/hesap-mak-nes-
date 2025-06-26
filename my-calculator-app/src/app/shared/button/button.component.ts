
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-button', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './button.component.html',
  styleUrl: './button.component.css' 
})
export class ButtonComponent {

  @Input() type: 'submit' | 'button' | 'reset' = 'button';

  @Input() variant: string = 'primary';

  @Input() disabled: boolean = false;

  @Output() btnClick = new EventEmitter<void>();


  onClick(): void {
    if (!this.disabled) { 
      this.btnClick.emit();
    }
  }


  get buttonClasses(): string {
    return `btn btn-${this.variant}`; 
  }
}