import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

@Injectable()
export class DataService {

  private _URL_SERVIDOR: string = environment.URL_SERVIDOR;

  constructor(private httpClient: HttpClient) { }

  PostAnalysis(data:String){


    let headers = { 'Authorization':'prueba',
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'};

    return this.httpClient.get(this._URL_SERVIDOR + 'analisis/'+data, {headers});
  }
}
