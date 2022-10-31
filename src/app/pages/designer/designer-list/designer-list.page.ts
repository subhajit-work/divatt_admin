import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  ToastController,
  ModalController,
  AlertController,
} from "@ionic/angular";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth/auth.service";
import { CommonUtils } from "src/app/services/common-utils/common-utils";
import { ModalPage } from "../../modal/modal.page";

@Component({
  selector: "app-designer-list",
  templateUrl: "./designer-list.page.html",
  styleUrls: ["./designer-list.page.scss"],
})
export class DesignerListPage implements OnInit {
  item:any={}
  filttertype: any;
  filttername='isProfileCompleated';
  tabletitle= "Completed";
  showAction;
  profileStatus = "COMPLETED";
  private  LebellistDataSubcribe: Subscription;
  Lebellist=[];
  constructor(
    private http: HttpClient,
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
      column_name: "displayName",
      display_name: "Display Name",
      sortingButtonName: "",
    }
    ,{
      column_name: "boutiqueName",
      display_name: "Boutique Name",
      sortingButtonName: "",
    },
    {
      column_name: "firstName1",
      display_name: "Designer 1",
      sortingButtonName: "",
    },{
      column_name: "firstName2",
      display_name: "Designer 2",
      sortingButtonName: "",
    },
    {
      column_name: "firmName",
      display_name: "Firm Name",
      sortingButtonName: "",
    },{
      column_name: "email",
      display_name: "Email",
      sortingButtonName: "",
    },{
      column_name: "mobileNo",
      display_name: "Mobile No",
      sortingButtonName: "",
    },{
      column_name: "gender",
      display_name: "Gender",
      sortingButtonName: "",
    },{
      column_name: "dob",
      display_name: "dob",
      sortingButtonName: "",
    },
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
  categories:any;
  model:any={}
  // Variables end

  ngOnInit() {
    // this.commonFunction();
  }

  ionViewWillEnter() {
    this.commonFunction();
  }

  commonFunction() {
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
                  this.listing_url = "designer/list";
                  this.onRefresh();
                  // delete api
                  this.deleteApi = "adminMData/deleteDesignerLevels";
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
    this.getLebellist();
  }

  /*----------------Table list data start----------------*/

  // checkDesignerList start
  checkDesignerList(_identifier){
    if(_identifier == 'completed'){
      this.tabletitle= "Completed";
      this.showAction = "";
      
      this.profileStatus = "COMPLETED";
      this.onListDate( this.listing_url, this.pageNo, this.displayRecord,this.sortColumnName,this.filttertype, this.sortOrderName, this.searchTerm, this.profileStatus);
    }else if(_identifier == 'waitForApprove'){
      this.tabletitle= "Waiting For Approve";
      this.showAction = "waitForApprove";

      this.profileStatus = "waitForApprove";
      // this.profileStatus = "ACTIVE";
      this.onListDate( this.listing_url, this.pageNo, this.displayRecord,this.sortColumnName,this.filttertype, this.sortOrderName, this.searchTerm, this.profileStatus);
    }else if(_identifier == 'waitForSubmit'){
      this.tabletitle= "Approved";
      this.showAction = "";

      this.profileStatus = "APPROVE";
      this.onListDate( this.listing_url, this.pageNo, this.displayRecord,this.sortColumnName,this.filttertype, this.sortOrderName, this.searchTerm, this.profileStatus);
    }else if(_identifier == 'submitted'){
      this.tabletitle= "Submitted";
      this.showAction = "submitted";

      this.profileStatus = "SUBMITTED";
      this.onListDate( this.listing_url, this.pageNo, this.displayRecord,this.sortColumnName,this.filttertype, this.sortOrderName, this.searchTerm, this.profileStatus);
    }else if(_identifier == 'rejected'){
      this.tabletitle= "rejected";
      this.showAction = "";
      this.profileStatus = "REJECTED";
      this.onListDate( this.listing_url, this.pageNo, this.displayRecord,this.sortColumnName,this.filttertype, this.sortOrderName, this.searchTerm, this.profileStatus);
    }else if(_identifier == 'deleted'){
      this.tabletitle= "Deleted";
      this.showAction = "";
      this.profileStatus = "";
      this.onListDate( this.listing_url, this.pageNo, this.displayRecord,this.sortColumnName,this.filttertype, this.sortOrderName, this.searchTerm, this.profileStatus);
    }else if(_identifier == 'change'){
      this.tabletitle= "Change Request";
      this.showAction = "";
      this.profileStatus = "CHANGE";
      this.onListDate( this.listing_url, this.pageNo, this.displayRecord,this.sortColumnName,this.filttertype, this.sortOrderName, this.searchTerm, this.profileStatus);
    }
  }
  // checkDesignerList end

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
    this.onListDate( this.listing_url, this.pageNo, _record,this.sortColumnName,this.filttertype, this.sortOrderName, this.searchTerm, this.profileStatus);
  }
  // Display records end
  // List data start
  onListDate( _listUrl, _pageNo, _displayRecord,_sortColumnName,filttertype ,_sortOrderName, _searchTerm, _profileStatus) 
  {
    this.isListLoading = true;
    // isDeleted=true
    let api;
    if(this.tabletitle == 'Deleted'){
     api =_listUrl+"?page="+_pageNo+"&limit="+_displayRecord+"&sortName="+_sortColumnName+"&sort="+_sortOrderName+"&keyword="+_searchTerm+"&isDeleted=true"+"&profileStatus="+_profileStatus;

    }else{
     api =_listUrl+"?page="+_pageNo+"&limit="+_displayRecord+"&sortName="+_sortColumnName+"&sort="+_sortOrderName+"&keyword="+_searchTerm+"&profileStatus="+_profileStatus;

    }
    this.tableListSubscribe = this.http.get(api).subscribe(
      (res: any) => {
        this.isListLoading = false;
        console.log("res", res);
        this.tableData = res;
        this.tableListData = res.data;

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
    this.onListDate( this.listing_url,this.pageNo, this.displayRecord,this.sortColumnName,this.filttertype,this.sortOrderName, this.searchTerm, this.profileStatus);
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

    this.onListDate(this.listing_url,this.pageNo,this.displayRecord,this.sortColumnName,this.filttertype,this.sortOrderName,this.searchTerm,this.profileStatus);
  }
  // Sorting end

  // Search start
  searchTerm: string = "";
  searchList(event) {
    this.searchTerm = event.target.value;
    this.onListDate(this.listing_url,this.pageNo,this.displayRecord,this.sortColumnName,this.filttertype,this.sortOrderName,this.searchTerm,this.profileStatus);

  }
  // Search end

  // Referesh start
  onRefresh() {
    this.pageNo = 0;
    this.sortColumnName = "dId";
    this.sortOrderName = "DESC";
    this.searchTerm = "";
    this.tableValueType = "0";
    this.getLebellist();
    // table data call
    this.onListDate(this.listing_url,this.pageNo,this.displayRecord,this.sortColumnName,this.filttertype,this.sortOrderName,this.searchTerm,this.profileStatus);
  }
  // Referesh end

  // Delete start
  deleteData(_id) {
    console.log("id>>", _id);
    let sentValues = { id: _id };
    this.deleteLoading = true;
    this.deleteDataSubscribe = this.http
      .put(this.deleteApi, sentValues)
      .subscribe(
        (res: any) => {
          this.deleteLoading = false;
          // console.log("Delete data  res >", res.return_data);
          if (res.status == 200) {
            this.commonUtils.presentToast("success", res.message);
            this.onRefresh();
          } else {
            this.commonUtils.presentToast("error", res.message);
          }
        },
        (errRes) => {
          // this.selectLoadingDepend = false;
          this.commonUtils.presentToast("error", errRes.error.message);
          this.deleteLoading = false;
        }
      );
  }
  // Delete end

  /*----------------Table list data end----------------*/

  // Delete aleart start
  async presentAlert(_identifier, _id) {
    let messages, headers;

    if (_identifier == "delete") {
      headers = "Delete";
      messages = "Are you sure want to delete?";
    }
    const alert = await this.alertController.create({
      cssClass: "aleart-popupBox",
      header: headers,
      message: messages,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "popup-cancel-btn",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Okay",
          cssClass: "popup-ok-btn",
          handler: () => {
            console.log("Confirm Okay");
            // this.clickActionBtn('', 'delete');
            // this.deleteData(_id);
            if (_identifier == "delete") {
              this.deleteData(_id);
            }
          },
        },
      ],
    });

    await alert.present();
  }
  // Delete aleart end

  async presentToast(_msg, _type) {
    const toast = await this.toastController.create({
      message: _msg,
      duration: 2000,
      cssClass: "my-tost-custom-class" + _type,
    });
    toast.present();
  }
  // selectLabel start
  labelValue;
  selectLabel(value)
  {
    this.labelValue = value.Name;
    console.log("this.Lebellist",value,this.labelValue);
    
  }
  // selectLabel end
  changeStatus(type,actiontype,_item) {
    if(actiontype == 'waitForApprove')
    {
      var _items;
      var formData;
      if(type == 'reject')
      {
        formData = {
          dId: _item.dId,
          isActive: _item.isActive,
          profileStatus: "REJECTED",
          isDeleted: _item.isDeleted,
          isProfileCompleated: _item.isProfileCompleated,
          isProfileSubmitted: _item.isProfileSubmitted,
        };
        this.openDesignerCommentmodal('Desigerrejected_modal', formData, _items);
      }else if(type == 'approve')
      {
         formData = {
          dId: _item.dId,
          isActive: _item.isActive,
          profileStatus: "APPROVE",
          isDeleted: _item.isDeleted,
          isProfileCompleated: _item.isProfileCompleated,
          isProfileSubmitted: _item.isProfileSubmitted,
        };
        this.changeStatusSubscribe = this.http.put("designer/update", formData).subscribe(
          (res: any) => {
            this.commonUtils.presentToast("success", res.message);
            // this.getcategoryList();
            this.onListDate( this.listing_url, this.pageNo,this.displayRecord,this.sortColumnName,this.filttertype,this.sortOrderName,this.searchTerm, this.profileStatus);
          },
          (error) => {
            this.commonUtils.presentToast("error", error.error.message);
          }
        );
      }
    }else if(actiontype == 'submitted')
    {
      if(type == 'reject')
      {
          formData = {
          dId: _item.dId,
          isActive: _item.isActive,
          // profileStatus: _item.isApproved,
          profileStatus: "REJECTED",
          isDeleted: _item.isDeleted,
          isProfileCompleated: false,
          isProfileSubmitted: _item.isProfileSubmitted,
        };
        this.openDesignerCommentmodal('Desigerrejected_modal', formData, _items);
      }else if(type == 'approve')
      {
         formData = {
          dId: _item.dId,
          isActive: _item.isActive,
          categories: this.labelValue,
          profileStatus: "COMPLETED",
          isDeleted: _item.isDeleted,
          isProfileCompleated: true,
          isProfileSubmitted: _item.isProfileSubmitted,
        };
        this.changeStatusSubscribe = this.http.put("designer/update", formData).subscribe(
          (res: any) => {
            this.commonUtils.presentToast("success", res.message);
            this.model = {};
            this.getLebellist();
            this.onListDate( this.listing_url, this.pageNo,this.displayRecord,this.sortColumnName,this.filttertype,this.sortOrderName,this.searchTerm, this.profileStatus);
          },
          (error) => {
            this.commonUtils.presentToast("error", error.error.message);
          }
        );
      }
    }
    console.log('_item', _item);
   
    
      
  }
  // select all check box start
  allSelectItem(event) {
    if (event.target.checked) {
      this.itemcheckClick = false;
      // console.log('check item selkectedddddddddddddd');
      for (let i = 0; i < this.tableListData.length; i++) {
        // if(this.checkedList.includes(this.items[i].id) === false)
        if (
          this.checkedList.indexOf(this.tableListData[i]) === -1 &&
          this.tableListData[i] !== null
        ) {
          this.checkedList.push(this.tableListData[i]);
          this.tableListData[i].isSelected = true;
        }
      }
    } else if (this.itemcheckClick == false) {
      // console.log('not check item selectionnnnnnnnnnn')
      this.checkedList = [];
      for (let i = 0; i < this.tableListData.length; i++) {
        if (this.checkedList.indexOf(this.tableListData[i]) === -1) {
          this.tableListData[i].isSelected = false;
        }
      }
    }

    console.log("checked item all @@ >>", this.checkedList);
    console.log("tableListData item all @@ >>", this.tableListData);
  }
  // Select all checkbox end
  // Select single checkbox start
  onCheckboxSelect(option, event) {
    if (event.target.checked) {
      if (this.checkedList.indexOf(option) === -1) {
        this.checkedList.push(option);
      }
    } else {
      for (let i = 0; i < this.tableListData.length; i++) {
        if (this.checkedList[i] == option) {
          this.checkedList.splice(i, 1);
        }
      }
    }

    if (this.tableListData.length <= this.checkedList.length) {
      this.allselectModel = true;
      console.log("length 4");
    } else {
      console.log("length 0");
      this.allselectModel = false;
      this.itemcheckClick = true;
    }

    console.log("checked item single >>", this.checkedList);
  }
  // Select single checkbox end
  // ---------------- Click Delete Item start ---------------------
  deleteLodershow = false;
  alldeleteLoaderShow = false;
  async onClickDeleteItem(_identifire, _item, _items, _index) {
    const alert = await this.alertController.create({
      cssClass: "aleart-popupBox",
      header: "Delete",
      message: "Do you really want to delete?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "popup-cancel-btn",
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          },
        },
        {
          text: "Ok",
          cssClass: "popup-ok-btn",
          handler: () => {
            // ------------ single item delete start ------------
            if (_identifire == "single") {
              console.log("_item", _item);
              let formData;
              formData = {
                dId: _item.dId,
                isActive: _item.isActive,
                categories: this.labelValue,
                profileStatus: "COMPLETED",
                isDeleted: true,
                isProfileCompleated: true,
                isProfileSubmitted: _item.isProfileSubmitted,
              };
              this.changeStatusSubscribe = this.http.put("designer/update", formData).subscribe(
                (res: any) => {
                  this.commonUtils.presentToast("success", res.message);
                  this.model = {};
                  this.getLebellist();
                  this.onListDate( this.listing_url, this.pageNo,this.displayRecord,this.sortColumnName,this.filttertype,this.sortOrderName,this.searchTerm, this.profileStatus);
                },
                (error) => {
                  this.commonUtils.presentToast("error", error.error.message);
                }
              );
              // ------------ single item delete end ------------
            } else {
              let checkItemIdArray = [];
              if (this.checkedList) {
                this.checkedList.forEach((element) => {
                  checkItemIdArray.push(element.id);
                });
              }
              if (_items) {
                _items.forEach((element) => {
                  this.checkedList.forEach((element1) => {
                    if (element.id == element1.id) {
                      element.deleteLodershow = true; //loader show
                      this.alldeleteLoaderShow = true;
                    }
                  });
                });
              }

              this.deleteDataSubscribe = this.http
                .put("category/muldelete", checkItemIdArray)
                .subscribe(
                  (res: any) => {
                    if (res.status == 200) {
                      if (_items) {
                        for (let i = 0; i < _items.length; i++) {
                          for (let j = 0; j < this.checkedList.length; j++) {
                            if (_items[i].id == this.checkedList[j].id) {
                              // _items.splice(i, i);

                              this.checkedList = [];
                              // _items.splice(_items.indexOf(_items[i]), 1);
                              this.deleteLodershow = false; //loader hide
                              this.alldeleteLoaderShow = false;
                              // console.log('delete items >>', _items);
                              // console.log('delete this.checkedList >>', this.checkedList);

                              this.allselectModel = false;
                            }
                          }
                        }
                        if (_items.length == 0) {
                          this.allselectModel = false;
                          this.checkedList = [];
                          checkItemIdArray = [];
                        }
                      }
                      this.commonUtils.presentToast("success", res.message);
                      this.onRefresh();
                    } else {
                      this.commonUtils.presentToast("error", res.message);
                    }
                  },
                  (errRes) => {
                    this.deleteLodershow = false; //loader hide
                    this.commonUtils.presentToast(
                      "error",
                      errRes.error.message
                    );
                    this.alldeleteLoaderShow = false;
                    _items.forEach((element) => {
                      this.checkedList.forEach((element1) => {
                        if (element.id == element1.id) {
                          element.deleteLodershow = false;
                          this.alldeleteLoaderShow = false;
                        }
                      });
                    });
                  }
                );
            }
          },
        },
      ],
    });

    await alert.present();
  }
  // Click Delete Item end
  async openDesignerCommentmodal(_identifier, _item, _items) {
    console.log('openDesignerCommentmodal ...........>>', _identifier);

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
      this.onListDate(this.listing_url, this.pageNo, this.displayRecord,this.sortColumnName,this.filttertype, this.sortOrderName, this.searchTerm, this.profileStatus);
      if(getdata.data == 'submitClose'){
        
      }

    });

    return await profile_modal.present();
  }
  // openRejectemodal start
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
  // getLebellist start
  getLebellist()
  {
    this.LebellistDataSubcribe = this.http.get("adminMData/getDesignerCategory").subscribe((res:any) =>{
      this.Lebellist = res.data;
      },error =>{
        console.log(error);
        this.commonUtils.presentToast('error', error.error.message);
    })
  }
  // getLebellist end
  // ----------- destroy unsubscription start ---------
  ngOnDestroy() {
    if (this.tableListSubscribe !== undefined) {
      this.tableListSubscribe.unsubscribe();
    }
    if (this.deleteDataSubscribe !== undefined) {
      this.deleteDataSubscribe.unsubscribe();
    }
    if (this.changeStatusSubscribe !== undefined) {
      this.changeStatusSubscribe.unsubscribe();
    }
    if(this.permissionDataSubscribe !== undefined){
      this.permissionDataSubscribe.unsubscribe();
    }
    if(this.LebellistDataSubcribe !== undefined){
      this.LebellistDataSubcribe.unsubscribe();
    }
  }
  // ----------- destroy unsubscription end ---------
}
