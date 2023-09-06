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
import { FirebaseApp } from '@angular/fire/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private auth3: AngularFireAuth,
    private firebase: FirebaseApp,
    private db: AngularFirestore,
    private router: Router
  ) {}

  errorMsg: string;
  logout() {
    this.authService.logout();
  }
  login(form) {
    this.authService.login(form.value.email, form.value.password);
  }

  async facebookLogin() {
    this.auth3.signInWithPopup(new FacebookAuthProvider()).then((result) => {
      this.db
        .collection('users')
        .doc(result.credential.providerId)
        .collection(result.user.uid)
        .add({
          name: result.user.displayName,
          email: result.user.email,
          phone: result.user.phoneNumber,
          accountCreated: result.user.metadata.creationTime,
        });
    });
  }
  async googleLogin() {
    const auth = getAuth(this.firebase);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider, browserPopupRedirectResolver).then(
      (result) => {
        this.db
          .collection('users')
          .doc(result.providerId)
          .collection(result.user.uid)
          .add({
            name: result.user.displayName,
            email: result.user.email,
            phone: result.user.phoneNumber,
            accountCreated: result.user.metadata.creationTime,
          });
      }
    );
  }

  ngOnInit(): void {
    this.authService.eventAuthError.subscribe((error) => {
      this.errorMsg = error;
    });
  }
}
