import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, ModalController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { Storage } from '@ionic/storage';
import { ModalPage } from '../modal/modal.page';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as moment from 'moment';
@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  role: any;
  tableListData = [];
  allselectModel;
  itemcheckClick = false;
  checkedList = [];
  private designerId;
  alldelbtn: boolean;
  private changeStatusSubscribe: Subscription;
  statustype='all';
  tableTitle = 'All';
  approvalApi: string;
  approveProductSubscribe: Subscription;
  designerprofiledata: any;
  currentDate: string;
  constructor(private http:HttpClient,
    public toastController: ToastController,
              private modalController : ModalController,
              private alertController:AlertController,
              private commonUtils: CommonUtils,
              private authService: AuthService,
              private router:Router,private storage:Storage) { }

  tableHeaderData1 = [
    {
      column_name: "productName",
      display_name: "Product Name",
      sortingButtonName: ""
    },{
      column_name: "productDescription",
      display_name: "Product Description",
      sortingButtonName: ""
    }
    ,{
      column_name: "designerName",
      display_name: "Designer Name",
      sortingButtonName: ""
    }
    ,{
      column_name: "gender",
      display_name: "Gender",
      sortingButtonName: ""
    }
    ,{
      column_name: "age",
      display_name: "Age",
      sortingButtonName: ""
    }
    // ,{
    //   column_name: "priceType",
    //   display_name: "Price Type",
    //   sortingButtonName: ""
    // },
    // {
    //   column_name: "designerId",
    //   display_name: "Designer Id",
    //   sortingButtonName: ""
    // },
    // {
    //   column_name: "taxPercentage",
    //   display_name: "Tax Percentage",
    //   sortingButtonName: ""
    // }
    ,{
      column_name: "price",
      display_name: "Indian MRP(₹)",
      sortingButtonName: ""
    },{
      column_name: "price",
      display_name: "US MRP($)",
      sortingButtonName: ""
    },{
      column_name: "purchaseMax",
      display_name: "Stock",
      sortingButtonName: ""
    }
  ];
  tableHeaderData = [
    {
      column_name: "productName",
      display_name: "Product Name",
      sortingButtonName: ""
    },{
      column_name: "productDescription",
      display_name: "Product Description",
      sortingButtonName: ""
    }
    ,{
      column_name: "gender",
      display_name: "Gender",
      sortingButtonName: ""
    }
    ,{
      column_name: "age",
      display_name: "Age",
      sortingButtonName: ""
    }
    // ,{
    //   column_name: "priceType",
    //   display_name: "Price Type",
    //   sortingButtonName: ""
    // },
    // {
    //   column_name: "designerId",
    //   display_name: "Designer Id",
    //   sortingButtonName: ""
    // },
    // {
    //   column_name: "taxPercentage",
    //   display_name: "Tax Percentage",
    //   sortingButtonName: ""
    // }
    ,{
      column_name: "price",
      display_name: "Indian MRP(₹)",
      sortingButtonName: ""
    },{
      column_name: "price",
      display_name: "US MRP($)",
      sortingButtonName: ""
    }
    ,{
      column_name: "purchaseMax",
      display_name: "Stock",
      sortingButtonName: ""
    }
  ];

  // Variables start
  isListLoading = false;
  listing_url;
  tableData;
  pageNo;
  sortColumnName = '';
  sortOrderName = '';
  deleteApi;
  deleteLoading = false;
  restoreApi;
  restoreLoading = false;
  tableValueType;
  private tableListSubscribe: Subscription;
  private deleteDataSubscribe: Subscription;
  private permissionDataSubscribe: Subscription;
  pagePermission;
  // Variables end

  ngOnInit() {
    // this.commonFunction();
  }

  ionViewWillEnter() {
    this.commonFunction();
  }

  commonFunction(){
    let currentDate = Date.now()
    this.currentDate = moment(currentDate).format('YYYY/MM/DD');
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
              if(item.modDetails.url == pageUrl[1]){
                if(item.modPrivs.list == true){
                  console.log('-----Permission Granted-----');
                  this.pagePermission = item;
                  console.log('this.pagePermission', this.pagePermission);
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
        console.log("res.authority",res.authority);
        
        this.getDesignerProfiledata(res.uid)
      }
    })
    /*Check permission status end*/

       // delete api
    this.deleteApi = 'category/delete';
    this.storage.get('setStroageGlobalParamsData').then((val) => {
      console.log('User ID', val.uid);
      this.role=val.authority
      this.designerId = val.uid;
      console.log("Role",this.role);
      this.setApis(this.role,this.designerId)

      
    });
    console.log("this.listing_url",this.listing_url);
    
  }
  // getDesignerProfiledata for check perpession start
getDesignerProfiledata(uid)
{
  
  this.http.get("designer/"+uid).subscribe(
    (res:any) => {
      this.designerprofiledata = res;
      if(res.profileStatus == 'COMPLETED')
      {
        
      }else
      {
        let pageUrl = this.router.url.split("/");
        console.log('pageUrl', pageUrl[1]);
        if(pageUrl[1] == 'product-list')
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
  setApis(role,designerid)
  {
    if(role == 'DESIGNER')
      {
        this.listing_url = 'designerProduct/designerProductList/'+designerid;
        this.tableTitle = 'Designer';
      }
      else
      {
        this.listing_url = 'designerProduct/listPerStatus';
      }
      this.onRefresh();
  }
  // datatype start
  datatype(identifier)
  {
      console.log(identifier);
    if(identifier == 0)
    {
      this.statustype = 'all'
      this.tableTitle ='All';
    }else if(identifier == 1)
    {
      this.statustype = 'pending'
      this.tableTitle ='Pending';
    }else if(identifier == 2)
    {
      this.statustype = 'approved'
      this.tableTitle ='Approved';
    }else if(identifier == 3)
    {
      this.statustype = 'rejected'
      this.tableTitle ='Rejected';
    }
    this.onRefresh()
    // this.onListDate(this.statustype,this.listing_url, this.pageNo, this.displayRecord, this.sortColumnName, this.sortOrderName, this.searchTerm);
  }
  // datatype end
  // changeStatus start
  changeStatus(identifier,item)
  {
    this.approvalApi = 'product/changeProductApprovalStatus';
    console.log("identifier,id",identifier,item);
    
    if(identifier == 'reject')
    {
      var _items;
      var data = {
        item:item,
        type:'Rejected'
      }
      this.openProductCommentmodal('productapprove_modal', data, _items);

    }else if(identifier == 'approve')
    {
      
      var data = {
        item:item,
        type:'Approved'
      }
      // this.onapproveProduct(data)
      this.openProductCommentmodal('productapprove_modal', data, _items);
    }
  }
  // changeStatus end
  // approveProduct start
  onapproveProduct(data)
  {
    
      console.log(data);
    this.storage.get('setStroageGlobalParamsData').then((val) => {
      console.log('All User Data', val.uid);
      this.role = val.authority;
      var alldata = [
        {
          Reason:data.type,
          adminId:val.uid,
          dateTime : this.currentDate,
          comments:data.item.comments[0].comments,
        }
    ]
      let approvedata ={
        adminStatus:data.type,
        approvedBy:val.uid,
        comments:alldata,
        productId:data.item.productId,
        designerId:data.item.designerId,
      }
      this.approveProductSubscribe =this.http.put('product/changeProductApprovalStatus',approvedata).subscribe(
        (res:any) => {
          this.commonUtils.presentToast('success', res.message);
          // this.btnloader = false;
          this.onRefresh()
        },
        (error) =>{
          console.log("errorerror",error);
          //  this.btnloader = false;
          this.commonUtils.presentToast('error', error.error.message);
          
        })
    });
  }
  // approveProduct end
  /*----------------Table list data start----------------*/

    // Display records start
    displayRecord = 10;
    displayRecords = [
      { id : '1', displayValue: 10},
      { id : '2', displayValue: 25},
      { id : '3', displayValue: 50},
      { id : '4', displayValue: 100},
      // { id : '5', displayValue: '0'}
    ];
    displayRecordChange(_record) {
      console.log('_record', _record);
      
      this.displayRecord = _record;
      this.pageNo = 0;
      this.onListDate(this.statustype,this.listing_url, this.pageNo, _record, this.sortColumnName, this.sortOrderName,this.searchTerm);
    }
    // Display records end
    // List data start
    onListDate(status,_listUrl, _pageNo, _displayRecord, _sortColumnName, _sortOrderName, _searchTerm){
      this.isListLoading = true;
      if(this.role == 'DESIGNER')
      {
        var api = _listUrl+'?page='+_pageNo+'&limit='+_displayRecord+'&sortName='+_sortColumnName+'&sort='+_sortOrderName+'&keyword='+_searchTerm;
        // var api = _listUrl+'?status='+status+'&page='+_pageNo+'&limit='+_displayRecord+'&sortName='+_sortColumnName+'&sort='+_sortOrderName+'&keyword='+_searchTerm;
      }else if(this.role == 'ADMIN')
      {
         api = _listUrl+'?status='+status+'&page='+_pageNo+'&limit='+_displayRecord+'&sortName='+_sortColumnName+'&sort='+_sortOrderName+'&keyword='+_searchTerm;
      }
      
      this.tableListSubscribe = this.http.get(api).subscribe(
        (res:any) => {
          this.isListLoading = false;
          console.log('res', res);
          this.tableData = res;
          this.tableListData = res.data;
          if(this.tableListData.length != 0 )
          {
            this.alldelbtn = false;
          }
          if(this.role == 'DESIGNER')
          {
            this.alldelbtn = false;
          }
          //---------  check item show start ----------
        if(this.tableListData && this.checkedList){
          for (let i = 0 ; i < this.tableListData.length; i++) {
            for (let j = 0 ; j < this.checkedList.length; j++) {
              if(this.checkedList[j].id ==  this.tableListData[i].id){
                this.tableListData[i].isSelected = true;
              }
            }
          }
        }
        },
        errRes => {
          // this.selectLoadingDepend = false;
          this.isListLoading = false;
        }
      );
    }
    // List data end
    // Pagination start
    setPage(page: number) {
      console.log('page', page);
      console.log("page");
      
      this.pageNo = page;
      this.onListDate(this.statustype,this.listing_url, this.pageNo, this.displayRecord, this.sortColumnName, this.sortOrderName, this.searchTerm);
      
    }
    // Pagination end

    // Sorting start
    isSortTableHeader(_tableHeaderData,  _headerItem ){
      console.log('_tableHeaderData', _tableHeaderData);
      console.log('_headerItem', _headerItem);

      // all field reset first
      _tableHeaderData.forEach((val) => {
        val.sortingButtonName = ''
      })

      _headerItem.orederShow = !_headerItem.orederShow;
      if(_headerItem.orederShow) {
        _headerItem.sortingButtonName = "ASC";
      }else
      {
        _headerItem.sortingButtonName = "DESC";
      }

      this.sortColumnName = _headerItem.column_name;
      this.sortOrderName = _headerItem.sortingButtonName;

      console.log('this.sortColumnName', this.sortColumnName);
      console.log('this.sortOrderName', this.sortOrderName);
      console.log('_tableHeaderData>>', _tableHeaderData);

      this.onListDate(this.statustype,this.listing_url, this.pageNo, this.displayRecord, this.sortColumnName, this.sortOrderName, this.searchTerm);
    }
    // Sorting end

    // Search start
    searchTerm:string = '';
    searchList(event){
      this.searchTerm = event.target.value;

      console.log('this.searchTerm', this.searchTerm);
      
      this.onListDate(this.statustype,this.listing_url, this.pageNo, this.displayRecord, this.sortColumnName, this.sortOrderName, this.searchTerm);
    }
    // Search end

    // Referesh start
    onRefresh(){
      this.pageNo = 0;
      this.sortColumnName = 'productId';
      this.sortOrderName = 'DESC';
      this.searchTerm = '';
      this.tableValueType = '0';
      // table data call
      this.onListDate(this.statustype,this.listing_url, this.pageNo, this.displayRecord, this.sortColumnName, this.sortOrderName, this.searchTerm);
    }
    // Referesh end

    // Delete start
    deleteData(_id){
      console.log('id>>', _id);
      let sentValues = {'id': _id};
      this.deleteLoading = true;
      this.deleteDataSubscribe = this.http.put(this.deleteApi, sentValues).subscribe(
        (res:any) => {
          this.deleteLoading = false;
          console.log("Edit data  res >", res.return_data);
          if(res.status == 200){
            this.commonUtils.presentToast('success', res.message);
            this.onRefresh();
          }else {
            this.commonUtils.presentToast('error', res.message);
          }
        },
        errRes => {
          // this.selectLoadingDepend = false;
          this.deleteLoading = false;
        }
      );
    }
    // Delete end

  /*----------------Table list data end----------------*/
  
  // Delete aleart start
  async presentAlert(_identifier, _id) {

     let messages,headers;

     if(_identifier == 'delete')
    {
      headers = "Delete"
      messages = "Are you sure want to delete this product?"      
    }
    const alert = await this.alertController.create({
      cssClass: 'aleart-popupBox',
      header: headers,
      message: messages,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'popup-cancel-btn',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          cssClass: 'popup-ok-btn',
          handler: () => {
            console.log('Confirm Okay');
            // this.clickActionBtn('', 'delete');
             // this.deleteData(_id);
            if(_identifier == 'delete'){
              this.deleteData(_id);
            }
          }
        }
      ]
    });

    await alert.present();
  }
  // Delete aleart end

  async presentToast(_msg, _type) {
    const toast = await this.toastController.create({
      message: _msg,
      duration: 2000,
      cssClass:"my-tost-custom-class" +_type,
    });
    toast.present();
  }
  // statusChange(productid)
  // {    
    
  //   var data = {
  //     productid:productid,
  //     designerid:1
  //   }
  //   this.openProductCommentmodal('productapprove_modal',data,'')
  // }
     // select all check box start
  statusChange(productid)
  {    
    
    this.changeStatusSubscribe =this.http.put('designerProduct/status/'+productid,'').subscribe(
      (res:any) => {
        this.commonUtils.presentToast('success', res.message);
        // this.getcategoryList();
        this.onListDate(this.statustype,this.listing_url, this.pageNo, this.displayRecord, this.sortColumnName, this.sortOrderName, this.searchTerm);
      },
      (error) =>{
        this.onListDate(this.statustype,this.listing_url, this.pageNo, this.displayRecord, this.sortColumnName, this.sortOrderName, this.searchTerm);
        this.commonUtils.presentToast('error', error.error.message);
      })   
  }
  allSelectItem(event) {
    if (event.target.checked) {
      this.itemcheckClick = false;
      // console.log('check item selkectedddddddddddddd');
      for (let i = 0 ; i < this.tableListData.length; i++) {
        // if(this.checkedList.includes(this.items[i].id) === false)
        if (this.checkedList.indexOf(this.tableListData[i]) === -1 && this.tableListData[i] !== null) {
          this.checkedList.push(this.tableListData[i]);
          this.tableListData[i].isSelected = true;

        }
      }
    } else if (this.itemcheckClick == false) {
      // console.log('not check item selectionnnnnnnnnnn')
      this.checkedList = [];
      for (let i = 0 ; i < this.tableListData.length; i++) {
        if (this.checkedList.indexOf(this.tableListData[i]) === -1)
        {
          this.tableListData[i].isSelected = false;

        }
      }
    }

    console.log('checked item all @@ >>', this.checkedList);
    console.log('tableListData item all @@ >>', this.tableListData);
  }
  // Select all checkbox end
    // Select single checkbox start
    onCheckboxSelect(option, event) {
      if (event.target.checked) {
        if (this.checkedList.indexOf(option) === -1) {
          this.checkedList.push(option);
        }
      } else {
          for (let i = 0 ; i < this.tableListData.length; i++) {
            if (this.checkedList[i] == option) {
              this.checkedList.splice(i, 1);
          }
        }
      }
  
      if (this.tableListData.length <= this.checkedList.length) {
      this.allselectModel = true;
      console.log('length 4');
      } else {
        console.log('length 0');
        this.allselectModel = false;
        this.itemcheckClick = true;
  
      }
  
      console.log('checked item single >>', this.checkedList);
    }
    // Select single checkbox end
        // ---------------- Click Delete Item start ---------------------
    // deleteLodershow = false; 
    alldeleteLoaderShow = false;
    async onClickDeleteItem(_identifire, _item, _items, _index){
      console.log("_item",_item);
      
      const alert = await this.alertController.create({
        cssClass: 'aleart-popupBox',
        header: 'Delete',
        message: 'Do you really want to delete this product?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'popup-cancel-btn',
            handler: (blah) => {
              // console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Ok',
            cssClass: 'popup-ok-btn',
            handler: () => {
  
              // ------------ single item delete start ------------
              if(_identifire == 'single'){
                console.log('_item', _item);
                
                let sentValues = {'id': _item};
                // _item.deleteLodershow = true;
                this.deleteDataSubscribe = this.http.put("designerProduct/delete/"+_item,'').subscribe(
                  (res:any) => {
                    // _item.deleteLodershow = false;
                    console.log("Edit data  res >", res.return_data);
                    if(res.status == 200){
                      // _items.splice( _index, 1 );
                      // this.commonUtils.presentToast('success', res.return_message);
                      // if(_items.length == 0){
                      //   this.allselectModel = false;
                      // }
                      this.commonUtils.presentToast('success', res.message);
                      this.onRefresh();
                    }else {
                      this.commonUtils.presentToast('error', res.message);
                    }
                  },
                  errRes => {
                    // this.selectLoadingDepend = false;
                    // _item.deleteLodershow = false;
                    this.commonUtils.presentToast('error', errRes.error.message);
                  }
                );
              // ------------ single item delete end ------------
              }else{
                let checkItemIdArray = [];
                if(this.checkedList){
                  this.checkedList.forEach(element => {
                    checkItemIdArray.push(element.id);
                  });
                }
                if(_items){
                  _items.forEach(element => {
                    this.checkedList.forEach(element1 => {
                      if(element.id == element1.id){
                        // element.deleteLodershow = true; //loader show
                        this.alldeleteLoaderShow = true;
                      }
                    });
                  });
                }
                
                this.deleteDataSubscribe = this.http.put('product/muldelete', checkItemIdArray).subscribe(
                (res:any) => {
                  if(res.status == 200){
                    if(_items){
                      for (let i = 0 ; i < _items.length; i++) {
                        for (let j = 0 ; j < this.checkedList.length; j++) {
                          if ( _items[i].id == this.checkedList[j].id ) {
                            // _items.splice(i, i);
                            
                            this.checkedList = [];
                            // _items.splice(_items.indexOf(_items[i]), 1);
                            // this.deleteLodershow = false; //loader hide
                            this.alldeleteLoaderShow = false;
                            // console.log('delete items >>', _items);
                            // console.log('delete this.checkedList >>', this.checkedList);
                            
                            this.allselectModel = false; 
                          }
                        }
                      };
                      if(_items.length == 0){
                        this.allselectModel = false;
                        this.checkedList = [];
                        checkItemIdArray = [];
                      }
                    }
                    this.commonUtils.presentToast('success', res.message);
                    this.onRefresh();
                  }else {
                    this.commonUtils.presentToast('error', res.message);
                  }
                },errRes => {
                  // this.deleteLodershow = false; //loader hide
                  this.alldeleteLoaderShow = false;
                  _items.forEach(element => {
                    this.checkedList.forEach(element1 => {
                      if(element.id == element1.id){
                        // element.deleteLodershow = false;
                        this.alldeleteLoaderShow = false;
                      }
                    });
                  });
                }); 
              }
              
  
            }
          }
        ]
      });
  
      await alert.present();
  
    }
    // Click Delete Item end
    
    async openProductCommentmodal(_identifier, _item, _items) {
      console.log('openProductCommentmodal ...........>>', _identifier);
  
      let profile_modal;
      profile_modal = await this.modalController.create({
        component: ModalPage,
        cssClass: 'mymodalClass small openProductComment',
        componentProps: { 
          identifier: _identifier,
          modalForm_item: _item,
          modalForm_array: _items
        }
      });
      
      // modal data back to Component
      profile_modal.onDidDismiss()
      .then((getdata) => {
        console.log('getdata >>>>>>>>>>>', getdata);
        this.onListDate(this.statustype,this.listing_url, this.pageNo, this.displayRecord, this.sortColumnName, this.sortOrderName, this.searchTerm);
        if(getdata.data == 'submitClose'){
          
        }
  
      });
  
      return await profile_modal.present();
    }
    // openRejectemodal start
    async openRejectemodal(_identifier, _item, _items) {
    console.log('openRejectemodal ...........>>', _identifier,_item);

    let profile_modal;
    profile_modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'mymodalClass small rejectemodal',
      componentProps: { 
        identifier: _identifier,
        modalForm_item: _item,
        modalForm_array: _items
      }
    });
    
    // modal data back to Component
    profile_modal.onDidDismiss()
    .then((getdata) => {
      
      console.log('getdata >>>>>>>>>>>', getdata);
      if(getdata.data == 'submitClose'){
        
      }

    });

    return await profile_modal.present();
  }
  // openRejectemodal end
  // ----------- destroy unsubscription start ---------
  ngOnDestroy() {
    if(this.tableListSubscribe !== undefined){
      this.tableListSubscribe.unsubscribe();
    }
    if(this.deleteDataSubscribe !== undefined){
      this.deleteDataSubscribe.unsubscribe();
    }
    if(this.changeStatusSubscribe !== undefined){
      this.changeStatusSubscribe.unsubscribe();
    }
    if(this.permissionDataSubscribe !== undefined){
      this.permissionDataSubscribe.unsubscribe();
    }
  }
  // ----------- destroy unsubscription end ---------

}
