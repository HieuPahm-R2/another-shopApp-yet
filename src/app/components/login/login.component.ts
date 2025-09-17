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
  selectedRole: Role = {
    id: 1,
    name: "user"
  }

  constructor(
    private router: Router,
    private userService: UserService,
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
      role_id: this.selectedRole?.id
    }
    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        const { token } = response
        if (this.rememberMe) {
          this.tokenService.setToken(token)
          this.userService.getUserDetail(token).subscribe({
            next: (response: any) => {
              this.userResponse = {
                ...response,
                date_of_birth: new Date(response.date_of_birth)
              }
              this.userService.saveUserResponseToLs(this.userResponse)
              if (this.userResponse?.role.name === 'admin') {
                this.router.navigate(['/admin'])
              } else if (this.userResponse?.role.name === 'user') {
                this.router.navigate(['/'])
              }
            },
            complete: () => {

            },
            error: (error: any) => {
              alert(error.error)
            }
          })
        }

      },
      complete: () => {

      },
      error: (error: any) => {
        // debugger;
        alert(error.error.message)
      }
    })
  }

  togglePassword() {
    this.showPassword = !this.showPassword
  }
}
