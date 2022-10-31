// import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { AlertController, LoadingController, IonSlides, MenuController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { environment } from 'src/environments/environment';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  main_url = environment.apiUrl;
  file_url = environment.fileUrl;
  @ViewChild('slider', { static: true }) private slider: IonSlides;
  hide = true;
  hide2=true
  hide3 = true;
  model:any = {}
  login:any = {};
  maritalstatuslist=[
    {
      id:1,name:"Unmarried"
    },{
      id:2,name:"Married"
    }
  ]
  owlcarousel = [
    {
      title: "Welcome to Divatt",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    },
    {
      title: "Welcome to Divatt",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    },
    {
      title: "Welcome to Divatt",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    }
  ]

  isLoading = false;
  siteInfo;
  isLogin = true;
  userTypes;
  private formSubmitSubscribe: Subscription;
  public slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  btnloader: boolean;
  message: any;
  btnloader2: boolean;
  message2: any;
  gender: any;
  designerProfile: {};
  boutiqueProfile: any;
  data: any;
  minDate: Date;
  maxDate: Date;
  errormsg: string;
  
  constructor(
    public menuCtrl: MenuController,
    private authService:AuthService,
    private router:Router,
    private loadingController: LoadingController,
    private http : HttpClient,
    private alertCtrl: AlertController,
    private commonUtils: CommonUtils,
    private modalController : ModalController,
    private appComponent: AppComponent,
    // public datepipe: DatePipe
  ) { }

  ngOnInit() {
    // menu hide
    this.commonFunction();
    this.menuCtrl.enable(false);

    this.formSubmitSubscribe =  this.authService.globalparamsData.subscribe(res => {
      console.log('authService',res);
      
      if(res && res != null && res != undefined && res != ''){
        if(res.token != undefined ){
          this.router.navigateByUrl('/dashboard');
        }
      }
    });

    // get Site Info
    this.formSubmitSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      this.siteInfo = res;
    })
  }
  commonFunction()
  {
    const currentYear = new Date().getFullYear();
    // this.minDate = new Date(currentYear - 1, 0, 1);
    this.maxDate = new Date(currentYear - 18, 11, 31);
  }
  site_path;
  site_href;
  site_href_split;
  site_path_split;
  type = 'DESIGNER'
  ionViewWillEnter() {

    this.menuCtrl.enable(false);
    
    // get Site Info
    this.formSubmitSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      this.siteInfo = res;
    })

    /* this.site_path = window.location.pathname;
    this.site_href = window.location.href;
    this.site_href_split = window.location.href.split('/')[1];
    this.site_path_split = window.location.pathname.split('/')[1]; */

    // this.appComponent.userInfoData();

    // menu hide
    this.menuCtrl.enable(false);

    this.formSubmitSubscribe =  this.authService.globalparamsData.subscribe(res => {
      if(res && res != null && res != undefined && res != ''){
        if(res.token != undefined ){
          this.router.navigateByUrl('/dashboard');
        }
      }
    });

  }


  onSwitchAuthMode(){
    this.isLogin =! this.isLogin;
  }

  //---------------- login form submit start-----------------
    onSubmitForm(form:NgForm){
      this.isLoading = true;
      console.log('form >>', form.value);
      if(!form.valid){
        return;
      }
      const email = form.value.email;
      const password = form.value.password;

      if(this.isLogin){
        // login server data send
      }else{
        // signup server data send
      }

      this.authenticate(form, form.value);
      // form.reset();

    }
    radioChange(e)
    {
      console.log(e.value);
      this.gender = e.value;
    }
    selectLoginType(value)
    {
        this.type = value;
    }
    // register form start
    onSubmitRegForm(form:NgForm)
    {
      
      this.btnloader2 = true;
      console.log("REG-->",form.value);
       
      this.designerProfile = {
        firstName1:form.value.firstName1,
        lastName1:form.value.lastName1,
        firstName2:form.value.firstName2,
        lastName2:form.value.lastName2,
        designerName:form.value.firstName1 + ' ' + form.value.lastName1,
        email:form.value.email,
        gender:form.value.gender,
        maritalStatus:form.value.maritalStatus,
        mobileNo:form.value.mobile,
        password:form.value.password,
        dob:form.value.dob,
        altMobileNo:form.value.altmobile,
        displayName:form.value.displayName,
        qualification:form.value.qualification,
      }
      this.boutiqueProfile = {
        boutiqueName:form.value.boutiqueName,
      }
      this.data = {
        designerName:form.value.firstName1 + ' ' + form.value.lastName1,
        boutiqueProfile:this.boutiqueProfile,
        designerProfile:this.designerProfile,
      }
      this.http.post("designer/add",this.data).subscribe(
        (res:any) => {
          console.log("res",res);
          this.btnloader2 = false;
          this.commonUtils.presentToast("success",res.message);
          
          // setTimeout(() => {
            this.tabGroup.selectedIndex = 0;
          // }, 1000);
          setTimeout(() => {
          form.reset();
          },1500)
        },
        (error) =>{
          this.btnloader2 = false;
          console.log("error",error);
          this.message2 = error.error.message;
        })
    }
    // reginter form end
    // authenticate function
    authenticate(_form, form_data) {
      this.btnloader = true;
      this.loadingController
        .create({ keyboardClose: true, message: 'Logging in...' })
        .then(loadingEl => {
          loadingEl.present();
          let authObs: Observable<any>;
          
          
          if (this.isLogin) {
            authObs = this.authService.login('auth/login', form_data, '');
            console.log('###########>>>', authObs);
            console.log('######form_data#####>>>', form_data);
            
          } else {
            // authObs = this.authService.signup(email, password);
          }
          console.log('authenticate@@', authObs);
          console.log('authenticate...........');
          this.formSubmitSubscribe = authObs.subscribe(
            resData => {
              console.log('resData =============))))))))))))))>', resData);
              this.btnloader = false;
                this.router.navigateByUrl('/dashboard')
                // .then(() => {
                //   window.location.reload();
                // });
                setTimeout(() => {
                  // this.commonUtils.presentToast('success', resData.message);
                }, 500);
                
                setTimeout(() => {
                  _form.reset();
                  loadingEl.dismiss();

                }, 2000);
                
                
                loadingEl.dismiss();
                // this.commonUtils.presentToast('error', resData.message);
              
              // console.log("data login after resData ++++++>", resData);
              this.btnloader = false;
              // loadingEl.dismiss();
              // this.router.navigateByUrl('/places/tabs/discover');
            },
            errRes => {
              console.log("errRes",errRes);
              this.btnloader = false;
              loadingEl.dismiss();
              // this.commonUtils.presentToast('error', errRes.error.message);
              this.message = errRes.error.message;
              // setTimeout(() => {
              //   this.message = null;
              // }, 3000);
            }
          );
        });
    }
  // login form submit end

    private showAlert(message: string) {
      this.alertCtrl
        .create({
          header: 'Authentication failed',
          message: message,
          buttons: ['Okay']
        })
        .then(alertEl => alertEl.present());
    }

    // ..... resetPasswordOpenModal start ......
    async resetPasswordOpenModal(_identifier, _item, _items) {
      // console.log('_identifier >>', _identifier);
      let profileDetails_modal;
      profileDetails_modal = await this.modalController.create({
        component: ModalPage,
        cssClass: 'mymodalClass password',
        componentProps: { 
          identifier: _identifier,
          modalForm_item: _item,
          modalForm_array: _items
        }
      });
      
      // modal data back to Component
      profileDetails_modal.onDidDismiss()
      .then((getdata) => {
        console.log('getdata >>>>>>>>>>>', getdata);
        if(getdata.data == 'submitClose'){
        }

      });

      return await profileDetails_modal.present();
    }
    // resetPasswordOpenModal end 

    tabClick(tab) {
      // console.log(tab);
    }
    termsConditions(e)
    {
      // console.log("Event",e);
      
    }
   // Date format change start
  dateFormatChange(_identifier, event: MatDatepickerInputEvent<Date>){
    console.log('_identifier', _identifier);
    console.log('_data', event);
    
    this.model.dob = moment(event.value).format('YYYY/MM/DD');
    console.log('this.model.dob ', this.model.dob );
    
  }
  passwordvalid(new_password,conform_password)
  {
    console.log(new_password,conform_password);
    if (conform_password == undefined) {
      this.errormsg = '';
        
    }else if (new_password!=conform_password) {
        this.errormsg = "Password and conform password  not match.";
        setTimeout(()=>{                           // <<<---using ()=> syntax
          // this.errormsg = "";
      }, 3000);
    }else  if (new_password==conform_password)
    {
      this.errormsg = "";
    }
    else
    {
      this.errormsg = "";
    }
    
  }
  ngsel(e)
  {
      
  }
  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.formSubmitSubscribe !== undefined){
      this.formSubmitSubscribe.unsubscribe();
    }
  }
  // destroy subscription end

}
