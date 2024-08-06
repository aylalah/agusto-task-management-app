import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './public/header/header.component';
import { FooterComponent } from './public/footer/footer.component';
import { AppRoutingModule } from './app-routing.module';
// import { RegisterComponent } from './auth/register/register.component';
// import { LoginComponent } from './auth/login/login.component';
// import { AuthComponent } from './auth/auth.component';
import { AuthModule } from './auth/auth.module';
import { MenuComponent } from './public/menu/menu.component';
import { AdminHeaderComponent } from './public/admin-header/admin-header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskComponent } from './task/task.component';
import { UsersComponent } from './users/users.component';
import { ProjectsComponent } from './projects/projects.component';
import { BoardComponent } from './board/board.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UpdateUserComponent } from './update-user/update-user.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    AdminHeaderComponent,
    DashboardComponent,
    TaskComponent,
    UsersComponent,
    ProjectsComponent,
    BoardComponent,
    AddUserComponent,
    UpdateUserComponent,
    // RegisterComponent,
    // LoginComponent,
    // AuthComponent
  ],
  imports: [
    BrowserModule,
    AuthModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
