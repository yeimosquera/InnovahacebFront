import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor() { }

  encriptar(dataEncriptar: any) {
    var strEncriptado = CryptoJS.AES.encrypt(
      JSON.stringify(dataEncriptar),
      environment.secretKey
    ).toString();
    return strEncriptado
  }

  desencriptar(dataDesencriptar: string) {
    if (!dataDesencriptar) return null;
    const decrypted = CryptoJS.AES.decrypt(dataDesencriptar, environment.secretKey).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  }
}
