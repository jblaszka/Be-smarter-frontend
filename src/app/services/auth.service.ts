import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { JwtPayload } from 'jwt-decode';
import { BehaviorSubject, Observable, catchError, filter, map, tap, throwError } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { Router, UrlTree } from '@angular/router';
export const USER_STORAGE_KEY = 'APP_TOKEN';

export interface UserData {
  token: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private user: BehaviorSubject<UserData | null | undefined> =
    new BehaviorSubject<UserData | null | undefined>(undefined);

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  loadUser() {
    const token = localStorage.getItem(USER_STORAGE_KEY);
    console.log(token);

    if (token) {
      const decode = jwt_decode<JwtPayload>(token);

      const userData: UserData = {
        token: token,
        id: decode.sub!,
      };
      this.user.next(userData);
    } else {
      this.user.next(null);
    }
  }

  login(email: string, password: string) {
    return this.http.post('http://localhost:8080/api/v1/auth/authenticate', {
      email,
      password,
    }).pipe(
      map((res: any) => {
        console.log('Result : ', res);
        localStorage.setItem(USER_STORAGE_KEY, res.token);
        const decode = jwt_decode<JwtPayload>(res.token);
        const userData: UserData = {
          token: res.token,
          id: decode.sub!,
        };
        this.user.next(userData);
        return res;
      })
    );
  }

  register(firstname: string, lastname: string, email: string, password: string) {
    return this.http.post('http://localhost:8080/api/v1/auth/register', {
      firstname,
      lastname,
      email,
      password,
    }).pipe(
      map((res: any) => {
        console.log('Result : ', res);
      })
    );
  }

  getActionForDay(): Observable<string> {
    const token = localStorage.getItem(USER_STORAGE_KEY)

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this.http.get('http://localhost:8080/api/v1/one-day/random', { headers, responseType: 'text' });
  }

  getActionForWeek(): Observable<string> {
    const token = localStorage.getItem(USER_STORAGE_KEY)

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this.http.get('http://localhost:8080/api/v1/one-week/random', { headers, responseType: 'text' });
  }

  getActionForMonth(): Observable<string> {
    const token = localStorage.getItem(USER_STORAGE_KEY)

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this.http.get('http://localhost:8080/api/v1/one-month/random', { headers, responseType: 'text' });
  }

  getUserActionToDo(): Observable<Object[]> {
    const token = localStorage.getItem(USER_STORAGE_KEY)
    const userEmail = this.getCurrenUserID();

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this.http.get<Object[]>(`http://localhost:8080/api/v1/user-activity/toDo/${userEmail}`, { headers });
  }


  addActionToDo(activity: string, points: number) {
    const token = localStorage.getItem(USER_STORAGE_KEY)

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    const userEmail = this.getCurrenUserID();

    this.http.post('http://localhost:8080/api/v1/user-activity/addUserActivity', {
      activity,
      points,
      userEmail,
    }, { headers }).subscribe((res: any) => {
      console.log('Result : ', res);
    });
  }

  addActionDone(activityID: number) {
    const token = localStorage.getItem(USER_STORAGE_KEY)

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    console.log(activityID);

    this.http.post(`http://localhost:8080/api/v1/user-activity/makeDone/${activityID}`, {},
      { headers }).subscribe((res: any) => {
        console.log('Result : ', res);
      });
  }

  getUserActionDone(): Observable<Object[]> {
    const token = localStorage.getItem(USER_STORAGE_KEY)
    const userEmail = this.getCurrenUserID();

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this.http.get<Object[]>(`http://localhost:8080/api/v1/user-activity/done/${userEmail}`, { headers });
  }

  signOut() {
    localStorage.removeItem(USER_STORAGE_KEY);
    this.user.next(null);
  }

  getCurrenUser() {
    return this.user.asObservable();
  }

  getCurrenUserID() {
    return this.user.getValue()?.id;
  }

  isLoggedIn(): Observable<boolean | UrlTree> {
    const router = inject(Router);

    return this.getCurrenUser().pipe(
      filter((user) => user !== undefined),
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        } else {
          return router.createUrlTree(['/']);
        }
      })
    );
  }
}