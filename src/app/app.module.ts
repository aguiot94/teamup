import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import { ClickOutsideModule } from 'ng-click-outside';


import { AppComponent } from './app.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserSingleComponent } from './users/user-single/user-single.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { ProjetsListComponent } from './projets/projets-list/projets-list.component';
import { ProjetSingleComponent } from './projets/projet-single/projet-single.component';
import { ProjetFormComponent } from './projets/projet-form/projet-form.component';
import { TasksListComponent } from './tasks/tasks-list/tasks-list.component';
import { TaskSingleComponent } from './tasks/task-single/task-single.component';
import { TaskFormComponent } from './tasks/task-form/task-form.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { CommentFormComponent } from './comments/comment-form/comment-form.component';
import { CommentsListComponent } from './comments/comments-list/comments-list.component';
import { PortfolioListComponent } from './portfolio/portfolio-list/portfolio-list.component';
import { PortfolioSingleComponent } from './portfolio/portfolio-single/portfolio-single.component';
import { PortfolioFormComponent } from './portfolio/portfolio-form/portfolio-form.component';
import { UserService } from './services/user.service';
import { ProjetsService } from './services/projets.service';
import { TasksService } from './services/tasks.service';
import { AuthService } from './services/auth.service';
import { UserRequestService } from './services/user-request.service';
import { NotificationService } from './services/notification.service';
import { AuthGuardService } from './services/auth-guard.service';
import { CommentsService } from './services/comments.service';
import { PortfolioService } from './services/portfolio.service';
import { CompetencesService } from './services/competences.service';
import { VerticalHeaderService } from './services/vertical-header.service';
import { MessagesService } from './services/messages.service';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExternalUserComponent } from './users/external-user/external-user.component';
import { HomeComponent } from './home/home/home.component';
import { VerticalHeaderComponent } from './header/vertical-header/vertical-header.component';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { MessagesComponent } from './messages/messages/messages.component';
import { MessagesListComponent } from './messages/messages-list/messages-list.component';

const appRoutes: Routes = [
{ path: 'auth/signup', component: SignUpComponent },
{ path: 'auth/signin', component: SignInComponent },
{ path: 'projets', component: ProjetsListComponent },
{ path: 'home', component: HomeComponent },
{ path: 'projets/new', canActivate: [AuthGuardService], component: ProjetFormComponent },
{ path: 'projets/:id', canActivate: [AuthGuardService], component: ProjetSingleComponent },
{ path: 'projets/:id/tasks', canActivate: [AuthGuardService], component: TasksListComponent },
{ path: 'projets/:id/tasks/:id', canActivate: [AuthGuardService], component: TaskSingleComponent} ,
{ path: 'tasks/new', canActivate: [AuthGuardService], component: TaskFormComponent} ,
{ path: 'user/account', canActivate: [AuthGuardService], component: UserSingleComponent },
{ path: 'user/view/:id', canActivate: [AuthGuardService], component: ExternalUserComponent },
{ path: 'message/view/:id', canActivate: [AuthGuardService], component: MessagesComponent },
{ path: 'messages', canActivate: [AuthGuardService], component: MessagesListComponent },
{ path: 'user/new', canActivate: [AuthGuardService], component: UserFormComponent },
{ path: 'user/portfolio', canActivate: [AuthGuardService], component: PortfolioListComponent },
{ path: 'user/portfolio/:id', canActivate: [AuthGuardService], component:  PortfolioSingleComponent },
{ path: 'user/portfolio/new', canActivate: [AuthGuardService], component: PortfolioFormComponent},
{ path: '', redirectTo: 'home', pathMatch: 'full' },
{ path: '**', redirectTo: 'home' }
]

@NgModule({
  declarations: [
    AppComponent,
    UsersListComponent,
    UserSingleComponent,
    UserFormComponent,
    ProjetsListComponent,
    ProjetSingleComponent,
    ProjetFormComponent,
    TasksListComponent,
    TaskSingleComponent,
    TaskFormComponent,
    SignInComponent,
    SignUpComponent,
    CommentFormComponent,
    CommentsListComponent,
    PortfolioListComponent,
    PortfolioSingleComponent,
    PortfolioFormComponent,
    HeaderComponent,
    ExternalUserComponent,
    HomeComponent,
    VerticalHeaderComponent,
    SearchFilterPipe,
    MessagesComponent,
    MessagesListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatIconModule,
    ClickOutsideModule
  ],
  providers: [UserService,
              ProjetsService, 
              TasksService, 
              AuthService, 
              AuthGuardService, 
              CommentsService, 
              PortfolioService, 
              TaskFormComponent, 
              UserRequestService, 
              NotificationService,
              CompetencesService,
              VerticalHeaderService,
              MessagesService],

  bootstrap: [AppComponent]
})
export class AppModule {

}
