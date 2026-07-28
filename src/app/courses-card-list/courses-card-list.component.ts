import { Component, effect, ElementRef, inject, input, output, viewChildren, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from "@angular/router";
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { Course } from "../models/course.model";

@Component({
  selector: 'courses-card-list',
  imports: [RouterLink],
  templateUrl: './courses-card-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './courses-card-list.component.scss',
})
export class CoursesCardListComponent {
  courses = input.required<Course[]>();

  courseUpdated = output<Course>();

  courseDeleted = output<string>();

  dialog = inject(MatDialog);

  courseCards = viewChildren<ElementRef>('courseCard');

  constructor() {
    effect(() => {
      console.log(`courseCards`, this.courseCards());
    })
  }

  async onEditCourse(course: Course) {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'update',
      title: 'Update Existing Course',
      course,
    });
    if (!newCourse) {
      return;
    }
    console.log(`Course edited:`, newCourse);
    this.courseUpdated.emit(newCourse);
  }

  onCourseDeleted(course: Course) {
    this.courseDeleted.emit(course.id);
  }
}
