import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UsuarioHttpService } from 'src/app/services/usuario/usuario.http.service';
import { SolicitudeHttpService } from 'src/app/services/Solictudes/solicitude.http.service';
import { finalize } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CrearSolicitudComponent } from '../../crear-solicitud/crear-solicitud.component';
import Swal from 'sweetalert2';
import { IUsuario } from 'src/app/services/interfaces/Usurio.interface';
import { GeneralService } from 'src/app/services/general/general.service';
import { GestionarSolicitudComponent } from '../../gestionar-solicitud/gestionar-solicitud.component';
import { ISolicitud } from 'src/app/services/interfaces/Solicitud.interface';
import { IHistorial } from 'src/app/services/interfaces/IHistorial.interfase';
import { TrazabilidadModalComponent } from '../../trazabilidad-modal/trazabilidad-modal.component';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatTableModule,
    MatCardModule,
    MatButtonModule,
    HttpClientModule,
    DatePipe,
    MatIcon
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  isCargando: boolean = false
  datosusuarios!: IUsuario

  constructor(private usuarioHttpService: UsuarioHttpService,
    private solicitudeHttpService: SolicitudeHttpService,
    private dialog: MatDialog,
    private generalService: GeneralService
  ) {

  }

  displayedColumns: string[] = ['idSolicitud', 'titulo', 'descripcion', 'fechaCreacion', 'acciones'];
  dataSource = [];

  ngOnInit(): void {
    const userData = localStorage.getItem("userData");
    if (userData) {
      this.datosusuarios = this.generalService.desencriptar(userData);
    }
    this.getSolicitudes()
  }

  getSolicitudes() {
    this.isCargando = true;
    this.dataSource = []
    this.solicitudeHttpService.getSolicitudes()
      .pipe(finalize(() => this.isCargando = false))
      .subscribe({
        next: (response) => {

          if (response.sucess) {
            this.dataSource = response.data;
          }
        },
        error: (err) => {
        }
      });
  }

  eliminarSolicitud(idSolicitud: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la solicitud de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isCargando = true;

        this.solicitudeHttpService.detelete(idSolicitud)
          .pipe(finalize(() => this.isCargando = false))
          .subscribe({
            next: (response) => {
              if (response.sucess) {
                Swal.fire({
                  title: 'Eliminado',
                  text: 'La solicitud fue eliminada correctamente.',
                  icon: 'success',
                  timer: 2000,
                  showConfirmButton: false
                });
                this.getSolicitudes(); // refresca la lista
              } else {
                Swal.fire('Error', 'No se pudo eliminar la solicitud.', 'error');
              }
            },
            error: (err) => {
              Swal.fire('Error', 'Ocurrió un error al eliminar la solicitud.', 'error');
              console.error('Error al eliminar la solicitud:', err);
            }
          });
      }
    });
  }

  verComentarios(idSolicitud: number): void {
    this.solicitudeHttpService.getHistorialSolicitudById(idSolicitud)
      .pipe(finalize(() => this.isCargando = false))
      .subscribe({
        next: (response) => {
          if (response.sucess) {           
            this.abrirTrazabilidad(response.data) 
          }
        },
        error: (err) => {
          console.error('Error al obtener las solicitudes:', err);
        }
      });
      
  }

  gestionarSolicitud(Solicitud: ISolicitud): void {
    
    const dialogRef = this.dialog.open(GestionarSolicitudComponent, {
      width: '800px',
      disableClose: true,
      data:  Solicitud
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSolicitudes()
      }
    });
  }

  crearSolicitud() {
    const dialogRef = this.dialog.open(CrearSolicitudComponent, {
      width: '800px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSolicitudes()
      }
    });
  }

  editarSolicitud(idSolicitud: number) {
    const dialogRef = this.dialog.open(CrearSolicitudComponent, {
      width: '800px',
      disableClose: true,
      data: { idSolicitud }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSolicitudes()
      }
    });
  }

  abrirTrazabilidad(data: IHistorial[]) {
    this.dialog.open(TrazabilidadModalComponent, {
      width: '1100px',
      data,
    });
  }
}
