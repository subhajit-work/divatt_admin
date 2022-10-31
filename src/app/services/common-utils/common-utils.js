"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
/* tslint:disable */
var CommonUtils = /** @class */ (function () {
    function CommonUtils(http, storage, pagerService, toastController) {
        this.http = http;
        this.storage = storage;
        this.pagerService = pagerService;
        this.toastController = toastController;
        //----------- group login click identifire data get start ------------
        this._groupLoginClickableIdentifire = new rxjs_1.BehaviorSubject(null);
        // group login click identifire data get  end
        //----------- group login data get start ------------
        this._groupLoginClickableData = new rxjs_1.BehaviorSubject(null);
        // group login data get  end
        //----------- site inforamation  start ------------
        this._siteInfoCheck = new rxjs_1.BehaviorSubject(null);
        // site inforamation  end
        //----------- user type start ------------
        this._userTypeCheck = new rxjs_1.BehaviorSubject(null);
        // user type end
        //--------- menu data fetch start ---------------
        this._menudata = new rxjs_1.BehaviorSubject([]);
        // menu data fetch end
        //--------- menu permission fetch start ---------------
        this._menuPermission = new rxjs_1.BehaviorSubject([]);
        // menu permission fetch end
        // -----get url name all component start----
        this._pagepathName = new rxjs_1.BehaviorSubject(null);
        /* return this.http.post<{name:string}>('https://...json',{
            value,
            id:null
            })

            .pipe(
            switchMap(resData => {
                console.log('resData *********** 1111111111 >', this.tickets);
                generateId = resData.name; //id set
                return this.tickets;
            }),

            take(1),
            
            tap(ticketss => {
                console.log('resData *********** 222222222 >', this.tickets);
                // console.log('ticketss *********** >', ticketss);
                value.id = generateId; //id get
                this._tickets.next(ticketss.concat(value));
                // ticketss.push(value);
            })
        ) */
        // -----get url name all component end----
        // ----add and remove item (+ -) start-----
        //Add more functions
        this.addToItem = function (items) {
            items.push({});
        };
        //Remove more functions
        this.removeToItem = function (index, event, items, action, isDefault) {
            event.preventDefault();
            if (items.length == 1 && isDefault && action == 'edit')
                return;
            //items remove
            items.splice(index, 1);
        };
        // add and remove item (+ -)end
        // ================= display page record start =========================
        this.displayRecord = '10';
        this.displayRecords = [
            { id: '1', displayValue: '10' },
            { id: '2', displayValue: '25' },
            { id: '3', displayValue: '50' },
            { id: '4', displayValue: '100' },
            { id: '5', displayValue: '200' }
        ];
        this._itemsHeader = new rxjs_1.BehaviorSubject([]);
        // pager object
        this.pager = {};
        this._items = new rxjs_1.BehaviorSubject([]);
        // click edit item update end
        // ===================== getlist data Fetch start ===================
        this._getList = new rxjs_1.BehaviorSubject([]);
    }
    Object.defineProperty(CommonUtils.prototype, "groupLoginIdentifireObservable", {
        get: function () {
            return this._groupLoginClickableIdentifire.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    CommonUtils.prototype.onClickGroupIdentifire = function (data) {
        this._groupLoginClickableIdentifire.next(data);
    };
    Object.defineProperty(CommonUtils.prototype, "groupLoginClickDataObservable", {
        get: function () {
            return this._groupLoginClickableData.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    CommonUtils.prototype.onClickGroupItemData = function (data) {
        this._groupLoginClickableData.next(data);
    };
    Object.defineProperty(CommonUtils.prototype, "getSiteInfoObservable", {
        get: function () {
            return this._siteInfoCheck.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    CommonUtils.prototype.setSiteInfo = function (type) {
        // console.log('setSiteInfo SERVICE >>>>>>>>',type);
        this._siteInfoCheck.next(type);
    };
    Object.defineProperty(CommonUtils.prototype, "getUserTypeObservable", {
        get: function () {
            return this._userTypeCheck.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    CommonUtils.prototype.setUserType = function (type) {
        this._userTypeCheck.next(type);
    };
    Object.defineProperty(CommonUtils.prototype, "menuDataobservable", {
        get: function () {
            return this._menudata.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    CommonUtils.prototype.getMenudataService = function (path) {
        this._menudata.next(path);
    };
    Object.defineProperty(CommonUtils.prototype, "menuPermissionObservable", {
        get: function () {
            return this._menuPermission.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    CommonUtils.prototype.menuPermissionService = function (data) {
        this._menuPermission.next(data);
    };
    Object.defineProperty(CommonUtils.prototype, "pagePathNameAnywhereObsv", {
        get: function () {
            return this._pagepathName.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    CommonUtils.prototype.getPathNameFun = function (path) {
        this._pagepathName.next(path);
    };
    // display page record end
    // ====================== tost message start ==================
    CommonUtils.prototype.presentToast = function (_type, msg) {
        return __awaiter(this, void 0, void 0, function () {
            var toast;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastController.create({
                            message: msg,
                            showCloseButton: true,
                            animated: true,
                            translucent: true,
                            duration: 2000,
                            cssClass: "my-tost-custom-class" + _type
                        })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(CommonUtils.prototype, "itemsHeaderData", {
        get: function () {
            // return [...this._itemsHeader];
            return this._itemsHeader.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    CommonUtils.prototype.headerListData = function (_getUrl) {
        var _this = this;
        this.items_header_data = []; //blank array items will be push
        // table header column selection
        this.tableHeaderData = [];
        this.tableheaderDropdownChecked = [];
        return this.http.get("" + _getUrl).pipe(operators_1.map(function (resData) {
            if (resData.return_status > 0 && resData.return_data.length > 0) {
                for (var key in resData.return_data) {
                    if (resData.return_data.hasOwnProperty(key)) {
                        _this.items_header_data.push(resData.return_data[key]);
                    }
                }
            }
            else {
                // infinite scroll complite
                // event.target.complete();
            }
            // ---- array filter by display and default array item start ---
            _this.items_header_data.forEach(function (val, ind) {
                // dropdown show item
                if (val.is_display == 1) {
                    if (_this.tableHeaderData.indexOf(val.column_name) === -1) {
                        _this.tableHeaderData.push(val);
                    }
                }
                // dropdown checked item
                if (val.is_default == 1) {
                    if (_this.tableheaderDropdownChecked.indexOf(val.column_name) === -1) {
                        _this.tableheaderDropdownChecked.push(val);
                    }
                }
            });
            // copy array header data to new array
            _this.tableHeaderDataDropdown = _this.tableHeaderData.map(function (item) { return item; });
            // array filter by display and default array item end
            return [_this.tableHeaderData, _this.tableheaderDropdownChecked, _this.tableHeaderDataDropdown];
        }), operators_1.tap(function (itmArry) {
            // console.log('itmArry >>>>>>>>>>', itmArry);
            _this._itemsHeader.next(itmArry[0]); //update observable data
        }));
    };
    Object.defineProperty(CommonUtils.prototype, "itemsData", {
        get: function () {
            // return [...this._items];
            return this._items.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    //(api_url, display_record, page, apiParms, search, cherecterSearch,  orderBy, order, advanceSearch, identifire)
    CommonUtils.prototype.fetchList = function (_getUrl, _per_page_showItem, _page, _api_parms, _search, _cherecterSearch, _orderBy, _order, _advanceSearch, _identifire) {
        var _this = this;
        var apiParameters = '';
        var advanceSearchParams = '';
        var onlySearch;
        // search
        if (_search === undefined || _search === null || _search == '') {
            onlySearch = '';
        }
        else {
            onlySearch = _search;
        }
        // advance search
        var formData = new FormData();
        var other_data = _advanceSearch;
        if (other_data !== undefined && other_data !== null && other_data !== '') {
            for (var item in other_data) {
                if (other_data[item] == undefined) {
                    other_data[item] = '';
                }
                advanceSearchParams = advanceSearchParams + '&' + item + '=' + other_data[item];
            }
        }
        // api parameters
        var other_data_parms = _api_parms;
        if (other_data_parms !== undefined && other_data_parms !== null && other_data_parms !== '') {
            for (var itemP in other_data_parms) {
                if (other_data_parms[itemP] == undefined) {
                    other_data_parms[itemP] = '';
                }
                apiParameters = apiParameters + '&' + itemP + '=' + other_data_parms[itemP];
            }
        }
        this.items_data = []; //blank array items will be push
        return this.http.get(_getUrl + "?per_page=" + _per_page_showItem + "&page=" + _page + apiParameters + "&search=" + _search + "&sortbychar=" + _cherecterSearch + "&orderby=" + _orderBy + "&order=" + _order + advanceSearchParams).pipe(operators_1.map(function (resData) {
            _this.items_data = [];
            // console.log('listing link call .................resData =>', resData);
            if (resData.return_status > 0 && resData.return_data.data.length > 0) {
                for (var key in resData.return_data.data) {
                    if (resData.return_data.data.hasOwnProperty(key)) {
                        _this.items_data.push(resData.return_data.data[key]);
                    }
                }
                _this.listAllResData = resData.return_data;
                // console.log('listing common serveice aaaaaaaaaaaaaa >>>>>', resData.return_data);
            }
            // console.log('listing common serveice 111 >>>>>', resData.return_data);
            if (resData.return_status > 0 && resData.return_data.total == '0') {
                // console.log('listing common serveice bbbbbbbbbbbbb >>>>>', resData.return_data);
                _this.listAllResData = resData.return_data;
            }
            if (resData.return_status > 0) {
                return [_this.items_data, _this.listAllResData];
            }
        }), operators_1.tap(function (itmArry) {
            // console.log('itmArry >----------------------->', itmArry);
            if (itmArry) {
                _this._items.next(itmArry);
                _this._items.complete();
            }
            // this._items.complete();
        }));
    };
    CommonUtils.prototype.clickEditDataFun = function (_data) {
        this.clickEditData = _data;
        console.log("_data.principle >", _data.principle);
    };
    Object.defineProperty(CommonUtils.prototype, "getListData", {
        get: function () {
            // return [...this._getList];
            return this._getList.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    CommonUtils.prototype.getlistCommon = function (_getUrl) {
        var _this = this;
        return this.http.get("" + _getUrl).pipe(operators_1.map(function (resData) {
            if (resData.return_status > 0) {
                return resData.return_data;
            }
        }), operators_1.tap(function (itmArry) {
            _this._getList.next(itmArry);
        }));
    };
    // getlist data Fetch end
    // ===================== select checkbox get value start ===================
    CommonUtils.prototype.onCheckboxSelectCommon = function (option, event, _getItemsArry, _allselectModel, _itemcheckClick, _checkedList) {
        if (event.target.checked) {
            if (_checkedList.indexOf(option.id) === -1) {
                _checkedList.push(option.id);
            }
        }
        else {
            for (var i = 0; i < _getItemsArry.length; i++) {
                if (_checkedList[i] == option.id) {
                    _checkedList.splice(i, 1);
                }
            }
        }
        if (_getItemsArry.length <= _checkedList.length) {
            _allselectModel = true;
            console.log('length 4');
        }
        else {
            console.log('length 0');
            _allselectModel = false;
            _itemcheckClick = true;
        }
        return [_checkedList, _allselectModel];
        // console.log('checked item >>', this.checkedList);
    };
    // select checkbog get value end
    // =================all checkbox value selected start====================
    CommonUtils.prototype.allSelectItemCommon = function (event, _getItemsArry, _itemcheckClick, _checkedList) {
        if (event.target.checked) {
            _itemcheckClick = false;
            // console.log('check item selkectedddddddddddddd');
            for (var i = 0; i < _getItemsArry.length; i++) {
                // if(this.checkedList.includes(this.items[i].id) === false)
                if (_checkedList.indexOf(_getItemsArry[i].id) === -1 && _getItemsArry[i].id !== null) {
                    _checkedList.push(_getItemsArry[i].id);
                    _getItemsArry[i].isSelected = true;
                }
            }
        }
        else if (_itemcheckClick == false) {
            // console.log('not check item selectionnnnnnnnnnn')
            _checkedList = [];
            for (var i = 0; i < _getItemsArry.length; i++) {
                if (_checkedList.indexOf(_getItemsArry[i].id) === -1) {
                    _getItemsArry[i].isSelected = false;
                }
            }
        }
        return _checkedList;
        // console.log('checked item @@ >>', _checkedList);
    };
    CommonUtils = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], CommonUtils);
    return CommonUtils;
}());
exports.CommonUtils = CommonUtils;
