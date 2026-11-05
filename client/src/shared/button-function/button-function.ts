import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-button-function',
  styleUrl: './button-function.css',
  templateUrl: './button-function.html',
})
export class ButtonFunction {
  isDisabled = input<boolean>();
  selected = input<boolean>();
  wasClicked = output<Event>();

  onClick(event: Event) {
    this.wasClicked.emit(event);
  }
}
