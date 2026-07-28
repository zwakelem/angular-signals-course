import { Component, effect, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { firstValueFrom } from 'rxjs';
import { CourseCategoryComboboxComponent } from "../course-category-combobox/course-category-combobox.component";
import { LoadingIndicatorComponent } from "../loading/loading.component";
import { CourseCategory } from '../models/course-category.model';
import { Course } from '../models/course.model';
import { CoursesService } from '../services/courses.service';
import { EditCourseDialogData } from './edit-course-dialog.data.model';

@Component({
  selector: 'edit-course-dialog',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    CourseCategoryComboboxComponent,
  ],
  templateUrl: './edit-course-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './edit-course-dialog.component.scss',
})
export class EditCourseDialogComponent {
  dialogRef = inject(MatDialogRef);
  data: EditCourseDialogData = inject(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);
  form = this.fb.group({
    title: [''],
    longDescription: [''],
    iconUrl: [''],
  });
  courseService = inject(CoursesService);
  // this signal is bi-directional between this parent component
  // and child component CourseCategoryComboboxComponent 
  // we use the "value" attribute to bind this "category" signal
  // to the signal in the child component named "value"
  category = signal<CourseCategory>('BEGINNER');

  constructor() {
    this.form.patchValue({
      title: this.data?.course?.title,
      longDescription: this.data?.course?.longDescription,
      iconUrl: this.data?.course?.iconUrl,
    });
    this.category.set(this.data?.course?.category ?? 'BEGINNER');
    effect(() => {
      console.log(`Course category bi-directional binding: ${this.category}`);
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  async onSave() {
    const courseProps = this.form.value as Partial<Course>;
    courseProps.category = this.category();
    if (this.data.mode === 'update') {
      this.updateCourse(this.data?.course!.id, courseProps);
    } else if (this.data.mode === 'create') {
      await this.createCourse(courseProps);
    }
  }

  async createCourse(course: Partial<Course>) {
    try {
      const newCourse = await this.courseService.createCourse(course);
      this.dialogRef.close(newCourse);
    } catch (err) {
      console.log(err);
      alert('Error creating course');
    }
  }

  async updateCourse(courseId: string, changes: Partial<Course>) {
    try {
      const updatedCourse = await this.courseService.updateCourse(
        courseId,
        changes,
      );
      this.dialogRef.close(updatedCourse);
    } catch (err) {
      console.error(err);
      alert(`Failed to update the course`);
    }
  }
}

export async function openEditCourseDialog(dialog: MatDialog, data: EditCourseDialogData) {
  const config = new MatDialogConfig();
  config.disableClose = true;
  config.autoFocus = true;
  config.width = "400px";
  config.data = data;

  const close$ = dialog.open(EditCourseDialogComponent, config).afterClosed();
  return firstValueFrom(close$);
}
