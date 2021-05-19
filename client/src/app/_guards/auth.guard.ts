import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AccountService } from '../_services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private toastr: ToastrService) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.accountService.currentUser$.pipe(
      map(user => {
        console.log(user)
        if (user) return true;
        this.toastr.error('Nope!!')
        return (false);
      })
    )
  }
}