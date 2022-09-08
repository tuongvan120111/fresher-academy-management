import { Injectable } from '@angular/core';
import { RoleUser } from '../constants/common.constants';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
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
}
