import { DOCUMENT } from "@angular/common"
import { Inject, Injectable } from "@angular/core"

@Injectable({
  providedIn: 'root'
})

export class CartService {
  localStorage?: Storage
  private cart: Map<number, number> = new Map<number, number>() // Dùng Map để lưu trữ giỏ hàng

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.localStorage = document.defaultView?.localStorage
    // Lấy dữ liệu giỏ hàng từ localStorage khi khởi tạo service
    this.refreshCart()
  }

  public refreshCart() {
    const storedCart = this.localStorage?.getItem(this.getCartKey())
    if (storedCart) {
      this.cart = new Map(JSON.parse(storedCart))
    } else {
      this.cart = new Map<number, number>()
    }
  }

  addToCart(productId: number, quantity: number = 1): void {
    // debugger
    if (this.cart.has(productId)) {
      // Nếu sản phẩm đã có trong giỏ hàng, tăng
      this.cart.set(productId, this.cart.get(productId)! + quantity)
    } else {
      // Nếu chưa có, thêm sản phẩm vào với số lượng là `quantity`
      this.cart.set(productId, quantity)
    }
    this.saveCartToLocalStorage()
  }

  getCart(): Map<number, number> {
    return this.cart
  }

  setCart(cart: Map<number, number>) {
    this.cart = cart ?? new Map<number, number>()
    this.saveCartToLocalStorage()
  }

  clearCart(): void {
    this.cart.clear()
    this.saveCartToLocalStorage()
  }

  private getCartKey(): string {
    const userResponseJSON = this.localStorage?.getItem('user')
    const userResponse = JSON.parse(userResponseJSON!)
    // debugger
    return `cart:${userResponse?.id ?? ''}`

  }

  private saveCartToLocalStorage(): void {
    this.localStorage?.setItem(this.getCartKey(), JSON.stringify(Array.from(this.cart.entries())))
  }
}