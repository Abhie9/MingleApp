import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_modules/userParams';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseURL = environment.apiUrl;
  members: Member[] = [];

  constructor(private http: HttpClient) { }

  getMembers(userParams: UserParams) {
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize)

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender.toString());

    return this.getPaginatedResult<Member[]>(`${this.baseURL}users`,params)
  }

  
  
  getMember(username: string) {
    const member = this.members.find(x => x.username === username);
    if (member !== undefined) return of(member);
    return this.http.get<Member>(`${this.baseURL}users/${username}`);
  }

  updateMember(member: Member){
    return this.http.put(`${this.baseURL}users`, member).pipe(
      map(() => {
        const index = this.members.indexOf(member)
        this.members[index] = member;
      })
    )
  }

  setProfilePicture(photoId: number){
    return this.http.put(`${this.baseURL}users/set-main-photo/${photoId}`, {});
  }
  
  deletePhoto(photoId: number){
    return this.http.delete(`${this.baseURL}users/delete-photo/${photoId}`);
  }

  private getPaginatedResult<T>(url, params) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
 
     return this.http.get<T>(url, { observe: 'response', params }).pipe(
       map(repsonse => {
         paginatedResult.result = repsonse.body;
         if (repsonse.headers.get('Pagination') !== null) {
           paginatedResult.pagination = JSON.parse(repsonse.headers.get('Pagination'));
         }
         return paginatedResult;
       })
     );
   }
 
   private getPaginationHeaders(pageNumber: number, pageSize: number){
     let params = new HttpParams();
       params = params.append('pageNumber', pageNumber.toString());
       params = params.append('pageSize', pageSize.toString());
 
     return params;
   }
}