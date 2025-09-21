import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserResponse } from '../../res/user.response';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { UpdateUserDTO } from '../../dtos/user.update.dto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  userResponse?: UserResponse
  userProfileForm: FormGroup
  token: string = ''

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private tokenService: TokenService,
    private toastr: ToastrService,
  ) {
    this.userProfileForm = this.formBuilder.group({
      fullname: [''],
      address: ['', [Validators.minLength(3)]],
      password: ['', [Validators.minLength(6)]],
      retype_password: ['', [Validators.minLength(6)]],
      date_of_birth: [Date.now()]
    }, {
      validators: this.passwordMatchValidator// Custom validator function for password match
    })
  }
  ngOnInit(): void {
    this.token = this.tokenService.getToken()
    debugger
    this.userService.getUserDetail(this.token).subscribe({
      next: (response: any) => {
        // debugger
        this.userResponse = {
          ...response,
          date_of_birth: new Date(response.date_of_birth)
        }
        this.userProfileForm.patchValue({
          fullname: this.userResponse?.fullname ?? '',
          address: this.userResponse?.address ?? '',
          date_of_birth: this.userResponse?.date_of_birth.toISOString().substring(0, 10)
        })
        this.userService.saveUserResponseToLs(this.userResponse)
      },
      complete: () => {
        // debugger;
      },
      error: (error: any) => {
        // debugger;
        alert(error.error.message)
      }
    })
  }
  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value
      const retypedPassword = formGroup.get('retype_password')?.value
      if (password !== retypedPassword) {
        return { passwordMismatch: true }
      }
      return null
    }
  }
  save(): void {
    if (this.userProfileForm.valid) {
      const updateUserDTO: UpdateUserDTO = {
        fullname: this.userProfileForm.get('fullname')?.value,
        address: this.userProfileForm.get('address')?.value,
        password: this.userProfileForm.get('password')?.value,
        retype_password: this.userProfileForm.get('retype_password')?.value,
        date_of_birth: this.userProfileForm.get('date_of_birth')?.value
      }
      this.userService.updateUser(this.token, updateUserDTO).subscribe({
        next: () => {

        },
        complete: () => {

        },
        error(err) {

        },
      })
    } else {
      if (this.userProfileForm.hasError('passwordMismatch')) {
        this.toastr.error('Something went wrongs..', 'password not match!', {
          timeOut: 3000,
        });
      }
    }
  }
}
