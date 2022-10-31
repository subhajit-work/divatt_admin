import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
declare var $: any;
@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.page.html',
  styleUrls: ['./product-view.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductViewPage implements OnInit {
  productDataSubscribe: any;
  api_url: any;
  productDetail: any={};
  productId: string;
  permissionDataSubscribe: any;
  pagePermission: any;

  constructor(private http:HttpClient,
    private router:Router,
    private commonUtils:CommonUtils,
    private activatedRoute: ActivatedRoute,
    public toastController: ToastController,
              private authService: AuthService,) { }

  ngOnInit() {
    this.commonFunction();
  }
  commonFunction()
  {
    this.productId = this.activatedRoute.snapshot.params.id;
    this.getProductdetails();
    $.getScript('assets/js/sticky-kit.js');
    $.getScript('assets/js/menu.js');
     /*Check permission status start*/
    this.authService.globalparamsData.subscribe(res => {
      console.log('res>>', res);
      if(res.authority == 'ADMIN'){
        this.permissionDataSubscribe = this.commonUtils.menuPermissionObservable.subscribe(data => {
          if(data){
            console.log('menu>>', data);
            console.log('this.router.url>>', this.router.url);
    
            let pageUrl = this.router.url.split("/");
            console.log('pageUrl', pageUrl);
    
            for(let item of data) {
              if(item.modDetails.url == 'product-list'){
                if(item.modPrivs.list == true){
                  console.log('-----Permission Granted-----');
                  this.pagePermission = item;
                  console.log('this.pagePermission', this.pagePermission);
                  this.api_url = 'user/view/'+this.productId;
                  this.getProductdetails();
                  break;
                }else {
                  console.log('-------No Permission--------');
                  this.router.navigateByUrl('/error');
                }
                
              }
            }
          }
        })
      }else if(res.authority == 'DESIGNER')
      {
        this.api_url = 'user/view/'+this.productId;
        this.getProductdetails();
      }else  {
        this.router.navigateByUrl('/error');
      }
    })
    /*Check permission status end*/
  }
  getProductdetails()
  {
    this.productDataSubscribe = this.http.get(this.api_url).subscribe(
      (response:any) => {
        console.log("response",response);
        this.productDetail = response;
        
      },
      errRes => {
        console.log("error handeller >>@@",errRes );
        
      }
    );
  }
  public slideRightConfig: any = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    dots:true,
  };
}
