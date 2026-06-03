import { Routes } from '@angular/router';
import { CourseComponent } from './course/course.component';
import { courseResolver } from './course/course.resolver';
import { isUserAuthenticated } from './guards/auth.guard';
import { HomeComponent } from "./home/home.component";
import { LessonsComponent } from "./lessons/lessons.component";
import { courseLessonsResolver } from './lessons/lessons.resolver';
import { LinkedSignalDemoComponent } from "./linked-signal/linked-signal-demo.component";
import { LoginComponent } from "./login/login.component";
import { ResourceDemoComponent } from "./resource-demo/resource-demo.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [isUserAuthenticated],
  },
  {
    path: 'courses/:courseId',
    component: CourseComponent,
    canActivate: [isUserAuthenticated],
    resolve: {
      course: courseResolver,
      lessons: courseLessonsResolver
    }
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'lessons',
    component: LessonsComponent,
  },
  {
    path: 'shopping-cart',
    component: LinkedSignalDemoComponent,
  },
  {
    path: 'resource-demo',
    component: ResourceDemoComponent,
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
