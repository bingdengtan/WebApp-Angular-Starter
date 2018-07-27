import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

declare var $: any;

import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { CoreUtils } from '../../utils/core.utils';
import { GridColumn, GridMenu, GridComponent } from '../../components/grid/grid.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

interface IUser {
  username: string;
  email: string;
  id: null;
  roles: Array<string>;
  creation_date: null;
  created_by: string;
  last_updated_date: null;
  last_updated_by: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @ViewChild(GridComponent) gridComponent: GridComponent;
  @ViewChild(ConfirmDialogComponent) confirmDialog: ConfirmDialogComponent;
  title = 'Users Management';
  restUrl = '';
  gridColumns: any[] = new Array();
  gridActions: any[] = new Array();

  roles: any[] = new Array();
  assignedRoles: any[] = new Array();

  user: IUser = {
    username: '',
    email: '',
    id: null,
    roles: [],
    creation_date: null,
    created_by: '',
    last_updated_date: null,
    last_updated_by: ''
  };

  modalRef: BsModalRef;
  confirmDialogTitle: string;
  confirmDialogMessage: string;

  constructor(private coreUtils: CoreUtils,
    private modelService: UserService,
    private roleService: RoleService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {
    this.confirmDialogTitle = 'User Management';
  }

  ngOnInit() {
    this.coreUtils.resizeWindow();
    this.initGrid();
    this.initRoles();
  }

  showModal(): void {
    this.initCheckRoles();
    $('#myModal').modal('show');
  }

  menuActionNew(): void {
    // this.roles.forEach(role => role['checked'] = false);
    this.user = {username: '', email: '', id: null, roles: [],
      creation_date: null, created_by: '', last_updated_date: null, last_updated_by: ''};
    this.showModal();
  }

  save(): void {
    const $btn = $('#saveButton').button('loading');

    const roleCheckedObjects = $('input[name="roles"]:checked');
    const userRoles = [];
    for (const role of roleCheckedObjects) {
      userRoles.push(role.value);
    }
    this.user.roles = userRoles;

    // this.user.roles = this.roles.filter(opt => opt.checked === true).map(opt => opt.id);
    this.modelService.save(this.user).then( response => {
      $btn.button('reset');
      if ($('#myModal').modal('hide')) {
        this.gridComponent.loadGrid(1);
        // this.roles.forEach(role => role.checked = false);
      }
    }).catch(e => {
      $btn.button('reset');
      this.toastr.error(e.error.detail, 'Save Failed');
    });
  }

  menuActionEdit(): void {
    const rows = this.gridComponent.getSelectedRows();
    if (rows.length !== 1) {
      this.toastr.warning('Please select one document to edit.', '', {
        positionClass: 'toast-top-center'
      });
    } else {
      this.user = JSON.parse(JSON.stringify(rows[0]));
      this.showModal();
    }
  }

  menuActionDelete(): void {
    const selectedIds = this.gridComponent.getSelectedIds();
    if (selectedIds.length <= 0 ) {
      this.toastr.warning('Please select document first', '', {
        positionClass: 'toast-top-center'
      });
    } else {
      this.confirmDialogMessage = 'Are you sure to delete the selected document(s)';
      this.confirmDialog.show();
    }
  }

  confirmCallback(confirm): void {
    this.confirmDialog.hide();
    if (confirm) {
      setTimeout(() => {
        this.confirmDeletetion();
      }, 500);
    }
  }

  confirmDeletetion(): void {
    const selectedIds = this.gridComponent.getSelectedIds();
    selectedIds.forEach(async id => {
      await this.modelService.delete(id).then( response => {
          this.toastr.success('Delete completed', '');
          this.gridComponent.loadGrid(1);
      }).catch(e => {
        this.toastr.error(e.error.detail, 'Delete Failed');
      });
    });
  }

  cellClickAction(row): void {
    this.user = JSON.parse(JSON.stringify(row));
    this.showModal();
  }

  initCheckRoles(): void {
    const roleObjects = $('input[name="roles"]');
    if (this.user.roles.length <= 0) {
      for (const role of roleObjects) {
        role.checked = false;
      }
    } else {
      const roleIds = this.user.roles.map(x => '' + x);
      for (const role of roleObjects) {
        role.checked = roleIds.indexOf(role.value) > -1;
      }
    }
  }

  getDateFormat(row, val): String {
    return this.coreUtils.getDateFormat(val);
  }

  getActiveFormat(row, val): String {
    return val ? 'Yes' : '';
  }

  getRolesFormat(row, val): String {
    if (val.length > 0) {
      const roles = this.roles.filter( (role) => val.indexOf(role.id) >= 0);
      return roles.map( role => role.role_name).join(', ');
    }
    return '';
  }

  private initGrid(): void {
    this.restUrl = this.modelService.restUrl;

    let nameCol: GridColumn = {title: 'ID', filedName: 'id', width: null, columnFormat: null, display: false,
      click: null,
      sort: {enable: false, sortBy: null}};
    this.gridColumns.push(nameCol);

    nameCol = {title: 'User Name', filedName: 'username', width: null, columnFormat: null, display: true,
      click: this.cellClickAction.bind(this),
      sort: {enable: true, sortBy: 'username'}};
    this.gridColumns.push(nameCol);

    nameCol = {title: 'Email', filedName: 'email', width: null, columnFormat: null, display: true,
      click: null,
      sort: {enable: true, sortBy: 'email'}};
    this.gridColumns.push(nameCol);

    nameCol = {title: 'Roles', filedName: 'roles', width: null, columnFormat: this.getRolesFormat.bind(this), display: true,
      click: null,
      sort: {enable: false, sortBy: null}};
    this.gridColumns.push(nameCol);

    nameCol = {title: 'Active', filedName: 'is_active', width: null, columnFormat: this.getActiveFormat.bind(this), display: true,
      click: null,
      sort: {enable: true, sortBy: 'is_active'}};
    this.gridColumns.push(nameCol);

    nameCol = {title: 'Creation Date', filedName: 'creation_date', width: null, columnFormat: this.getDateFormat.bind(this),
      display: false,
      click: null,
      sort: {enable: true, sortBy: 'creation_date'}};
    this.gridColumns.push(nameCol);

    nameCol = {title: 'Creation By', filedName: 'created_by', width: null, columnFormat: null,
      display: false,
      click: null,
      sort: {enable: true, sortBy: 'created_by'}};
    this.gridColumns.push(nameCol);

    nameCol = {title: 'Last Updated Date', filedName: 'last_updated_date', width: null, columnFormat: this.getDateFormat.bind(this),
      display: true,
      click: null,
      sort: {enable: true, sortBy: 'last_updated_date'}};
    this.gridColumns.push(nameCol);

    nameCol = {title: 'Last Updated By', filedName: 'last_updated_by', width: null, columnFormat: null,
      display: true,
      click: null,
      sort: {enable: true, sortBy: 'last_updated_by'}};
    this.gridColumns.push(nameCol);

    // actions
     let gridMenu: GridMenu;
    gridMenu = {title: 'New', aClass: 'btn-primary', faIcon: 'fa fa-sticky-note-o',
      action: this.menuActionNew.bind(this), subMenus: []};
    this.gridActions.push(gridMenu);

    gridMenu = {title: 'Edit', aClass: 'btn-info', faIcon: 'fa fa-edit',
      action: this.menuActionEdit.bind(this), subMenus: []};
    this.gridActions.push(gridMenu);

    gridMenu = {title: 'Delete', aClass: 'btn-danger', faIcon: 'fa fa-trash',
      action: this.menuActionDelete.bind(this), subMenus: []};
    this.gridActions.push(gridMenu);

    // gridMenu = {title: 'More', aClass: 'btn-primary', faIcon: 'fa fa-trash',
    //   action: null, subMenus: [{title: 'More 1', action: this.menuActionDelete}, {title: 'More 2', action: this.menuActionDelete}]};
    // this.gridActions.push(gridMenu);
  }

  private initRoles(): void {
    this.roleService.list({pageNumber: 1, pageSize: 100, sortBy: 'role_name', orderBy: 'asc'}, {})
      .then(roles => {
        this.roles = roles.results.map(role => {
          return {checked: false, id: role.id, role_name: role.role_name};
        });
      });
  }
}
