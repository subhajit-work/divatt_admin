import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.page.html',
  styleUrls: ['./add-category.page.scss'],
})
export class AddCategoryPage implements OnInit {
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
  private getCategorybyIdSubscribe:Subscription;
  private addCategorySubscribe: Subscription;
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
              console.log('moduleUrlName',moduleUrlName);
              
              if(pageUrlName[1] == moduleUrlName[0]){
                if(this.parms_action_name == 'add' && item.modPrivs.create == true){
                   console.log('-----Permission create Granted-----');

                  break;
                }else if(this.parms_action_name == 'edit' && item.modPrivs.update == true){
                  console.log('-----Permission update Granted-----');
                  this.getcatById();
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
  // commonFunction end
  // getcatById start
  getcatById()
  {
    this.loader = true;
    this.getCategorybyIdSubscribe = this.http.get("category/view/"+this.parms_action_id).subscribe(
      (res:any) => {
        console.log("res",res);
        this.loader = false;
        this.model = {
          categoryName:res.categoryName,
          categoryDescription:res.categoryDescription,
          categoryImage:res.categoryImage,
          id:res.id,
          createdBy:res.createdBy,
        }
        this.imageSrc = res.categoryImage;
        this.previewimageSrc = res.categoryImage;
      },
      (error) =>{
        this.loader = false;
        console.log("error",error);
      })
  }
  // getcatById end
  /* -----------Image uploading start----------- */
  public imageSrc: string = '';
  public previewimageSrc: string = '';
  public fd;
  handleInputChange(e) {
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
    this.imageSrc= e.target.files[0];
    var fd = new FormData();  
    fd.append("file", e.target.files[0]);
    this.http.post("admin/profile/s3/upload",fd).subscribe(
      (res:any) => {
        this.imageSrc = res.path;
        this.model.categoryImage = res.path;
        console.log("profileimgpath",this.imageSrc);
        // this.commonUtils.presentToast('success', res.message);
      },
      (error) =>{
        console.log("error",error);
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
  onSubmitCategortForm(form:NgForm)
  {

    this.btnloader =true;
    // add api start
    if(this.parms_action_name == 'add')
    {
      // set all value
        this.allcategorydata={
          categoryDescription:form.value.categoryDescription,
          categoryName:form.value.categoryName,
          categoryImage:this.imageSrc,
          level:0,
          // createdBy:this.categoryModel.createdBy,
          createdBy:'Admin',
        }
        // set all val
        
        this.addCategorySubscribe = this.http.post('category/add',this.allcategorydata).subscribe((res:any) =>{
          // window.location.reload();
          console.log("allcategorydata",this.allcategorydata,"response",res);
          this.btnloader =false;
         
          this.commonUtils.presentToast('success', res.message);
          this.router.navigateByUrl('/category-list')
          form.reset();
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
      // if(this.imageSrc == '')
      // {
        // this.nofile = true;
        this.allcategorydata={
          categoryDescription:form.value.categoryDescription,
          categoryName:form.value.categoryName,
          categoryImage:this.imageSrc,
          level:0,
          id:this.model.id,
          createdBy:this.model.createdBy,
          
          }
    
      this.addCategorySubscribe = this.http.put("category/update/"+this.parms_action_id,this.allcategorydata).subscribe((res:any) =>{
        console.log("allcategorydatay",this.allcategorydata,"response",res);
        this.btnloader =false;
        
        // window.location.reload();
        this.commonUtils.presentToast('success', res.message);
        this.router.navigateByUrl('/category-list')
        form.reset();
         },error =>{
          this.btnloader =false;
          // console.log("error",error);
          this.commonUtils.presentToast('error', error.error.message);
          // recall category list
      })
    } 
    // edit api end
    
  }
  // onSubmitCategortForm end
    
  // ngOnDestroy start
  ngOnDestroy() {
    if(this.getCategorybyIdSubscribe !== undefined){
      this.getCategorybyIdSubscribe.unsubscribe();
    }
    if(this.addCategorySubscribe !== undefined){
      this.addCategorySubscribe.unsubscribe();
    }
  }  
  // ngOnDestroy end
}
