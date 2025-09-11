import { Injectable } from "@angular/core";
import { environment } from "../env/environments";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Product } from "../models/product";

@Injectable({
    providedIn: 'root'
})
export class ProductService{
    private apiBaseUrl = environment.apiBaseUrl

    constructor(private http: HttpClient){

    }
    getProducts(
         page: number, limit: number    
    ): Observable<Product[]>{
        const params = {
            
            page: page.toString(),
            limit: limit.toString()
        }   
        return this.http.get<Product[]>(`${this.apiBaseUrl}/products`, {params})
    }
}