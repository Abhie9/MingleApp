import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, pipe } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_modules/userParams';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseURL = environment.apiUrl;
  members: Member[] = [];
  //store members and filters in key value format
  memberCache = new Map();
  user: User;
  userParams: UserParams;

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
   }

  getUserParams(){
    return this.userParams
  }

  setUserParams(params: UserParams){
    this.userParams =  params;
  }

  resetUserParams(){
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams) {
    // console.log(Object.values(userParams).join('_'))

    var response = this.memberCache.get(Object.values(userParams).join('_'));
    if(response){
      return of(response);
    }

    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize)

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult<Member[]>(`${this.baseURL}users`,params, this.http)
      .pipe(map(response => {
      this.memberCache.set(Object.values(userParams).join('_'), response);
      return response;
    }))
  }

  
  
  getMember(username: string) {
    // console.log(this.memberCache);
    //extract user from cashed memory
    const member = [...this.memberCache.values()]
    .reduce((arr, elem) => arr.concat(elem.result), [])
    .find((member: Member) => member.username === username);

    if(member){
      return of(member);
    }
    // console.log(member); 
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

  addLike(username: string){
    return this.http.post(`${this.baseURL}likes/${username}`, {});
  }
  
  getLikes(predicate: string, pageNumber, pageSize){
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate',predicate);

    return getPaginatedResult<Partial<Member[]>>(`${this.baseURL}likes`, params, this.http);

  }

  
}