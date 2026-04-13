import { Injectable } from '@angular/core';

const STORAGE_KEY = 'admin';

@Injectable({ providedIn: 'root' })
export class AuthService {
  login(username: string, password: string): boolean {
    if (username === 'abdullahadmin' && password === 'abdullahadmin') {
      localStorage.setItem(STORAGE_KEY, 'true');
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
