import { Injectable } from '@angular/core';
import readXlsxFile from 'read-excel-file';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  async getFileData(input: File) {
    const schema = {
      'Type of Class': {
        prop: 'typeOfClass',
        type: String,
      },
      'Skill of Class': {
        prop: 'skillOfClass',
        type: String,
      },
      Position: {
        prop: 'position',
        type: String,
      },
    };

    const json = await readXlsxFile(input, { schema });
    let {
      typeOfClass = 'Fresher',
      skillOfClass = 'Java',
      position = 'Developer',
    } = json.rows[0] as {
      typeOfClass: string;
      skillOfClass: string;
      position: string;
    };
    switch (typeOfClass?.toLowerCase()) {
      case 'fresher':
        typeOfClass = 'FR';
        break;
      case 'campus link':
        typeOfClass = 'CP';
        break;
      default:
        typeOfClass = 'FR';
        break;
    }

    return { typeOfClass, skillOfClass, position };
  }
}
