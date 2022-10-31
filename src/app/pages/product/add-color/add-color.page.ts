import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';

@Component({
  selector: 'app-add-color',
  templateUrl: './add-color.page.html',
  styleUrls: ['./add-color.page.scss'],
})
export class AddColorPage implements OnInit {

  model: any = {};
  action: any;
  btnloader: boolean;
  private addColorSubscribe: Subscription;
  allcolordata: any;
  name: any;
  parms_action_name: string;
  private permissionDataSubscribe: Subscription;
  parms_color_name;
  private getColorSubscribe: Subscription;
  loader: boolean;
  constructor(private activatedRoute: ActivatedRoute,private authService:AuthService,
    private http:HttpClient,private router:Router,private commonUtils:CommonUtils) { }
  ngOnInit() {
  }
  ionViewWillEnter() {
    this.commonFunction();
  }
  // commonFunction start
  commonFunction()
  {
    // get active url name
    this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);
    this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('action');
    this.parms_color_name = this.activatedRoute.snapshot.paramMap.get('name');
    
    console.log('parms_action_name', this.parms_action_name);
    console.log('parms_action_id', this.parms_color_name);

    /*Check permission status start*/
    this.authService.globalparamsData.subscribe(res => {
      console.log('res>>', res);
      if(res.authority == 'ADMIN'){
        this.permissionDataSubscribe = this.commonUtils.menuPermissionObservable.subscribe(data => {
          if(data){
            console.log('menu>>', data);
            console.log('this.router.url>>', this.router.url);
    
            let pageUrlName = this.router.url.split("/");
            console.log('pageUrlName', pageUrlName);
            
            for(let item of data) {
              let moduleUrlName = item.modDetails.url.split("-");
              console.log('moduleUrlName',moduleUrlName,pageUrlName);
              
              if(pageUrlName[1] == moduleUrlName[0]){
                if(this.parms_action_name == 'add' && item.modPrivs.create == true){
                   console.log('-----Permission create Granted-----');
                  break;
                }else if(this.parms_action_name == 'edit' && item.modPrivs.update == true){
                  console.log('-----Permission update Granted-----');
                   this.getcolorByName();
                  break;
                }else {
                  console.log('-------No Permission--------');
                  this.router.navigateByUrl('/error');
                }
                
              }
            }
          }
        })
      }else {
        this.router.navigateByUrl('/error');
      }
    })
    /*Check permission status end*/
  }
  // getcolorByName start
  getcolorByName()
  {
    this.loader = true;
    this.getColorSubscribe = this.http.get("adminMData/getColour/"+this.parms_color_name).subscribe((res:any) =>{
      console.log("Color Data",this.allcolordata,"response",res);
      // this.commonUtils.presentToast('success', res.message);
    this.loader = false;
      this.model = {
        colorName:res.colorName,
        colorValueCreate:res.colorValue,
        isActive:res.isActive
      }
     },
     error =>{
        this.loader = false;
        this.btnloader =false;
        this.commonUtils.presentToast('success', error.error.message);
        // recall category list
    })
  }
  // getcolorByName end
  // onSubmitColorForm start
  onSubmitColorForm(form:NgForm)
  {
    this.btnloader =true;
    console.log("from",form.value);
    if(this.parms_action_name == 'add')
    {
      this.addColorSubscribe = this.http.put("adminMData/addColour",form.value).subscribe((res:any) =>{
        console.log("Color Data",this.allcolordata,"response",res);
        this.btnloader =false;
        
        this.commonUtils.presentToast('success', res.message);
        this.router.navigateByUrl('/color-list')
        form.reset();
        },error =>{
          this.btnloader =false;
          // console.log("error",error);
          this.commonUtils.presentToast('error', error.error.message);
          // recall category list
      })
    }else if(this.parms_action_name == 'edit')
    {
      this.addColorSubscribe = this.http.put("adminMData/updateColours/"+this.parms_color_name,form.value).subscribe((res:any) =>{
        
        this.commonUtils.presentToast('success', res.message);
        this.router.navigateByUrl('/color-list')
        form.reset();
        },error =>{
          this.btnloader =false;
          this.commonUtils.presentToast('success', error.error.message);
      })
    }
    
  }
  // onSubmitColorForm end
  ngOnDestroy() {
    if(this.addColorSubscribe !== undefined){
      this.addColorSubscribe.unsubscribe();
    }
    if(this.permissionDataSubscribe !== undefined){
      this.permissionDataSubscribe.unsubscribe();
    }
  }
}
