import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-select',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class Select {
  @Input('control') control!: FormControl;
  @Input('inputClass') inputClass = '';
  @Input('label') label!: string;
  @Input('defaultValue') defaultValue: any = '';
  @Input('placeholder') placeholder: string = '';
  @Input('options') options: any[] = [];
  @Input('displayName') displayName = 'label';
  @Input('value') value = 'value';
  @Input('getObject') getObject = false;
}
