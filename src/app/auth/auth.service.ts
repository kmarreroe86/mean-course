import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data-model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  private isUserAuth = false;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  createdUser(email: string, password: string) {

    const authModel: AuthData = { email, password };
    this.http.post('http://localhost:3000/api/users/signup', authModel).subscribe(response => {
      console.log(response);
    });
  }

  login(email: string, password: string) {

    const authModel: AuthData = { email, password };
    this.http.post<{ token: string, expiresIn: number }>('http://localhost:3000/api/users/login', authModel).subscribe(response => {
      if (response.token) {
        const expiresDuration = response.expiresIn;
        this.setAuthTimer(expiresDuration);
        this.token = response.token;
        this.isUserAuth = true;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresDuration * 1000);
        this.saveAuthData(this.token, expirationDate);
        this.router.navigate(['/']);
      }
      console.log(response);
    });
  }

  logout() {
    this.token = null;
    this.isUserAuth = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  getToken() {
    return this.token;
  }

  getAuthSatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuht() {
    return this.isUserAuth;
  }

  autoAuthorizeUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) { return; }
    const expiresIn = authInformation.expirationDate.getTime() - new Date().getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isUserAuth = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) { return; }

    return {
      token,
      expirationDate: new Date(expirationDate)
    };
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
