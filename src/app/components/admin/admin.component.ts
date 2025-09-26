import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { Router, RouterModule } from '@angular/router';
import { UserResponse } from '../../res/user.response';
import { CommonModule } from '@angular/common';
import { OrderAdminComponent } from './order/order.admin.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, OrderAdminComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  adminComponent: string = 'orders'
  userResponse?: UserResponse | null

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage()
    // debugger
    if (this.router.url === '/admin') {
      this.router.navigate(['/admin/orders'])
    }
  }

  logout() {
    this.userService.removeUserFromLocalStorage()
    this.tokenService.removeToken()
    this.userResponse = this.userService.getUserResponseFromLocalStorage()
    this.router.navigate(['/'])
  }

  showAdminComponent(componentName: string): void {
    if (componentName === 'orders') {
      this.router.navigate(['/admin/orders'])
    } else if (componentName === 'categories') {
      this.router.navigate(['/admin/categories'])
    } else if (componentName === 'products') {
      this.router.navigate(['/admin/products'])
    }
  }
}
