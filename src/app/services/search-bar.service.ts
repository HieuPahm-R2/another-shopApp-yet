import { Inject, Injectable, signal } from "@angular/core";
import { environment } from "../env/environments";
import { map, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Product } from "../models/product";

export interface Suggestion {
  title: string;
  image: string;
  url: string;
}
@Injectable({
    providedIn: 'root'
})
export class SearchBarService {
     private apiBaseUrl = environment.apiBaseUrl
    
        constructor(private http: HttpClient){
    
        }
        searchBook(keyword: string,categoryId: number,page: number, limit: number): Observable<Suggestion[]>{
            const params = {
                keyword: keyword,
                category_id: categoryId.toString(),
                page: page.toString(),
                limit: limit.toString()
            }   
            return this.http.get<any>(`${this.apiBaseUrl}/products`, {params}).pipe(
                map(res => res.products?.map((item: any) => ({
                    title: item.name,
                    image: item.thumbnail
                })) || [])
            )
        }
}