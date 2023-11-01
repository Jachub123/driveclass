import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SearchDriveClassComponent } from './search-drive-class/search-drive-class.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { DrivingSchoolComponent } from './search-drive-class/driving-school/driving-school.component';
import { SchoolDetailViewComponent } from './search-drive-class/driving-school/school-detail-view/school-detail-view.component';
import { TrimPipe } from './trim.pipe';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { environment } from 'src/environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './auth.guard';
import { DatePipe } from '@angular/common';
import { EditSchoolComponent } from './search-drive-class/driving-school/school-detail-view/edit-school/edit-school.component';
import { LinksAndTippsComponent } from './links-and-tipps/links-and-tipps.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DisclaimerComponent } from './footer/disclaimer/disclaimer.component';
import { ImpressumComponent } from './footer/impressum/impressum.component';
import { FooterComponent } from './footer/footer.component';
import { ContactComponent } from './footer/contact/contact.component';
const appRoutes: Routes = [
  { path: '', component: SearchDriveClassComponent, pathMatch: 'full' },
  {
    path: 'school/:id',
    canActivate: [AuthGuardService],
    component: SchoolDetailViewComponent,
  },
  {
    path: 'disclaimer',
    component: DisclaimerComponent,
  },
  {
    path: 'impressum',
    component: ImpressumComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'school/:id/edit',
    canActivate: [AuthGuardService],
    component: EditSchoolComponent,
  },
  {
    path: 'tipps',
    component: LinksAndTippsComponent,
  },
  { path: 'register', component: RegisterComponent },
  { path: 'register/:id', component: RegisterComponent },
  { path: 'login', canActivate: [AuthGuardService], component: LoginComponent },
  {
    path: 'emailVerification/:name/:id',
    component: EmailVerificationComponent,
  },
];
@NgModule({
  declarations: [
    AppComponent,
    SearchDriveClassComponent,
    HeaderComponent,
    DrivingSchoolComponent,
    SchoolDetailViewComponent,
    LoginComponent,
    TrimPipe,
    RegisterComponent,
    EmailVerificationComponent,
    EditSchoolComponent,
    DisclaimerComponent,
    ImpressumComponent,
    FooterComponent,
    ContactComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireStorageModule,
    FormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'enabled' }),
  ],

  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
