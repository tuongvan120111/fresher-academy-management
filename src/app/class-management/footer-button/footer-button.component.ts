import { RoleUser } from './../../shared/constants/common.constants';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  ButtonType,
  ClassStatusString,
} from 'src/app/shared/constants/class-management.contants';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClassManagementService } from 'src/app/shared/services/class-management.service';
import { ClassModel } from 'src/app/shared/models/class-management.model';
import { DialogSizeSComponent } from 'src/app/components/dialog-size-s/dialog-size-s.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-footer-button',
  templateUrl: './footer-button.component.html',
  styleUrls: ['./footer-button.component.scss'],
})
export class FooterButtonComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  @Input() userRole!: number;
  @Input() dataClass: any;
  @Output() setLoading = new EventEmitter<boolean>();

  status!: string;
  private dialogRef!: MatDialogRef<DialogSizeSComponent>;

  isShowSubmitButton: boolean = true;
  classID: string = '';

  routerURI: string = '';

  classManagementData!: ClassModel;
  constructor(
    private dialog: MatDialog,
    private classSer: ClassManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.dataClass
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ClassModel) => {
        this.classManagementData = data;
        this.status = data.general.status;
      });
    this.routerURI = this.router.url;
    this.classID = this.route.snapshot.paramMap.get('id') || '';
    this.isShowSubmitButton =
      !this.classID || this.routerURI.includes('/update');
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
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
    let statusSubmitted = '';

    switch (name) {
      case ButtonType.Submit:
        if (ClassStatusString.Draft !== this.status) {
          return;
        }
        confirmMessage = 'submit';
        status = ClassStatusString.Submitted;
        statusSubmitted = ClassStatusString.Submitted;
        break;
      case ButtonType.Approve:
        if (ClassStatusString.Submitted !== this.status) {
          return;
        }
        confirmMessage = 'approve';
        status = ClassStatusString.Planning;
        statusSubmitted = ClassStatusString.Approved;
        break;
      case ButtonType.Reject:
        if (ClassStatusString.Submitted !== this.status) {
          return;
        }
        confirmMessage = 'reject';
        status = ClassStatusString.Rejected;
        isShowRemarkDialog = true;
        statusSubmitted = ClassStatusString.Rejected;
        break;
      case ButtonType.Accept:
        if (ClassStatusString.Planning !== this.status) {
          return;
        }
        confirmMessage = 'accept';
        status = ClassStatusString.Planned;
        statusSubmitted = ClassStatusString.Accepted;
        break;
      case ButtonType.Decline:
        if (ClassStatusString.Planning !== this.status) {
          return;
        }
        confirmMessage = 'decline';
        status = ClassStatusString.Declined;
        isShowRemarkDialog = true;
        statusSubmitted = ClassStatusString.Declined;
        break;
      case ButtonType.Start:
        if (ClassStatusString.Planned !== this.status) {
          return;
        }
        confirmMessage = 'start';
        status = ClassStatusString.InProgress;
        statusSubmitted = ClassStatusString.Started;
        break;
      case ButtonType.Finish:
        if (ClassStatusString.InProgress !== this.status) {
          return;
        }
        confirmMessage = 'finish';
        status = ClassStatusString.Pending;
        statusSubmitted = ClassStatusString.Finished;
        break;
      case ButtonType.Close:
        if (ClassStatusString.Pending !== this.status) {
          return;
        }
        confirmMessage = 'close';
        status = ClassStatusString.Closed;
        statusSubmitted = ClassStatusString.Closed;
        break;
      case ButtonType.Request:
        if (ClassStatusString.Pending !== this.status) {
          return;
        }
        confirmMessage = 'request';
        status = ClassStatusString.Requested;
        isShowRemarkDialog = true;
        statusSubmitted = ClassStatusString.Requested;
        break;
      case ButtonType.Cancel:
        if (
          ClassStatusString.Draft !== this.status &&
          ClassStatusString.Submitted !== this.status
        ) {
          return;
        }
        confirmMessage = 'cancel';
        status = ClassStatusString.Canceled;
        statusSubmitted = ClassStatusString.Canceled;
        break;
      default:
        break;
    }

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

    this.dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (result) => {
        if (result) {
          if (isShowRemarkDialog) {
            this.showRemarkDialog(status);
            return;
          }
          this.setLoading.emit();

          console.log(status);
          await this.classSer.updateStatusClass(
            this.classID,
            this.classManagementData,
            status,
            statusSubmitted
          );
          this.setLoading.emit(false);

          this.notificationService.success('Update successfully');
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

    dialogRemarkRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (result) => {
        if (result) {
          this.setLoading.emit();
          await this.classSer.updateStatusClass(
            this.classID,
            this.classManagementData,
            status,
            result
          );
          this.setLoading.emit(false);
          this.notificationService.success('Update successfully');
        }
      });
  }
}
