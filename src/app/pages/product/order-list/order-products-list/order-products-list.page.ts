import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, ModalController, AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ModalPage } from 'src/app/pages/modal/modal.page';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-products-list',
  templateUrl: './order-products-list.page.html',
  styleUrls: ['./order-products-list.page.scss'],
})
export class OrderProductsListPage implements OnInit {
  parms_action_id: any;
  url: string;
  invoiceId: any;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    public toastController: ToastController,
    private modalController: ModalController,
    private alertController: AlertController,
    private commonUtils: CommonUtils,
    private authService: AuthService,
    private router: Router
  ) {}
  tableListData = [];
  allselectModel;
  itemcheckClick = false;
  checkedList = [];
  tableHeaderData = [
    {
      column_name: "orderId",
      display_name: "Order Id",
      sortingButtonName: "",
    },{
      column_name: "productName",
      display_name: "Product Name",
      sortingButtonName: "",
    },
    {
      column_name: "colour",
      display_name: "Colour",
      sortingButtonName: "",
    },
    {
      column_name: "mrp",
      display_name: "MRP",
      sortingButtonName: "",
    },
    {
      column_name: "salesPrice",
      display_name: "Sales Price",
      sortingButtonName: "",
    },
    {
      column_name: "taxAmount",
      display_name: "Tax Amount",
      sortingButtonName: "",
    },
    {
      column_name: "units",
      display_name: "Units",
      sortingButtonName: "",
    },
    {
      column_name: "size",
      display_name: "Size",
      sortingButtonName: "",
    },
    {
      column_name: "taxType",
      display_name: "Tax Type",
      sortingButtonName: "",
    }
  ];
  isListLoading = false;
  listing_url;
  tableData;
  pageNo;
  sortColumnName = "";
  sortOrderName = "";
  deleteApi;
  deleteLoading = false;
  restoreApi;
  restoreLoading = false;
  tableValueType;
  private changeStatusSubscribe: Subscription;
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

  commonFunction() {
    this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('orderId');
    this.allselectModel = false;
    this.checkedList = [];
    /*Check permission status start*/
    this.authService.globalparamsData.subscribe((res) => {
      console.log("res>>", res);
      if (res.authority == "ADMIN") {
        this.permissionDataSubscribe =
          this.commonUtils.menuPermissionObservable.subscribe((data) => {
            if (data) {
              console.log("menu>>", data);
              console.log("this.router.url>>", this.router.url);

              let pageUrl = this.router.url.split("/");
              console.log("pageUrl", pageUrl);

              for (let item of data) {
                if (item.modDetails.url == 'order-list') {
                  if (item.modPrivs.list == true) {
                    console.log("-----Permission Granted-----");
                    this.pagePermission = item;
                    console.log("this.pagePermission", this.pagePermission);
                    // this.listing_url = "userOrder/list";
                      this.listing_url = "userOrder/getOrder/"+this.parms_action_id;
                    this.onRefresh();
                    // delete api
                    break;
                  } else {
                    console.log("-------No Permission--------");
                    this.router.navigateByUrl("/error");
                  }
                }
              }
            }
          });
      } else {
        this.router.navigateByUrl("/error");
      }
    });
    /*Check permission status end*/
    // this.onRefresh();
  }

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
    console.log("_record", _record);

    this.displayRecord = _record;
    this.pageNo = 0;
    this.onListDate(this.listing_url,this.pageNo,_record,this.sortColumnName,this.sortOrderName,this.searchTerm);
  }
  // Display records end
  // List data start
  onListDate(_listUrl,_pageNo,_displayRecord,_sortColumnName,_sortOrderName,_searchTerm) {
    this.isListLoading = true;
    let api = _listUrl +"?page=" +_pageNo +"&limit=" +_displayRecord +"&sortName=" +_sortColumnName +"&sort=" +_sortOrderName +"&keyword=" +_searchTerm;
    this.tableListSubscribe = this.http.get(api).subscribe(
      (res: any) => {
        this.isListLoading = false;
        console.log("res", res);
        this.tableData = res;
        this.tableListData = res.data;
        this.url = environment.apiUrl+"/"+"userOrder/getOrderByInvoiceId/"+res.invoiceId;
        this.invoiceId = res.invoiceId;
        //---------  check item show start ----------
        if (this.tableListData && this.checkedList) {
          for (let i = 0; i < this.tableListData.length; i++) {
            for (let j = 0; j < this.checkedList.length; j++) {
              if (this.checkedList[j].id == this.tableListData[i].id) {
                this.tableListData[i].isSelected = true;
              }
            }
          }
        }
      },
      (errRes) => {
        // this.selectLoadingDepend = false;
        this.isListLoading = false;
      }
    );
  }
  // List data end
  // Pagination start
  setPage(page: number) {
    console.log("page", page);
    console.log("page");

    this.pageNo = page;
    this.onListDate(this.listing_url,this.pageNo,this.displayRecord,this.sortColumnName,this.sortOrderName,this.searchTerm);
  }
  // Pagination end

  // Sorting start
  isSortTableHeader(_tableHeaderData, _headerItem) {
    console.log("_tableHeaderData", _tableHeaderData);
    console.log("_headerItem", _headerItem);

    // all field reset first
    _tableHeaderData.forEach((val) => {
      val.sortingButtonName = "";
    });

    _headerItem.orederShow = !_headerItem.orederShow;
    if (_headerItem.orederShow) {
      _headerItem.sortingButtonName = "ASC";
    } else {
      _headerItem.sortingButtonName = "DESC";
    }

    this.sortColumnName = _headerItem.column_name;
    this.sortOrderName = _headerItem.sortingButtonName;

    console.log("this.sortColumnName", this.sortColumnName);
    console.log("this.sortOrderName", this.sortOrderName);
    console.log("_tableHeaderData>>", _tableHeaderData);
    this.onListDate(this.listing_url,this.pageNo,this.displayRecord,this.sortColumnName,this.sortOrderName,this.searchTerm);
    
  }
  // Sorting end

  // Search start
  searchTerm: string = "";
  searchList(event) {
    this.searchTerm = event.target.value;

    console.log("this.searchTerm", this.searchTerm);

    this.onListDate(this.listing_url,this.pageNo,this.displayRecord,this.sortColumnName,this.sortOrderName,this.searchTerm);

  }
  // Search end

  // Referesh start
  onRefresh() {
    this.pageNo = 0;
    this.sortColumnName = "id";
    this.sortOrderName = "DESC";
    this.searchTerm = "";
    this.tableValueType = "0";
    // table data call
    this.onListDate(this.listing_url,this.pageNo,this.displayRecord,this.sortColumnName,this.sortOrderName,this.searchTerm);

  }
  // Referesh end
  // changeStatus end
  changeStatus(type,item:any={},moredata) {
    console.log("item",type,item,moredata);
    var data:any={},time,todate;
    var trackingHistory:any = [];
    // item={
    //   moredata:moredata
    // };
    item.moredata= moredata;
    if(item.TrackingData)
    {
      trackingHistory = item.TrackingData.trackingHistory;
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
    // [Dispatch:{time:00.00,date:00/00/0000,comment:"",},Shipment:{time:00.00,date:00/00/0000,comment:""},Out for Delivery:{time:00.00,date:00/00/0000,comment:""},Delivered:{time:00.00,date:00/00/0000,comment:""}]
    // 4 obj
   
    
      
    console.log(todate,trackingHistory);
    
    data = 
    {
      deliveredDate: item.TrackingData.deliveredDate,
      deliveryExpectedDate: item.TrackingData.deliveryExpectedDate,
      deliveryMode:item.TrackingData.deliveryMode,
      deliveryStarted: item.TrackingData.deliveryStarted,
      deliveryStatus:moredata.deliveryStatus,
      deliveryType:"Admin to Dispatch",
      designerId:item.designerId,
      orderId:item.orderId,
      productSku:item.productSku,
      productId:item.productId,
      trackingHistory:trackingHistory,
      userId:item.userId,
      trackingId: item.TrackingData.trackingId,
      trackingUrl: item.TrackingData.trackingUrl
    }
    if(type == 'shipment')
    {
      this.openorderCommentmodal("orderCommentAdmin_modal", data, item);
    }else if(type == 'out_for')
    {
      this.openorderCommentmodal("orderDeliveryAdmin_modal", data, item);
    }else if(type == 'delivered')
    {
      this.openorderCommentmodal("DeliveredAdmin_modal", data, item);
    }else if(type == 'Cancel')
    {
      this.openorderCommentmodal("orderCancelAdmin_modal", data, item);
    }
    
  }
  // changeStatus start
  async openorderCommentmodal(_identifier, _item, _items) {
    console.log('openProfilemodal ...........>>', _identifier);

    let orderCommentmodal;
    orderCommentmodal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'mymodalClass small profilemodal',
      componentProps: { 
        identifier: _identifier,
        modalForm_item: _item,
        modalForm_array: _items
      }
    });
    
    // modal data back to Component
    orderCommentmodal.onDidDismiss()
    .then((getdata) => {
      console.log("getdata",getdata);
      this.onRefresh();
      
    });

    return await orderCommentmodal.present();
  }
  /*----------------Table list data end----------------*/
  createInvoice()
  {
    console.log("tableData",this.tableData);
    var orders = this.tableData.OrderSKUDetails;
    var productIds:any=[],userId;
    userId = this.tableData.userId;
    let api ="/"+this.tableData.orderId+"/"+userId;
    console.log("tableData",this.tableData,orders,orders.designerId,orders.orderId,productIds,userId);
    this.tableListSubscribe = this.http.post(api,'').subscribe(
      (res: any) => {
        this.isListLoading = false;
      },
      (errRes) => {
      }
    );
  }
  // ----------- destroy unsubscription start ---------
  ngOnDestroy() {
    if (this.tableListSubscribe !== undefined) {
      this.tableListSubscribe.unsubscribe();
    }
    if (this.permissionDataSubscribe !== undefined) {
      this.permissionDataSubscribe.unsubscribe();
    }
  }
  // ----------- destroy unsubscription end ---------

}
