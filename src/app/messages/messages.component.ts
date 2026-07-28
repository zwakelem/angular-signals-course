import { NgClass } from "@angular/common";
import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { MessagesService } from "./messages.service";

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NgClass],
})
export class MessagesComponent {
  messageService = inject(MessagesService);
  message = this.messageService.message;

  onClose() {
    this.messageService.clear();
  }
}
