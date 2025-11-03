import { HttpInterceptorFn } from '@angular/common/http';
import { UsuarioHttpService } from '../services/usuario/usuario.http.service';
import { inject } from '@angular/core';
import { IUsuario } from '../services/interfaces/Usurio.interface';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const usuarioHttpService = inject(UsuarioHttpService);

  // Puede ser null o undefined, así que usamos el operador opcional
  const userdata: IUsuario | null = usuarioHttpService.getUserData?.() ?? null;
  const token = userdata?.token ?? null;

  // Si no hay token, enviamos la petición tal cual
  if (!token) {
    return next(req);
  }

  //Si hay token, clonamos la request con el header de autorización
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq).pipe();
};
