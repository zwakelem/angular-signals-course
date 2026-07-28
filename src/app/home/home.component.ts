import { Component, computed, effect, inject, OnInit, signal, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { CoursesCardListComponent } from "../courses-card-list/courses-card-list.component";
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { MessagesService } from '../messages/messages.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'home',
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class HomeComponent implements OnInit {
  #courses = signal<Course[]>([]);

  beginnerCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'BEGINNER');
  });

  advancedCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'ADVANCED');
  });

  coursesService = inject(CoursesService);
  dialog = inject(MatDialog);
  messageService = inject(MessagesService);

  beginnersList = viewChild<CoursesCardListComponent>('beginnersList');
  // advancedList = viewChild<CoursesCardListComponent>('advancedList');

  courses$ = toObservable(this.#courses);

  constructor() {

    this.courses$.subscribe(courses => console.log(`courses$`, courses));  

    effect(() => {
      // console.log(`beginnersList: `, this.beginnersList());
    });

    effect(() => {
      // console.log(`Beginner courses: `, this.beginnerCourses());
      // console.log(`Advanced courses: `, this.advancedCourses());
    });

    this.loadCourses();
    // .then(() =>
    //   console.log(`All courses loaded:`, this.#courses()),
    // );
  }

  ngOnInit(): void {
    // this.loadCourses().then(() =>
    //   console.log(`All courses loaded:`, this.courses()),
    // );
  }

  async loadCourses() {
    try {
      const courses = await this.coursesService.loadAllCourses();
      this.#courses.set(courses.sort(sortCoursesBySeqNo));
    } catch (err) {
      this.messageService.showMessage(`Error loading courses`, 'error');
      console.error(err);
    }
  }

  onCourseUpdated(updatedCourse: Course) {
    const courses = this.#courses();
    const newCourses = courses.map((course) =>
      course.id === updatedCourse.id ? updatedCourse : course,
    );
    this.#courses.set(newCourses);
  }

  async onCourseDeleted(deletedCourseId: string) {
    try {
      await this.coursesService.deleteCourse(deletedCourseId);
      const courses = this.#courses();
      const newCourses = courses.filter(
        (course) => course.id !== deletedCourseId,
      );
      this.#courses.set(newCourses);
    } catch (err) {
      console.log(err);
      alert(`Error deleting course with id=` + deletedCourseId);
    }
  }

  async onAddCourse() {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'create',
      title: 'Create New Course',
    });

    if (!newCourse) {
      return;
    }
    const newCourses = [...this.#courses(), newCourse];
    this.#courses.set(newCourses);
  }
}
