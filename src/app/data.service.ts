import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class DataService {
  private _URL_SERVIDOR: string = environment.URL_SERVIDOR;

  constructor(private httpClient: HttpClient) { }

  GetPrueba(data:JSON){
    let headers : any = {};
    let params : any = data;
    return this.httpClient.get(this._URL_SERVIDOR + 'compilador/getPrueba',{headers, params})
  }
}
