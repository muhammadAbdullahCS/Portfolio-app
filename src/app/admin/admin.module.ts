import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { LoginPageComponent } from './pages/login/login-page.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';

@NgModule({
  declarations: [LoginPageComponent, DashboardPageComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, AdminRoutingModule],
})
export class AdminModule {}
