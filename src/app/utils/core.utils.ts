import {Injectable} from '@angular/core';
import * as moment from 'moment';
declare var $: any;

export interface IPager {
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    orderBy: string;
}

@Injectable()
export class CoreUtils {
    static FORMAT_DATE = 'YYYY-MM-DD';
    static FORMAT_DATE_TIME = 'YYYY-MM-DD HH:mm:ss';

    getAppHostName(): String {
        return location.protocol + '//' + location.hostname;
    }

    getDateFormat(date): String {
        let val;
        // date = moment.utc(date);
        date = moment(date);
        if (date.isValid) {
            val = date.format(CoreUtils.FORMAT_DATE_TIME);
        }
        return val;
    }

    getQueryPagination(pager: IPager, query: any): string {
        let url = '';
        url += '?page=' + pager.pageNumber + '&page_size=' + pager.pageSize;
        if (pager.sortBy) {
          url += '&ordering=' + (pager.orderBy === 'asc' ?  '' : '-') + pager.sortBy;
        }
        const keys = Object.keys(query);
        keys.forEach(k => {
          url += '&' + k + '=' + encodeURI(query[k]);
        });
        return url;
    }

    resizeWindow(): void {
        const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
        if (isIEOrEdge) {
            $(window).trigger('resize');
        } else {
            window.dispatchEvent(new Event('resize'));
        }
    }
}
