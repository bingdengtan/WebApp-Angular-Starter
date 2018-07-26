import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { CoreUtils } from '../utils/core.utils';
import { BasicModelService } from './basic.model.service';

@Injectable()
export class UserService extends BasicModelService {
  constructor(public http: HttpClient, public coreUtils: CoreUtils) {
    super(http, coreUtils);
    this.restUrl = environment.api + 'adm/user/';
  }
}
