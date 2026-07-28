import { Component, ElementRef, inject, signal, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { Lesson } from "../models/lesson.model";
import { LessonsService } from "../services/lessons.service";
import { LessonDetailComponent } from "./lesson-detail/lesson-detail.component";

@Component({
  selector: 'lessons',
  imports: [LessonDetailComponent],
  templateUrl: './lessons.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lessons.component.scss',
})
export class LessonsComponent {
  mode = signal<'master' | 'detail'>('master');
  lessons = signal<Lesson[]>([]);
  selectedLesson = signal<Lesson | null>(null);
  lessonService = inject(LessonsService);

  searchInput = viewChild.required<ElementRef>('search');

  async onSearch() {
    const query = this.searchInput()?.nativeElement.value;
    console.log('search query', query);

    const results = await this.lessonService.loadLessons({ query });
    this.lessons.set(results);
  }

  onLessonSelected(lesson: Lesson) {
    this.mode.set('detail');
    this.selectedLesson.set(lesson);
  }

  onCancel() {
    this.mode.set('master');
  }

  onLessonUpdated(lesson: Lesson) {
    this.lessons.update(lessons => 
      lessons.map(l => l.id === lesson.id ? lesson : l)
    );
  }
}
