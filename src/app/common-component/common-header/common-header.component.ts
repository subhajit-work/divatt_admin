import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { ModalPage } from 'src/app/pages/modal/modal.page';
import { Storage } from '@ionic/storage';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
@Component({
  selector: 'common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss'],
})
export class CommonHeaderComponent implements OnInit {

  showSearch: boolean = false;
  uid: any;
  userData:any={};
  username: string;
  role: string;
  designerprofiledata: any;
  productAdd: boolean = false;
  profileImage: any;
  permissionMenuLoading: boolean;
  userPermissionDataSubscribe: any;
  get_user_permission: any;
  designermodules: any;
  openleftnav: boolean =false;
  constructor(
    public menuCtrl: MenuController,
    private modalController : ModalController,
    private router:Router,
    private storage: Storage, 
    private authService:AuthService,
    private http:HttpClient,
    private commonUtils: CommonUtils, // common functionlity come here

  ) { }

  ngOnInit() 
  {
    // this.storage.set('name', 'Max');

    // Or to get a key/value pair
    this.storage.get('setStroageGlobalParamsData').then((val) => {
      console.log('All User Data', val);
      // console.log("this.href",val.username.split('@')[0]);
      this.role = val.authority;
      this.getuserInfo(val.authority,val.username)
      this.storage.get('profileImageData').then((val) => {
        console.log('profileImageData', val);
      });
    });
    
    this.commonfunction();
  }
     // ..... Login  modal start ......
    //  commonfunction start
    
    commonfunction()
    {
      this.storage.get('setStroageGlobalParamsData').then((val) => {
        console.log('User ID', val);
        
        if(val.authority == 'DESIGNER')
        {
          // this.getDesignerProfiledata(val.authority,val.username)
          this.getDesignerProfiledata(val.uid)
        }       
        
      });
    }
    // commonfunction end
      // getDesignerProfiledata start
      getDesignerProfiledata(uid)
      {
        
        this.http.get("designer/"+uid).subscribe(
          (res:any) => {
            this.designerprofiledata = res;
            console.log("res",res);
            
            this.profileImage = res.designerProfile.profilePic;
            console.log("this.profileImage",this.profileImage);
            
            if(res.profileStatus == 'COMPLETED')
            {
              this.productAdd  = true
            }else
            {
              this.productAdd  = false
            }
            
            
          },
          (error) =>{
            console.log("error",error);
          })
      }
      // getDesignerProfiledata end
    // getuserInfo start
    getuserInfo(role,username)
    {
      console.log("username",this.username);
      
      this.http.get("auth/info/"+role+"/"+username).subscribe(
        (res:any) => {
          this.userData = res;
          console.log('usernameusername',this.userData);
          this.userPermissionData(res.role)

          this.storage.get('setStroageGlobalParamsData').then((val) => {
            if(val.authority == "DESIGNER")
            {

            }else
            {
              this.profileImage =  res.profilePic;

            }
          });
          
        },
        (error) => {
          
        }
      )
      
    }
    // getuserInfo end
  async openChangePasswordmodal(_identifier, _item, _items) {
    console.log('openChangePasswordmodal_identifier ...........>>', _identifier);

    let changePassword_modal;
    changePassword_modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'mymodalClass small ChangePassword',
      componentProps: { 
        identifier: _identifier,
        modalForm_item: _item,
        modalForm_array: _items
      }
    });
    
    // modal data back to Component
    changePassword_modal.onDidDismiss()
    .then((getdata) => {
      console.log('getdata >>>>>>>>>>>', getdata);
      if(getdata.data == 'submitClose'){
        
      }

    });

    return await changePassword_modal.present();
  }
  // Login modal end 
  showSearchBox(_item) {
    console.log('showSearch>>', this.showSearch);
    if(this.showSearch == false) {
      this.showSearch = true;
    }else{
      this.showSearch = false;
    }
  }

  menuOpenClose(){
    this.menuCtrl.enable(false);
  }
  goToPage(url)
  {
    this.router.navigateByUrl(url);
  }
// getDesignerProfiledata end
  /*--------------------User permission data get start--------------------*/
  userPermissionData(_role){
    this.permissionMenuLoading = true;
    this.userPermissionDataSubscribe = this.http.get('admin/role/'+_role).subscribe(
      (response: any) => {
        this.permissionMenuLoading = false;
        console.log('this.get_user_permission',response);
        this.get_user_permission = response;
        console.log("designermodules",this.designermodules);
        this.commonUtils.menuPermissionService(response.modules);
      },
      errRes => {
        this.permissionMenuLoading = false;
      }
    );
  }
  /*User permission data get end*/
  openNav(){
    this.openleftnav = !this.openleftnav;
  }
  // go to login page start
  logout()
  {
    
    console.log(localStorage.getItem('token'));
    this.authService.logout();
    // this.router.navigateByUrl('/welcome');
    localStorage.removeItem('token');
    console.log(localStorage.getItem('token'));
  }
  // go to login page end
}
