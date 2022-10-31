import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';

@Component({
  selector: 'app-product-specification',
  templateUrl: './product-specification.page.html',
  styleUrls: ['./product-specification.page.scss'],
})
export class ProductSpecificationPage implements OnInit {

  private getsubCategorybyIdSubscribe:Subscription;
  private getCategoryListSubscribe: Subscription;
  private permissionDataSubscribe: Subscription;
  private getspecificationByIdSubscribe:Subscription;
  allspecificationdata: any;
  private addspecificationsSubscribe: Subscription;
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
  specificationType = [
    { type:'select',viewvalue:'Select'},
    { type:'input',viewvalue:'Input'}]
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
    //             console.log('moduleUrlNameYes',moduleUrlName[0],pageUrlName[1]);
    //             if(this.parms_action_name == 'add' && item.modPrivs.create == true){
    //                console.log('-----Permission create Granted-----');

    //               break;
    //             }else if(this.parms_action_name == 'edit' && item.modPrivs.update == true){
    //               console.log('-----Permission update Granted-----');
    //               this.getspecificationById();
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
              console.log('moduleUrlName,pageUrlName[1],moduleUrlName[0]',moduleUrlName,pageUrlName[1],moduleUrlName[0]);
              
              
              if(pageUrlName[1] == moduleUrlName[0]){
                console.log('pageUrlName[1]', pageUrlName[1]);
                
                if(this.parms_action_name == 'add' && item.modPrivs.create == true){
                   console.log('-----Permission create Granted-----');

                  break;
                }else if(this.parms_action_name == 'edit' && item.modPrivs.update == true){
                  console.log('-----Permission update Granted-----');
                  this.getspecificationById()
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
  // getspecificationById start
  getspecificationById()
  {
    this.loader = true;
    this.getspecificationByIdSubscribe = this.http.get("specification/view/"+this.parms_action_id).subscribe(
      (res:any) => {
        this.loader =false;
        // this.commonUtils.presentToast('success',res.message)
        console.log("getspecificationByIdSubscribe",res);
        this.model = {
          categoryId:         res.categoryId,
          categoryName:       res.categoryName,
          type:                 res.type,
          requiredval:             res.required,
          name:                 res.name,
        //  option :this.values,
        }
        this.categoryId = res.categoryId;
        this.categoryName = res.categoryName;
        this.values = res.option;
        // this.values
        // this.values.push({name: });
        console.log("specification",this.model);
        
      },
      (error) =>{
        this.loader =false;
        console.log("error",error.error.message);
        this.commonUtils.presentToast('error',error.error.message)
      })
  }
  // getspecificationById end
  values:any = [{}];
  removevalue(i){
    this.values.splice(i,1);
  }
  addvalue(){
    this.values.push({name: ""});
  }
  // categorySelected start
  categoryName;
  categoryId;
  categorySelected(category)
  {
    console.log(category);
    
    this.categoryName = category.categoryName;
    this.categoryId = category.id;
  }
  // categorySelected end
  // form submit start
  onSubmitspecificationsForm(form:NgForm)
  {
    this.btnloader = true;
    console.log("this.values",this.values,form.value);
    
    // add api start
    if(this.parms_action_name == 'add')
    {
      // set all value
        this.allspecificationdata={
          categoryName:this.categoryName,
          categoryId:this.categoryId,
          option :this.values,
          type:form.value.type,
          required:form.value.requiredval,
          name:form.value.name,
        }
        // if(this.values)
        // this.values = [{}]
        // set all val
        this.addspecificationsSubscribe = this.http.post('specification/add',this.allspecificationdata).subscribe((res:any) =>{
            // window.location.reload();
            console.log("allspecificationdata",this.allspecificationdata,"response",res);
            this.router.navigateByUrl('/specification-list')
            this.btnloader = false;
            this.commonUtils.presentToast('success', res.message);
            
            form.reset();
            // this.router.navigateByUrl('/specifiction-list')
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
      console.log("else",this.model);      
      this.allspecificationdata={
        categoryName:this.categoryName,
        categoryId:this.categoryId,
        option :this.values,
        type:form.value.type,
        required:form.value.requiredval,
        name:form.value.name,
      }
      
      console.log("this.allcategorydata",this.allspecificationdata);
      
      this.addspecificationsSubscribe = this.http.put("specification/update/"+this.parms_action_id,this.allspecificationdata).subscribe((res:any) =>{
        console.log("specification",this.allspecificationdata,"response",res);
        this.btnloader = false;
        this.commonUtils.presentToast('success', res.message);
        this.router.navigateByUrl('/specification-list')
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
    console.log("Select Type",e,this.values.length);
    if(e == 'input'){
      this.values = [];
    }else if(e == 'select'){
      // this.values = [{}];
    }

  }
  // ngOnDestroy start
  ngOnDestroy() {
    if(this.addspecificationsSubscribe !== undefined){
      this.addspecificationsSubscribe.unsubscribe();
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
    if(this.getspecificationByIdSubscribe !== undefined){
      this.getspecificationByIdSubscribe.unsubscribe();
    }
  }  
  // ngOnDestroy end

}
