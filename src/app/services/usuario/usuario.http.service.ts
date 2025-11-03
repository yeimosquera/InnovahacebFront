import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { IResponseApi } from '../interfaces/ResponseApi.interface';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class UsuarioHttpService {
  private _api: string;
  key = CryptoJS.enc.Utf8.parse('1234567890123456');
  iv = CryptoJS.enc.Utf8.parse('1234567890123456');

  constructor(private http: HttpClient) {
    this._api = `${environment.base_url_api}/api/v1/Usuario`;
  }

  login(usuario: string, contrasena: string) {
    const body = {
      correo: usuario,
      contrasena: contrasena
    };
    return this.http.post<IResponseApi>(`${this._api}/login`, body);
  }

  getUserData() {
    const encrypted = localStorage.getItem('userData');
    if (!encrypted) return null;
    const decrypted = CryptoJS.AES.decrypt(encrypted, environment.secretKey).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  }

  encryptAES(text: string): string {
    const encrypted = CryptoJS.AES.encrypt(text, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

}
