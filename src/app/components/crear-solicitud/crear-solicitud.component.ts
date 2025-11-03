import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SolicitudeHttpService } from 'src/app/services/Solictudes/solicitude.http.service';
import { ISolicitud } from 'src/app/services/interfaces/Solicitud.interface';
import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralService } from 'src/app/services/general/general.service';
import { IUsuario } from 'src/app/services/interfaces/Usurio.interface';

@Component({
  selector: 'app-crear-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.scss']
})
export class CrearSolicitudComponent implements OnInit {
  solicitudForm: FormGroup;
  isCargando: boolean = false
  datosusuarios!: IUsuario

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrearSolicitudComponent>,
    private solicitudeHttpService: SolicitudeHttpService,
    private snackBar: MatSnackBar,
    private generalService: GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.solicitudForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    const userData = localStorage.getItem("userData");
    if (userData) {
      this.datosusuarios = this.generalService.desencriptar(userData);
    }
    if (this.data?.idSolicitud) {
      this.cargarSolicitud(this.data.idSolicitud);
    }
  }

  guardar() {
    if (this.solicitudForm.invalid) return;
    const request = this.solicitudForm.value as ISolicitud;
    this.isCargando = true;
    request.idUsuarioSolicitante = this.datosusuarios.idUsuario
    if (this.data?.idSolicitud) { // Editar
      request.idSolicitud = this.data?.idSolicitud
      this.solicitudeHttpService.update(request)
        .pipe(finalize(() => this.isCargando = false))
        .subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            // Si el backend devuelve errores de validación
            if (error.status === 400 && error.error?.data?.length) {
              const errores = error.error.data;
              this.cmostrarErrores(errores);
            } else {
              this.mostrarErrorGeneral(error);
            }
          }
        });
    } else { // Guardar
      this.solicitudeHttpService.create(request)
        .pipe(finalize(() => this.isCargando = false))
        .subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            // Si el backend devuelve errores de validación
            if (error.status === 400 && error.error?.data?.length) {
              const errores = error.error.data;
              this.cmostrarErrores(errores);
            } else {
              this.mostrarErrorGeneral(error);
            }
          }
        });
    }
  }


  cancelar() {
    this.dialogRef.close();
  }

  cmostrarErrores(errores: any[]) {
    errores.forEach(e => {
      const msg = `${e.propertyName}: ${e.errorMessage}`;
      this.snackBar.open(msg, 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
    });
  }

  mostrarErrorGeneral(error: any) {
    console.error('Error general', error);
    this.snackBar.open('Ocurrió un error inesperado al crear la solicitud.', 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar-error']
    });
  }

  cargarSolicitud(id: number): void {
    this.isCargando = true;

    this.solicitudeHttpService.getSolicitudById(id)
      .pipe(finalize(() => this.isCargando = false))
      .subscribe({
        next: (response) => {
          if (response.sucess) {
            this.solicitudForm.patchValue({
              titulo: response.data.titulo,
              descripcion: response.data.descripcion
            });
          }
        },
        error: (err) => {
          console.error('Error al obtener las solicitudes:', err);
        }
      });
  }

}
