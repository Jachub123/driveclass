import { Component, OnInit } from '@angular/core';
import { AuthService } from '../register/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) {}

  errorMsg: string;
  logout() {
    this.authService.logout();
  }
  login(form) {
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnInit(): void {
    this.authService.eventAuthError.subscribe((error) => {
      this.errorMsg = error;
    });
  }
}
