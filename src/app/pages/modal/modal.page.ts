import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
// import { CategoryPage } from '../product/category/category.page';
import { environment } from 'src/environments/environment';
var myDate = new Date();
@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})

export class ModalPage implements OnInit {
  
  hide:any='password';
  hide2:any='password';
  hide3:any='password';
  model:any={};
  modal:any={};
  get_identifier: any;
  get_item: any;
  get_array: any;
  heder_title: string;
  btnloader2
  username: any;
  tbody: any;
  allcategorydata: any;
  id: any;
  categoryModel: any;
  categoryImage: any;
  error: string;
  maritalstatuslist=[
    {
      id:1,name:"Unmarried"
    },{
      id:2,name:"Married"
    }
  ]
  role: any;
  profileupdateApi: string;
  private profileupdateSubcribe: Subscription;
  private approveProductSubscribe: Subscription;
  btnloader: boolean;
  designerprofiledata: any={
    ifscCode:'',
    bankName:'',
    accountNumber:'',
  };
  adminprofiledata: any={};
  alladminprofileProfiledata:any = {};
  alldesignerProfiledata: any= {};
  formloader: boolean;
  previewimageSrc_aadher: any;
  previewimageSrc_pan: any;
  designerProfile: any;
  currentYear: number;
  private changeorderStatusSubscribe: Subscription;
  currentDate;
  private ExportOrderSubscribe: Subscription;
  private GenarateInvoiceSubscribe: Subscription;
  private getDesignerSubscribe: Subscription;
  stateList: any = {};
  countryList:any = [{
    id:1,name:"India"
  }]
  private getStateData: Subscription;

  constructor(private navParams: NavParams, 
    private modalController: ModalController,
    private http:HttpClient,private storage: Storage,
    private router:Router,private commonUtils: CommonUtils,
    private authService: AuthService,
    ) { }
  
  ngOnInit() {
    let currentDate = Date.now()
    this.currentDate = moment(currentDate).format('YYYY/MM/DD');
    console.log('this.currentDate',this.currentDate);
    this.currentYear = (new Date()).getFullYear() - 18;
    console.log("DATE",myDate,(new Date()).getFullYear(),this.currentYear);
    this.commonFunction();
    // this.designerprofiledata.country = 1;
    this.get_item = '';
    this.get_identifier = this.navParams.get('identifier');
    this.get_item = this.navParams.get('modalForm_item');
    this.get_array = this.navParams.get('modalForm_array');
    if (this.get_identifier == 'changepassword_modal') {
      this.heder_title = 'change password ';
      // this.api_url = 'user/user-login';
    }else if (this.get_identifier == 'categoryadd_modal') {
      this.heder_title = 'Add Category ';
      // this.api_url = 'user/user-login';
    }else if (this.get_identifier == 'designerprofile_modal') {
      this.heder_title = 'Edit Profile ';
      console.log("get_item",this.get_item);
      this.setdesignerProfiledata();
      // this.api_url = 'user/user-login';
    }else if (this.get_identifier == 'adminprofile_modal') {
      this.heder_title = 'Edit Profile ';
      console.log("get_item",this.get_item);
      this.setadminProfiledata();
      // this.api_url = 'user/user-login';
    }else if (this.get_identifier == 'productapprove_modal') {
      
      console.log("get_item",this.get_item);
      // this.api_url = 'user/user-login';
      if(this.get_item.type == "Approved")
      {
        this.heder_title = 'Approve Product ';
      }else if(this.get_item.type == "Rejected")
      {
        this.heder_title = 'Reject Product ';
      }
      
    }else if (this.get_identifier == 'message_modal') {
      this.heder_title = 'Comments of Approve and Rejection';
      console.log("get_item",this.get_item);
      // this.api_url = 'user/user-login';
    }else if (this.get_identifier == 'rejectmessage_modal') {
      this.heder_title = 'Comments of Rejection';
      console.log("get_item",this.get_item);
      // this.api_url = 'user/user-login';
    }else if (this.get_identifier == 'Desigerrejected_modal') {
      this.heder_title = 'Reason for rejection ';
      console.log("get_item",this.get_item);
      // this.api_url = 'user/user-login';
    }else if (this.get_identifier == 'orderCommentdesigner_modal') {
      this.heder_title = 'Add Comment';
      console.log("get_item",this.get_item,this.get_array);
      // this.api_url = 'user/user-login';
    }else if (this.get_identifier == 'orderCommentAdmin_modal') {
      this.heder_title = 'Update tracking Order';
      // this.model.deliveryStarted = this.get_array.TrackingData.trackingHistory[1].date
      console.log("tracking",this.get_item,this.get_array);
      // this.api_url = 'user/user-login';
    }else if (this.get_identifier == 'orderDeliveryAdmin_modal') {
      this.heder_title = 'Delivery Partner data';
      // this.model.deliveryStarted = this.get_array.TrackingData.trackingHistory[1].date
      console.log("get_item",this.get_item,this.get_array);
      // this.api_url = 'user/user-login';
    }else if (this.get_identifier == 'DeliveredAdmin_modal') {
      this.heder_title = 'Delivered Details';
      // this.model.deliveryStarted = this.get_array.TrackingData.trackingHistory[1].date
      console.log("get_item",this.get_item,this.get_array);
      // this.api_url = 'user/user-login';
    }else if (this.get_identifier == 'orderCancelAdmin_modal') {
      this.heder_title = 'Reason of Cancel';
      // this.model.deliveryStarted = this.get_array.TrackingData.trackingHistory[1].date
      console.log("get_item",this.get_item,this.get_array);
      // this.api_url = 'user/user-login';
    }else if (this.get_identifier == 'orderCancelDesigner_modal') {
      this.heder_title = 'Reason of Cancel';
      // this.model.deliveryStarted = this.get_array.TrackingData.trackingHistory[1].date
      console.log("get_item",this.get_item,this.get_array);
      // this.api_url = 'user/user-login';
    }else if (this.get_identifier == 'orderExportModal') {
      this.heder_title = 'Export Order Document';
      // this.model.deliveryStarted = this.get_array.TrackingData.trackingHistory[1].date
      console.log("get_item",this.get_item,this.get_array);
      // this.api_url = 'user/user-login';
    }
    // get user name
    console.log('get_identifier',this.get_identifier);
    this.storage.get('setStroageGlobalParamsData').then((val) => {
      console.log('All User Data', val.username);
      this.username = val.username;
    });
  }
// data for profile edit start
// commonFunction start
commonFunction()
{
  this.storage.get('setStroageGlobalParamsData').then((val) => {
    console.log('User ID', val.authority);
    this.role= localStorage.getItem('userdata');
    console.log("Role",this.role);
    if(this.role == 'DESIGNER')
    {
      this.profileupdateApi ="designer/profile/update";
      console.log("DESIGNER");
      this.getState();
    }
    else
    {
      this.profileupdateApi ="admin/profile/update";
      console.log("Admi");
    }
  });
}
// commonFunction end
// setdesignerProfiledata start
setdesignerProfiledata()
{
      this.designerprofiledata = this.get_item;
      this.designerprofiledata = 
      {
        
        designerId:this.get_item.designerId,
        firstName1:this.get_item.designerProfile.firstName1,
        lastName1:this.get_item.designerProfile.lastName1,
        firstName2:this.get_item.designerProfile.firstName2,
        lastName2:this.get_item.designerProfile.lastName2,
        displayName:this.get_item.designerProfile.displayName,
        email:this.get_item.designerProfile.email,
        password:this.get_item.designerProfile.password,
        profilePic:this.get_item.designerProfile.profilePic,
        mobileNo:this.get_item.designerProfile.mobileNo,
        altMobileNo:this.get_item.designerProfile.altMobileNo,
        maritalStatus:this.get_item.designerProfile.maritalStatus,
        gender:this.get_item.designerProfile.gender,
        qualification:this.get_item.designerProfile.qualification,
        address:this.get_item.socialProfile.address,
        achievements:this.get_item.socialProfile.achievements,
        description:this.get_item.socialProfile.description,
        facebookLink:this.get_item.socialProfile.facebookLink,
        instagramLink:this.get_item.socialProfile.instagramLink,
        youtubeLink:this.get_item.socialProfile.youtubeLink,
        boutiqueName:this.get_item.boutiqueProfile.boutiqueName,
        firmName:this.get_item.boutiqueProfile.firmName,
        experience:this.get_item.boutiqueProfile.experience,
        gstin:this.get_item.boutiqueProfile.gstin,
        operatingCity:this.get_item.boutiqueProfile.operatingCity,
        professionalCategory:this.get_item.boutiqueProfile.professionalCategory,
        yearOfOperation:this.get_item.boutiqueProfile.yearOfOperation,
        state:this.get_item.designerProfile.state,
        city:this.get_item.designerProfile.city,
        country:this.get_item.designerProfile.country,
        
      }
    this.designerprofiledata.dob = moment(this.get_item.designerProfile.dob).format('YYYY-MM-DD');
    console.log("this.profiledata",this.designerprofiledata,this.designerprofiledata.dob);
    
    if(this.get_item.designerPersonalInfoEntity)
    {
      this.previewimageSrc_aadher = this.get_item.designerPersonalInfoEntity.designerDocuments.aadharCard;;
      this.previewimageSrc_pan = this.get_item.designerPersonalInfoEntity.designerDocuments.panCard;
      this.designerprofiledata.bankName=this.get_item.designerPersonalInfoEntity.bankDetails.bankName;
      this.designerprofiledata.accountNumber=this.get_item.designerPersonalInfoEntity.bankDetails.accountNumber;
      this.designerprofiledata.ifscCode=this.get_item.designerPersonalInfoEntity.bankDetails.ifscCode;
    }
   
}
// setdesignerProfiledata end
// setadminProfiledata start
setadminProfiledata()
{
  
   this.adminprofiledata = this.get_item;
   this.adminprofiledata.dob = moment(this.get_item.dob).format('YYYY-MM-DD');
  console.log("this.profiledata",this.adminprofiledata);
}
// setadminProfiledata end
// data for profile edit end
// changeDateFormat start
changeDateFormat(_identifier,_date)
{
  // console.log("_identifier",_identifier,_date,this.adminprofiledata.dob,this.designerprofiledata.designerProfile.dob);
  if(_identifier == 'DESIGNER')
  {
    this.model.designerdob= moment(_date).format('YYYY/MM/DD');
  }else if(_identifier == 'ADMIN')
  {
    this.model.admindob= moment(_date).format('YYYY/MM/DD');
    console.log("this.model.admindob",this.model.admindob);
    
  }else if(_identifier == 'Approval')
  {
    this.model.ApprovalDate= moment(_date).format('YYYY/MM/DD');
  }else if(_identifier == 'del_date')
  {
    this.model.deliveredDate= moment(_date).format('YYYY/MM/DD');
  }else if(_identifier == 'del_Expdate')
  {
    this.model.deliveryExpectedDate = moment(_date).format('YYYY/MM/DD');
  }else if(_identifier == 'delivered_time')
  {
    this.model.deliveredDate = moment(_date).format('YYYY/MM/DD');
  }else if(_identifier == 'export_start')
  {
    this.model.startDate = moment(_date).format('DD/MM/YYYY');
  }else if(_identifier == 'export_end')
  {
    this.model.endDate = moment(_date).format('DD/MM/YYYY');
  }
  // console.log("_identifier",_identifier,_date,this.adminprofiledata.dob,this.designerprofiledata.designerProfile.dob);
  
}
// changeDateFormat end

// ChangepswForm start
onSubmitChangepswForm(form: NgForm)
{
  this.btnloader2 = true;
  var data = {
    newPass:form.value.newPass,
    oldPass:form.value.oldPass,
    userName:form.value.userName,
  }
  console.log("Change Password-->",form.value);
    this.http.post("auth/changePassword",data).subscribe(
      (res:any) => {
        console.log("res",res);
        this.btnloader2 = false;
        this.commonUtils.presentToast('success', res.message);
        this.closeModal();
      },
      (error) =>{
        console.log("error",error);
        this.btnloader2 = false;
        this.commonUtils.presentToast('error', error.error.message);
      })
  
}
// ChangepswForm end
  private aadharCardfile: string = '';
  private panCardfile: string = '';
  private fileType;
  private previewimageSrc: string = '';
  handleInputChange(e,type) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    if(type == 'aadharCard')
    {
      this.fileType = type;
      this.aadharCardfile= e.target.files[0];
      var fd = new FormData();  
      fd.append("file", e.target.files[0]);
      this.http.post("admin/profile/s3/upload",fd).subscribe(
        (res:any) => {
          this.previewimageSrc_aadher = res.path;
          this.designerprofiledata.aadharCard = res.path,
          console.log("profileimgpath",this.aadharCardfile);
          // this.commonUtils.presentToast('success', res.message);
        },
        (error) =>{
          console.log("error",error);
          this.commonUtils.presentToast('error', error.error.message);
        })
    }else if(type == 'panCard')
    {
      this.fileType = type;
      this.panCardfile= e.target.files[0];
      var fd = new FormData();  
      fd.append("file", e.target.files[0]);
      this.http.post("admin/profile/s3/upload",fd).subscribe(
        (res:any) => {
          this.previewimageSrc_pan = res.path;
          this.designerprofiledata.aadharCard = res.path;
          console.log("profileimgpath",this.panCardfile);
          // this.commonUtils.presentToast('success', res.message);
        },
        (error) =>{
          console.log("error",error);
          this.commonUtils.presentToast('error', error.error.message);
        })
    }
    
      reader.readAsDataURL(file);
  }
  // onSubmitdesignerProfileForm start
  onSubmitdesignerProfileForm(form: NgForm)
  {
    console.log("form",form.value);
    
    this.formloader = true;
    var boutiqueProfile = {
      boutiqueName:form.value.boutiqueName,
      experience:form.value.experience,
      firmName:form.value.firmName,
      gstin:form.value.gstin,
      operatingCity:form.value.operatingCity,
      professionalCategory:form.value.professionalCategory,
      yearOfOperation:form.value.yearOfOperation,
    }
    this.designerProfile;
   
    if(form.value.dob == undefined)
    {
      // this.designerProfile = {
      //   dob:
      // }
      var dob =moment(this.designerprofiledata.dob).format('YYYY/MM/DD');
    }
    else
    {
      // this.designerProfile = {
      //   dob:form.value.dob,
        
      // }
      dob = form.value.dob;
    }
    this.designerProfile = {
      altMobileNo:form.value.altMobileNo,
      profilePic:form.value.profilePic,
      displayName:form.value.displayName,
      email:this.designerprofiledata.email,
      password:this.designerprofiledata.password,
      firstName1:form.value.firstName1,
      firstName2:form.value.firstName2,
      gender:form.value.gender,
      lastName1:form.value.lastName1,
      lastName2:form.value.lastName2,
      maritalStatus:form.value.maritalStatus,
      mobileNo:form.value.mobileNo,
      qualification:form.value.qualification,
      dob:dob,
      country:form.value.country,
      state:form.value.state,
      city:form.value.city,

  }
    var socialProfile= {
      achievements: form.value.achievements,
      address: form.value.address,
      description: form.value.description,
      facebookLink: form.value.facebookLink,
      instagramLink: form.value.instagramLink,
      youtubeLink:form.value.youtubeLink,
    }
    
    var designerPersonalInfoEntity = {
      designerId:this.designerprofiledata.designerId,
      bankDetails : {
        accountNumber:form.value.accountNumber,
        bankName:form.value.bankName,
        ifscCode:form.value.ifscCode
      },
      designerDocuments:{
        aadharCard:this.previewimageSrc_aadher,
        panCard:this.previewimageSrc_pan,
        void_check:form.value.void_check
      }
    }
    this.alldesignerProfiledata = {
      boutiqueProfile:boutiqueProfile,
      designerProfile:this.designerProfile,
      socialProfile:socialProfile,
      designerPersonalInfoEntity:designerPersonalInfoEntity,
      email:this.designerprofiledata.email,
      password:this.designerprofiledata.password,
      designerId:this.designerprofiledata.designerId,
      designerName:this.designerprofiledata.firstName1 +' '+ this.designerprofiledata.lastName1
    }
    
    // this.allProfiledata = form.value
    console.log("this.designerprofiledata",this.alldesignerProfiledata);
    
    console.log(form.value);
   this.profileupdateSubcribe =  this.http.put(this.profileupdateApi,this.alldesignerProfiledata).subscribe((res:any) =>{
    this.formloader = false; 
    this.closeModal()
      // window.location.reload();
      this.commonUtils.presentToast('success', res.message);
      },error =>{
        this.formloader = false;
        console.log("error",error);
        this.commonUtils.presentToast('error', error.error.message);
        // recall category list
    })
  }
  // onSubmitdesignerProfileForm end
  // onSubmitadminProfileForm start
  onSubmitadminProfileForm(form: NgForm)
  {
    if(form.value.dob == undefined)
    {
      this.alladminprofileProfiledata = {
        firstName:form.value.firstName,
        lastName:form.value.lastName,
        email:form.value.email,
        gender:form.value.gender,
        dob:moment(this.adminprofiledata.dob).format('YYYY/MM/DD'),
        profilePic:form.value.profilePic,
        password:this.adminprofiledata.password,
        roleName:this.adminprofiledata.roleName,
        mobileNo:this.adminprofiledata.mobileNo,
        uid:this.adminprofiledata.uid,
        role:this.adminprofiledata.role,
    }
    }else
    {
      this.alladminprofileProfiledata = {
        firstName:form.value.firstName,
        lastName:form.value.lastName,
        email:form.value.email,
        gender:form.value.gender,
        dob:form.value.profilePic,
        profilePic:form.value.profilePic,
        password:this.adminprofiledata.password,
        roleName:this.adminprofiledata.roleName,
        mobileNo:this.adminprofiledata.mobileNo,
        uid:this.adminprofiledata.uid,
        role:this.adminprofiledata.role,
    }
    }
    
  
    console.log("this.allProfiledata",this.alladminprofileProfiledata);
    
    console.log(form.value);
    this.profileupdateSubcribe =  this.http.put(this.profileupdateApi,this.alladminprofileProfiledata).subscribe((res:any) =>{
      this.closeModal()
      this.commonUtils.presentToast('success', res.message);
      },error =>{
        console.log("error",error);
        this.commonUtils.presentToast('error', error.error.message);
    })
  }
  // onSubmitadminProfileForm end
  // approveProduct start
  onSubmitapproveProduct(form: NgForm)
  {
    var data:any=[];
    data = this.get_item.item.comments
    console.log(this.get_item,this.get_item.item.comments.length);
    // if no comment
    if(this.get_item.item.comments.length == 0)
    {
      this.storage.get('setStroageGlobalParamsData').then((val) => {
        console.log('All User Data', val.uid);
        this.role = val.authority;
         data = [
          {
            Reason : this.get_item.type,
            comments:form.value.comment,
            adminId:val.uid,
            dateTime : this.currentDate,
          }
        ]
        });
    }
    // // if comment have
    else 
    {
      this.storage.get('setStroageGlobalParamsData').then((val) => {
        console.log('All User Data', val.uid);
        this.role = val.authority;
        data.push({Reason : this.get_item.type,comments:form.value.comment,adminId:val.uid,dateTime : this.currentDate,
        })
        //  data = [
        //   {
        //     Reason : this.get_item.type,
        //     comments:form.value.comment,
        //     adminId:val.uid,
        //     dateTime : this.currentDate,
        //   }
        // ]
        });
    }
    this.btnloader = true;
    this.storage.get('setStroageGlobalParamsData').then((val) => {
      console.log('All User Data', val.uid);
      this.role = val.authority;
      //  data = [
      //   {
      //     Reason : this.get_item.type,
      //     comments:form.value.comment,
      //     adminId:val.uid,
      //     dateTime : this.currentDate,
      //   }
      // ]
      let comment ={
        adminStatus:this.get_item.type,
        approvedBy:val.uid,
        comments:data,
        productId:this.get_item.item.productId,
        designerId:this.get_item.item.designerId,
      }
      console.log("comment",comment);
      
      this.approveProductSubscribe =this.http.put('product/changeProductApprovalStatus',comment).subscribe(
        (res:any) => {
          this.commonUtils.presentToast('success', res.message);
          this.btnloader = false;
          this.closeModal();
        },
        (error) =>{
          console.log("errorerror",error);
           this.btnloader = false;
          this.commonUtils.presentToast('error', error.error.message);
         
        })
      });
    
  }
  // approveProduct end
  // onSubmitdesignerRejectForm start
  onSubmitdesignerRejectForm(form: NgForm)
  {
    
    console.log(this.get_item);  
    var formData = {
      adminComment:form.value.comment,
      dId:this.get_item.dId,
      isActive:this.get_item.isActive,
      profileStatus:this.get_item.profileStatus,
      isDeleted:this.get_item.isDeleted,
      isProfileCompleated:this.get_item.isProfileCompleated,
      isProfileSubmitted:this.get_item.isProfileSubmitted,
    }
    this.btnloader = true;
    this.approveProductSubscribe =this.http.put('designer/update',formData).subscribe(
      (res:any) => {
        this.commonUtils.presentToast('success', res.message);
        this.btnloader = false;
        this.closeModal();
      },
      (error) =>{
        console.log("errorerror",error);
          this.btnloader = false;
        this.commonUtils.presentToast('error', error);
        
      })
    
  }
  // onSubmitdesignerRejectForm end
  // closeModal start
  closeModal() {
    this.modalController.dismiss();
  }
  // closeModal end
  // passwordvalid start
  passwordvalid(new_password,conform_password)
  {
    if (conform_password == undefined) {
      this.error = '';
        
    }else if (new_password!=conform_password) {
        this.error = "New password and conform password  not match.";
        setTimeout(()=>{                           // <<<---using ()=> syntax
          // this.error = "";
      }, 3000);
    }else  if (new_password==conform_password)
    {
      this.error = "";
    }
    else
    {
      this.error = "";
    }
    
  }
  // passwordvalid end
  // onSubmitDispatchForm start
  onSubmitDispatchForm(form:NgForm)
  {
    console.log("form",form.value,this.get_item);
    this.get_item.trackingHistory[0].comment = form.value.comment;
    this.changeorderStatusSubscribe = this.http.post("userOrder/track/add",this.get_item).subscribe(
      (res: any) => {
        this.commonUtils.presentToast("success", res.message);
        this.closeModal();
      },
      (error) => {
        this.commonUtils.presentToast("success", error.error.message);
      }
    );
  }
  // onSubmitDispatchForm end
  // onSubmitShipmentAdminForm start
  onSubmitShipmentAdminForm(form:NgForm)
  {
    console.log("SHIPPING DATA",this.get_array,this.get_item);
    
    var data:any={},time,todate;
    var trackingHistory:any = [];
    if(this.get_array.TrackingData)
    {
      trackingHistory = this.get_array.TrackingData.trackingHistory;
    }
    var day = new Date();
    console.log(day,day.getMinutes());
    if(day.getSeconds() > 10)
    {
      time = day.getHours() + ':' + day.getMinutes() +':' + day.getSeconds();
    }
    else{
      time = day.getHours() + ':' + day.getMinutes() +':0' + day.getSeconds();
    }
    console.log(day,time);
    todate = moment(day).format('YYYY/MM/DD');
    console.log("form",form.value,this.get_item);
    this.get_item.deliveredDate = form.value.deliveredDate;
    this.get_item.deliveryStatus = "shipment";
    this.get_item.deliveryStarted = form.value.deliveryStarted;
    // this.get_item.trackingHistory[1].comment = form.value.comment;
    this.authService.globalparamsData.subscribe((res) => {
      console.log("trackingHistory", res,trackingHistory);
      if (res.authority != "DESIGNER") {
       {
        trackingHistory.push({time:time,date:todate,comment:form.value.comment,adminId:res.uid,auth:res.authority,type:'shipment'});
       }}
      console.log("trackingHistory", res,trackingHistory);
    });
    this.get_item.deliveryMode = form.value.deliveryMode;
    this.get_item.deliveryExpectedDate = form.value.deliveryExpectedDate;
    console.log("form",form.value,this.get_item,this.get_array.TrackingData.trackingId);
    this.changeorderStatusSubscribe = this.http.put("userOrder/track/update/"+this.get_array.TrackingData.trackingId,this.get_item).subscribe(
      (res: any) => {
        this.commonUtils.presentToast("success", res.message);
        this.genInvoice();
        // this.closeModal();
      },
      (error) => {
        this.commonUtils.presentToast("success", error.error.message);
      }
    );
  }
  genInvoice()
  {
    var designerData:any={},data:any={};
    this.getDesignerSubscribe = this.http.get("designer/"+this.get_array.designerId).subscribe(
      (res: any) => {
        // this.commonUtils.presentToast("success", res.message);
        designerData = res;
        data = {
          designerDetails:{
            GSTIN:designerData.boutiqueProfile.gstin,
            PAN:'',
            name:designerData.designerName,
            mobile:designerData.designerProfile.mobileNo,
            address:designerData.socialProfile.address,
          },
          invoiceDatetime:'',
          invoiceId:'',
          orderDatetime:this.get_array.moredata.orderDate,
          orderId:this.get_array.moredata.orderId,
          productDetails:{
            colour:this.get_array.colour,
            createdOn:this.get_array.createdOn,
            designerId:this.get_array.designerId,
            discount:this.get_array.discount,
            id:this.get_array.id,
            images:this.get_array.images,
            mrp:this.get_array.mrp,
            orderId:this.get_array.orderId,
            orderItemStatus:this.get_array.orderItemStatus,
            productId:this.get_array.productId,
            productName:this.get_array.productName,
            productSku:this.get_array.productSku,
            reachedCentralHub:this.get_array.reachedCentralHub,
            salesPrice:this.get_array.salesPrice,
            size:this.get_array.size,
            taxAmount:this.get_array.taxAmount,
            taxType:this.get_array.taxType,
            units:this.get_array.units,
            updatedOn:this.get_array.updatedOn,
            userId:this.get_array.userId,
          },
          userDetails:{
            userId:this.get_array.moredata.userId,
            shipping_address:this.get_array.moredata.shippingAddress,
            billing_address:this.get_array.moredata.billingAddress,
            mobile:this.get_array.moredata.billingAddress.mobile,
          },
        }
        setTimeout(() => {
          this.GenarateInvoiceSubscribe = this.http.post("userOrder/invoices/add",data).subscribe(
            (res: any) => {
              // this.commonUtils.presentToast("success", res.message);
              this.closeModal();
            },
            (error) => {
              setTimeout(() => {
                this.commonUtils.presentToast("success", error.error.message);
                // if(error.error.message =='Invoice already exist!')
                // {
                  this.closeModal();
                // }
              }, 1000);
            }
          );  
        }, 500);
        
        console.log("getDesignerSubscribe",res,data);
        
      },
      (error) => {
        this.commonUtils.presentToast("success", error.error.message);
      }
    );
    
    

  }
    // getState start
    getState()
    {
      this.getStateData = this.http.get("user/getStateData").subscribe(
        (res:any) => {
          this.stateList = res
        },
        (erroe)=>{}); 
    }
    // getState end
    // SelectedCountry start
    SelectedCountry(id)
    {

    }
    // SelectedCountry end
  // onSubmitShipmentAdminForm end
  // onSubmitDeliveryAdminForms start
  onSubmitDeliveryAdminForm(form:NgForm)
  {
    var data:any={},time,todate;
    var trackingHistory:any = [];
    trackingHistory = this.get_array.TrackingData.trackingHistory;
    var day = new Date();
    console.log(day,day.getMinutes());
    if(day.getSeconds() > 10)
    {
      time = day.getHours() + ':' + day.getMinutes() +':' + day.getSeconds();
    }
    else{
      time = day.getHours() + ':' + day.getMinutes() +':0' + day.getSeconds();
    }
    console.log(day,time);
    todate = moment(day).format('YYYY/MM/DD');
    console.log("form",form.value,this.get_item,this.get_array.TrackingData.trackingId);
    this.get_item.deliveredDate = form.value.del_Time;
    this.get_item.deliveryStarted = this.get_item.deliveryStarted;
    this.get_item.deliveryStatus = "out_for_delivery";
    // this.get_item.trackingHistory[1].comment = form.value.comment;
    this.authService.globalparamsData.subscribe((res) => {
      console.log("trackingHistory", res,trackingHistory);
      if (res.authority != "DESIGNER") {
       {
        trackingHistory.push({outdeliverytime:form.value.del_Time,date:todate,comment:form.value.comment,adminId:res.uid,auth:res.authority,type:'out_for_delivery',deliverypartnername:form.value.deliverypartnername,deliverypartnerNumber:form.value.deliverypartnerNumber});
       }}
      console.log("trackingHistory", res,trackingHistory);
    });
    this.get_item.deliveryMode = this.get_item.deliveryMode;
    this.get_item.deliveryExpectedDate = this.get_item.deliveryExpectedDate;
    console.log("form",form.value,this.get_item,this.get_array.TrackingData.trackingId);
    this.changeorderStatusSubscribe = this.http.put("userOrder/track/update/"+this.get_array.TrackingData.trackingId,this.get_item).subscribe(
      (res: any) => {
        this.commonUtils.presentToast("success", res.message);
        this.closeModal();
      },
      (error) => {
        this.commonUtils.presentToast("success", error.error.message);
      }
    );
  }
  // onSubmitDeliveryAdminForm end
  // onSubmitDeliveredAdminForm start
  onSubmitDeliveredAdminForm(form:NgForm)
  {
    var data:any={},time,todate;
    var trackingHistory:any = [];
    trackingHistory = this.get_array.TrackingData.trackingHistory;
    var day = new Date();
    console.log(day,day.getMinutes());
    if(day.getSeconds() > 10)
    {
      time = day.getHours() + ':' + day.getMinutes() +':' + day.getSeconds();
    }
    else{
      time = day.getHours() + ':' + day.getMinutes() +':0' + day.getSeconds();
    }
    console.log(day,time);
    todate = moment(day).format('YYYY/MM/DD');
    console.log("form",form.value,this.get_item,this.get_array.TrackingData.trackingId);
    this.get_item.deliveryStatus = "delivered";
    // this.get_item.deliveryStarted = form.value.deliveryStarted;
    // this.get_item.trackingHistory[1].comment = form.value.comment;
    this.authService.globalparamsData.subscribe((res) => {
      console.log("trackingHistory", res,trackingHistory);
      if (res.authority != "DESIGNER") {
       {
        trackingHistory.push({delivered_time:form.value.delivered_time,date:todate,comment:form.value.comment,adminId:res.uid,auth:res.authority,type:'delivered',deliverypartnername:form.value.deliverypartnername,deliverypartnerNumber:form.value.deliverypartnerNumber});
      }}
      console.log("trackingHistory", res,trackingHistory);
    });
    this.get_item.deliveryMode = form.value.deliveryMode;
    this.get_item.deliveredDate = form.value.deliveredDate;
    console.log("form",form.value,this.get_item,this.get_array.TrackingData.trackingId);
    this.changeorderStatusSubscribe = this.http.put("userOrder/track/update/"+this.get_array.TrackingData.trackingId,this.get_item).subscribe(
      (res: any) => {
        this.commonUtils.presentToast("success", res.message);
        this.closeModal();
      },
      (error) => {
        this.commonUtils.presentToast("success", error.error.message);
      }
    );
  }
  // onSubmitDeliveredAdminForm end
  // onSubmitDeliveredCancelAdminForm start
  onSubmitDeliveredCancelAdminForm(form:NgForm)
  {
    var data:any={},time,todate;
    var trackingHistory:any = [];
    if(this.get_array.TrackingData)
    {
      trackingHistory = this.get_array.TrackingData.trackingHistory;
    }
    var day = new Date();
    console.log(day,day.getMinutes());
    if(day.getSeconds() > 10)
    {
      time = day.getHours() + ':' + day.getMinutes() +':' + day.getSeconds();
    }
    else{
      time = day.getHours() + ':' + day.getMinutes() +':0' + day.getSeconds();
    }
    console.log(day,time);
    todate = moment(day).format('YYYY/MM/DD');
    console.log("form",form.value,this.get_item);
    this.get_item.deliveryStatus = "cancel";
    // this.get_item.trackingHistory[1].comment = form.value.comment;
    this.authService.globalparamsData.subscribe((res) => {
      console.log("trackingHistory", res,trackingHistory);
      if (res.authority != "DESIGNER") {
      {
        trackingHistory.push({time:time,date:todate,comment:form.value.comment,adminId:res.uid,auth:res.authority,type:'cancel'});
      }}
      console.log("trackingHistory", res,trackingHistory);
    });
    console.log("form",form.value,this.get_item,this.get_array.TrackingData.trackingId);
    this.changeorderStatusSubscribe = this.http.put("userOrder/track/update/"+this.get_array.TrackingData.trackingId,this.get_item).subscribe(
      (res: any) => {
        this.commonUtils.presentToast("success", res.message);
        this.closeModal();
      },
      (error) => {
        this.commonUtils.presentToast("success", error.error.message);
      }
    );
  }
  // onSubmitDeliveredCancelAdminForm end
  // onSubmitDeliveredCancelDesignerForm start
  onSubmitDeliveredCancelDesignerForm(form:NgForm)
  {
    var data:any={},time,todate;
    var trackingHistory:any = [];
    
    var day = new Date();
    console.log(day,day.getMinutes());
    if(day.getSeconds() > 10)
    {
      time = day.getHours() + ':' + day.getMinutes() +':' + day.getSeconds();
    }
    else{
      time = day.getHours() + ':' + day.getMinutes() +':0' + day.getSeconds();
    }
    console.log(day,time);
    todate = moment(day).format('YYYY/MM/DD');
    console.log("form",form.value,this.get_item);
    // this.get_item.deliveredDate = form.value.deliveredDate;
    this.get_item.deliveryStatus = "cancel";
    this.get_item.deliveryStarted = form.value.deliveryStarted;
    // this.get_item.trackingHistory[1].comment = form.value.comment;
    if(this.get_array.TrackingData)
    {
      trackingHistory = this.get_array.TrackingData.trackingHistory;
      this.authService.globalparamsData.subscribe((res) => {
        
          trackingHistory.push({time:time,date:todate,comment:form.value.comment,designerId:res.uid,auth:res.authority,type:'cancel'});
        console.log("trackingHistory", res,trackingHistory);
      });
      console.log("trackingHistory", data,trackingHistory);
    }
    
    if(this.get_array.TrackingData)
    {
      data = {
        deliveredDate: this.get_array.TrackingData.deliveredDate,
        deliveryExpectedDate: this.get_array.TrackingData.deliveryExpectedDate,
        deliveryMode: this.get_array.TrackingData.deliveryMode,
        deliveryStarted: this.get_array.TrackingData.deliveryStarted,
        deliveryStatus: "cancel",
        deliveryType: this.get_array.TrackingData.deliveryType,
        designerId: this.get_array.TrackingData.designerId,
        id: this.get_array.TrackingData.id,
        orderId: this.get_array.TrackingData.orderId,
        procuctSku: this.get_array.TrackingData.procuctSku,
        productId: this.get_array.TrackingData.productId,
        trackingHistory: trackingHistory,
        trackingId: this.get_array.TrackingData.trackingId,
        trackingUrl: this.get_array.TrackingData.trackingUrl,
        userId: this.get_array.TrackingData.userId
      };
    }else
    {
      this.authService.globalparamsData.subscribe((res) => {
        
        trackingHistory.push({time:time,date:todate,comment:"",designerId:res.uid,auth:res.authority,type:'cancel'});
        console.log("trackingHistory", res,trackingHistory);
        data = {
          deliveredDate: "",
          deliveryExpectedDate: "",
          deliveryMode: "",
          deliveryStarted: "",
          deliveryStatus: "cancel",
          deliveryType: "",
          designerId:res.uid,
          orderId: this.get_array.orderId,
          procuctSku: "",
          productId: this.get_item.productId,
          trackingHistory: trackingHistory,
          trackingId: "",
          trackingUrl: "",
          userId: this.get_array.userId,
          orderItemStatus:"cancel"
        };

      });
        console.log(data);
        
        this.changeorderStatusSubscribe = this.http.post("userOrder/track/add",data).subscribe(
          (res: any) => {
            this.commonUtils.presentToast("success", res.message);
            this.closeModal();
          },
          (error) => {
            this.commonUtils.presentToast("success", error.error.message);
          }
        );

    }
    
    console.log("trackingHistory", data,trackingHistory);
    console.log("form",form.value,this.get_item,this.get_array.TrackingData.trackingId);
    this.changeorderStatusSubscribe = this.http.put("userOrder/track/update/"+this.get_array.TrackingData.trackingId,data).subscribe(
      (res: any) => {
        this.commonUtils.presentToast("success", res.message);
        this.closeModal();
      },
      (error) => {
        this.commonUtils.presentToast("success", error.error.message);
      }
    );
  }
  // onSubmitDeliveredCancelDesignerForm end
  // onSubmitOrderExport start
  ExportType;
  getExportType(type)
  {
    this.ExportType = type;
  }
  onSubmitOrderExport(form:NgForm)
  { 
    let api
    console.log(form.value);
    if(this.ExportType == 'pdf')
    {
      api = "userOrder/exelSheet" +"?startDate=" +form.value.startDate +"&endDate=" +form.value.endDate;
    }else if(this.ExportType == 'doc')
    {
      api = "userOrder/exelSheet" +"?startDate=" +form.value.startDate +"&endDate=" +form.value.endDate;
    } 
    this.ExportOrderSubscribe = this.http.get(api).subscribe(
      (res:any) => {},
      (error) =>{});
      window.open(environment.apiUrl+'/'+api);
      this.closeModal();
  }
  // onSubmitOrderExport end
  ngsel(e)
  {
    
  }
  selectState(id)
  {

  }
  ngOnDestroy() {
    if (this.ExportOrderSubscribe !== undefined) {
      this.ExportOrderSubscribe.unsubscribe();
    }
    if (this.getStateData !== undefined) {
      this.getStateData.unsubscribe();
    }
    if (this.getDesignerSubscribe !== undefined) {
      this.getDesignerSubscribe.unsubscribe();
    }
  }
  
}
