import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SmartqService {
  private url = 'https://thesmartq.firebaseio.com/menu.json';
  
  constructor(private http: Http) {
  }

  getMenu() {
    return this.http.get(this.url);
  }
}
