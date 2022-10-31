import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.page.html',
  styleUrls: ['./add-employee.page.scss'],
})


export class AddEmployeePage implements OnInit {

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
  private menuPermissionSubscribe: Subscription;
  private getroles:Subscription;
  private permissionDataSubscribe: Subscription;
  allEditData;
  getroleList_api;
  roleList;
  hideset = true;
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
    this.getroleList_api = 'admin/roles';

    // form_api Api
    this.form_api = 'admin/profile/add';

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
                   this.getroleList();
                  break;
                }else if(this.parms_action_name == 'edit' && item.modPrivs.update == true){
                  console.log('-----Permission update Granted-----');
                  this.getroleList();
                  this.editApi = 'admin/profile/'+this.parms_action_id;
                  // form api
                  this.editForm_api = 'admin/profile/update'
                  // init call
                  this.init();

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

  /* -------------Get roles start------------- */
  getroleList(){
    this.editLoading = true;
    this.getroles = this.http.get(this.getroleList_api).subscribe(
        (res:any) => {
          this.roleList = res; 
          console.log("Get roleList",this.roleList);
          
          this.editLoading = false;
        },
        errRes => {
           console.log("Get roleList >", errRes); 
           this.editLoading = false; 
        }
      );
  }
  /*Get roles end */

  /* -----------Image uploading start----------- */
  public imageSrc: string = '';

  handleInputChange(e) {
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
        this.imageSrc = res.path;
        this.model.profilePic = res.path;
        console.log("profileimgpath",this.imageSrc);
        // this.commonUtils.presentToast('success', res.message);
      },
      (error) =>{
        console.log("error",error);
        this.commonUtils.presentToast('error', error.error.message);
      })
  }
  /* Image uploading end */

  /* Default select start */
  ngsel(value)
  {
     console.log('Select >>>', value);
  }  

  // Date format change start
  changeDateFormat(_identifier, _date){
    console.log('_date', _date);
    console.log('_identifier', _identifier);

    if(_identifier == 'registrationDate') {
      this.model.isntRegDate = moment(_date).format('YYYY/MM/DD');
    }else if(_identifier == 'establishmentDate'){
      this.model.instEndDate = moment(_date).format('YYYY/MM/DD');
    }else if(_identifier == 'dateOfBirth'){
      this.model.dob = moment(_date).format('YYYY/MM/DD');
    }
    
    
    console.log('model.isntRegDate', this.model.isntRegDate);

  }
  // Date format change end
  
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
            firstName : res.firstName,
            lastName : res.lastName,
            dob : res.dob,
            email : res.email,
            mobileNo : res.mobileNo,
            role : res.role,
            roleName : res.roleName,
            uid : res.uid,
            profilePic : res.profilePic,
            password : res.password,
          }; 

          this.imageSrc =  res.profilePic;
          // this.ngsel(this.model.instId);
          this.model.chkdob = moment(res.dob).format('YYYY-MM-DD');
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

    if(!form.valid){
      return;
    }

    if(this.parms_action_name == 'edit'){
      this.formSubmitSubscribe = this.http.put(this.editForm_api, form.value).subscribe(
        (response:any) => {
          this.formLoading = false;
          console.log("add form response >", response);
  
          if(response.status == 200){
            this.router.navigateByUrl('employee-list');
            this.commonUtils.presentToast('success', response.message);
            form.reset();
          }else {
            this.commonUtils.presentToast('error', response.message);
          }
        },
        errRes => {
          this.formLoading = false;
          this.commonUtils.presentToast('error', errRes.message);
        }
      );
    }else if(this.parms_action_name == 'add'){
      this.formSubmitSubscribe = this.http.post(this.form_api, form.value).subscribe(
        (response:any) => {
          this.formLoading = false;
          console.log("add form response >", response);
  
          if(response.status == 200){
            this.router.navigateByUrl('employee-list');
            this.commonUtils.presentToast('success', response.message);
            form.reset();

            this.getroleList();
          }else {
            this.commonUtils.presentToast('error', response.message);
          }
        },
        errRes => {
          this.formLoading = false;
          this.commonUtils.presentToast('error', errRes.error.message);
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