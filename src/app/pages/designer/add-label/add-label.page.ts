import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
@Component({
  selector: 'app-add-label',
  templateUrl: './add-label.page.html',
  styleUrls: ['./add-label.page.scss'],
})
export class AddLabelPage implements OnInit {
  values:any = [{}];
  btnloader:boolean;
  parms_action_name: string;
  parms_categoryName: string;
  private permissionDataSubscribe: Subscription;
  private getCategoryListSubscribe: Subscription;
  categoryslist;
  model: any = {};
  subcategorylist: any;
  getsubCategoryListSubscribe: Subscription;
  imageString: any;
  uplodeimgloader: boolean;
  allLebeldata;
  private addLebelSubscribe: Subscription;
  private getMeasurementSubscribe: Subscription;
  Lebel_id;
  parms_subcategoryName: string;
  categoryId: any;
  parms_LevelName: string;
  getLevelSubscribe: Subscription;
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
    this.parms_LevelName = this.activatedRoute.snapshot.paramMap.get('name');
    console.log('parms_action_name', this.parms_action_name);
    console.log('parms_action_id', this.parms_LevelName);
   
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
                  //  this.getcategoryList();
    // this.getproductMeasurement()
                  break;
                }
                else 
                if(this.parms_action_name == 'edit' && item.modPrivs.update == true){
                  console.log('-----Permission update Granted-----');
                  this.getLevel();
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
  // // commonFunction end

  // //       // getspecificationById start
  getLevel()
  {
    this.loader = true;
    this.getLevelSubscribe = this.http.get("adminMData/getDesignerCategory/"+this.parms_LevelName).subscribe(
      (res:any) => {
        this.loader = false;
        console.log("getLebelDataSubscribe",res);
          this.Lebel_id = res.id;
          this.model = {
            Name: res.Name,
        }
        console.log("Mesorment",this.model);
        
      },
      (error) =>{
        this.loader = false;
        console.log("error",error.error.message);
        this.commonUtils.presentToast('error',error.error.message)
      })
  }
    
  removevalue(i){
    this.values.splice(i,1);
  }
  addvalue(){
    this.values.push({name: ""});
  }
  // form submit start
  onSubmitLebelForm(form:NgForm)
  {
    this.btnloader = true;
      console.log("allLebeldata",this.values,form.value);
    
    // add api start
    if(this.parms_action_name == 'add')
    {
      // set all value
      let allLebel:any = []
      for(let i = 0; i< this.values.length;i++)
      {
        allLebel.push(this.values[i].name)
      }
      console.log("allLebeldata",this.values,form.value,allLebel);
        this.allLebeldata={
          id:101,
          designerLevels :allLebel,
          metaKey: "DESIGNER_LEVELS", 
        }
        // set all val

      this.addLebelSubscribe = this.http.put('adminMData/addDesignerCategory',this.allLebeldata).subscribe((res:any) =>{
          // window.location.reload();
          console.log("allLebeldata",this.allLebeldata,"response",res);
          this.router.navigateByUrl('/specifiction-list')
          this.commonUtils.presentToast('success', res.message);
          this.btnloader = false;
          form.reset();
          this.router.navigateByUrl('/level-designer');
          this.values = null;
          },error =>{
            console.log(error);
            this.btnloader = false;
            this.commonUtils.presentToast('error', error.error.message);
        })
    }
    // add api end
    // edit api start
    else if(this.parms_action_name == 'edit')
    {
      console.log("else",this.model); 
      let allLebel:any = []
        allLebel.push(form.value.Name)
        var updateLevel={
          designerLevels :allLebel, 
        }
      this.addLebelSubscribe = this.http.put("adminMData/updateDesignerLevels/"+this.parms_LevelName,updateLevel).subscribe((res:any) =>{
        console.log("updateLevel",res);
       this.commonUtils.presentToast('success', res.message);
        this.router.navigateByUrl('/level-designer')
        form.reset();

        },error =>{
          this.commonUtils.presentToast('success', error.error.message);
      })
    } 
    // edit api end
    
  }
  //  form submit end  
  ngOnDestroy() {
    if(this.permissionDataSubscribe !== undefined){
      this.permissionDataSubscribe.unsubscribe();
    }
    if(this.getLevelSubscribe !== undefined){
      this.getLevelSubscribe.unsubscribe();
    }
  }  

}
