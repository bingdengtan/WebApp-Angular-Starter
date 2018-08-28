import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { CoreUtils } from '../utils/core.utils';
import { BasicModelService } from './basic.model.service';

@Injectable()
export class UserService extends BasicModelService {
  me: any;

  constructor(public http: HttpClient, public coreUtils: CoreUtils) {
    super(http, coreUtils);
    this.restUrl = environment.api + 'adm/user/';
  }

  getUserByName(username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.restUrl + 'get_user_by_name/?username=' + encodeURI(username))
        .toPromise()
        .then( response => {
          resolve(response);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  async getMe(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.restUrl + 'me/')
        .toPromise()
        .then( response => {
          this.me = response;
          resolve(response);
        })
        .catch(e => {
          this.me = null;
          reject(e);
        });
    });
  }
}
