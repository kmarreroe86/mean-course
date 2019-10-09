import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

/**
 * If the validator returns null then is valid, otherwise should return an array of
 *  key value pairs of errors (null means valid)
 */
export function mimeTypeImageSyncValidator(control: AbstractControl): { [key: string]: any | null } {
  return null;
}


export function mimeTypeImageAsyncValidator(control: AbstractControl):
  Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> {

  const file = control.value as File;
  const fileReader = new FileReader();
  const fileReaderObservable = Observable.create((observer: Observer<{ [key: string]: any }>) => {
    fileReader.addEventListener('loadend', () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4); // Access to the mimetype information

      let header = '';
      let isValid = false;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }

      switch (header) {
        case '89504e47': // png
          isValid = true;
          break;
        case 'ffd8ffe0': // jpg, jpeg
        case 'ffd8ffe1': // jpg, jpeg
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          isValid = true;
          break;
        default:
          isValid = false; // Or you can use the blob.type as fallback
          break;
      }
      if (isValid) {
        observer.next(null);
      } else {
        observer.next({ invalidMimeType: true });
      }

      observer.complete();
    });

    fileReader.readAsArrayBuffer(file); // Read the file, fire loadend event when its done
  });

  return fileReaderObservable;
}
