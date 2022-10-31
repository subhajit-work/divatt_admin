import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, ModalController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';

@Component({
  selector: 'app-color',
  templateUrl: './color.page.html',
  styleUrls: ['./color.page.scss'],
})
export class ColorPage implements OnInit {
  allselectModel;
  itemcheckClick = false;
  checkedList = [];
  alldeleteLoaderShow;
  tableListData = [];
  pagePermission;
  private permissionDataSubscribe: Subscription;
  constructor(private http:HttpClient,
    public toastController: ToastController,
              private modalController : ModalController,
              private alertController:AlertController,
              private commonUtils: CommonUtils,
              private router:Router,private authService: AuthService,) { }

  tableHeaderData = [
    {
      column_name: "color_name",
      display_name: "Color Name",
      sortingButtonName: ""
    },{
      column_name: "color_value",
      display_name: "color value",
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
  // Variables end

  ngOnInit() {
    this.commonFunction();
  }

  ionViewWillEnter() {
    this.commonFunction();
  }

  commonFunction(){
    // this.listing_url = 'adminMData/tblList';
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
                  this.listing_url = 'adminMData/tblList';
                  // this.onRefresh();
                  this. getColorList();
                    // delete api
                  this.deleteApi = 'category/delete';
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
    //  this.onRefresh();
    
       // delete api
  }
  getColorList()
  {
    this.isListLoading = true;
    this.tableListSubscribe = this.http.get(this.listing_url).subscribe(
      (res:any) => {
        this.isListLoading = false;
        console.log('res', res);
        this.tableData = res;
      },
      errRes => {
        // this.selectLoadingDepend = false;
        this.isListLoading = false;
      }
    );
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
    console.log('_record', _record);
    
    this.displayRecord = _record;
    this.pageNo = 0;
    this.onListDate(this.listing_url, this.pageNo, _record, this.sortColumnName, this.sortOrderName, this.searchTerm);
  }
  // Display records end
  // List data start
  onListDate(_listUrl, _pageNo, _displayRecord, _sortColumnName, _sortOrderName, _searchTerm){
    this.isListLoading = true;
    let api = _listUrl+'?page='+_pageNo+'&limit='+_displayRecord+'&sortName='+_sortColumnName+'&sort='+_sortOrderName+"&metaKey="+"colour"+'&keyword='+_searchTerm;
    this.tableListSubscribe = this.http.get(api).subscribe(
      (res:any) => {
        this.isListLoading = false;
        console.log('res', res);
        this.tableData = res;
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
    this.onListDate(this.listing_url, this.pageNo, this.displayRecord, this.sortColumnName, this.sortOrderName, this.searchTerm);
    
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

    this.onListDate(this.listing_url, this.pageNo, this.displayRecord, this.sortColumnName, this.sortOrderName,this.searchTerm);
  }
  // Sorting end

  // Search start
  searchTerm:string = '';
  searchList(event){
    this.searchTerm = event.target.value;

    console.log('this.searchTerm', this.searchTerm);
    
    this.onListDate(this.listing_url, this.pageNo, this.displayRecord, this.sortColumnName, this.sortOrderName, this.searchTerm);
  }
  // Search end

  // Referesh start
  onRefresh(){
    this.pageNo = 0;
    this.sortColumnName = 'id';
    this.sortOrderName = 'DESC';
    this.searchTerm = '';
    this.tableValueType = '0';
    // table data call
    this.onListDate(this.listing_url, this.pageNo, this.displayRecord, this.sortColumnName, this.sortOrderName, this.searchTerm);
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
          // this.onRefresh();
          this.getColorList();
        }else {
          this.commonUtils.presentToast('error', res.message);
        }
      },
      errRes => {
        // this.selectLoadingDepend = false;
        this.getColorList();
        this.deleteLoading = false;
      }
    );
  }
  // Delete end


  // Deleted or not start
  deletedOrNot(ev: any) {
    console.log('Segment changed', ev);
    this.tableValueType = ev.detail.value;
    this.pageNo = 0;
    this.getColorList();
    // this.onListDate(this.listing_url, this.pageNo, this.displayRecord, this.sortColumnName, this.sortOrderName,this.searchTerm);
  }
  // Deleted or not end

  /*----------------Table list data end----------------*/
  
  // Delete aleart start
  async presentAlert(_identifier, _id) {

     let messages,headers;

     if(_identifier == 'delete')
    {
      headers = "Delete"
      messages = "Are you sure want to delete this template?";
    }else if(_identifier == 'restore'){
      headers = "Restore"
      messages = "Are you sure want to restore this template?";
    }else if(_identifier == 'primarySet'){
      headers = "Primary"
      if(_id.isPrimary == 0){
        messages = "Are you sure want change this to set primary?";
      }else {
        messages = "Are you sure want change this to set non-primary?";
      }
      
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
  statusChange(e,item)
  {    
    var data =
    {
      colorName:item.colorName,
      colorValue:item.colorValue,
      isActive:e
    }
    this.http.put('adminMData/updateColours/'+item.colorName,data).subscribe(
      (res:any) => {
        this.commonUtils.presentToast('success', res.message);
        this.getColorList();
        // this.onListDate(this.listing_url, this.pageNo, this.displayRecord, this.sortColumnName, this.sortOrderName,this.searchTerm);
      },
      (error) =>{
        this.getColorList();
        this.commonUtils.presentToast('error', error.error.message);
        // this.onListDate(this.listing_url, this.pageNo, this.displayRecord, this.sortColumnName, this.sortOrderName,this.searchTerm);
      }
    )
    
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
  deleteLodershow = false; 
  async onClickDeleteItem(_identifire, _item, _items, _index){
    const alert = await this.alertController.create({
      cssClass: 'aleart-popupBox',
      header: 'Delete',
      message: 'Do you really want to delete this color?',
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
              
              let sentValues = {'name': _item.colorName};
              _item.deleteLodershow = true;
              this.deleteDataSubscribe = this.http.delete("adminMData/deleteColour/"+_item.colorName).subscribe(
                (res:any) => {
                  _item.deleteLodershow = false;
                  console.log("Edit data  res >", res.return_data);
                  if(res.status == 200){
                    _items.splice( _index, 1 );
                    this.commonUtils.presentToast('success', res.return_message);
                    if(_items.length == 0){
                      this.allselectModel = false;
                    }
                    this.commonUtils.presentToast('success', res.message);
                    this.getColorList();
                  }else {
                    this.commonUtils.presentToast('success', res.message);
                  }
                },
                errRes => {
                  // this.selectLoadingDepend = false;
                  this.commonUtils.presentToast('success', errRes.error.message);
                  _item.deleteLodershow = false;
                  this.getColorList();
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
                      element.deleteLodershow = true; //loader show
                      this.alldeleteLoaderShow = true;
                    }
                  });
                });
              }
              
              this.deleteDataSubscribe = this.http.put('category/muldelete', checkItemIdArray).subscribe(
              (res:any) => {
                if(res.status == 200){
                  if(_items){
                    for (let i = 0 ; i < _items.length; i++) {
                      for (let j = 0 ; j < this.checkedList.length; j++) {
                        if ( _items[i].id == this.checkedList[j].id ) {
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
                  this.alldeleteLoaderShow = false;
                }
              },errRes => {
                this.commonUtils.presentToast('error', errRes.error.message);
                this.alldeleteLoaderShow = false;
                _items.forEach(element => {
                  this.checkedList.forEach(element1 => {
                    if(element.id == element1.id){
                      element.deleteLodershow = false;
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
  // ----------- destroy unsubscription start ---------
  ngOnDestroy() {
    if(this.tableListSubscribe !== undefined){
      this.tableListSubscribe.unsubscribe();
    }
    if(this.permissionDataSubscribe !== undefined){
      this.permissionDataSubscribe.unsubscribe();
    }
    if(this.deleteDataSubscribe !== undefined){
      this.deleteDataSubscribe.unsubscribe();
    }
  }
  // ----------- destroy unsubscription end ---------

}
