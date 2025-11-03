import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { IHistorial } from 'src/app/services/interfaces/IHistorial.interfase';


@Component({
  selector: 'app-trazabilidad-modal',
  standalone: true,
  imports: [CommonModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule],
  templateUrl: './trazabilidad-modal.component.html',
  styleUrl: './trazabilidad-modal.component.scss'
})
export class TrazabilidadModalComponent {
  displayedColumns = ['usuario', 'estadoAnterior', 'estadoNuevo', 'comentario', 'fechaCreacion'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IHistorial[],
    private dialogRef: MatDialogRef<TrazabilidadModalComponent>
  ) { 
    console.log(data);
    
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
