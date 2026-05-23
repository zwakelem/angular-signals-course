import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { MessagesService } from '../messages/messages.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  loginForm = this.fb.group({
    email: ['', Validators.email],
    password: [''],
  });

  messagesService = inject(MessagesService);
  authService = inject(AuthService);
  router = inject(Router);

  async onLogin() {
    try {
      const formValue = this.loginForm.value;
      if (!formValue.email || !formValue.password ) {
        this.messagesService.showMessage('Enter an email and password.', 'error');
        return;
      }

      await this.authService.login(formValue.email, formValue.password);
      await this.router.navigate(['/home']);

    } catch(err) {
      console.error(err);
      this.messagesService.showMessage('Login failed, please try again!', 'error');
    }
  }
}
