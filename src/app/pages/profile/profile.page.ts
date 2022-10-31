import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, ModalController } from '@ionic/angular';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { Storage } from '@ionic/storage';
import { ModalPage } from '../modal/modal.page';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  designerprofiledata: any={};
  adminprofiledata: any={};
  uid;
  profileId: any;
  active: boolean;
  deleteDataSubscribe: any;
  show: boolean;
  role: any;
  username: any;
  profileimgpath: any;
  profileupdateSubcribe: any;
  imageLoader: boolean;
  showmoreLess = false;
  showmore: boolean = false;
  showmore1:boolean = false;
  private getProfileData: Subscription;
  private followCountData: Subscription;
  followers: any;
  profiledata:any;
  constructor( public menuCtrl: MenuController,private http:HttpClient,
    private modalController : ModalController,
    private alertController:AlertController,
    private commonUtils: CommonUtils,
    private router:Router,private storage:Storage) { }
  edit = false;
  ngOnInit() {
    this.commonFunction();
    
  }
  commonFunction(){
    this.storage.get('setStroageGlobalParamsData').then((val) => {
      console.log('User ID', val.uid);
      
      if(val.authority == 'DESIGNER')
      {
        // this.getDesignerProfiledata(val.authority,val.username)
        this.getDesignerProfiledata(val.uid);
        this.getProfileData = this.http.get("designer/countData/"+val.uid).subscribe(
          (res:any) => {
            this.followers = res.FollowersData;
          },
          (error) =>{
          })
      }
      else if(val.authority == 'ADMIN')
      {
        this.getAdminProfiledata(val.authority,val.username)
      }
      this.uid = val.uid;
      this.role=val.authority
      this.username =val.username
      console.log("Role",this.role);
      
    });
  }

    // getDesignerProfiledata start
    getDesignerProfiledata(uid)
    {
      
      this.getProfileData = this.http.get("designer/"+uid).subscribe(
        (res:any) => {
          this.formBtn = false;
          this.designerprofiledata = res;
          this.designerprofiledata.dob = moment(res.designerProfile.dob).format('YYYY-MM-DD');
         console.log("this.modalDate",this.designerprofiledata.designerProfile.dob);
          console.log("profiledata",this.designerprofiledata);
          if(this.designerprofiledata == null)
          {
            // this.show = false;
            this.edit = false;
          }
          else
          {
            this.active = true;
          }
          
          
            console.log("profiledata",this.designerprofiledata);
            console.log("this.modalDate");
        },
        (error) =>{
          this.formBtn = true;
          console.log("error",error);
          this.show = false;
            this.edit = false;
        })
    }
    // getDesignerProfiledata end
  // getAdminProfiledata start
    getAdminProfiledata(role,username)
    {
      
      this.getProfileData = this.http.get("auth/info/"+role+"/"+username).subscribe(
        (res:any) => {
          this.formBtn = false;
          if(this.adminprofiledata == null)
          {
            // this.show = false;
            this.edit = false;
          }
          else
          {
            this.active = true;
          }
            this.adminprofiledata = res;
            console.log("profiledata",this.adminprofiledata);
            console.log("this.modalDate",this.adminprofiledata.dob);
        },
        (error) =>{
          this.formBtn = true;
          console.log("error",error);
          this.show = false;
            this.edit = false;
        })
    }
    // getAdminProfiledata end
// chooseFile
    chooseFile(_identifier,image)
    {
      var allowedExtensions =/(\.jpg|\.jpeg|\.png)$/i;

      // if (!allowedExtensions.exec(image)) {
      //   // alert('Invalid file type');
      //   this.commonUtils.presentToast("error","Invalid file type. Only JPG,PNG,JPEG file is allowed.")
      //   // fileInput.value = '';
      //   return false;
      // }else{
        if(image.target.files[0] != undefined)
        {
          this.imageLoader = true;
          var fd = new FormData(); 
          fd.append("file", image.target.files[0]);
          this.http.post("admin/profile/s3/upload",fd).subscribe(
            (res:any) => {
              this.storage.set('profileImageData',  {
                'profileImgpath': res.path,
              
                
              });
              this.storage.get('profileImageData').then((val) => {
                console.log('User IDprofileImgpath', val);
                
              });
              console.log();
              if(_identifier == 'DESIGNER')
              {
                this.designerprofiledata.designerProfile.profilePic = res.path;
                this.uplodeProfilepicDesigner()
              }
              else if(_identifier == 'ADMIN')
              {
                this.adminprofiledata.profilePic = res.path;
                this.uplodeProfilepicAdmin()
              }
              this.imageLoader = false;
            },
            (error) =>{
              console.log("error",error);
              this.commonUtils.presentToast('error', error.error.message);
              this.imageLoader = false;
            })
        }
      // }
      // console.log('image',image.target.files[0]);
      
    }
    // chooseFile
    // uplodeProfilepic start
    uplodeProfilepicAdmin()
    {
          this.profileupdateSubcribe =  this.http.put('admin/profile/update',this.adminprofiledata).subscribe((res:any) =>{
           console.log("resres0",res);
           
            this.commonUtils.presentToast('success', res.message);
            // var imgpath = 
            this.imageLoader = false;  
          },error =>{
              // console.log("error",error);
              this.commonUtils.presentToast('error', error.error.message);
          })
          this.storage.get('setStroageGlobalParamsData').then((val) => {
            console.log('User ID', val.uid);
            
           
              this.getAdminProfiledata(val.authority,val.username)
             
            
          });
          console.log("this.adminprofiledata.profilepic",this.adminprofiledata.profilepic);
          // this.commonUtils.presentToast('success', res.message);
          
    }
    // uplodeProfilepic end
    // uplodeProfilepicDesigner start
    choseFilePath :any={}
    formBtn = false;
    uplodeProfilepicDesigner()
    {
        this.profileupdateSubcribe =  this.http.put('designer/profile/update',this.designerprofiledata).subscribe((res:any) =>{
        this.imageLoader = false;
        console.log("XYZ",res); 
        
          this.commonUtils.presentToast('success', res.message);
          this.profileimgpath = res.designerProfile.profilePic;
          },error =>{
            // console.log("error",error);
            this.commonUtils.presentToast('error', error.error.message);
        }) 
        this.storage.get('setStroageGlobalParamsData').then((val) => {
          console.log('User ID', val.uid);
            this.getDesignerProfiledata(val.uid)            
        });
    }
    // uplodeProfilepicDesigner end
    // cancleUploading start
    cancleUploading(type,identifier)
    {
      this.formBtn = !this.formBtn;
      console.log(this.formBtn);
      if(type == 'edit')
      {

      }else if(type == 'close')
      {
           this.storage.get('setStroageGlobalParamsData').then((val) => {
          console.log('User ID', val.uid);
          if(identifier == 'ADMIN')
          {
            this.getAdminProfiledata(val.authority,val.username)
          }else  if(identifier == 'DESIGNER')
          {
            this.getDesignerProfiledata(val.uid)
          }
          
          
          
        });
       
      }
      
    }
    // cancleUploading end
    // openAdminProfilemodal start
    async openAdminProfilemodal(_identifier, _item, _items) {
      console.log('openProfilemodal ...........>>', _identifier);
  
      let profile_modal;
      profile_modal = await this.modalController.create({
        component: ModalPage,
        cssClass: 'mymodalClass medium profilemodal',
        componentProps: { 
          identifier: _identifier,
          modalForm_item: _item,
          modalForm_array: _items,
        }
      });
      
      // modal data back to Component
      profile_modal.onDidDismiss()
      .then((getdata) => {
        
        this.getAdminProfiledata(this.role,this.username)
        console.log('getdata >>>>>>>>>>>', getdata);
        if(getdata.data == 'submitClose'){
          
        }
  
      });
  
      return await profile_modal.present();
    }
    // openAdminProfilemodal end
    // openAdminProfilemodal start
    async openDesignerProfilemodal(_identifier, _item, _items) {
      console.log('openProfilemodal ...........>>', _identifier);
  
      let profile_modal;
      profile_modal = await this.modalController.create({
        component: ModalPage,
        cssClass: 'mymodalClass medium profilemodal',
        componentProps: { 
          identifier: _identifier,
          modalForm_item: this.designerprofiledata,
          modalForm_array: _items
        }
      });
      
      // modal data back to Component
      profile_modal.onDidDismiss()
      .then((getdata) => {
        
        this.getDesignerProfiledata(this.uid)
        console.log('getdata >>>>>>>>>>>', getdata);
        if(getdata.data == 'submitClose'){
          
        }
  
      });
  
      return await profile_modal.present();
    }
    // openAdminProfilemodal end
    // Delete start
    deleteData(_id){
    console.log('id>>', _id);
    let sentValues = {'id': _id};
    this.deleteDataSubscribe = this.http.delete("admin/profile/"+this.profileId).subscribe(
      (res:any) => {
        console.log("Delete", res.return_data);
        if(res.status == 200){
          this.commonUtils.presentToast('success', res.message);
        }else {
          this.commonUtils.presentToast('error', res.message);
        }
      },
      errRes => {
      }
    );
  }
  // Delete end
  statusChange(_id){
    console.log('id>>', _id);
    this.deleteDataSubscribe = this.http.put("admin/profile/"+_id,'').subscribe(
      (res:any) => {
        console.log("Delete", res.return_data);
        if(res.status == 200){
          this.commonUtils.presentToast('success', res.message);
        }else {
          this.commonUtils.presentToast('error', res.message);
        }
      },
      errRes => {
      }
    );
  }
   // ----------- destroy unsubscription start ---------
   ngOnDestroy() {
    if (this.getProfileData !== undefined) {
      this.getProfileData.unsubscribe();
    }
    if (this.followCountData !== undefined) {
      this.followCountData.unsubscribe();
    }
  }
  // ----------- destroy unsubscription end ---------
}
