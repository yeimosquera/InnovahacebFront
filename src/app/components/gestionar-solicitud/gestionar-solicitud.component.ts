import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ISolicitud } from 'src/app/services/interfaces/Solicitud.interface';
import { MatSelectModule } from '@angular/material/select';
import { SolicitudeHttpService } from 'src/app/services/Solictudes/solicitude.http.service';
import { ICreateHistorialModel } from 'src/app/services/interfaces/ICreateHistorialModel.interfase';
import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUsuario } from 'src/app/services/interfaces/Usurio.interface';
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
  selector: 'app-gestionar-solicitud',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule],
  templateUrl: './gestionar-solicitud.component.html',
  styleUrl: './gestionar-solicitud.component.scss'
})
export class GestionarSolicitudComponent implements OnInit{

  historialForm: FormGroup;
  isCargando: boolean = false
  idestadoInicial:number = 0
  opcionesEstado = [
    { value: 1, label: 'Creada' },
    { value: 2, label: 'En Revisión' },
    { value: 3, label: 'En Curso' },
    { value: 4, label: 'Finalizada' }
  ];
  datosusuarios!: IUsuario

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GestionarSolicitudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<ISolicitud>,
    private solicitudeHttpService: SolicitudeHttpService,
    private snackBar: MatSnackBar,
    private generalService: GeneralService
  ) {
    this.historialForm = this.fb.group({
      idEstado: [Number(data?.idEstado) || 1, Validators.required],
      comentario: ['', [Validators.required, Validators.minLength(5)]],
      titulo: [{ value: data?.titulo || '', disabled: true }]
    });
    this.idestadoInicial = data?.idEstado || 0
  }

  ngOnInit(): void {
    const userData = localStorage.getItem("userData");
    if (userData) {
      this.datosusuarios = this.generalService.desencriptar(userData);
    }
  }

  guardar(): void {
    
    const request = this.historialForm.value as ICreateHistorialModel;
    request.idEstadoAnterior = this.idestadoInicial
    request.idEstadoNuevo = this.historialForm.get("idEstado")?.value ?? 0;
    request.idSolicitud = this.data.idSolicitud || 0
    request.idUsuario = this.datosusuarios.idUsuario
    
    this.solicitudeHttpService.createHistorial(request)
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


    if (this.historialForm.valid) {
      this.dialogRef.close(this.historialForm.value as ISolicitud);
    } else {
      this.historialForm.markAllAsTouched();
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  get f() {
    return this.historialForm.controls;
  }

  cmostrarErrores(errores: any[]) {
    errores.forEach(e => {
      const msg = `${e.propertyName}: ${e.errorMessage}`;
      this.snackBar.open(msg, 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
    });
  }

  mostrarErrorGeneral(error: any) {
    console.error('Error general', error);
    this.snackBar.open('Ocurrió un error inesperado al gestionar la solicitud.', 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar-error']
    });
  }
}
