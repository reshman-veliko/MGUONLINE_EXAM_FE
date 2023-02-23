import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor(private dataService: DataService) { }

  encryptUsingAES256(encString: string): string {
    let _key = CryptoJS.enc.Utf8.parse(this.dataService.encrypetionToken);
    let _iv = CryptoJS.enc.Utf8.parse(this.dataService.encrypetionToken);
    let encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(encString), _key, {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
    return encrypted.toString();
  }
  decryptUsingAES256(decString: string): string {
    let _key = CryptoJS.enc.Utf8.parse(this.dataService.encrypetionToken);
    let _iv = CryptoJS.enc.Utf8.parse(this.dataService.encrypetionToken);

    let decrypted = CryptoJS.AES.decrypt(
      decString, _key, {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);
    return decrypted.toString();
  }

  DecryptEncryption(array: any, masterElementFields: string[], subElementFields: string[] ,imgField:string[]): any {
    if (array.length > 0) {
      array.forEach(masterElement => {
        masterElementFields.forEach(masterField => {
          masterElement[masterField] = this.decryptUsingAES256(masterElement[masterField]).replace(/"/g,'');
        });

        imgField.forEach(masterField => {
          masterElement[masterField] = this.decryptUsingAES256(masterElement[masterField]).replace(/"/g,'');
        });
        masterElement.options.forEach(subElement => {
          subElementFields.forEach(subElementField => {
            subElement[subElementField] = this.decryptUsingAES256(subElement[subElementField]).replace(/"/g,'');
          });
        });
      });

      return array;
    }
  }

}
