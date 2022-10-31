import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';

@Component({
  selector: 'app-add-subcategory',
  templateUrl: './add-subcategory.page.html',
  styleUrls: ['./add-subcategory.page.scss'],
})
export class AddSubcategoryPage implements OnInit {

  private getsubCategorybyIdSubscribe:Subscription;
  private addsubCategorySubscribe: Subscription;
  private getCategoryListSubscribe: Subscription;
  private permissionDataSubscribe: Subscription;
  loader: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private http:HttpClient,
    private router:Router,
    private commonUtils:CommonUtils,
    private authService: AuthService,
    ) { }
  model: any = {};
  categoryImage: any;
  mobileImage: any;
  allcategorydata: { };
  categoryslist;
  nofile: boolean;
  imgerror: string;
  btnloader: boolean;
  parms_action_name;
  parms_action_id;
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
    this.getcategoryList();

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
    this.getsubCategorybyIdSubscribe = this.http.get("subcategory/view/"+this.parms_action_id).subscribe(
      (res:any) => {
      this.loader = false;

        this.model = {
          categoryName:         res.categoryName,
          categoryDescription:  res.categoryDescription,
          categoryImage:        res.categoryImage,
          id:                   res.id,
          createdBy:            res.createdBy,
          parentId:             parseInt(res.parentId),
        }
        this.imageSrc = res.categoryImage;
        this.previewimageSrc = res.categoryImage;
        console.log("this.model",this.model);
        
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
    handleInputChange(e) {
      var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
      var pattern = /image-*/;
      var reader = new FileReader();
      if (!file.type.match(pattern)) {
        alert('invalid format');
        return;
      }
      this.imageSrc= e.target.files[0];
      var fd = new FormData();  
      fd.append("file", e.target.files[0]);
      this.http.post("admin/profile/s3/upload",fd).subscribe(
        (res:any) => {
          this.imageSrc = res.path;
          this.previewimageSrc = res.path;
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
      console.log("imageSrc1",this.imageSrc);
    }
    /* Image uploading end */
  // form submit start
  onSubmitsubCategoryForm(form:NgForm)
  {
    this.btnloader = true;
    // add api start
    if(this.parms_action_name == 'add')
    {
      // set all value
        this.allcategorydata={
          categoryDescription:form.value.categoryDescription,
          categoryName:form.value.categoryName,
          parentId:form.value.parentId,
          categoryImage:this.imageSrc,
          level:0,
          // createdBy:this.categoryModel.createdBy,
          createdBy:'Admin',
        }
        // set all val
        var fd = new FormData();  
        fd.append("categoryImage", this.imageSrc);
      this.addsubCategorySubscribe = this.http.post('subcategory/add',this.allcategorydata).subscribe((res:any) =>{
          // window.location.reload();
          console.log("allcategorydata",this.allcategorydata,"response",res);
          this.router.navigateByUrl('/subcategory-list')
          this.btnloader = false;
          this.commonUtils.presentToast('success', res.message);
          form.reset();
          },error =>{
            this.btnloader = false;
            console.log(error);
            this.commonUtils.presentToast('error', error.error.message);
        })
    }
    // add api end
    // edit api start
    else if(this.parms_action_name == 'edit')
    {
      console.log("else",this.imageSrc,this.model.categoryImage);      
        this.allcategorydata={
          categoryDescription:form.value.categoryDescription,
          categoryName:form.value.categoryName,
          categoryImage:this.imageSrc,
          level:0,
          id:this.model.id,
          parentId:form.value.parentId,
          createdBy:this.model.createdBy,
          
        }
      
      console.log("this.allcategorydata",this.allcategorydata);
      
      this.addsubCategorySubscribe = this.http.put("subcategory/update/"+this.parms_action_id,this.allcategorydata).subscribe((res:any) =>{
        console.log("allcategorydatay",this.allcategorydata,"response",res);
        this.btnloader = false;
        this.commonUtils.presentToast('success', res.message);
        this.router.navigateByUrl('/subcategory-list')
        form.reset();

        },error =>{
          this.btnloader = false;
          // console.log("error",error);
          this.commonUtils.presentToast('error', error.error.message);
          // recall category list
      })
    } 
    // edit api end
    
  }
  //  form submit end  
  // getcategoryList start
  getcategoryList()
  {
    this.getCategoryListSubscribe = this.http.get("category/list?limit=0").subscribe(
      (res:any) => {
        console.log("res",res);
        this.categoryslist = res.data
      },
      (error) =>{
        console.log("error",error);
      })
  }
  // getcategoryList end
      

  ngsel(e)
  {

  }
  // ngOnDestroy start
  ngOnDestroy() {
    if(this.addsubCategorySubscribe !== undefined){
      this.addsubCategorySubscribe.unsubscribe();
    }
    if(this.getCategoryListSubscribe !== undefined){
      this.getCategoryListSubscribe.unsubscribe();
    }
    if(this.getsubCategorybyIdSubscribe !== undefined){
      this.getsubCategorybyIdSubscribe.unsubscribe();
    }
    if(this.permissionDataSubscribe !== undefined){
      this.permissionDataSubscribe.unsubscribe();
    }
  }  
  // ngOnDestroy end
}
