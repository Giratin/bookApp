import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }

  private api = environment.apiUrl;


  public searchFor(str : string): Observable<any>{
    return this.http.get(`${this.api}${str}&maxResults=20`);
  }

  public paginate(str : string, page : number): Observable<any>{
    var index = (page * 20) +1;
    return this.http.get(`${this.api}${str}&maxResults=20&startIndex=${index}`);
  }

}
