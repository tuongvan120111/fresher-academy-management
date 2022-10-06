import { Injectable } from '@angular/core';
import readXlsxFile from 'read-excel-file';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  getFileData(input: File) {
    const schema = {
      position: {
        prop: 'position',
        type: String,
      },
      skill: {
        prop: 'skill',
        type: String,
      },
    };

    return readXlsxFile(input, { schema });
  }
}
