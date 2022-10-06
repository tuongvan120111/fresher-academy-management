import { RoleUser } from './../../shared/constants/common.constants';
import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import {
  ButtonType,
  ClassStatusString,
} from 'src/app/shared/constants/class-management.contants';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClassManagementService } from 'src/app/shared/services/class-management.service';
import { ClassModel } from 'src/app/shared/models/class-management.model';
import { DialogSizeSComponent } from 'src/app/components/dialog-size-s/dialog-size-s.component';

@Component({
  selector: 'app-footer-button',
  templateUrl: './footer-button.component.html',
  styleUrls: ['./footer-button.component.scss'],
})
export class FooterButtonComponent implements OnInit {
  @Input() userRole!: number;
  @Input() classManagementData!: ClassModel;

  status!: string;
  routerURI!: string;
  private dialogRef!: MatDialogRef<DialogSizeSComponent>;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private classSer: ClassManagementService
  ) {}

  ngOnInit(): void {
    this.status = this.classManagementData?.general.status;
    this.routerURI = this.router.url;
  }

  isFARec(): boolean {
    return RoleUser.FARec === this.userRole;
  }
  isTrainer(): boolean {
    return RoleUser.Trainer === this.userRole;
  }
  isClassAdmin(): boolean {
    return RoleUser.ClassAdmin === this.userRole;
  }
  isDeliveryManager(): boolean {
    return RoleUser.DeliveryManager === this.userRole;
  }

  get ClassStatusString() {
    return ClassStatusString;
  }

  get ButtonType() {
    return ButtonType;
  }

  onClickButon(name: ButtonType) {
    let confirmMessage = '';
    let status = '';
    let isShowRemarkDialog = false;

    switch (name) {
      case ButtonType.Submit:
        if (ClassStatusString.Draft !== this.status) {
          return;
        }
        confirmMessage = 'submit';
        status = ClassStatusString.Submitted;
        break;
      case ButtonType.Approve:
        if (ClassStatusString.Submitted !== this.status) {
          return;
        }
        confirmMessage = 'approve';
        status = ClassStatusString.Approved;
        break;
      case ButtonType.Reject:
        if (ClassStatusString.Submitted !== this.status) {
          return;
        }
        confirmMessage = 'reject';
        status = ClassStatusString.Rejected;
        isShowRemarkDialog = true;
        break;
      case ButtonType.Accept:
        if (ClassStatusString.Planning !== this.status) {
          return;
        }
        confirmMessage = 'accept';
        status = ClassStatusString.Approved;
        break;
      case ButtonType.Decline:
        if (ClassStatusString.Planning !== this.status) {
          return;
        }
        confirmMessage = 'decline';
        status = ClassStatusString.Declined;
        isShowRemarkDialog = true;
        break;
      case ButtonType.Start:
        if (ClassStatusString.Planned !== this.status) {
          return;
        }
        confirmMessage = 'start';
        status = ClassStatusString.Started;
        break;
      case ButtonType.Finish:
        if (ClassStatusString.InProgress !== this.status) {
          return;
        }
        confirmMessage = 'finish';
        status = ClassStatusString.Finished;
        break;
      case ButtonType.Close:
        if (ClassStatusString.Pending !== this.status) {
          return;
        }
        confirmMessage = 'close';
        status = ClassStatusString.Closed;
        break;
      case ButtonType.Request:
        if (ClassStatusString.Pending !== this.status) {
          return;
        }
        confirmMessage = 'request';
        status = ClassStatusString.Requested;
        isShowRemarkDialog = true;
        break;
      default:
        break;
    }

    console.log(123123123);
    this.dialogRef = this.dialog.open(DialogSizeSComponent, {
      width: '450px',
      data: {
        icon: ['info'],
        title: 'Confirm',
        message: `Are you sure to ${confirmMessage}?`,
        buttons: 'OK',
        iconColor: 'green',
      },
    });

    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (isShowRemarkDialog) {
          this.showRemarkDialog(status);
          return;
        }

        this.classSer.updateStatusClass(this.classManagementData, status);
      }
    });
  }

  showRemarkDialog(status: string) {
    const dialogRemarkRef = this.dialog.open(DialogSizeSComponent, {
      width: '450px',
      data: {
        icon: ['info'],
        title: 'Reason',
        message: 'Please input reason here',
        buttons: 'OK',
        iconColor: 'orange',
        isShowInputMessage: true,
      },
    });

    dialogRemarkRef.afterClosed().subscribe((result) => {
      if (result) {
        this.classSer.updateStatusClass(this.classManagementData, status, '');
      }
    });
  }
}
