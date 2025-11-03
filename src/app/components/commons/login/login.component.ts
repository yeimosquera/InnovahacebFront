import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { UsuarioHttpService } from 'src/app/services/usuario/usuario.http.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  hidePassword = true;
  loginForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioHttpService,
    private router: Router,
    private generalService: GeneralService) {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos antes de continuar',
        confirmButtonColor: '#1976d2'
      });
      return;
    }

    const { usuario, contrasena } = this.loginForm.value;

    Swal.fire({
      title: 'Iniciando sesión...',
      text: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.usuarioService.login(usuario, contrasena).subscribe({
      next: (response) => {
        Swal.close();

        if (response.sucess && response.statusCode == 200) {
          const userData = response.data;
          const encryptedData = this.generalService.encriptar(userData)

          localStorage.setItem('userData', encryptedData);

          Swal.fire({
            icon: 'success',
            title: 'Bienvenido',
            text: `Hola, ${userData.nombre}!`,
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/bandejas']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Credenciales inválidas',
            text: 'Usuario o contraseña incorrectos.'
          });
        }
      },
      error: () => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error del servidor',
          text: 'No se pudo conectar al servidor. Intente nuevamente.'
        });
      }
    });
  }
}