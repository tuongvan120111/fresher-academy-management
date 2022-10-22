import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageList } from 'src/app/shared/constants/message-list.constants';
import { DialogCommonData } from 'src/app/shared/models/common.model';

@Component({
  selector: 'app-dialog-size-s',
  templateUrl: './dialog-size-s.component.html',
  styleUrls: ['./dialog-size-s.component.scss'],
})
export class DialogSizeSComponent implements OnInit {
  input: string = '';
  constructor(
    private dialogRef: MatDialogRef<DialogSizeSComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogCommonData
  ) {}

  ngOnInit(): void {}

  onClosed(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(
      !!this.input ? this.input : MessageList.MSGDialogAccept
    );
  }

  inputValue(event: any) {
    this.input = event.target.value;
  }
}
