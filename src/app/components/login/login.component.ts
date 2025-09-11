import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoginDTO } from '../dtos/login.dto';
import { LoginResponse } from '../../res/login.response';
import { TokenService } from '../../services/token.service';
import { Role } from '../../models/role';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm
  phoneNumber: string = ''
  password: string = ''
  rememberMe: boolean = true
  selectedRole: Role = {
    id: 1,
    name: "user"
  }

  constructor(private router: Router, 
    private userService: UserService, private tokenService: TokenService){

  }
  login(){
    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id
    }
    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
          const {token} = response
          if(this.rememberMe){
            this.tokenService.setToken(token)
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
  onPhoneNumberChange(){
    console.log(`Phone typed: ${this.phoneNumber}`)
    //how to validate ? phone must be at least 6 characters
  }
}
