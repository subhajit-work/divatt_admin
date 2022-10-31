import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides, MenuController } from '@ionic/angular';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  
  @ViewChild('slider', { static: true }) private slider: IonSlides;
  hide = true;
  hide2 = true;
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
  btnloader: boolean;
  link: any;
  time: any;
  newPass: any;
  data: any;
  errormsg: string;
  model:any = {};
  constructor(
    public menuCtrl: MenuController,private http:HttpClient,
    private activatedRoute :ActivatedRoute,
    private route:Router,
    private commonUtils:CommonUtils
  ) { }
  public slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  ngOnInit() {
    this.link = this.activatedRoute.snapshot.params.link;
    this.time = this.activatedRoute.snapshot.params.linktime;
  }
  onsubmitResetform(form:NgForm)
  {
  console.log(form.value.newPass);
  
    this.data = {newPass:form.value.newPass};
    this.btnloader = true;
    this.http.post("auth/resetPassword/"+this.link+"/"+this.time,this.data).subscribe(
      (res:any) => {
        console.log("p",res);
        
        if(res.status == 200)
        {
          this.commonUtils.presentToast('success', res.message);
          this.route.navigateByUrl('/auth');
        }
        else
        {
          this.commonUtils.presentToast('error', res.message);
        }
        this.btnloader = false;
      },
      (error) =>{
        console.log(error);
        
        this.btnloader = false;
        this.commonUtils.presentToast('error', error.error.message);
      })
  }
  passwordvalid(new_password,conform_password)
  {
    console.log(new_password,conform_password);
    if (conform_password == undefined) {
      this.errormsg = '';
        
    }else if (new_password!=conform_password) {
        this.errormsg = "New password and conform password  not match.";
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
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }
// mailForgotPasswordLink

}
