import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.page.html',
  styleUrls: ['./banner.page.scss'],
})
export class BannerPage implements OnInit {

  loader: boolean;
 constructor(
    private activatedRoute: ActivatedRoute,
    private http:HttpClient,
    private router:Router,
    private commonUtils:CommonUtils,
    private authService: AuthService,
    ) { }
  model: any = {};
  btnloader
  categoryImage: any;
  mobileImage: any;
  allcategorydata: { };
  parms_action_name;
  parms_action_id;
  nofile: boolean;
  imgerror: string;
  private getBannerbyIdSubscribe:Subscription;
  private addBannerSubscribe: Subscription;
  private permissionDataSubscribe: Subscription;
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
    this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
    
    console.log('parms_action_name', this.parms_action_name);
    console.log('parms_action_id', this.parms_action_id);

    /*Check permission status start*/
    // this.authService.globalparamsData.subscribe(res => {
    //   console.log('res>>', res);
    //   if(res.authority == 'ADMIN'){
    //     this.permissionDataSubscribe = this.commonUtils.menuPermissionObservable.subscribe(data => {
    //       if(data){
    //         console.log('menu>>', data);
    //         console.log('this.router.url>>', this.router.url);
    
    //         let pageUrlName = this.router.url.split("/");
    //         console.log('pageUrlName', pageUrlName);
            
    //         for(let item of data) {
    //           let moduleUrlName = item.modDetails.url.split("-");
    //           console.log('moduleUrlName',moduleUrlName);
              
    //           if(pageUrlName[1] == moduleUrlName[0]){
    //             if(this.parms_action_name == 'add' && item.modPrivs.create == true){
    //                console.log('-----Permission create Granted-----');

    //               break;
    //             }else if(this.parms_action_name == 'edit' && item.modPrivs.update == true){
    //               console.log('-----Permission update Granted-----');
    //               this.getBannerById();
    //               break;
    //             }else {
    //               console.log('-------No Permission--------');
    //               this.router.navigateByUrl('/error');
    //             }
                
    //           }
    //         }
    //       }
    //     })
    //   }else {
    //     this.router.navigateByUrl('/error');
    //   }
    // })
    /*Check permission status end*/
                  this.getBannerById();

  }
  // commonFunction end
  // getBannerById start
  getBannerById()
  {
    this.loader = true;
    this.getBannerbyIdSubscribe = this.http.get("adminMData/getBanner/"+this.parms_action_id).subscribe(
      (res:any) => {
        console.log("res",res);
        this.loader = false;
        this.model = {
          title:res.title,
          description:res.description,
          image:res.image,
        }
        this.imageSrc = res.image;
        this.previewimageSrc = res.image;
      },
      (error) =>{
        this.loader = false;
        console.log("error",error);
      })
  }
  // getBannerById end
  /* -----------Image uploading start----------- */
  public imageSrc: string = null;
  public previewimageSrc: string = '';
  public fd;
  uploader = false;
  handleInputChange(e) {
    this.uploader = true;
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    
    console.log(this.imageSrc);
    this.imageSrc = null;
    // this.file = null;
    // this.imageSrc= e.target.files[0];
    var fd = new FormData();  
    fd.append("file", e.target.files[0]);
    this.http.post("admin/profile/s3/upload",fd).subscribe(
      (res:any) => {
        this.imageSrc = res.path;
        this.model.image = res.path;
        console.log("profileimgpath",this.imageSrc);
        this.uploader = false;


        // this.commonUtils.presentToast('success', res.message);
      },
      (error) =>{
        console.log("error",error);
        this.uploader = false;


        this.commonUtils.presentToast('error', error.error.message);
      })
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    
      this.previewimageSrc = reader.result;
  }
  /* Image uploading end */
  // onSubmitCategortForm start 
  onSubmitbannerForm(form:NgForm)
  {

    this.btnloader =true;
    // add api start
    if(this.parms_action_name == 'add')
    {
        
        this.addBannerSubscribe = this.http.post('adminMData/addBanner',form.value).subscribe((res:any) =>{
          console.log("allcategorydata",this.allcategorydata,"response",res);
          this.btnloader =false;
         
          this.commonUtils.presentToast('success', res.message);
          this.router.navigateByUrl('/banner-list')
          form.reset();
          this.imageSrc ='';
        },error =>{
            console.log(error);
            this.btnloader =false;
            this.commonUtils.presentToast('error', error.error.message);
        })
        console.log("allda",this.allcategorydata);
        
    }
    // add api end
    // edit api start
    else if(this.parms_action_name == 'edit')
    {
    
      this.addBannerSubscribe = this.http.put("adminMData/updateBanner/"+this.parms_action_id,form.value).subscribe((res:any) =>{
        console.log("allcategorydatay",this.allcategorydata,"response",res);
        this.btnloader =false;
        
        // window.location.reload();
        this.commonUtils.presentToast('success', res.message);
        this.router.navigateByUrl('/banner-list')
        form.reset();
         },error =>{
          this.btnloader =false;
          this.commonUtils.presentToast('error', error.error.message);
      })
    } 
    // edit api end
    
  }
  // onSubmitCategortForm end
    
  // ngOnDestroy start
  ngOnDestroy() {
    if(this.getBannerbyIdSubscribe !== undefined){
      this.getBannerbyIdSubscribe.unsubscribe();
    }
    if(this.addBannerSubscribe !== undefined){
      this.addBannerSubscribe.unsubscribe();
    }
    if(this.permissionDataSubscribe !== undefined){
      this.permissionDataSubscribe.unsubscribe();
    }
  }  
  // ngOnDestroy end

}
