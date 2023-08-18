import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../shared/services/auth-serverice.service';
import { User } from '../shared/services/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent implements OnInit {
  name: string;
  id: any;
  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private authService: AuthService,
    public afAuth: AngularFireAuth
  ) {}
  validEmail: boolean = false;
  user: User;

  ngOnInit() {
    /*     this.user = {
      displayName: 'jachub',
      emailVerified: false,
      photoURL: 'www.google.com',
      uid: 'xyz',
      email: 'dschakub@hotmail.com',
    };
    console.log(this.afAuth.sendSignInLinkToEmail("dschakub@hotmail.de"));
    this.authService.SendVerificationMail(); */
    this.route.params.subscribe((params: Params) => {
      this.name = params['name'];
      this.id = params['id'];
    });

    this.db
      .collection('schools')
      .doc('T4GpuQlOBycURI4BzvG2')
      .collection(this.name)
      .doc(this.id)
      .get()
      .subscribe((response) => {
        console.log(response.exists);
        if (response.exists) {
          this.validEmail = true;
        }
      });
  }
}
