import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService} from '../auth.service'; // Importa AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NavbarComponent,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss' ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;


  constructor(private router: Router, private fb: FormBuilder,
              private authService: AuthService) { // Usa AuthService

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next: (data) => {
          //time
          const loginTime = new Date().getTime();
          localStorage.setItem('loginTime', loginTime.toString());


          this.authService.storeUser(data.user);
          this.router.navigate(['/home']);
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Datos incorrectos, por favor verifica e intenta nuevamente.',
          });
        }
      });
    }
  }
  

  openRegister() {
    this.router.navigate(['/register']);
  }
}
