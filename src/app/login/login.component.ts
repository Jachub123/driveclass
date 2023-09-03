import { Component, OnInit } from '@angular/core';
import { AuthService } from '../register/auth-service.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FacebookAuthProvider } from '@angular/fire/auth';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  browserPopupRedirectResolver,
} from 'firebase/auth';
import { environment } from 'src/environments/environment';
import { FirebaseApp } from '@angular/fire/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private auth3: AngularFireAuth,
    private firebase: FirebaseApp
  ) {}

  errorMsg: string;
  logout() {
    this.authService.logout();
  }
  login(form) {
    this.authService.login(form.value.email, form.value.password);
  }

  async facebookLogin() {
    const result = await this.auth3.signInWithPopup(new FacebookAuthProvider());
    console.log(result);
  }
  async googleLogin() {
    const auth = getAuth(this.firebase);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider, browserPopupRedirectResolver).then(
      (result) => {
        console.log(result.user);
      }
    );
  }

  ngOnInit(): void {
    this.authService.eventAuthError.subscribe((error) => {
      this.errorMsg = error;
    });
  }
}
