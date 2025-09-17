import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { OrderResponse } from '../../res/order.response';

@Component({
  selector: 'app-order-confirm',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './order-confirm.component.html',
  styleUrl: './order-confirm.component.scss',
})
export class OrderConfirmComponent {
  orderResponse: OrderResponse = {
    id: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
    user_id: 0,
    fullname: '',
    phone_number: '',
    email: '',
    address: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
    shipping_method: '',
    shipping_address: '',
    shipping_date: new Date(),
    payment_method: '',
    order_details: []
  }
  constructor() {

  }
}
