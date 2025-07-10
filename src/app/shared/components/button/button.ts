import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input('inputClass') inputClass =
    'w-full bg-primary hover:bg-primary-hover py-2 px-4 text-white';
  @Input('buttonDisabled') buttonDisabled = false;
  @Input() loading = false;
  @Input() type = 'button';
  @Output() buttonClick = new EventEmitter<any>();

  onButtonClick() {
    if (this.loading || this.buttonDisabled) {
      return;
    }
    this.buttonClick.emit();
  }
}
