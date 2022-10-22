import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  DocumentChangeAction,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, map, Observable, of, take } from 'rxjs';
import { Loclastorage, RoleUser } from '../constants/common.constants';
import { Authentications } from '../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  loginSignal$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  getRoleUserString(role: RoleUser): string {
    switch (role) {
      case RoleUser.FAManager:
        return 'FA. Manager';
      case RoleUser.DeliveryManager:
        return 'Delivery Manager';
      case RoleUser.ClassAdmin:
        return 'Class Admin';
      case RoleUser.FARec:
        return 'FA. Rec';
      case RoleUser.Trainer:
        return 'Trainer';
      case RoleUser.SystemAdmin:
        return 'System Admin';
      default:
        return 'Trainee';
    }
  }

  getRoleUserLogin(role: RoleUser): string {
    switch (role) {
      case RoleUser.FAManager:
        return 'fam';
      case RoleUser.DeliveryManager:
        return 'dm';
      case RoleUser.ClassAdmin:
        return 'ca';
      case RoleUser.FARec:
        return 'fr';
      case RoleUser.Trainer:
        return 'trainer';
      case RoleUser.SystemAdmin:
        return 'sa';
      default:
        return 'trainee';
    }
  }

  async digestMessage(message: string) {
    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(''); // convert bytes to hex string
    return hashHex;
  }

  getListDataFromApi(
    collection: AngularFirestoreCollection<any>
  ): Observable<any[]> {
    return collection.snapshotChanges().pipe(
      map((changes: DocumentChangeAction<any>[]) => {
        const data = changes.map((c) => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data(),
        }));
        return data;
      }),
      take(1)
    );
  }

  getCurrentUser(): Authentications | undefined {
    const user = localStorage.getItem(Loclastorage.UserLogin);
    if (!user) {
      return undefined;
    }

    return JSON.parse(user || '');
  }

  getTwoDigitYear(date: Date): string {
    return date.getFullYear().toString().slice(-2);
  }
}
