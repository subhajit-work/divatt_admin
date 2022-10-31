import { trigger, transition, style, animate } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth/auth.service';
import { CommonUtils } from './services/common-utils/common-utils';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;

  // variable define
  url_name;
  url_path_name;
  get_user_type;
  panelOpenState: boolean;
  userInfodDataLoading;
  permissionMenuLoading;
  private userInfoSubscribe: Subscription;
  private userPermissionDataSubscribe: Subscription;
  activeMenuHilight;
  selectedItemActive;
  parentSelectedIndex;
  childSelectedIndex;
  siteInfo: any;
  isActive: boolean = false;
  siteInfoLoading;
  get_user_dtls;
  get_user_permission;
  viewData;
  sticky_url;
  toggle: boolean = false;
  menuicon: boolean;
  Url: any;
  designermodules = [{
    modDetails:{
      title:'Dashboard',
      title_icon:'home',
      url:'dashboard',
    },
    modName:'module1',
  },{
    modDetails:{
      title: "Product Management",
      title_icon: "checkroom",
      url: "product-list",
    },
    modName:'module2',
  }]
  admin: boolean =false;
  designerprofiledata: any;
  productAdd: boolean = false;
  constructor(

    private platform: Platform,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    public menuCtrl: MenuController,
    public renderer: Renderer2,
    public router: Router,
    private storage: Storage,
    private commonUtils: CommonUtils, // common functionlity come here
    @Inject(DOCUMENT) private _document: HTMLDocument //use for fabicon
  ) {
    
    this.onSiteInformation();
  }
  toggleMenu(_item) {
    console.log('', this.toggle);
    if (_item == false) {
      this.toggle = true;
      // this.menuCtrl.enable(true);
    } else {
      this.toggle = false;
      // this.menuCtrl.enable(false);
    }
  }

  ionViewWillEnter() {
    console.log(window.location.href)
    let x = window.location.href.split('#')[1];
    let current = x.split('/')[1];
    console.log("this.href", window.location.href.split('#')[1], current);
    if (current == 'auth') {
      this.menuicon = true;
    }else if (current == 'error') {
      this.menuicon = true;
    }

    console.log('ionViewWillEnter');
  }
  ngOnInit() {
    console.log("designermodules",this.designermodules);
    this.commonfunction()
    $.getScript('assets/js/script.js');
    $.getScript('assets/js/sticky-kit.js');
    // this.onActivate(event);

  }
//  commonfunction start
commonfunction()
{
  this.storage.get('setStroageGlobalParamsData').then((val) => {
    // console.log('User ID', val.uid);
    
    
    
    
  });
}
// commonfunction end

initializeApp() {
    this.platform.ready().then(() => {

      // user data call
      this.userInfoData();

      // ----get current active url name start---
      this.activatedRoute.url.subscribe(activeUrl => {
        this.url_name = window.location.pathname;
        console.log('this.url_name app.componet.ts @@@>>', this.url_name.split('/')[1]);
        var y = localStorage.getItem('userdata');
        console.log('retrievedObject: ', y);
        console.log(window.location.href)
        let x = window.location.href.split('#')[1];
        let current = x.split('/')[1];
        console.log("this.href", window.location.href.split('#')[1], current);
        if (current == 'auth') {
          this.menuicon = true;
        }
        else if (current == 'forgot-password') {
          this.menuicon = true;
        }
      })

      //get current active url name end

      // observable data for all page url name get
      this.commonUtils.pagePathNameAnywhereObsv.subscribe(pathRes => {
        // console.log('common utility path page url name #### @@@@@@@ >>', pathRes);
        this.url_path_name = pathRes;
      });


    });
  }
  //------------------- menu item show get_user_dtlsstart------------------------

  /*--------------------User info data get start--------------------*/
  userInfoData() {
    console.log('userInfoData');
    this.userInfodDataLoading = true;

    this.authService.globalparamsData.subscribe(res => {
      console.log('res>>', res);
      if(res != null || res != undefined) {
        this.userInfoSubscribe = this.http.get('auth/info/'+res.authority+'/'+res.username).subscribe(
          (response: any) => {
            this.userInfodDataLoading = false;
            console.log('this.get_user_dtls',response);
            this.get_user_dtls = response;
            if(res.authority == 'ADMIN')
            {
              this.userPermissionData(response.role);
              this.admin = true;
            }else if(res.authority == 'DESIGNER')
            {
              // this.getDesignerProfiledata(val.authority,val.username)
              this.getDesignerProfiledata(res.uid)
            }
            else
            {
              this.admin = false;
            }
          },
          errRes => {
            this.userInfodDataLoading = false;
          }
        );
      }else {
        this.menuicon = true;
      }
    })

    this.storage.get('setStroageGlobalParamsData').then((val) => {
      console.log('User ID', val);
      if(val != null || val != undefined) {
        this.userInfoSubscribe = this.http.get('auth/info/'+val.authority+'/'+val.username).subscribe(
          (response: any) => {
            this.userInfodDataLoading = false;
            console.log('this.get_user_dtls',response);
            this.get_user_dtls = response;
            if(val.authority == 'ADMIN')
            {
              this.userPermissionData(response.role);
              this.admin = true;
            }
            else
            {
              this.admin = false;
            }
          },
          errRes => {
            this.userInfodDataLoading = false;
          }
        );
      }else {
        this.menuicon = true;
      }
    });

  }
  /*User info data get end*/
// getDesignerProfiledata start
getDesignerProfiledata(uid)
{
  
  this.http.get("designer/"+uid).subscribe(
    (res:any) => {
      this.designerprofiledata = res;
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


  closeModal() {
    console.log('Clicked');
    // this.menuCtrl.enable(false);
    this.menuCtrl.toggle();
  }

  // ============site information get start =============
  site_path;
  site_href;
  site_href_split;
  site_path_split;
  site_url_name;
  onSiteInformation() {
    // console.log('this.url_name app.componet.ts  pathname @@@>>',  window.location.pathname);

    this.site_path = window.location.pathname;
    this.site_href = window.location.href;
    this.site_href_split = window.location.href.split('/')[1];
    this.site_path_split = window.location.pathname.split('/')[1];

    // server print reasult///////
    /* site_path > /ci/xcelero/online/ 
    site_href > https://demo.rnjcs.in/ci/xcelero/online/#/auth 
    site_href_split > 
    site_path_split > ci  */

    const parsedUrl = new URL(window.location.href);
    const baseUrl = parsedUrl.hostname;
    //console.log('parsedUrl> ', parsedUrl);
    console.log('baseUrl> ', baseUrl); // this will print http://example.com or http://localhost:4200
    if (baseUrl == 'localhost' || baseUrl == '192.168.1.218') {
      this.site_url_name = 'https://www.marketing-crm.bongtechsolutions.com/';
    } else {
      this.site_url_name = window.location.href;
    }

    this.siteInfoLoading = true;
    // initializeApp
    this.initializeApp();


  }
}