import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';

@Injectable()
export class CoreService {
  constructor(public http: HttpClient) {

  }
  getAppConfig(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get('assets/data/app.config.json')
        .toPromise()
        .then( response => {
          const appConfig = response;
          resolve(appConfig[key]);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  getLayoutConfig(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get('assets/data/app.layout.json')
        .toPromise()
        .then( response => {
          const appLayout = response;
          resolve(appLayout['layout']);
        })
        .catch(e => {
          reject(e);
        });
    });
  }
}
