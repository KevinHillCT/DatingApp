import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-button-delete',
  styleUrl: './button-delete.css',
  templateUrl: './button-delete.html',
})
export class ButtonDelete {
  isDisabled = input<boolean>();
  wasClicked = output<Event>();

  onClick(event: Event) {
    this.wasClicked.emit(event);
  }
}
