import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Course } from "../models/course.model";
import { CoursesService } from "../services/courses.service";

export const courseResolver: ResolveFn<Course | null> = 
  async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const courseId = route.paramMap.get('courseId');
    if (!courseId) {
      return null;
    }
    const courseService = inject(CoursesService);
    const course = courseService.getCourseById(courseId);
    return course;
  }