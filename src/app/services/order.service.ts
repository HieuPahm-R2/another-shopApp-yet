import { Injectable } from "@angular/core";
import { environment } from "../env/environments";
import { HttpClient } from "@angular/common/http";
import { OrderDTO } from "../dtos/order.dto";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiBaseUrl}/orders`

    constructor(private http: HttpClient) {

    }
    placeOrder(orderData: OrderDTO): Observable<any> {
        return this.http.post(this.apiUrl, orderData)
    }
    deleteOrder(orderId: number): Observable<any> {
        const url = `${environment.apiBaseUrl}/orders/${orderId}`
        return this.http.delete(url, { responseType: 'text' })
    }
}