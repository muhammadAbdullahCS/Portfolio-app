import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { UserLayoutComponent } from './components/user-layout/user-layout.component';
import { UserNavComponent } from './components/user-nav/user-nav.component';
import { HomePageComponent } from './pages/home/home-page.component';
import { AboutPageComponent } from './pages/about/about-page.component';
import { ProjectsPageComponent } from './pages/projects/projects-page.component';
import { ContactPageComponent } from './pages/contact/contact-page.component';

@NgModule({
  declarations: [
    UserLayoutComponent,
    UserNavComponent,
    HomePageComponent,
    AboutPageComponent,
    ProjectsPageComponent,
    ContactPageComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, SharedModule, UserRoutingModule],
})
export class UserModule {}
