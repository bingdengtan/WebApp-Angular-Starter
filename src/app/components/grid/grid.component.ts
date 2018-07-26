import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import 'rxjs/Rx';
import { forEach } from '@angular/router/src/utils/collection';
import { encode } from 'punycode';

declare var Pace: any;
// declare var jquery: any;
// declare var $: any;

export interface GridColumn {
  display: boolean;
  title: String;
  filedName: String;
  width: String;
  columnFormat: any;  // pass your format function
  click: any; // your clic function for this column, grid component will pass the row value as your function parameter.
  // sort object {enable: boolean, sortBy: string}, if the sortBy is null, then it will use the filed name to sort
  sort: any;
}

export interface GridMenu {
  title: String;
  aClass: String;
  faIcon: String;
  action: any;
  // sub menus: each one shold be {title:String, action: Function}
  subMenus: Array<any>;
}

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})

export class GridComponent implements OnInit {
  @Input() columns: Array<any>;
  @Input() menus: Array<GridMenu>;
  @Input() showIndex: boolean;
  @Input() indexTitle: String = 'Index';
  @Input() restUrl: string;
  @Input() pageSize = 10;
  @Input() pageSizes = [10, 20, 50, 100];
  @Input() sortBy = '';
  @Input() orderBy = 'asc';
  @Input() FTSearch = {show: false, placeholder: 'Search', forNames: []};
  @Input() selection = {show: true, multiple: false};
  @Input() queryObject;

  selectedIds: Array<String> = new Array();
  selectedRows: Array<any> = new Array();
  isSelectedAll = false;
  gridRows: Array<any> = new Array();
  grid: any;
  pager: any = {
    enableFirst: false,
    enableLast: false,
    enablePrevious: false,
    enableNext: false,
    showNextPages: false,
    curPages: []
  };
  pages = 5;

  start = 0; last = 0; count = 0;
  pageInfo: String = '';
  searchTerm: FormControl;
  loading = false;

  constructor(public http: HttpClient) {
    this.searchTerm = new FormControl();
  }

  ngOnInit() {
    console.log('Grid Component Init...');
    this.initSearchTerm();
    this.loadGrid(1);
  }

  getColumnValue(row: any, column: any): string {
    const fieldsLoop = column.filedName.split('.');
    let obj = JSON.parse(JSON.stringify(row));
    let val = '';
    for (let i = 0; i < fieldsLoop.length; i++) {
      if (obj[fieldsLoop[i]]) {
        val = obj[fieldsLoop[i]];
        obj = val;
      } else {
        break;
      }
    }
    if (column.columnFormat) {
      val = column.columnFormat(row, val);
    }
    return val;
  }

  getQueryUrl(pageNumber: number): string {
    let url = this.restUrl;
    url = this.restUrl + '?page=' + pageNumber + '&page_size=' + this.pageSize;
    if (this.sortBy) {
      url += '&ordering=' + (this.orderBy === 'asc' ?  '' : '-') + this.sortBy;
    }
    const query = this.getQueryObject();
    const keys = Object.keys(query);
    keys.forEach(k => {
      url += '&' + k + '=' + encodeURI(query[k]);
    });
    return url;
  }

  loadGrid(pageNumber: number): void {
    // Pace.restart();
    this.loading = true;
    if (this.grid) {
      if ((pageNumber < 1 || pageNumber > this.grid.pageCount) && this.grid.pageCount > 0 ) {
        this.loading = false;
        return;
      }
    }

    this.http.get(this.getQueryUrl(pageNumber))
      .toPromise()
      .then( response => {
        this.grid = response;
        const searchParams = new URLSearchParams(this.restUrl);
        this.grid.pageNumber = pageNumber;
        this.gridRows = this.grid.results;
        this.resetPager();
      })
      .catch(e => {
        this.loading = false;
        console.log(e);
      });
  }

  loadMorePages(): void {
    this.loadGrid(Math.ceil(this.grid.pageNumber / this.pages) * this.pages + 1);
  }

  resetPager(): void {
    // uncheck the selected all checkbox
    this.isSelectedAll = false;
    this.selectedIds = [];

    // hiden the loading
    this.loading = false;

    // page information
    this.grid.pageCount = Math.ceil(this.grid.count / this.pageSize);
    if (this.grid.count <= 0) {
      this.start = 0; this.last = 0;
    } else {
      this.start = (this.grid.pageNumber - 1) * this.pageSize + 1;
      this.last = this.grid.pageNumber === this.grid.pageCount ? this.grid.count : this.grid.pageNumber * this.pageSize;
    }
    this.pageInfo = `Show ${this.start} - ${this.last} , Total ${this.grid.count} Records`;

    // set the pager
    // this.grid.pageNumber = 13;

    const curPages: number[] = new Array();
    for (let i = 1; i <= this.pages; i++) {
      const tempPage = (Math.ceil(this.grid.pageNumber / this.pages) - 1) * this.pages + i;
      if (tempPage <= this.grid.pageCount) {
        curPages.push(tempPage);
      }
    }

    this.pager = {
      // enableFirst: this.grid.pageNumber > 1,
      enableFirst: this.grid.previous != null,
      // enableLast: this.grid.pageNumber < this.grid.pageCount,
      enableLast: this.grid.next != null,
      // enablePrevious: this.grid.pageNumber > 1,
      enablePrevious: this.grid.previous != null,
      // enableNext: this.grid.pageNumber < this.grid.pageCount,
      enableNext: this.grid.next != null,
      showNextPages: Math.ceil(this.grid.pageNumber / this.pages) * this.pages < this.grid.pageCount,
      curPages: curPages
    };

    // window.setTimeout(() => {
    //   Pace.stop();
    // }, 500);
  }

  getTHClass(th): string {
    let thClass = '';
    if (th.sort.enable) {
      thClass = 'sorting';
      const _sortBy = th.sort.sortBy && th.sort.sortBy !== '' ? th.sort.sortBy : th.filedName;
      if (_sortBy === this.sortBy) {
        thClass = thClass + '_' + (this.orderBy === 'asc' ? 'asc' : 'desc');
      }
    }
    return thClass;
  }

  sortColumn(th): void {
    if (th.sort.enable) {
      const _sortBy = th.sort.sortBy && th.sort.sortBy !== '' ? th.sort.sortBy : th.filedName;
      if (this.sortBy !== _sortBy) {
        this.orderBy = 'asc';
      } else {
        this.orderBy = this.orderBy === 'asc' ? 'desc' : 'asc';
      }
      this.sortBy = _sortBy;
      this.loadGrid(1);
    }
  }

  showColumns(column): void {
    column.display = !column.display;
  }

  changePageSize(size): void {
    this.pageSize = size;
    this.loadGrid(1);
  }

  initSearchTerm(): void {
    this.searchTerm.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap( term => {
        this.loading = true;
        // return this.http.post(this.restUrl, this.getPostData(1));
        return this.http.get(this.getQueryUrl(1));
      })
      .subscribe( response => {
        this.grid = response;
        this.gridRows = this.grid.results;
        this.grid.pageNumber = 1;
        this.resetPager();
      });
  }

  public getSelectedRows(): any {
    const _selectedRows = [];
    this.gridRows.forEach( row => {
      if (this.selectedIds.indexOf(row['id']) > -1) {
        _selectedRows.push(row);
      }
    });
    return _selectedRows;
  }

  public getSelectedIds(): Array<string> {
    const ids = [];
    this.gridRows.forEach( row => {
      if (this.selectedIds.indexOf(row['id']) > -1) {
        ids.push(row['id']);
      }
    });
    return ids;
  }

  toggleSelection(row): void {
    this.selectedIds = this.selection.multiple ? this.selectedIds : [];
    const idx = this.selectedIds.indexOf(row['id']);
    if ( idx > -1) {
      this.selectedIds.splice(idx, 1);
    } else {
      this.selectedIds.push(row['id']);
    }
    if (this.selectedIds.length > 0 && this.selectedIds.length === this.gridRows.length) {
      this.isSelectedAll = true;
    } else {
      this.isSelectedAll = false;
    }
  }

  toggleSelectAll(): void {
    this.isSelectedAll = !this.isSelectedAll;

    this.selectedIds = [];
    if (this.isSelectedAll) {
      this.gridRows.forEach( row => {
        this.selectedIds.push(row['id']);
      });
    }
  }

  private getQueryObject(): any {
    let query = {};

    if (this.FTSearch.show) {
      if (this.searchTerm.value && this.searchTerm.value !== '') {
        if (this.FTSearch.forNames.length > 0) {
          if (this.FTSearch.forNames.length === 1) {
            // query[this.FTSearch.forNames[0]] = {$regex: '.*' + this.searchTerm.value + '.*', $options: 'i'};
            query[this.FTSearch.forNames[0]] = this.searchTerm.value;
          } else {
            const queryFields = [];
            this.FTSearch.forNames.forEach(value => {
              const obj = {};
              // obj[value] = {$regex: '.*' + this.searchTerm.value + '.*', $options: 'i'};
              obj[value] = this.searchTerm.value;
              queryFields.push(obj);
            });
            // query = {$or: queryFields};
            query = queryFields;
          }
        }
      }
    } else {
      if (this.queryObject) {
        query = this.queryObject;
      }
    }

    return query;
  }

  // private getPostData(pageNumber: number): any {
  //   return {
  //     pageNumber: pageNumber,
  //     pageSize: this.pageSize,
  //     sortBy: this.sortBy !== '' ? this.sortBy : null,
  //     orderBy: this.orderBy !== '' ? this.orderBy : null,
  //     query: this.getQueryObject()
  //   };
  // }
}
