import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.page.html',
  styleUrls: ['./add-role.page.scss'],
})
export class AddRolePage implements OnInit {

  /*Variable start*/
  model: any = {};
  parms_action_name;
  parms_action_id;
  editApi;
  editForm_api;
  form_api;
  actionHeaderText;
  editLoading = false;
  private editDataSubscribe: Subscription;
  private formSubmitSubscribe: Subscription;
  private getmodules:Subscription;
  private permissionDataSubscribe: Subscription;
  allEditData;
  getmoduleList_api;
  moduleList;
  /*Variable end*/

  constructor(
    public toastController: ToastController,
    public menuCtrl: MenuController,
    private http : HttpClient,
    private commonUtils: CommonUtils, // common functionlity come here
    private router: Router,
    private activatedRoute : ActivatedRoute,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.commonFunction();
  }

  ionViewWillEnter() {
    this.commonFunction();
  }

  commonFunction(){
    // get active url name
    this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);
    this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('action');
    this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
    
    console.log('parms_action_name', this.parms_action_name);
    console.log('parms_action_id', this.parms_action_id);

    // get module api
    this.getmoduleList_api = 'admin/modules';

    // form_api Api
    this.form_api = 'admin/role';

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
                   this.getmoduleList();
                  break;
                }else if(this.parms_action_name == 'edit' && item.modPrivs.update == true){
                  console.log('-----Permission update Granted-----');
                  this.editApi = 'admin/role/'+this.parms_action_id;

                  // init call
                  this.init();
                  this.getmoduleList();
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

  /* -------------Get modules start------------- */
  getmoduleList(){
    this.editLoading = true;
    this.getmodules = this.http.get(this.getmoduleList_api).subscribe(
        (res:any) => {
          this.moduleList = res; 
          console.log("Get moduleList",this.moduleList);
          
          this.editLoading = false;
        },
        errRes => {
           console.log("Get moduleList >", errRes); 
           this.editLoading = false; 
        }
      );
  }
  /*Get modules end */
  
  // ---------- init start ----------
  init(){
    if( this.parms_action_name == 'edit'){
      this.actionHeaderText = 'Edit';

      this.editLoading = true;
      //edit data call
      this.editDataSubscribe = this.http.get(this.editApi).subscribe(
        (res:any) => {
          this.editLoading = false;
          console.log("Edit data  res >", res.return_data);
          this.model = {
            roleName : res.roleName,
            modules: res.modules
          }; 
          console.log('modules', this.model.modules);
          
          // this.ngsel(this.model.instId);
          this.model.creatDate = moment(res.lcCreatDate).format('YYYY-MM-DD');
          console.log('this.model.creatDate', this.model);
          

          // edit data
          this.allEditData = res;
          console.log('this.allEditData', this.allEditData);
          
        },
        errRes => {
          // this.selectLoadingDepend = false;
          this.editLoading = false;
        }
      );

    }else{
      this.actionHeaderText = 'Add';
    }
  }
  // ---------- init end ----------

  // ======================== form submit start ===================
  formLoading = false;
  onSubmitForm(form:NgForm){
    console.log("add form submit >", form.value);
    this.formLoading = true;

    let formValue = form.value;
    
    console.log('formValue', formValue);

    let modules=[];
    console.log('formValue.length', formValue.length);
    console.log('formValue.modules[index].modName', formValue.modules0modName);
    

    for (let index = 0; index < formValue.length; index++) {
      
      modules.push({
        "modName": formValue[`modules`+index+`modName`],
        "modPrivs":{
          "create": formValue[`modules`+index+`create`],
          "update": formValue[`modules`+index+`update`],
          "list": formValue[`modules`+index+`list`],
          "delete": formValue[`modules`+index+`delete`]
        }
      });
      
    }
    console.log('modules', modules);

    let formAllData = {
      "roleName": formValue.roleName,
      "modules": modules
    };


    console.log('formAllData',formAllData);
    

    if(!form.valid){
      return;
    }

    if(this.parms_action_name == 'edit'){
      this.formSubmitSubscribe = this.http.post(this.editForm_api, formAllData).subscribe(
        (response:any) => {
          this.formLoading = false;
          console.log("add form response >", response);
  
          if(response.status == 200){
            this.router.navigateByUrl('role-list');
            this.commonUtils.presentToast('success', response.message);
            form.reset();
          }else {
            this.commonUtils.presentToast('error', response.message);
          }
        },
        errRes => {
          this.formLoading = false;
        }
      );
    }else if(this.parms_action_name == 'add'){
      this.formSubmitSubscribe = this.http.post(this.form_api, formAllData).subscribe(
        (response:any) => {
          this.formLoading = false;
          console.log("add form response >", response);
  
          if(response.status == 200){
            this.router.navigateByUrl('role-list');
            this.commonUtils.presentToast('success', response.message);
            form.reset();

            this.getmoduleList();
          }else {
            this.commonUtils.presentToast('error', response.message);
          }
        },
        errRes => {
          this.formLoading = false;
        }
      );
    }

  }
  // form submit end

  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.formSubmitSubscribe !== undefined){
      this.formSubmitSubscribe.unsubscribe();
    }
    if(this.editDataSubscribe !== undefined ){
      this.editDataSubscribe.unsubscribe();
    }
    if(this.permissionDataSubscribe !== undefined){
      this.permissionDataSubscribe.unsubscribe();
    }
  }
  // destroy subscription end
}