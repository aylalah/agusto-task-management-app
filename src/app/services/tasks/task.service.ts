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
export class TaskService {

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

  public createTask(data: any): Observable<any> {
    const URI = this.baseUrl + '/task';
    return this.http.post<any>(URI, data, this.header);
  }

  public getAllTasks(params: any): Observable<any> {
    const URI = this.baseUrl + '/task';
    return this.http.get<any>(URI, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage['auth_tkn']}`
      }
    });
  }

  public getAllBoardTasks(params: any): Observable<any> {
    const URI = this.baseUrl + '/task/board';
    return this.http.get<any>(URI, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage['auth_tkn']}`
      }
    });
  }

  public getTastDetails(id: any): Observable<any> {
    const URI = this.baseUrl + `/task/${id}`;
    return this.http.get<any>(URI, this.header);
  }

  public getDashboardMatrix(): Observable<any> {
    const URI = this.baseUrl + `/task/dashboard/metrix`;
    return this.http.get<any>(URI, this.header);
  }

  public updateTask(data: any): Observable<any> {
    const URI = this.baseUrl + `/task/${data.id}`;
    return this.http.patch<any>(URI, data, this.header);
  }

  public changeTaskStatus(data: { id: any; }): Observable<any> {
    const URI = this.baseUrl + `/task/user_activation/${data.id}`;
    return this.http.patch<any>(URI, data, this.header);
  }

  public deleteTask(id: any): Observable<any> {
    const URI = this.baseUrl + `/task/${id}`;
    return this.http.delete<any>(URI, this.header);
  }

}