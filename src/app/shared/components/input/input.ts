import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class InputComponent {
  @Input('control') control!: FormControl;
  @Input('inputClass') inputClass = '';
  @Input('label') label!: string;
  @Input('type') type: 'text' | 'password' | 'email' | 'tel' = 'text';
  @Input('errorMessage')
  errorMessage: string = `Invalid ${
    this.label || 'input'
  }. Please check your entries and try again.`;
  @Input('useDefaultError') useDefaultError = true;
  @Input('placeholder') placeholder: string = '';
  @Input('id') id: string = '';
  @Input('autocomplete') autocomplete: string = '';
  @Input('autofocus') autofocus = false;

  ngOnChanges() {
    this.errorMessage = `Invalid ${
      this.label || 'input'
    }. Please check your entries and try again.`;
  }
}
