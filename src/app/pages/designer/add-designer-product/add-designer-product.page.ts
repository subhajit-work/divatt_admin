import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
@Component({
  selector: 'app-add-designer-product',
  templateUrl: './add-designer-product.page.html',
  styleUrls: ['./add-designer-product.page.scss'],
})
export class AddDesignerProductPage implements OnInit {
  standredSOH:any = [{}];
  age: {};
  selectedList:any=[];
  price: any;
  allData:any = {};
  addgift=false;
  designerId: any;
  productimg: any;
  uplodeimgloader:boolean=false;
  public fields: any[] = [{
  }];
  extraSpecifications:any={};
  role: any;
  private addProductSubcribe: Subscription;
  private getDesignerSubcribe: Subscription;
  private getCategoryListSubscribe: Subscription;
  userData: any;
  colourlist;
  btnloader: boolean;
  private getsubCategoryListSubscribe: Subscription;
  subcategorylist: any ;
  private getSpecificationListSubscribe: Subscription;
  specificationlist: any;
  getproductbyIdapi: string;
  private getProductByIdSubscribe: Subscription;
  giftWrap=false;
  customization=false;
  cod=false;
  showextra;
  editextraspecification: boolean = false;
  frontImage;
  isLinear;
  public back:string = '';
  public side:string = '';
  public close:string = '';
  public neck:string = '';
  public image6:string = '';
  public image7:string = '';
  public image8:string = '';
  public getColorListSubscribe: Subscription;
  public getMesormentListSubscribe: Subscription;
  mesormentList: any=[{disabled:true,name:''}];
  catname: string;
  subcatname: string;
  save_subcategorylist: any;
  setData: any;
  loader: boolean;
  HSNlist;
  private getHSNListSubscribe: Subscription;
  hsnData: any;
  constructor(private activatedRoute: ActivatedRoute,private storage: Storage,
    private http:HttpClient,private router:Router,private commonUtils:CommonUtils) { }
    categoryslist;
    discountTypelist=[
      {id:1,name:"Flat"},
      {id:2,name:"Percentage"},
      {id:3,name:"None"}
    ]
    pricetyplist=[
      {id:1,name:"Without Tax"},
      {id:2,name:"Inclusive Tax"}
    ]
    genderList=[
      {id:1,name:"Male"},
      {id:2,name:"Female"}
    ]
    productdtl: any = {
      
    };
    categoryImage: any;
    mobileImage: any;
    allcategorydata: { };
    action: any;
    id: any;
    nofile: boolean;
    isPrimary1;
    isPrimary2
  ngOnInit() {    
    this.productdtl.discountValue = 0;
  }
  ionViewWillEnter() {
    this.commonFunction();
  }
  // commonFunction start

  commonFunction()
  {
    
    this.storage.get('setStroageGlobalParamsData').then((val) => {
      // console.log('All User Data', val.username,val.authority,val.firstName);
      // console.log("this.href",val.username.split('@')[0]);
      this.role = val.authority;
      console.log('this.role', this.role);

      if(this.role == 'DESIGNER') {
        // this.getdesignerById(val.uid);
        this.getDesignerProfiledata(val.uid)
        this.getColorList();
        this.getHSNlist('');
        this.id = this.activatedRoute.snapshot.params.id;
        this.action = this.activatedRoute.snapshot.params.action;
        console.log(this.id,this.action);

        this.productdtl.inddiscountType = 'None';
        this.productdtl.usdiscountType = 'None';

        this. getcategoryList();
        if(this.action == 'edit')
        {
          this.editextraspecification = true;
          this.getproductbyIdapi = 'designerProduct/view/';
          this.getproductById();
          this.getDesignerProfiledata(val.uid)
        }
        
      }else {
        this.router.navigateByUrl('/error');
      }
      
      
    });
    
  }

  // commonFunction end
  getHSNlist(key)
  {
    this.getHSNListSubscribe = this.http.get("hsn/getactiveHSNList?searchKeyword="+key).subscribe(
      (res:any) => {
        console.log("res",res);
        this.HSNlist = res
      },
      (error) =>{
        // console.log("error",error);
        // this.commonUtils.presentToast('error', error.error.message);


      })
  }
  testSearch(term: string, item) {
    console.log(item);
    console.log(term);
    return item.name.startsWith(term);
  }
    // getDesignerProfiledata for check perpession start
getDesignerProfiledata(uid)
{
  console.log("this.getDesignerProfiledata(val.uid)",this.designerId);
  
  this.http.get("designer/"+uid).subscribe(
    (res:any) => {
      if(res.profileStatus == 'COMPLETED')
      {
        this.userData = res;
      }else
      {
        let pageUrl = this.router.url.split("/");
        console.log('pageUrl', pageUrl[1]);
        if(pageUrl[1] == 'add-designer-product')
        {
          this.commonUtils.presentToast('error',"Sorry ! You don't have any permission on product.");
          this.router.navigateByUrl('/error');
        }
      }
      
      
    },
    (error) =>{
      console.log("error",error);
    })
}
// getDesignerProfiledata for check perpession  end
  // getcatById start
  getdesignerById(role,username)
  {
    this.getDesignerSubcribe = this.http.get("designer/"+username).subscribe(
      (res:any) => {
        this.userData = res;
        console.log("this.userData",this.userData);
        
      },
      (error) => {
        
      }
    )
  }
  // getcatById end
  // getproductById start
  getproductById()
  {
    this.loader = true;
    this.getProductByIdSubscribe = this.http.get(this.getproductbyIdapi+this.id).subscribe(
      (res:any) => {
        this.loader = false;
        console.log("productdtl res",res);
        this.productdtl = res
        this.productdtl =
        {
          productName:res.productName,
          productDescription:res.productDescription,
          categoryId:res.categoryId,
          subCategoryId:res.subCategoryId,
          min:res.age.min,
          max:res.age.max,
          purchaseMax:res.purchaseQuantity.purchaseMax,
          purchaseMin:res.purchaseQuantity.purchaseMin,
          gender:res.gender,
          cod:res.cod,
          taxInclusive:res.taxInclusive,
          customization:res.customization,
          giftWrap:res.giftWrap,
          priceType:res.priceType,
          taxPercentage:res.taxPercentage,
          front : res.images[0].name,
          colour:res.images[0].colour,
          inddiscountType:res.price.indPrice.discountType,
          inddiscountValue:res.price.indPrice.discountValue,
          fittingInformation:res.specifications.fittingInformation,
          productDetails:res.specifications.productDetails,
          style:res.specifications.style,
          customizationSOH:res.customizationSOH,
          washingInformation:res.specifications.washingInformation,
          cotton:res.specifications.composition.cotton,
          polystar:res.specifications.composition.polystar,
          indmrp:res.price.indPrice.mrp,
          amount:res.price.indPrice.mrp,
          indealPrice:res.price.indPrice.dealPrice,
          indealstart:res.price.indPrice.dealStart,
          indealend:res.price.indPrice.dealEnd,
          usdealstart:res.price.usPrice.dealStart,
          usdealend:res.price.usPrice.dealEnd,
          usdiscountType:res.price.usPrice.discountType,
          usdiscountValue:res.price.usPrice.discountValue,
          usmrp:res.price.usPrice.mrp,
          usamount:res.price.usPrice.mrp,
          usdealPrice:res.price.usPrice.dealPrice,
          extraSpecificationskey: Object.keys(res.extraSpecifications),
          extraSpecificationsvalue: Object.values(res.extraSpecifications),
          // hsnData:res.hsnData.hsnCode
        }
        if(res.hsnData)
        {
          this.productdtl.hsnData = res.hsnData.hsnCode
          this.hsnData = res.hsnData;
        }
        
          this.frontImage = res.images[0].name,
          console.log('this.frontImage>>', this.frontImage);
          
          this.back = res.images[1].name,
          this.side = res.images[2].name,
          this.close = res.images[3].name,
          this.neck = res.images[4].name,
          this.image6 = res.images[5].name,
          this.image7 = res.images[6].name,
          this.image8 = res.images[7].name,
        this.productdtl.indeal_start = moment(res.price.indPrice.dealStart).format('YYYY-MM-DD');
        this.productdtl.indeal_end = moment(res.price.indPrice.dealEnd).format('YYYY-MM-DD');
        this.productdtl.usdeal_start = moment(res.price.usPrice.dealStart).format('YYYY-MM-DD');
        this.productdtl.usdeal_end = moment(res.price.usPrice.dealEnd).format('YYYY-MM-DD');
        for(let  i=0;i < res.standeredSOH.length ;i++)
        {
          this.standredSOH[i] = res.standeredSOH[i];
          // this.selectedList[i] = res.standeredSOH[i].sizeType;
            this.selectedList.push({sizeType:res.standeredSOH[i].sizeType})

        console.log("this.productdtl.standeredSOH",this.standredSOH,res.standeredSOH,this.selectedList);

        }
        console.log("val",this.selectedList);
        // for(let i = 0;i < this.standredSOH.length; i++)
        // {
        //   if(res.standeredSOH[i].sizeType != this.selectedList[i])
        //   {
        //     // this.mesormentList.push({disabled:true});
        //     this.selectedList.push({sizeType:res.standeredSOH[i].sizeType})
        //   }
        // console.log("val",this.selectedList);

        // }
        console.log("this.productdtl.standeredSOH",this.standredSOH,res.standeredSOH);
        
        this.categorySelected('',this.productdtl.categoryId,'onload')
        this.getSpecification(this.productdtl.categoryId);
        console.log("this.productdtl",this.productdtl);
        // const object1 = {
        //   a: 'somestring',
        //   b: 42,
        //   c: false
        // };
        
        

        for (let index = 0; index < res.extraSpecifications.length; index++) {
                this.extraSpecifications[this.specificationlist[index].name] = res.extraSpecifications[index].name;
                console.log('form.value.specificationValue+index;', res.extraSpecifications[index].name);
                
                console.log("Len",res.extraSpecifications.length);
              }
              console.log("final objeect is", this.extraSpecifications); 
      },
      (error) =>{
        this.loader = false;
        console.log("error",error);
        this.commonUtils.presentToast('error',error.error.message)
      })
      console.log("selectedList",this.selectedList);
  }
  // getproductById end
  // changeDateFormat start
  changeDateFormat(identifier,date)
  {
    if(identifier == 'indealstart')
    {
      this.productdtl.indealstart= moment(date).format('YYYY/MM/DD');
      console.log(this.productdtl.indealstart,date);
      
    }else if(identifier == 'indealend')
    {
      this.productdtl.indealend= moment(date).format('YYYY/MM/DD');
      console.log(this.productdtl.indealend,date);
      
    }if(identifier == 'usdealstart')
    {
      this.productdtl.usdealstart= moment(date).format('YYYY/MM/DD');
      console.log(this.productdtl.usdealstart,date);
      
    }else if(identifier == 'usdealend')
    {
      this.productdtl.usdealend= moment(date).format('YYYY/MM/DD');
      console.log(this.productdtl.usdealend,date);
      
    }
  }
  // changeDateFormat end
 
  // onGifiSelect start
  onGifiSelect(e)
  {
    console.log(e);
    if(e == true)
    {
      this.addgift = true;
    }
    else
    {
      this.addgift = false;
    }
  }
  // onGifiSelect end
  isprimary(identifier,event)
  {
    console.log("identifier,event",identifier,event);
    if(identifier == 'image1')
    {
      this.isPrimary1 = true;
      this.isPrimary2=false;
    }else if(identifier == 'img2')
    {
      this.isPrimary1 = false;
      this.isPrimary2=true;
    }
  }
    // Specification get start
    getSpecification(catid){
      this.getSpecificationListSubscribe = this.http.get("specification/listOfSpecification/"+catid).subscribe(
        (res:any) => {
          console.log("res",res);
          this.specificationlist = res
          console.log("this.specificationlist",this.specificationlist);
          console.log("Len",this.specificationlist.name);
          
        },
        (error) =>{
          console.log("error",error);
        })
    }
    // Specification get end
      
  /* -----------Image uploading start----------- */
  private imageidentifier: string = '';
  

  handleInputChange(e,imageidentifier) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    this.imageidentifier = imageidentifier;
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    this.uplodeimgloader = true;
    var fd = new FormData();
    console.log("fd",e);
    
    fd.append("file", e.target.files[0]);  
     if(this.imageidentifier == 'front')
    {
      this.productdtl.front = this.frontImage;
      console.log("this.frontImage",this.productdtl.front);
      this.http.post("admin/profile/s3/upload",fd).subscribe(
        (res:any) => {
          this.frontImage = res.path;
          this.productdtl.front = this.frontImage;
          this.uplodeimgloader = false;
        },
        (error) =>{
          console.log("error",error);
          this.uplodeimgloader = false;
          this.commonUtils.presentToast('error', error.error.message);
      })
      
    }else if(this.imageidentifier == 'back')
    {
      this.productdtl.back = this.back;
      console.log("this.back",this.productdtl.back);
      this.http.post("admin/profile/s3/upload",fd).subscribe(
        (res:any) => {
          this.back = res.path;
          this.productdtl.back = this.back;
          this.uplodeimgloader = false;
        },
        (error) =>{
          console.log("error",error);
          this.uplodeimgloader = false;
          this.commonUtils.presentToast('error', error.error.message);
      })
      
    }else if(this.imageidentifier == 'side')
    {
      this.productdtl.side = this.side;
      console.log("this.side",this.productdtl.side);
      this.http.post("admin/profile/s3/upload",fd).subscribe(
        (res:any) => {
          this.side = res.path;
          this.productdtl.side = this.side;
          this.uplodeimgloader = false;
        },
        (error) =>{
          console.log("error",error);
          this.uplodeimgloader = false;
          this.commonUtils.presentToast('error', error.error.message);
      })
      
    }else if(this.imageidentifier == 'close')
    {
      this.productdtl.close = this.close;
      console.log("this.close",this.productdtl.close);
       this.http.post("admin/profile/s3/upload",fd).subscribe(
        (res:any) => {
          this.close = res.path;
          this.productdtl.close = this.close;
          this.uplodeimgloader = false;
        },
        (error) =>{
          console.log("error",error);
          this.uplodeimgloader = false;
          this.commonUtils.presentToast('error', error.error.message);
      })
      
    }else if(this.imageidentifier == 'neck')
    {
      // this.neck  = reader.result;
      this.productdtl.neck = this.neck;
      console.log("this.neck",this.productdtl.neck);
       this.http.post("admin/profile/s3/upload",fd).subscribe(
        (res:any) => {
          this.neck = res.path;
          this.productdtl.neck = this.neck;
          this.uplodeimgloader = false;
        },
        (error) =>{
          console.log("error",error);
          this.uplodeimgloader = false;
          this.commonUtils.presentToast('error', error.error.message);
      })
      
    }else if(this.imageidentifier == 'image6')
    {
      // this.neck  = reader.result;
      this.productdtl.image6 = this.image6;
      console.log("this.neck",this.productdtl.image6);
       this.http.post("admin/profile/s3/upload",fd).subscribe(
        (res:any) => {
          this.image6 = res.path;
          this.productdtl.image6 = this.image6;
          this.uplodeimgloader = false;
        },
        (error) =>{
          console.log("error",error);
          this.uplodeimgloader = false;
          this.commonUtils.presentToast('error', error.error.message);
      })
      
    }else if(this.imageidentifier == 'image7')
    {
      // this.neck  = reader.result;
      this.productdtl.image7 = this.image7;
      console.log("this.neck",this.productdtl.image7);
       this.http.post("admin/profile/s3/upload",fd).subscribe(
        (res:any) => {
          this.image7 = res.path;
          this.productdtl.image7 = this.image7;
          this.uplodeimgloader = false;
        },
        (error) =>{
          console.log("error",error);
          this.uplodeimgloader = false;
          this.commonUtils.presentToast('error', error.error.message);
      })
      
    }else if(this.imageidentifier == 'image8')
    {
      // this.neck  = reader.result;
      this.productdtl.image8 = this.image8;
      console.log("this.neck",this.productdtl.image8);
       this.http.post("admin/profile/s3/upload",fd).subscribe(
        (res:any) => {
          this.image8 = res.path;
          this.productdtl.image8 = this.image8;
          this.uplodeimgloader = false;
        },
        (error) =>{
          console.log("error",error);
          this.uplodeimgloader = false;
          this.commonUtils.presentToast('error', error.error.message);
      })
      
    }
    console.log("this.productdtl",this.productdtl);
  }
  /* Image uploading end */
 
  removevalue(i,val){
    console.log(val);
    
    this.standredSOH.splice(i,1);
    this.selectedList.splice(i,1);
    for (let j = 0; j < this.mesormentList.length; j++) {
      if(this.mesormentList[j].name==val){
        if(this.mesormentList[j].disabled==true)
            this.mesormentList[j].disabled=false
            else
            this.mesormentList[j].disabled=true
      }
  
    }
  }
  addvalue(){
    this.standredSOH.push({notify: '',oos: '',sizeType: '', soh: ''});
  }
    // add dyenomic fields end
    // hsnSelected start
    hsnSelected(hsndata)
    {
      console.log("hsndata",hsndata);
      
      this.hsnData = hsndata
      if(hsndata == undefined)
      {
        this.productdtl.amount = '';
        this.productdtl.indmrp = '';
        this.productdtl.indealPrice = '';
        this.productdtl.inddiscountType = 'None';
        this.productdtl.inddiscountValue = '';
      }
    }
    // hsnSelected end
  onSubmitDesigproductForm(form:NgForm)
  {
    this.btnloader =true;
    console.log("this.SOH",form.value,this.standredSOH);
    console.log("Len",this.specificationlist.name,this.specificationlist.length);
   for (let index = 0; index < this.specificationlist.length; index++) {
      this.extraSpecifications[this.specificationlist[index].name] = form.value[`specificationValue`+index];
      console.log('form.value.specificationValue+index;', form.value[`specificationValue`+index]);
      
      console.log("Len",this.specificationlist[index].name);
    }
    console.log("final objeect is", this.extraSpecifications); 
    
    // create small objects start
    var age = {
      min:form.value.min,
      max:form.value.max,
    }
    var indPrice = {
      dealStart:form.value.indealstart,
      dealEnd:form.value.indealend,
      mrp:form.value.indmrp,
      dealPrice:this.productdtl.indealPrice,
      discountType:form.value.inddiscountType,
      discountValue:form.value.inddiscountValue
    }

    var usPrice = {
      dealStart:form.value.usdealstart,
      dealEnd:form.value.usdealend,
      mrp:form.value.usmrp,
      dealPrice:this.productdtl.usdealPrice,
      discountType:form.value.usdiscountType,
      discountValue:form.value.usdiscountValue
    }
    var purchaseQuantity={
      purchaseMax:form.value.purchaseMax,
      purchaseMin:form.value.purchaseMin
    }
    var price ={
      indPrice:indPrice,
      usPrice:usPrice,
    }
    var giftQnty = {
      IN:form.value.inamount,
      US:form.value.usamount,
    }
    var images = [{
      
      isPrimary:true,
      colour:form.value.colour1,
      name:this.frontImage,
      
    },{
      name:this.back,
    },{
      name:this.side,
    },{
      name:this.close,
    },{
      name:this.neck,
    },{
      name:this.image6,
    },{
      name:this.image7,
    },{
      name:this.image8,
    }]
   
    
    // create small objects end
   // set boolean value start
   var composition = {
      cotton:form.value.cotton,
      polystar:form.value.polystar,
    }
   var specifications = {
    productDetails:form.value.productDetails,
    fittingInformation:form.value.fittingInformation,
    Style:form.value.Style,
    composition:composition,
    washingInformation:form.value.washingInformation
   }
  //  var standeredSOH = [
  //   {
  //     notify:form.value.notify,
  //     oos:form.value.oos,
  //     sizeType:form.value.sizeType,
  //     soh:form.value.soh,
  //   }
    
  //  ]
  var standeredSOH = this.standredSOH;
  
   
   
// set boolean value end
    // for()
    // customize for gifiwrap start and main allData object
    if(this.addgift == false)
    {
      
      this.allData = 
      {
        categoryId:form.value.categoryId,
        subCategoryId:form.value.subCategoryId,
        designerId:this.userData.designerId,
        designerName:this.userData.designerProfile.firstName1 +' '+this.userData.designerProfile.lastName1,
        colour:form.value.colour,
        price:price,
        customizationSOH:form.value.customizationSOH,
        age:age,
        gender:form.value.gender,
        customization:this.customization,
        cod:this.cod,
        giftWrap:this.giftWrap,
        purchaseQuantity:purchaseQuantity,
        priceType:form.value.priceType,
        productDescription:form.value.productDescription,
        productName:form.value.productName,
        taxInclusive:form.value.taxInclusive,
        standeredSOH:standeredSOH,
        taxPercentage:form.value.taxPercentage,
        images:images,
        extraSpecifications:this.extraSpecifications,
        specifications:specifications,
        hsnData:this.hsnData
      }
    }
    else
    {
      this.allData = 
      {
        categoryId:form.value.categoryId,
        subCategoryId:form.value.subCategoryId,
        price:price,
        age:age,
        gender:form.value.gender,
        cod:this.cod,
        colour:form.value.colour,
        customizationSOH:form.value.customizationSOH,
        customozation:this.customization,
        giftWrap:this.giftWrap,
        designerId:this.userData.designerId,
        designerName:this.userData.designerProfile.firstName1 +' '+this.userData.designerProfile.lastName1,
        purchaseQuantity:purchaseQuantity,
        giftQnty:giftQnty,
        priceType:form.value.priceType,
        productDescription:form.value.productDescription,
        productName:form.value.productName,
        taxInclusive:form.value.taxInclusive,
        taxPercentage:form.value.taxPercentage,
        images:images,
        standeredSOH:standeredSOH,
        specifications:specifications,
        extraSpecifications:this.extraSpecifications,
        hsnData:this.hsnData
      }
    }
    // ccustomize for gifiwrap end
         console.log("this.allData",this.allData);
         if(this.action == 'add')
         {
           
          if(form.value.giftWrap != null)
          {
            this.giftWrap = form.value.giftWrap;
          }
          if(form.value.customization != null)
          {
           this.customization = form.value.customization;
          }
          if(form.value.cod != null)
          {
           this.cod = form.value.cod;
          }
          this.addProductSubcribe = this.http.post('designerProduct/add',this.allData).subscribe((res:any) =>{
            this.btnloader = false;
            form.reset();
            this.commonUtils.presentToast('success', res.message);
            this.router.navigateByUrl("product-list");
            },error =>{
              console.log(error);
              this.btnloader = false;
              this.commonUtils.presentToast('error', error.error.message);
          })
         }else if(this.action == 'edit')
         {
           if(form.value.dealEnd == undefined)
          this.addProductSubcribe = this.http.put('designerProduct/update/'+this.id,this.allData).subscribe((res:any) =>{
            this.btnloader = false;
            // form.reset();
            this.commonUtils.presentToast('success', res.message);
            this.router.navigateByUrl("product-list");
            },error =>{
              console.log(error);
              this.btnloader = false;
              this.commonUtils.presentToast('error', error.error.message);
          })
         }
         
   
   
  }

  // getcategoryList start
  getcategoryList()
  {
    this.getCategoryListSubscribe = this.http.get("category/getCategoryList").subscribe(
      (res:any) => {
        console.log("res",res);
        this.categoryslist = res
      },
      (error) =>{
        // console.log("error",error);
        this.commonUtils.presentToast('error', error.error.message);

      })
  }
  // getcategoryList end



  
  // /*------Sale price calculation start------*/
  // salePriceCalculation(discountType,mrp,discountValue,identifier){
  //   // console.log(this.hsnData);
    
    
  //   // var mrp = this.hsnData.taxValue * _mrp;
  //   // console.log(mrp);
    
  //   console.log('discountType', discountType);
  //   console.log('mrp', mrp);
  //   console.log('discountValue', discountValue);
  //   console.log('identifier', identifier);
    
  //   if(identifier && discountType && mrp){
  //     let salePrice;
  //     let errorPrice;

  //     if(discountType == 'Flat'){
  //       if(mrp > discountValue){
  //         salePrice = (mrp - discountValue);
  //         errorPrice = false;
  //       }else if (discountValue > mrp){
  //         salePrice = 0;
  //         errorPrice = true;
  //       }else {
  //         salePrice = 0;
  //         errorPrice = false;
  //       }
        
  //       console.log('salePrice', salePrice);
  //       if(identifier == 'indiaPrice'){
  //         this.productdtl.indealPrice = salePrice;
          
  //           this.productdtl.indealPriceError = errorPrice;
          
  //       }else {
  //         this.productdtl.usdealPrice = salePrice;
          
  //           this.productdtl.usdealError = errorPrice;
          
  //       }
  //     }else  if(discountType == 'Percentage'){
  //       if(mrp > discountValue){
  //         salePrice = mrp - (mrp * (discountValue/100)) ;
  //         errorPrice = false;
  //       }else if(discountValue > mrp){
  //         salePrice = 0;
  //         errorPrice = true;
  //       }else {
  //         salePrice = 0;
  //         errorPrice = false;
  //       }
        
  //       console.log('salePrice', salePrice);
  //       if(identifier == 'indiaPrice'){
  //         this.productdtl.indealPrice = salePrice;
          
  //           this.productdtl.indealPriceError = errorPrice;
          
  //       }else {
  //         this.productdtl.usdealPrice = salePrice;
          
  //           this.productdtl.usdealError = errorPrice;
          
  //       }
  //     }else {
  //       if(identifier == 'indiaPrice'){
  //         this.productdtl.indealPrice = mrp;
  //         this.productdtl.inddiscountValue = 0;
  //       }else {
  //         this.productdtl.usdealPrice = mrp;
  //         this.productdtl.usdiscountValue = 0;
  //       }
  //     }
  //   }
  // }
  // /*Sale price calculation end*/
  /*------Sale price calculation start------*/
  // oldmrp;
  // o_mrp
  salePriceCalculation(amount,discountType,mrp,discountValue,identifier){
    // indiaPrice start
    if(identifier == 'indiaPrice')
    {
      console.log(identifier);
      
      if(this.productdtl.indmrp)
      {

      }else 
      {
        this.productdtl.indmrp = amount;
      }
      if(!discountValue)
      {
        discountValue = 0;
      }else{
        this.productdtl.indealPriceError = false
      }
      var taxValue = this.hsnData.taxValue * this.productdtl.indmrp;
      this.productdtl.indealPrice = taxValue + this.productdtl.indmrp;
      if(this.productdtl.inddiscountType == 'Flat')
      {
          // this.productdtl.indmrp = amount;
          this.productdtl.indmrp = amount - discountValue
          taxValue = this.hsnData.taxValue * this.productdtl.indmrp;
          this.productdtl.indealPrice = taxValue + this.productdtl.indmrp;
          if(discountValue > this.productdtl.amount)
          {
            this.productdtl.indealPriceError = true
            this.productdtl.indmrp = this.productdtl.amount;
            this.productdtl.discountValue = 0;
            taxValue = this.hsnData.taxValue * this.productdtl.indmrp;
            this.productdtl.indealPrice = taxValue + this.productdtl.amount;
            console.log(this.productdtl.indealPrice,this.productdtl.discountValue,this.productdtl.indmrp);
            
          }

      }else if(this.productdtl.inddiscountType == 'Percentage')
      {
          // this.productdtl.indmrp = amount;
          this.productdtl.indmrp = amount - (amount * (discountValue/100));
          taxValue = this.hsnData.taxValue * this.productdtl.indmrp;
          this.productdtl.indealPrice = taxValue + this.productdtl.indmrp;
          if(discountValue > 100)
          {
            this.productdtl.indealPriceError = true
            this.productdtl.indmrp = this.productdtl.amount;
            this.productdtl.discountValue = 0;
            taxValue = this.hsnData.taxValue * this.productdtl.indmrp;
            this.productdtl.indealPrice = taxValue + this.productdtl.amount;
            
          }

      }else if(this.productdtl.inddiscountType == "None"){
        this.productdtl.indmrp = amount;
        taxValue = this.hsnData.taxValue * this.productdtl.indmrp;
          this.productdtl.indealPrice = taxValue + this.productdtl.indmrp;
      }
    }
    // indiaPrice  end
    // usPrice start
    else if(identifier == 'usPrice')
    {
      console.log(identifier);
      
      if(this.productdtl.usmrp)
      {

      }else 
      {
        this.productdtl.usmrp = amount;
      }
      if(!discountValue)
      {
        discountValue = 0;
      }else{
        this.productdtl.usdealPriceError = false
      }
      var taxValue = this.hsnData.taxValue * this.productdtl.usmrp;
      this.productdtl.usdealPrice = taxValue + this.productdtl.usmrp;
      if(this.productdtl.usdiscountType == 'Flat')
      {
          // this.productdtl.indmrp = amount;
          this.productdtl.usmrp = amount - discountValue
          taxValue = this.hsnData.taxValue * this.productdtl.usmrp;
          this.productdtl.usdealPrice = taxValue + this.productdtl.usmrp;
          if(discountValue > this.productdtl.usamount)
          {
            this.productdtl.usdealPriceError = true
            this.productdtl.usmrp = this.productdtl.usamount;
            this.productdtl.usdiscountValue = 0;
            taxValue = this.hsnData.taxValue * this.productdtl.usmrp;
            this.productdtl.usdealPrice = taxValue + this.productdtl.usamount;
            
          }

      }else if(this.productdtl.usdiscountType == 'Percentage')
      {
          // this.productdtl.indmrp = amount;
          this.productdtl.usmrp = amount - (amount * (discountValue/100));
          taxValue = this.hsnData.taxValue * this.productdtl.usmrp;
          this.productdtl.usdealPrice = taxValue + this.productdtl.usmrp;
          if(discountValue > 100)
          {
            this.productdtl.usdealPriceError = true
            this.productdtl.usmrp = this.productdtl.usamount;
            this.productdtl.usdiscountValue = 0;
            taxValue = this.hsnData.taxValue * this.productdtl.usmrp;
            this.productdtl.usdealPrice = taxValue + this.productdtl.usamount;
            
          }

      }else if(this.productdtl.usdiscountType == "None"){
        this.productdtl.usmrp = amount;
        taxValue = this.hsnData.taxValue * this.productdtl.usmrp;
          this.productdtl.usdealPrice = taxValue + this.productdtl.usmrp;
      }
    }
    // usPrice  end
   console.log();
   
  }
  /*Sale price calculation end*/
  // categorySelected start
  categorySelected(e,catid,calltype){
    console.log('catid', catid,e);
    this.catname = e;
    if(calltype == 'onchange')
    {
      this.productdtl.subCategoryId = null;
      this.specificationlist = null;
      this.standredSOH = [{}]
      this.mesormentList = [];
      this.selectedList = []
      this.editextraspecification = false;
      if(catid)
      {
        this.getSpecification(catid);
    
        this.getsubCategoryListSubscribe = this.http.get("subcategory/getAllSubcategory/"+catid).subscribe(
          (res:any) => {
            console.log("res",res);
            this.subcategorylist = res
          },
          (error) =>{
            this.commonUtils.presentToast('error', error.error.message);
          })
      }
      
    }else if(calltype == 'onload')
    {
      console.log("calltype",calltype);
      if(catid)
      {
        this.getSpecification(catid);
    
        this.getsubCategoryListSubscribe = this.http.get("subcategory/getAllSubcategory/"+catid).subscribe(
          (res:any) => {
            console.log("res",res);
            this.subcategorylist = res;
            this.save_subcategorylist = res;
            this.getMesormentList('onload');
            
          },
          (error) =>{
            this.commonUtils.presentToast('error', error.error.message);
          })
      }
     
    }
      this.subcategorylist = [];
      this.specificationlist = null;
      
       
    
    // this.subcategorylist = 
    
  }
  // categorySelected end
  SubcatSelected(e,id)
  {
    console.log(e,id);
    this.subcatname = e;
    this.standredSOH = [{}]
    this.mesormentList = [];
    this.selectedList = []
    this.getMesormentList('onchange') 
  }
  //getColorList start 
  getColorList()
  {
    this.getColorListSubscribe = this.http.get("adminMData/coloreList").subscribe(
      (res:any) => {
        console.log("res",res);
        this.colourlist = res
      },
      (error) =>{
        // console.log("error",error);
        this.commonUtils.presentToast('error', error.error.message);


      })
  }
  //getColorList end
  // selectColor start
  selectColor(val)
  {
    console.log(val);
    
  }
  // selectColor end
  // getMesormentList start
getMesormentList(calltype)
{ 
  var x,y;
  console.log("this.categoryslistthis.categoryslist",this.categoryslist.length,this.categoryslist,this.productdtl.categoryId,this.save_subcategorylist,this.productdtl.subCategoryId);
  
  if(calltype == 'onload')
  {
    for(x=0;x<this.categoryslist.length;x++)
    {
      if(this.productdtl.categoryId == this.categoryslist[x].id)
      {
        this.catname = this.categoryslist[x].categoryName
        console.log("this.catname",this.catname);
        
      }
    }
    for(y=0;y<this.save_subcategorylist.length;y++)
    {
      console.log("this.save_subcategorylist[y].id",this.save_subcategorylist[y].id);
      
      if(this.productdtl.subCategoryId == this.save_subcategorylist[y].id)
      {
        this.subcatname = this.save_subcategorylist[y].categoryName
      }
    }
  }else if(calltype == 'onchange')
  {

  }
  this.getMesormentListSubscribe = this.http.get("productMeasurement/view/"+this.catname+'/'+this.subcatname).subscribe(
    (res:any) => {
      console.log("res",res);

      this.mesormentList = res.measurementKey;
      this.mesormentList.forEach(element => {
        element.disabled=false
      });
      for (let i = 0; i < this.selectedList.length; i++) {
        for (let j = 0; j < this.mesormentList.length; j++) {
          if(this.mesormentList[j].name==this.selectedList[i].sizeType)
          this.mesormentList[j].disabled=true
        }
        
      }
      console.log('me',this.mesormentList);
      

    },
    (error) =>{
      // console.log("error",error);
      this.commonUtils.presentToast('error', error.error.message);

    })
}
// getMesormentList end
  // clearfile start
  clearfile(index)
  {
    console.log("index",index);
    if(index == 'front')
    {
      this.productdtl.front = null;
      this.frontImage = null;
    }else if(index == 'back')
    {
      this.back = null;
    }else if(index == 'side')
    {
      this.side = null;
    }else if(index == 'close')
    {
      this.close = null;
    }else if(index == 'neck')
    {
      this.neck = null;
    }else if(index == 'image6')
    {
      this.image6 = null;
    }else if(index == 'image7')
    {
      this.image7 = null;
    }else if(index == 'image8')
    {
      this.image8 = null;
    }
    console.log("index",this.productdtl.images);
  }
  // clearfile end
  ngsel(id)
  {
    console.log(id);
    
  }
  setval(data)
  {
    this.setData=data;
  }
  toggleDisabled(val) {
    console.log("val",val,this.selectedList,this.mesormentList,this.mesormentList.length);
    var selector;
    if(val != undefined)
    {
      console.log("undefined")
      if(val != '')
      {
        for (let j = 0; j < this.mesormentList.length; j++) {
          if(this.mesormentList[j].name==val){
            if(this.mesormentList[j].disabled==true)
                this.mesormentList[j].disabled=false
                else
                this.mesormentList[j].disabled=true
          }
          if(this.mesormentList[j].name==this.setData){
            if(this.mesormentList[j].disabled==true)
                this.mesormentList[j].disabled=false
                else
                this.mesormentList[j].disabled=true
          }
      
        }
      }
    } 
    console.log("this.selectedList",selector,this.mesormentList);
    
    // const mesorment: any = this.mesormentList[1];
    // mesorment.disabled = !mesorment.disabled;
}
  // ngOnDestroy start
  ngOnDestroy() {
    if(this.getCategoryListSubscribe !== undefined){
      this.getCategoryListSubscribe.unsubscribe();
    }
    if(this.getProductByIdSubscribe !== undefined){
      this.getProductByIdSubscribe.unsubscribe();
    }
    if(this.getsubCategoryListSubscribe !== undefined){
      this.getsubCategoryListSubscribe.unsubscribe();
    }
    if(this.getSpecificationListSubscribe !== undefined){
      this.getSpecificationListSubscribe.unsubscribe();
    }
    if(this.addProductSubcribe !== undefined){
      this.addProductSubcribe.unsubscribe();
    }
    if(this.getDesignerSubcribe !== undefined){
      this.getDesignerSubcribe.unsubscribe();
    }
    if(this.getColorListSubscribe !== undefined){
      this.getColorListSubscribe.unsubscribe();
    }
    if(this.getMesormentListSubscribe !== undefined){
      this.getMesormentListSubscribe.unsubscribe();
    }
    if(this.getHSNListSubscribe !== undefined){
      this.getHSNListSubscribe.unsubscribe();
    }
  }  
  // ngOnDestroy end

}
