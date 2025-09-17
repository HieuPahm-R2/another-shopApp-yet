import { Injectable } from "@angular/core";
import { environment } from "../env/environments";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Product } from "../models/product";

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiBaseUrl = environment.apiBaseUrl

    constructor(private http: HttpClient) {

    }
    getProducts(
        keyword: string,
        categoryId: number,
        page: number, limit: number
    ): Observable<Product[]> {
        const params = {
            keyword: keyword,
            category_id: categoryId.toString(),
            page: page.toString(),
            limit: limit.toString()
        }
        return this.http.get<Product[]>(`${this.apiBaseUrl}/products`, { params })
    }
    getDetailProduct(productId: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiBaseUrl}/products/${productId}`)
    }
    getProductsByIds(productIds: number[]): Observable<Product[]> {
        const params = new HttpParams().set('ids', productIds.join(',')) //ids=1,2,3
        return this.http.get<Product[]>(`${this.apiBaseUrl}/products/by-ids`, { params })
    }
}