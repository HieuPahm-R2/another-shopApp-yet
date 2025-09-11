import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RegisterDTO } from '../dtos/register.dto';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm
  phoneNumber: string;
  password: string;
  retypePassword: string;
  fullName: string
  address: string
  isAccepted: boolean
  dateOfBirth: Date
  constructor(private router: Router, private userService: UserService){
    this.phoneNumber = ''
    this.password = ''
    this.retypePassword = ''
    this.fullName = ''
    this.address = ''
    this.isAccepted = false
    this.dateOfBirth = new Date()
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18)
  }
  onPhoneChange(){

  }
  register(){
    const registerDto: RegisterDTO = {
      'fullName': this.fullName,
      'phone_number': this.phoneNumber,
      'address': this.address,
      'password': this.password,
      'retype_password': this.retypePassword,
      'date_of_birth': this.dateOfBirth,
      'facebook_account_id': 0,
      'google_account_id': 0,
      'role_id': 1
    }
    this.userService.register(registerDto).subscribe({
      next:(response: any) => {
        const confirm =  window.confirm('Đăng ký thành công. Bấm "OK" để chuyển đến trang đăng nhập.')
        if (confirm) {
          this.router.navigate(['/login'])
        }
      },
      complete: () => {

      },
      error: (error: any) => {
         // debugger
        alert(error?.error?.message ?? '')
      }
    })
  }
   checkPasswordsMatch() {
    if (this.password !== this.retypePassword) {
      this.registerForm.form.controls['retypePassword']
        .setErrors({'passwordMismatch': true})
    } else {
      this.registerForm.form.controls['retypePassword'].setErrors(null)
    }
  }

  checkAge() {
    if (this.dateOfBirth) {
      const today = new Date()
      const birthDate = new Date(this.dateOfBirth)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      if (age < 18) {
        this.registerForm.form.controls['dateOfBirth'].setErrors({'invalidAge': true})
      } else {
        this.registerForm.form.controls['dateOfBirth'].setErrors(null)
      }
    }
  }
}
