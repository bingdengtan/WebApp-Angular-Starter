import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import 'rxjs/Rx';

import { CoreUtils, IPager } from '../utils/core.utils';

@Injectable()
export class BasicModelService {
  restUrl: string;

  constructor(public http: HttpClient, public coreUtils: CoreUtils) {

  }

  save(model: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (model.id) {
        this.http.put(this.restUrl + model.id + '/', model)
          .toPromise()
          .then( response => {
            resolve(response);
          })
          .catch(e => {
            reject(e);
          });
      } else {
        this.http.post(this.restUrl, model)
        .toPromise()
        .then( response => {
          resolve(response);
        })
        .catch(e => {
          reject(e);
        });
      }
    });
  }

  async delete(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete(this.restUrl + id, {})
        .toPromise()
        .then( response => {
          resolve(response);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  list(pager: IPager, query: any): Promise<any> {
    const urlParameters = CoreUtils.prototype.getQueryPagination(pager, query);
    return new Promise((resolve, reject) => {
      this.http.get(this.restUrl + urlParameters)
        .toPromise()
        .then( response => {
          resolve(response);
        })
        .catch(e => {
          reject(e);
        });
    });
  }
}
