import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IonSlides, MenuController } from '@ionic/angular';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  @ViewChild('slider', { static: true }) private slider: IonSlides;
  hide = true;
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
  message: any;
  message2: any;
  model:any={};
  constructor(
    public menuCtrl: MenuController,private http:HttpClient,private route:Router,private commonUtils:CommonUtils
  ) { }
  public slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  ngOnInit() {
    
  }
  onsubmitForgetform(form:NgForm)
  {
    this.btnloader = true;
    var mail = form.value.username;
    this.http.get("auth/mailForgotPasswordLink/"+mail).subscribe(
      (res:any) => {
        this.btnloader = false;
        // this.commonUtils.presentToast('success', res.message);
        this.message2 = res.message;
        setTimeout(() => {
                  // this.message2 = '';
                  form.reset();
                  this.route.navigateByUrl('/auth');
        }, 2000);
        
      },
      (error) =>{
        // this.commonUtils.presentToast('error', error.message);
        this.message = error.error.message;
        this.btnloader = false;
      })
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }
// mailForgotPasswordLink
}
