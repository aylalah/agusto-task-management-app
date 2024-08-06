import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
// import { ProfileService } from 'src/app/profile/profile.service';
const jwt = new JwtHelperService();

class DecodedToken {
  exp!: number;
  username!: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public baseUrl = environment.baseUrl;
  public header =  {headers: {Authorization: `Bearer ${localStorage['auth_tkn']}`}};
  private decodedToken;
  profile: any;
  auth_meta = localStorage.getItem("auth_meta")


  constructor(  private http: HttpClient,
                // private UserProfile: ProfileService
            ) {
    this.decodedToken = JSON.parse(''+ this.auth_meta) || new DecodedToken();
  }

  public createUser(data: any): Observable<any> {
    const URI = this.baseUrl + '/users';
    return this.http.post<any>(URI, data, this.header);
  }

  public getAllUsers(query: any): Observable<any> {
    const URL = this.baseUrl + '/users';
    return this.http.get(URL, {
      params: query,
      headers: { 
        Authorization: `Bearer ${localStorage['auth_tkn']}`
      }
    }).pipe(map(response => {
      return response;
    }));
  }

  public updateUserProfile(userData: any): Observable<any> {
    const URI = this.baseUrl + '/users/update_user/' + userData.id;
    return this.http.patch(URI, userData, {
      headers: { 
        Authorization: `Bearer ${localStorage['auth_tkn']}` 
      }
    }).pipe(map(response => {
      return response;
    }));
  }

  public resetPassword(userData: { id: string; }): Observable<any> {
    const URI = this.baseUrl + '/users/change-password/' + userData.id;
    return this.http.patch(URI, userData, {headers: { Authorization: `Bearer ${localStorage['auth_tkn']}`}
        }).pipe(map(response => {
        return response;
      }));
  }

  public getUser(): Observable<any> {
    const URI = this.baseUrl + '/users/profile';
    return this.http.get(URI, {headers: { Authorization: `Bearer ${localStorage['auth_tkn']}`}});
  }

  // users
  public getUsersCardMetrics(): Observable<any> {
    const URI = this.baseUrl + '/admin-profile/card_metrics';
    return this.http.get<any>(URI, this.header);
  }

  public getActiveUsers(): Observable<any> {
    const URI = this.baseUrl + '/users/active';
    return this.http.get<any>(URI, this.header);
  }

  public getUsers(params: any): Observable<any> {
    const URI = this.baseUrl + '/users';
    return this.http.get<any>(URI, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage['auth_tkn']}`
      }
    });
  }

  public getUserDetails(id: any): Observable<any> {
    const URI = this.baseUrl + `/users/${id}`;
    return this.http.get<any>(URI, this.header);
  }

  public getUserMatrix(): Observable<any> {
    const URI = this.baseUrl + `/users/user_matrix`;
    return this.http.get<any>(URI, this.header);
  }

  public updateUser(data: any): Observable<any> {
    const URI = this.baseUrl + `/users/${data.id}`;
    return this.http.patch<any>(URI, data, this.header);
  }

  public onResetPassword(data: any): Observable<any> {
    const URI = this.baseUrl + `/auth/profile/reset-password`;
    return this.http.post<any>(URI, data, this.header);
  }

  public changeUserStatus(data: { id: any; }): Observable<any> {
    const URI = this.baseUrl + `/users/user_activation/${data.id}`;
    return this.http.patch<any>(URI, data, this.header);
  }

  public deleteUser(id: any): Observable<any> {
    const URI = this.baseUrl + `/users/${id}`;
    return this.http.delete<any>(URI, this.header);
  }

}
