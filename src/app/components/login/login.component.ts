import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoginDTO } from '../../dtos/login.dto';
import { LoginResponse } from '../../res/login.response';
import { TokenService } from '../../services/token.service';
import { Role } from '../../models/role';
import { UserResponse } from '../../res/user.response';
import { CommonModule } from '@angular/common'
import { switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm
  phoneNumber: string = ''
  password: string = ''
  showPassword: boolean = false
  rememberMe: boolean = true
  userResponse?: UserResponse

  constructor(
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private tokenService: TokenService) {
  }
  registerAccount() {
    // debugger
    this.router.navigate(['/register'])
  }
  login() {
    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
    }
    this.userService.login(loginDTO).pipe(
      switchMap((response: LoginResponse) => {
        const { token } = response;
        if (this.rememberMe) {
          this.tokenService.setToken(token);
          // switchMap sẽ chuyển sang một observable mới là getUserDetail
          return this.userService.getUserDetail(token);
        }
        // Nếu không "rememberMe", trả về một observable rỗng để kết thúc chuỗi
        return [];
      })
    ).subscribe({
      next: (response1: any) => {
        // còn một subscription duy nhất để xử lý
        this.userResponse = {
          ...response1,
          date_of_birth: new Date(response1.date_of_birth)
        };
        this.userService.saveUserResponseToLs(this.userResponse);
        this.toastr.success('everything is done', 'Login successfully', {
          timeOut: 3000,
        });

        if (this.userResponse?.role.name === 'admin') {
          this.router.navigate(['/admin']);
        } else if (this.userResponse?.role.name === 'user') {
          this.router.navigate(['/']);
        }
      },
      error: (error: any) => {
        // Xử lý lỗi cho cả hai request (login và getUserDetail) tại một nơi
        this.toastr.error('everything is broken', 'bad credetials', {
          timeOut: 3000,
        });
      }
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword
  }
}



