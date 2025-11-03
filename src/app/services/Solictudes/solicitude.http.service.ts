import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IResponseApi } from '../interfaces/ResponseApi.interface';
import { ISolicitud } from '../interfaces/Solicitud.interface';
import { ICreateHistorialModel } from '../interfaces/ICreateHistorialModel.interfase';

@Injectable({
  providedIn: 'root'
})
export class SolicitudeHttpService {

  private _api: string;

  constructor(private http: HttpClient) {
    this._api = `${environment.base_url_api}/api/v1/Solicitud`;
  }

  getSolicitudes(): Observable<IResponseApi> {
    return this.http.get<IResponseApi>(`${this._api}/list-solicitud`);
  }

  create(request: ISolicitud): Observable<IResponseApi> {
    return this.http.post<IResponseApi>(`${this._api}/create-solicitud`, request);
  }

  getSolicitudById(idSolicitud: number) {
    return this.http.get<IResponseApi>(`${this._api}/get-solicitudById/${idSolicitud}`);
  }

  update(request: ISolicitud): Observable<IResponseApi> {
    return this.http.put<IResponseApi>(`${this._api}/update-solicitud`, request);
  }

  detelete(idsolitud: number): Observable<IResponseApi> {
    return this.http.delete<IResponseApi>(`${this._api}/delete-solicitud/${idsolitud}`);
  }

  createHistorial(request: ICreateHistorialModel): Observable<IResponseApi> {
    return this.http.post<IResponseApi>(`${this._api}/create-historial`, request);
  }

  getHistorialSolicitudById(idSolicitud: number) {
    return this.http.get<IResponseApi>(`${this._api}/get-trasabilidad-solicitudById/${idSolicitud}`);
  }

  

}
