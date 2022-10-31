import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, ModalController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {

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
      column_name: "firstName",
      display_name: "First Name",
      sortingButtonName: "",
    },
    {
      column_name: "lastName",
      display_name: "Last Name",
      sortingButtonName: "",
    },
    {
      column_name: "dob",
      display_name: "DOB",
      sortingButtonName: "",
    },
    {
      column_name: "email",
      display_name: "Email",
      sortingButtonName: "",
    },
    {
      column_name: "username",
      display_name: "Username",
      sortingButtonName: "",
    },
    {
      column_name: "mobileNo",
      display_name: "Mobile No",
      sortingButtonName: "",
    },
    {
      column_name: "createdOn",
      display_name: "Register On",
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
  // Variables end

  ngOnInit() {
    // this.commonFunction();
  }

  ionViewWillEnter() {
    this.commonFunction();
  }

  commonFunction() {
    this.allselectModel = false;
    this.checkedList = [];
    // this.listing_url = "user/getUserList";
    // this.onRefresh();
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
                if (item.modDetails.url == pageUrl[1]) {
                  if (item.modPrivs.list == true) {
                    console.log("-----Permission Granted-----");
                    this.pagePermission = item;
                    console.log("this.pagePermission", this.pagePermission);
                    this.listing_url = "user/getUserList";
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
  }

  /*----------------Table list data start----------------*/

  // Display records start
  displayRecord = 10;
  displayRecords = [
    { id : '1', displayValue: 10},
    { id : '2', displayValue: 25},
    { id : '3', displayValue: 50},
    { id : '4', displayValue: 100},
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
  statusChange(id)
  {

  }
  /*----------------Table list data end----------------*/

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
