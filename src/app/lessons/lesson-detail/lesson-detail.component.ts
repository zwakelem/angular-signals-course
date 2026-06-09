import { Component, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { MessagesService } from '../../messages/messages.service';
import { Lesson } from "../../models/lesson.model";
import { LessonsService } from '../../services/lessons.service';

@Component({
  selector: 'lesson-detail',
  imports: [ReactiveFormsModule],
  templateUrl: './lesson-detail.component.html',
  styleUrl: './lesson-detail.component.scss',
})
export class LessonDetailComponent {
  lesson = input.required<Lesson | null>();

  cancel = output();
  lessonUpdated = output<Lesson>();

  lessonsService = inject(LessonsService);
  messagesService = inject(MessagesService);

  onCancel() {
    this.cancel.emit();
  }

  async onSave(description: string) {
    try {
      const lesson = this.lesson();
      const updatedLesson = await this.lessonsService.saveLesson(lesson!.id, {
        description,
      });
      this.lessonUpdated.emit(updatedLesson);
    } catch(err) {
      console.error(err);
      this.messagesService.showMessage(`Error saving lesson!`, 'error');
    }
  }
}
