import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data-model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/users/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  private isUserAuth = false;
  private userId: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  createdUser(email: string, password: string) {

    const authModel: AuthData = { email, password };
    this.http.post(BACKEND_URL + 'signup', authModel).subscribe(response => {
      this.router.navigate(['/']);
    },
    error => {
      this.authStatusListener.next(false);
    });
  }

  login(email: string, password: string) {

    const authModel: AuthData = { email, password };
    this.http.post<{ token: string, expiresIn: number, userId: string }>(
      BACKEND_URL + 'login', authModel).subscribe(response => {
      if (response.token) {
        const expiresDuration = response.expiresIn;
        this.setAuthTimer(expiresDuration);
        this.token = response.token;
        this.isUserAuth = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresDuration * 1000);
        this.saveAuthData(this.token, expirationDate, this.userId);
        this.router.navigate(['/']);
      }
      console.log(response);
    },
    error => {
      this.authStatusListener.next(false);
    });
  }

  logout() {
    this.token = null;
    this.isUserAuth = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
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
      this.userId = authInformation.userId;
      this.isUserAuth = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) { return; }

    return {
      token,
      expirationDate: new Date(expirationDate),
      userId
    };
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
