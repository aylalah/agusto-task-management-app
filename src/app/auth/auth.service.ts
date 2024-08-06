import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

const jwt = new JwtHelperService();

class DecodedToken {
  exp!: number;
  username!: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private uriseg = 'http://localhost:5000/api/users';
  private uriseg = environment.baseUrl;
  private decodedToken;
  public header =  {headers: {Authorization: `Bearer ${localStorage['auth_tkn']}`}};
  auth_meta = localStorage.getItem("auth_meta")

  constructor(private http: HttpClient) {
    this.decodedToken = JSON.parse(''+ this.auth_meta) || new DecodedToken();
   }
   

  public login(userData: any): Observable<any> {
    const URI = this.uriseg + '/auth/login';
    return this.http.post(URI, userData).pipe(map(response => {
      const data: any = response;
      const token = data['data'].token;
      console.log(token);
      return this.saveToken(token);

    }));
  }

  public confirmEmail(token: any): Observable<any> {
    const URI = this.uriseg + `/auth/confirm_email/${token}`;
    return this.http.get(URI)
  }

  public verifyPasscode(data: any): Observable<any> {
    const URI = this.uriseg + '/auth/verify_passcode';
    return this.http.post(URI, data)
  }

  public authUser(): Observable<any> {
    const URI = this.uriseg + '/auth/profile';
    return this.http.get(URI, {headers: { Authorization: `Bearer ${localStorage['auth_tkn']}`}
      }).pipe(map(response => {
      const data: any = response;
      const status = data['status'];
      const token = data['data'].token;
      // this.profile = data;
      return data;
    }));
  }
  
  public forgotPassword(userData: any): Observable<any> {
    const URI = this.uriseg + '/auth/forgot-password';
    return this.http.post(URI, userData)
  }

  public resetPassword( token: any, userData: any): Observable<any> {
    const URI = this.uriseg + `/auth/reset-password/${token}` ;
    return this.http.patch(URI, userData)
  }

  public profileResetPassword( userData: any): Observable<any> {
    const URI = this.uriseg + `/auth/profile/reset-password` ;
    return this.http.post(URI, userData, this.header)
  }

  private saveToken(token: any): any {
    this.decodedToken = jwt.decodeToken(token);
    localStorage.setItem('auth_tkn', token);
    localStorage.setItem('auth_meta', JSON.stringify(this.decodedToken));
    return token;
  }

  public logout(): void {
    localStorage.removeItem('auth_tkn');
    localStorage.removeItem('auth_meta');
    this.decodedToken = new DecodedToken();
  }

  public isAuthenticated(): boolean {
    return moment().isBefore(moment.unix(this.decodedToken.exp));
  }

  public getUsername(): string {
    return this.decodedToken.username;
  }
}
