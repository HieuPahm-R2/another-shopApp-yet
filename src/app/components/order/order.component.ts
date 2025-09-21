import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { OrderResponse } from '../../res/order.response';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderDTO } from '../../dtos/order.dto';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { TokenService } from '../../services/token.service';
import { OrderService } from '../../services/order.service';
import { environment } from '../../env/environments';
import { Product } from '../../models/product';
import { Order } from '../../models/order';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [HeaderComponent, FooterComponent,
    CommonModule,
    FormsModule, ReactiveFormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  orderForm: FormGroup
  cartItems: {
    product: Product,
    quantity: number
  }[] = []
  totalAmount: number = 0 // Tổng tiền
  couponDiscount: number = 0 //số tiền được discount từ coupon
  couponApplied: boolean = false
  cart: Map<number, number> = new Map()
  orderData: OrderDTO = {
    user_id: 0,
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    status: 'pending',
    note: '',
    total_money: 0, // Sẽ được tính toán dựa trên giỏ hàng và mã giảm giá
    payment_method: 'cod',
    shipping_method: 'express',
    coupon_code: '', // Sẽ được điền từ form khi áp dụng mã giảm giá
    cart_items: []
  }
  private formBuilder = inject(FormBuilder)
  private cartService = inject(CartService)
  private productService = inject(ProductService)
  private orderService = inject(OrderService)
  private tokenService = inject(TokenService)
  private router = inject(Router)
  private toastr = inject(ToastrService)

  constructor() {
    // Tạo FormGroup và các FormControl tương ứng
    this.orderForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.email]],
      phone_number: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      note: [''],
      couponCode: [''],
      shipping_method: ['express'],
      payment_method: ['cod']
    })
  }

  ngOnInit(): void {
    this.orderData.user_id = this.tokenService.getUserId()
    this.cart = this.cartService.getCart()
    const productIds = Array.from(this.cart.keys())  // Chuyển danh sách ID từ Map giỏ hàng
    debugger
    if (productIds.length === 0) {
      return;
    }
    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        debugger
        // Lấy thông tin sản phẩm và số lượng từ danh sách sản phẩm và giỏ hàng
        this.cartItems = productIds.map((productId) => {
          const product = products.find((p) => p.id === productId)
          if (product) {
            product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`
          }
          return {
            product: product!,
            quantity: this.cart.get(productId)!
          }
        })
      },
      complete: () => {
        // debugger;
        this.calculateTotal()
      },
      error: (error: any) => {
        // debugger;
        console.error('Error fetching detail:', error)
      }
    })
  }
  placeOrder() {
    if (this.orderForm.errors == null) {
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value
      }
      this.orderData.cart_items = this.cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }))
      this.orderData.total_money = this.totalAmount
      // Done
      this.orderService.placeOrder(this.orderData).subscribe({
        next: (response: Order) => {
          this.toastr.success('everything is done', 'Thanks for your regarding', {
            timeOut: 3000,
          });
          this.cartService.clearCart()
          this.router.navigate(['/'])
        },
        complete: () => {
          // debugger;
          this.calculateTotal()
        },
        error: (error: any) => {
          // debugger;
          this.toastr.error('everything is broken', 'Major Error', {
            timeOut: 3000,
          });
        }
      })
    }
  }
  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems()
      this.calculateTotal()
    }
  }

  increaseQuantity(index: number): void {
    this.cartItems[index].quantity++
    // Cập nhật lại this.cart từ this.cartItems
    this.updateCartFromCartItems()
    this.calculateTotal()
  }

  // Hàm tính tổng tiền
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity, 0)
  }

  confirmDelete(index: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      // Xóa sản phẩm khỏi danh sách cartItems
      this.cartItems.splice(index, 1)
      // this.updateCartFromCartItems()
      // Tính toán lại tổng tiền
      this.calculateTotal()
    }
  }
  private updateCartFromCartItems(): void {
    this.cart.clear()
    this.cartItems.forEach((item) => {
      this.cart.set(item.product.id, item.quantity)
    })
    this.cartService.setCart(this.cart)
  }

}
