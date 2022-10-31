import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {ToastController,ModalController,AlertController,MenuController,} from "@ionic/angular";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth/auth.service";
import { CommonUtils } from "src/app/services/common-utils/common-utils";
import { ModalPage } from "../../modal/modal.page";


@Component({
  selector: 'app-designer-view',
  templateUrl: './designer-view.page.html',
  styleUrls: ['./designer-view.page.scss'],
})
export class DesignerViewPage implements OnInit {
  private getProfileData: Subscription;
  parms_actionId;
  designerData: any={};
  pagePermission: any;
  permissionDataSubscribe: Subscription;
  btnloader: boolean;
  onSubmitAdminSubscribe: Subscription;
  model:any={};
  private LebellistDataSubcribe: Subscription;
  Lebellist=[];

  constructor( public menuCtrl: MenuController,private http:HttpClient,
    private modalController : ModalController,
    private alertController:AlertController,
    private commonUtils: CommonUtils,
    private router:Router,private activatedRoute: ActivatedRoute,private authService: AuthService) { }
  edit = false;
  ngOnInit() {
    this.commonFunction();
    
  }
  commonFunction()
  {
    this.parms_actionId = this.activatedRoute.snapshot.paramMap.get('id');
    
    /*Check permission status start*/
    this.authService.globalparamsData.subscribe(res => {
      console.log('res>>', res);
      if(res.authority == 'ADMIN'){
        this.permissionDataSubscribe = this.commonUtils.menuPermissionObservable.subscribe(data => {
          if(data){
            console.log('menu>>', data);
            console.log('this.router.url>>', this.router.url);
    
            let pageUrl = this.router.url.split("/");
            console.log('pageUrl', pageUrl);
    
            for(let item of data) {
              if(item.modDetails.url == 'designer-list'){
                if(item.modPrivs.list == true){
                  console.log('-----Permission Granted-----');
                  this.pagePermission = item;
                  console.log('this.pagePermission', this.pagePermission);
                  this.getDesignerProfiledata();
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
  // getDesignerProfiledata start
  getDesignerProfiledata()
  {
    
    this.getProfileData = this.http.get("designer/"+this.parms_actionId).subscribe(
      (res:any) => {
        this.designerData = res;
        this.getLebellist();
        this.model = {
          displayName:res.designerProfile.displayName,
          designerCategory:res.designerProfile.designerCategory,
        }
      },
      (error) =>{
        // this.formBtn = true;
        console.log("error",error);
      })
  }
  // getDesignerProfiledata end
  onSubmitAdminUpdateForm(form:NgForm)
  {
    this.btnloader = true;
    this.onSubmitAdminSubscribe = this.http.get("hsn/view/",form.value).subscribe(
      (res:any) => {
        console.log("res",res);
        this.btnloader = false;
      },
      (error) =>{
        this.btnloader = false;
        console.log("error",error);
      })
  }
    // getLebellist start
    getLebellist()
    {
      this.LebellistDataSubcribe = this.http.get("adminMData/getDesignerCategory").subscribe((res:any) =>{
        this.Lebellist = res.data;
        },error =>{
          console.log(error);
          this.commonUtils.presentToast('error', error.error.message);
      })
    }
    // getLebellist end
    labelValue;
    selectLabel(value)
    {
      this.labelValue = value.Name;
      console.log("this.Lebellist",value,this.labelValue);
      
    }
  // ----------- destroy unsubscription start ---------
  ngOnDestroy() {
    if (this.getProfileData !== undefined) {
      this.getProfileData.unsubscribe();
    }
    if (this.LebellistDataSubcribe !== undefined) {
      this.LebellistDataSubcribe.unsubscribe();
    }
  }
  // ----------- destroy unsubscription end ---------
}
