import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { environment } from '../../env/environments';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent, 
    FooterComponent, CommonModule,
    FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  products: Product[] = []
  // categories: Category[] = [] // Dữ liệu động từ categoryService
  selectedCategoryId: number = 0 // Giá trị category được chọn
  currentPage: number = 0
  itemsPerPage: number = 10
  pages: number[] = []
  totalPages: number = 0
  visiblePages: number[] = []
  keyword: string = ''
  localStorage?: Storage

  constructor(private productService: ProductService, private router: Router){

  }
  ngOnInit() {
    this.currentPage = Number(this.localStorage?.getItem('currentProductPage')) || 0
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage)
    
  }
    getProducts( keyword: string, selectedCategoryId: number,page: number, limit: number) {
    // debugger;
    this.productService.getProducts(keyword, selectedCategoryId,page, limit).subscribe({
      next: (response: any) => {
        // debugger;
        response.products.forEach((product: Product) => {
          product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`
        })
        this.products = response.products
        this.totalPages = response.totalPages
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages)
      },
      complete: () => {
        // debugger;
      },
      error: (error: any) => {
        // debugger;
        console.error('Error fetching products:', error)
      }
    })
  }
  onPageChange(page: number) {
    // debugger;
    this.currentPage = page < 0 ? 0 : page
    this.localStorage?.setItem('currentProductPage', String(this.currentPage))
    this.getProducts( this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage)
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5
    const halfVisiblePages = Math.floor(maxVisiblePages / 2)

    let startPage = Math.max(currentPage - halfVisiblePages, 1)
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1)
    }

    return new Array(endPage - startPage + 1).fill(0)
      .map((_, index) => startPage + index)
  }

  onProductClick(productId: number) {
    // debugger;
    // Điều hướng đến t detail-product
    this.router.navigate(['/products', productId])
  }
}
