import { HttpClient } from "@angular/common/http";
import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { environment } from "../../environments/environment";
import { User } from "../models/user.model";

const USER_STORAGE_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  router = inject(Router);

  #userSignal = signal<User | null>(null);
  user = this.#userSignal.asReadonly();

  constructor() {
    this.loadUserFromStorage();

    effect(() => {
      const user = this.user();
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        return;
      }

      localStorage.removeItem(USER_STORAGE_KEY);
    });
  }

  loadUserFromStorage() {
    const jsonUser = localStorage.getItem(USER_STORAGE_KEY);
    if (!jsonUser) {
      return;
    }

    try {
      const user = JSON.parse(jsonUser) as User;
      this.#userSignal.set(user);
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }

  isLoggedIn = computed(() => !!this.user());

  async login(email: string, password: string): Promise<User> {
    const login$ = this.http.post<User>(`${environment.apiRoot}/login`, 
      {
        email, password
      }
    );
    const user = await firstValueFrom(login$);
    this.#userSignal.set(user);
    return user;
  }

  async logout() {
    localStorage.removeItem(USER_STORAGE_KEY);
    this.#userSignal.set(null);
    await this.router.navigate(['/login']);
  }

}
