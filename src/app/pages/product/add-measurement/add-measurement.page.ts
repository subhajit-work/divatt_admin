import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';

@Component({
  selector: 'app-add-measurement',
  templateUrl: './add-measurement.page.html',
  styleUrls: ['./add-measurement.page.scss'],
})
export class AddMeasurementPage implements OnInit {
  parms_action_name: string;
  parms_categoryName: string;
  btnloader;
  private permissionDataSubscribe: Subscription;
  private getCategoryListSubscribe: Subscription;
  categoryslist;
  model: any = {};
  subcategorylist: any;
  getsubCategoryListSubscribe: Subscription;
  imageString: any;
  uplodeimgloader: boolean;
  allmeasurementdata;
  private addmeasurementSubscribe: Subscription;
  private getMeasurementSubscribe: Subscription;
  measurement_id;
  parms_subcategoryName: string;
  categoryId: any;
  loader: boolean;
  constructor( private activatedRoute: ActivatedRoute,
    private http:HttpClient,
    private router:Router,
    private commonUtils:CommonUtils,
    private authService: AuthService,) { }
  ngOnInit(){
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
    this.parms_categoryName = this.activatedRoute.snapshot.paramMap.get('categoryName');
    this.parms_subcategoryName = this.activatedRoute.snapshot.paramMap.get('subcategoryName');
    console.log('parms_action_name', this.parms_action_name);
    console.log('parms_action_id', this.parms_categoryName);
   
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
                   this.getcategoryList();
    // this.getproductMeasurement()
                  break;
                }else if(this.parms_action_name == 'edit' && item.modPrivs.update == true){
                  console.log('-----Permission update Granted-----');
                  this.getcategoryList();
                  this.getproductMeasurement()
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
  getproductMeasurement()
  {
    this.loader = true;
    this.getMeasurementSubscribe = this.http.get("productMeasurement/view/"+this.parms_categoryName+'/'+this.parms_subcategoryName).subscribe(
      (res:any) => {
        // this.commonUtils.presentToast('success',res.message)
        console.log("getmeasurementDataSubscribe",res);
          this.loader = false;
          this.measurement_id = res.id;
          this.model = {
          categoryName:       res.categoryName,
          subCategoryName:       res.subCategoryName,
          name:                 res.name,
        //  option :this.values,
        }
        // this.categoryId = res.categoryId;
        // this.categoryName = res.categoryName;
        this.values = res.measurementKey;
        this.imageString = res.imageString
        // this.values
        // this.values.push({name: });
        console.log("Mesorment",this.model,this.values);
        
      },
      (error) =>{
        this.loader = false;
        console.log("error",error.error.message);
        this.commonUtils.presentToast('error',error.error.message)
      })
  }
  // getspecificationById end
  // getcategoryList start
  getcategoryList()
  {
    this.getCategoryListSubscribe = this.http.get("category/list?limit=0").subscribe(
      (res:any) => {
        console.log("res",res);
        this.categoryslist = res.data
        for(let i = 0;i < this.categoryslist.length; i++)
        {
          if(this.parms_categoryName == this.categoryslist[i].categoryName)
          {
            this.categoryId = this.categoryslist[i].id;
            this.categorySelected(this.categoryslist[i],'onload')
          }
        }
        
      },
      (error) =>{
        console.log("error",error);
      })
  }
  // categorySelected start
  categorySelected(event,calltype){
    console.log('event',event);
    var catid = event.id;
    if(catid != null)
    {
      console.log('catid', catid);
      if(calltype == 'onchange')
      {
        this.model.subCategoryId = null;
      }else if(calltype == 'onload')
      {
        console.log("calltype",calltype);
        
      }
        console.log("this.subcategorylist",this.subcategorylist);
        
        this.subcategorylist = [];
        // this.productdtl.extraSpecificationsvalue = null;
        console.log("this.subcategorylist",this.subcategorylist);
      
      this.getsubCategoryListSubscribe = this.http.get("subcategory/getAllSubcategory/"+catid).subscribe(
        (res:any) => {
          console.log("res",res);
          this.subcategorylist = res
        },
        (error) =>{
          // console.log("error",error);
          this.commonUtils.presentToast('error', error.error.message);
  
  
        })
    }
   
    
    // this.subcategorylist = 
    
  }
  // categorySelected end
  handleInputChange(e)
  {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
   var fd = new FormData();
    
    fd.append("file", e.target.files[0]);  
    this.http.post("admin/profile/s3/upload",fd).subscribe(
      (res:any) => {
         this.imageString = res.path;
        this.uplodeimgloader = false;
      },
      (error) =>{
        console.log("error",error);
        this.uplodeimgloader = false;
        this.commonUtils.presentToast('error', error.error.message);
    })
  }
    // getcategoryList end
    ngsel(e)
    {

    }
    values:any = [{}];
  removevalue(i){
    this.values.splice(i,1);
  }
  addvalue(){
    this.values.push({name: ""});
  }
    // form submit start
    onSubmitMeasurementForm(form:NgForm)
    {
       console.log("this.values",this.values,form.value);
      
      // add api start
      if(this.parms_action_name == 'add')
      {
        // set all value
          this.allmeasurementdata={
            categoryName:form.value.categoryName,
            measurementKey :this.values,
            metaKey: "PRODUCT_MEASUREMENTS", 
            imageString:this.imageString,
            subCategoryName:form.value.subCategoryName,

          }
          // set all val
        this.addmeasurementSubscribe = this.http.post('productMeasurement/add',this.allmeasurementdata).subscribe((res:any) =>{
            // window.location.reload();
            console.log("allspecificationdata",this.allmeasurementdata,"response",res);
            this.router.navigateByUrl('/specifiction-list')
           this.commonUtils.presentToast('success', res.message);
            
            form.reset();
            this.router.navigateByUrl('/measurement-list')
            },error =>{
              console.log(error);
              this.commonUtils.presentToast('error', error.error.message);
          })
      }
      // add api end
      // edit api start
      else if(this.parms_action_name == 'edit')
      {
        console.log("else",this.model);      
          this.allmeasurementdata={
            categoryName:form.value.categoryName,
            measurementKey :this.values,
            metaKey: "PRODUCT_MEASUREMENTS", 
            imageString:this.imageString,
            subCategoryName:form.value.subCategoryName,
            
          }
          // dikixif787@tagbert.com
        console.log("this.allcategorydata",this.allmeasurementdata);
        
        this.addmeasurementSubscribe = this.http.put("productMeasurement/update/"+this.measurement_id,this.allmeasurementdata).subscribe((res:any) =>{
          console.log("specification",this.allmeasurementdata,"response",res);
         this.commonUtils.presentToast('success', res.message);
          this.router.navigateByUrl('/measurement-list')
          form.reset();
  
          },error =>{
             // console.log("error",error);
            this.commonUtils.presentToast('error', error.error.message);
            // recall category list
        })
      } 
      // edit api end
      
    }
    //  form submit end  
  ngOnDestroy() {
    if(this.permissionDataSubscribe !== undefined){
      this.permissionDataSubscribe.unsubscribe();
    }
  }  
}
