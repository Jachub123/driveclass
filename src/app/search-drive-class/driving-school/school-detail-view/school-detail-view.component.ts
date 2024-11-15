import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SchoolService } from 'src/app/school.service';
import { School } from '../school.model';
import { AuthService } from 'src/app/register/auth-service.service';
import { FacebookAuthProvider } from '@angular/fire/auth';
import {
  GoogleAuthProvider,
  browserPopupRedirectResolver,
  getAuth,
  signInWithPopup,
} from 'firebase/auth';
import { FirebaseApp } from '@angular/fire/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DatePipe } from '@angular/common';
import { Comment } from 'src/app/comment';
import { Observable, Subscription, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-school-detail-view',
  templateUrl: './school-detail-view.component.html',
  styleUrls: ['./school-detail-view.component.scss'],
})
export class SchoolDetailViewComponent implements OnInit, OnDestroy {
  user: any;
  canNotComment: boolean;
  userSub: Subscription;
  schoolSub: Subscription;
  schoolSub2: Subscription;
  scoolSub3: Subscription;
  authedUserSub: Subscription;
  dbSub2: any;
  mySchool: boolean;
  showSubs: boolean = false;
  abo: string = '';
  @ViewChild('payrexxIframe', { static: false }) payrexxIframe: ElementRef;
  id: string;
  schools: School[] = [];
  school: School;
  render: boolean = false;
  comments: Array<Comment> = [];
  @ViewChild('payrexxIframe', { static: false }) iframe: ElementRef;
  msg: string;
  constructor(
    private schoolService: SchoolService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private auth3: AngularFireAuth,
    private firebase: FirebaseApp,
    private db: AngularFirestore,
    private datePipe: DatePipe,
    private http: HttpClient
  ) {
    window.addEventListener('message', this.handleMessage.bind(this), false);
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  @ViewChild('popUp') popUp: ElementRef;
  @ViewChild('comment') comment: ElementRef;
  @ViewChild('innerPopUp') innerPopUp: ElementRef;

  commentClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    let excludeMeElement;
    if (this.comment) {
      excludeMeElement = this.comment.nativeElement;
    }
    const excludeMeElement2 = this.innerPopUp.nativeElement;
    if (!this.auth.isLoggedIn()) {
      if (
        clickedElement !== excludeMeElement &&
        clickedElement !== excludeMeElement2
      ) {
        this.popUp.nativeElement.classList.add('hidden');
      } else {
        this.popUp.nativeElement.classList.remove('hidden');
      }
    }
  }

  async facebookLogin() {
    this.auth3.signInWithPopup(new FacebookAuthProvider()).then((result) => {
      return result;
      /*       this.db
        .collection('users')
        .doc(result.credential.providerId)
        .collection(result.user.uid)
        .add({
          name: result.user.displayName,
          email: result.user.email,
          phone: result.user.phoneNumber,
          accountCreated: result.user.metadata.creationTime,
        }); */
    });
  }
  async googleLogin() {
    const auth = getAuth(this.firebase);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider, browserPopupRedirectResolver);
    /*     .then(
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
    ); */
  }

  async didPostComment() {
    const userCommentCount = await lastValueFrom(
      this.db
        .collection('kommentare')
        .doc(this.id)
        .collection(this.user.uid)
        .get()
    );
    return userCommentCount.size;
  }
  async fetchViewedSchool() {
    const school = await lastValueFrom(this.schoolService.schoolCache);
    return school;
  }
  async postComment(school) {
    let user;

    await this.didPostComment().then((result) => {
      if (result > 0) {
        this.canNotComment = true;
        return;
      }
      if (this.user) {
        user = this.user;
      } else {
        this.authedUserSub = this.auth.loggedInUser.subscribe((loggedUser) => {
          user = loggedUser;
        });
      }
      this.userProvider(user);
      if (this.canNotComment) {
        return;
      }
      if (this.auth.isLoggedIn()) {
        this.db
          .collection('kommentare')
          .doc(school.name)
          .collection(school.profilename)
          .doc(user.uid)
          .set({
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            comment: this.comment.nativeElement.value,
            date: this.datePipe.transform(Date(), 'dd-MM-yyyy HH:mm'),
          });
        this.fetchComments(this.school);
      }
      this.canNotComment = true;
    });
  }

  getUserCommentCount(user) {
    console.log(user);
    if (user?.providerData[0]?.providerId !== 'password') {
      this.schoolService.fetchSchools();
      this.scoolSub3 = this.schoolService.schoolCache.subscribe((school) => {
        if (school.name === this.id) {
          this.db
            .collection('kommentare')
            .doc(this.id)
            .collection(school.profilename)
            .doc(user.uid)
            .get()
            .subscribe((comment) => {
              this.canNotComment = comment.exists;
            });
        }
      });
    }
  }

  async fetchComments(school) {
    const comment = await this.getComments(school.profilename);
    this.comments = comment;
  }

  getComments(profilename: string): Promise<Comment[]> {
    return new Promise<Comment[]>((resolve) => {
      this.db
        .collection('kommentare')
        .doc(this.id)
        .collection(profilename)
        .get()
        .subscribe((comments) => {
          const commentData: Comment[] = comments.docs.map((comment) => {
            return comment.data() as Comment;
          });
          resolve(commentData);
        });
    });
  }
  userProvider(user) {
    if (
      user?.providerData[0]?.providerId !== 'facebook.com' &&
      user?.providerData[0]?.providerId !== 'google.com'
    ) {
      this.canNotComment = true;
    }
  }

  handleMessage(event: MessageEvent) {
    if (typeof event.data === 'string') {
      try {
        const data = JSON.parse(event.data);
        if (data && data.payrexx) {
          Object.keys(data.payrexx).forEach((name) => {
            switch (name) {
              case 'transaction':
                if (typeof data.payrexx[name] === 'object') {
                  if (data.payrexx[name].status === 'confirmed') {
                    const time = new Date().getHours() + 1;
                    // Handle success
                    this.updateSub(
                      this.school,
                      data.payrexx.transaction.subscription.valid_until +
                        'T' +
                        time +
                        ':00',
                      data.payrexx.transaction.subscription.uuid
                    );
                    this.showSubs = false;
                    this.schoolService.fetchSchools(this.school.profilename);
                  }
                }
                break;
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  updateSub(school: School, valid: string, uuid: string) {
    this.db
      .collection('schools')
      .doc('T4GpuQlOBycURI4BzvG2')
      .collection('school')
      .doc(school.name)
      .set({
        school: {
          ...school,
          valid: valid,
          payrexxUuid: uuid,
        },
      });
  }

  showFrame() {
    const iFrame = this.payrexxIframe.nativeElement;
    const iFrameOrigin = new URL(iFrame.src).origin;

    iFrame.contentWindow.postMessage(
      JSON.stringify({
        origin: window.location.origin,
      }),
      iFrameOrigin
    );
  }
  scrollToAnchor(): void {
    // Use the anchor name to scroll to the element
    setTimeout(() => {
      const element = this.iframe.nativeElement;

      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  ngOnInit() {
    this.schools = [];
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (this.id === 'mySchool') {
        if (this.auth.isLoggedIn()) {
          this.schoolService.fetchSchools(
            JSON.parse(localStorage.getItem('user')!).email
          );
          this.schoolSub = this.schoolService.schoolCache.subscribe(
            (school) => {
              this.school = school;
              this.mySchool = true;
              this.render = true;
              this.showSubs = false;
            }
          );
        }
        this.schoolSub = this.schoolService.invalidSchools.subscribe(
          (school) => {
            this.school = school;
            this.showSubs = true;
          }
        );
      } else {
        if (this.schools.length === 0) {
          this.schoolService.fetchSchools();
        }

        this.schoolSub2 = this.schoolService.schoolCache.subscribe((obj) => {
          if (obj.name === this.id) {
            this.render = true;
            this.school = obj;
            this.fetchComments(this.school);
          }
        });
      }
    });
    this.auth.getUser();
    this.userSub = this.auth.user.subscribe((user) => {
      if (user) {
        this.user = user;
        this.userProvider(user);
        this.getUserCommentCount(user);
      }
    });
  }
  ngOnDestroy(): void {
    this.authedUserSub ? this.authedUserSub.unsubscribe() : '';
    this.scoolSub3 ? this.scoolSub3.unsubscribe() : '';
    this.userSub ? this.userSub.unsubscribe() : '';
    this.schoolSub ? this.schoolSub.unsubscribe() : '';
    this.schoolSub2 ? this.schoolSub2.unsubscribe() : '';
  }
}
