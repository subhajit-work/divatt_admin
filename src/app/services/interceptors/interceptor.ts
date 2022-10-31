import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpResponse, HttpParams, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, shareReplay, retry, map, catchError, switchMap } from 'rxjs/operators';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import { CommonUtils } from '../common-utils/common-utils';
import { Subscription } from 'rxjs/internal/Subscription';

const API_URL = environment.apiUrl;
const API_MASTER = environment.apiMaster;

/* tslint:disable */ 
@Injectable()
export class InterceptorProvider implements HttpInterceptor {
  isparams = false;

  empId;
  lat;
  lng;
  zoom;
  origin;
  destination;
  authToken:any='';
  

  private logoutDataSubscribe: Subscription;

  // private _globalparamsData = null;
  private _globalparamsData = new BehaviorSubject(null);

  // get token session master as observable
  get globalparamsData(){
    return this._globalparamsData.asObservable();
  }

  // get token session master as a non observable
  public getTokenSessionMaster() {
    return this._globalparamsData.value;
  }

  constructor(
    private router: Router,
    public toastController: ToastController,
    private storage: Storage,
    private authService : AuthService,
    private commonUtils: CommonUtils,
    private alertController : AlertController,
    private http : HttpClient,
) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authorization;
    // Keeps the original request params. as a new HttpParams
    let newParams = new HttpParams({fromString: request.params.toString()});

    let get_global_params = this.authService.getTokenSessionMaster();
    console.log('get_global_params intercepter >>>>>>>>>>>>>>>>', get_global_params);
  
    if(get_global_params != null && get_global_params.master == undefined){
      get_global_params.master = API_MASTER;
    }

    if(get_global_params != null && get_global_params.token !== undefined &&get_global_params.session !== undefined && get_global_params.master !== undefined){
      
      // newParams = newParams.append('token', get_global_params.token);
      // newParams = newParams.append('session', get_global_params.session);
      // newParams = newParams.append('master', get_global_params.master); 

      
    }
    console.log('newParams >>>>>>>', get_global_params);
    
    if(get_global_params == null || get_global_params.token == null){
      authorization = 'Bearer '
      console.log('appkey false');
    }else {
      authorization = 'Bearer '+get_global_params.token;
    }
    
    // Clone the request with params instead of setParams

      const requestClone = request.clone({
        url: `${API_URL}/${request.url}`,
        setHeaders: {
          'Authorization': authorization,
        }
      });

      // return next.handle(requestClone);
      return next.handle(requestClone).pipe(
        map((event: HttpEvent<any>) => {
          let eventUrl;
          if (event instanceof HttpResponse) {

            if(event.body.return_status == 0){
              //this.router.navigateByUrl('/auth');
              // this.authService.logout();
              this.commonUtils.presentToast('error', event.body.message);
            }

            //token expire check
            if(event.body.return_token_expire){
              //this.router.navigateByUrl('/auth');
              this.authService.logout();
            }

            //show return_message
            if(!event.body.return_token_expire){
              // this.commonUtils.presentToast('info', event.body.return_message);
            }

          }
          return event;
        }),
        catchError((error: HttpErrorResponse) => {

          // this.router.navigateByUrl('/auth');

          console.log("interceptor error handeller >>", error);

          if (error.status === 0) {
            // this.commonUtils.presentToast('error', 'Please Check Your Network Connection!');
            /* this.router.navigateByUrl('/auth');
            console.log('<< please check your network connection! >>'); */
          }else if(error.status === 404){
            // this.commonUtils.presentToast('error', 'Could not sign you up, please try again');
          }else if(error.status === 500){
            // this.commonUtils.presentToast('error', 'Token not valid');
            // this.authService.logout();
            /* this.commonUtils.presentToast('success', 'Internal Server Error');
            this.commonUtils.presentToast('info', 'Internal Server Error'); */
          }else if(error.status === 401){
            // this.commonUtils.presentToast('error', 'Could not sign you up, please try again');
            this.authService.logout();
            this.router.navigateByUrl('/auth');
          }else {
            // this.commonUtils.presentToast('error', error.error.messagee);
          }
          return throwError(error);
        })
      );
    
    

    
  }

  // reload alert
    async logoutAlert() {
      const reload = await this.alertController.create({
        header: 'Logout',
        message: 'Do you want to logout from other devices?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'popup-cancel-btn',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Ok',
            cssClass: 'popup-ok-btn',
            handler: () => {
              console.log('Confirm Okay');
            }
          }
        ]
      });

      await reload.present();
    }
  // reload page end


  /* async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      showCloseButton: true,
      animated:true,
      cssClass:"my-tost-custom-class",
      translucent: true,
      duration: 2000
    });
    toast.present();
  } */

  // ----------- destroy subscription start ---------
    ngOnDestroy() {
      if(this.logoutDataSubscribe !== undefined){
        this.logoutDataSubscribe.unsubscribe();
      }
    }
  // destroy subscription end
  
  }

  
