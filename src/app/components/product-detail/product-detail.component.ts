import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common'
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductImage } from '../../models/product.images';
import { environment } from '../../env/environments';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  product?: Product
  productId: number = 0
  currentImageIndex: number = 0
  quantity: number = 1
  isPressedAdd: boolean = false
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {

  }
  ngOnInit() {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id')
    if (idParam != null) {
      this.productId = +idParam
    }
    if (!isNaN(this.productId)) {
      this.productService.getDetailProduct(this.productId).subscribe({
        next: (response: any) => {
          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((item: ProductImage) => {
              item.image_url = `${environment.apiBaseUrl}/products/images/${item.image_url}`
            });
          }
          this.product = response
          console.log(this.product?.product_images.forEach(item => item.image_url))
          this.showImage(0)
        },
        complete: () => {
          // debugger;
        },
        error: () => {
          // debugger;
          console.error('Error fetching detail:')
        }
      }
      )
    } else {

    }
  }
  showImage(index: number): void {
    if (this.product && this.product.product_images && this.product.product_images.length > 0) {
      if (index < 0) {
        index = 0
      } else if (index > this.product.product_images.length) {
        index = this.product.product_images.length - 1
      }
      this.currentImageIndex = index // Gán index cập nhật ảnh hiển thị
    }
  }
  thumbnailOnClick(index: number) {
    this.currentImageIndex = index
  }
  nextImage(): void {
    this.showImage(this.currentImageIndex + 1)
  }
  prevImage(): void {
    this.showImage(this.currentImageIndex - 1)
  }
  // cart
  addToCart(): void {
    this.isPressedAdd = true
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity)
    } else {
      console.error('Action Add Error...')
    }
  }
  increaseQuantity(): void {
    this.quantity++
  }
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--
    }
  }
  getTotalMoney(): number {
    if (this.product) {
      return this.product.price * this.quantity
    }
    return 0
  }
  clickBuy(): void {
    if (this.isPressedAdd == false) {
      this.addToCart()
    }
    this.router.navigate(['/orders'])
  }
}

