import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { CommonUtils } from '../common-utils/common-utils';

/* tslint:disable */ 
@Injectable({
  providedIn: 'root'
})
// CanLoad is need for befor module loaded it check auth true or false
export class AuthGuard implements CanLoad  {

  // variable
  get_path_name;

  constructor( 
    private authService : AuthService,
    private router : Router,
    private commonUtils: CommonUtils 
  ){
  }

  canLoad(
    route: Route, 
    segments: UrlSegment[]
    ): Observable<boolean> | Promise<boolean> | boolean{
      /* if(!this.authService.globalparamsData.){
        this.router.navigateByUrl('/auth');
      }
      // console.log("this.authService.userIsAuthenticate >", this.authService.userIsAuthenticate);
      // return true; observable return boolean value true or false
      return this.authService.userIsAuthenticate; */

      return this.authService.globalparamsData.pipe(
        take(1),
        switchMap(isAuthenticated => {
          if (!isAuthenticated) {
            // console.log('when auto login >');
            return this.authService.autoLogin();
          } else {
            // console.log('when menually login >');


            /* this.commonUtils.menuDataobservable.subscribe(menuData =>{
              menuData.forEach(element => {
                element.pages.forEach(element2 => {
               console.log('menu data gurd >>>>>>>>>>>>>>>>>>>>>>>>> element2', element2.type.split('/')[1]);
              this.commonUtils.pagePathNameAnywhereObsv.subscribe(pathRes => {
                // console.log(' url name #### >>', pathRes);
                if(element2.type.split('/')[1] == pathRes){
                  // console.log('founddddddddddddddddddddddddddddddddddddddddddddddddd');
                  return of(!!isAuthenticated); //(!!) means true or false (boolean value)
                }else{
                  // console.log('not tt  founddddddddddddddddddddddddddddddddddddddddddddddddd');
                  return of(!!isAuthenticated); //(!!) means true or false (boolean value)
                }
              }); 
                });
              });
            }); */

            return of(!!isAuthenticated); //(!!) means true or false (boolean value)
          }
        }),
        tap(isAuthenticated => {
          // console.log('isAuthenticated gurd ##################### 222', isAuthenticated);
    
          if (!isAuthenticated) {
            this.router.navigateByUrl('/auth');
          }
        })
      );

  }
}