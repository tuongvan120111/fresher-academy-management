import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  downloadURL!: Observable<string>;
  constructor(private storage: AngularFireStorage) {}

  uploadFile(file: File) {
    const filename = uuidv4() + '.' + file.name.split('.').pop();
    const filePath = `class-managment/${filename}`;

    this.storage
      .upload(filePath, file)
      .snapshotChanges()
      .subscribe(() => {});

    return filename;
  }
}
