import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageList } from '../shared/constants/message-list.constants';
import { PrepareUserAccountService } from '../shared/services/prepare-user-account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userName!: string;
  passWd!: string;
  isCollapse: boolean = false;
  messError!: string;
  panelOpenState: boolean = false;

  constructor(private userSer: PrepareUserAccountService, private router: Router) { }

  ngOnInit(): void {
  }

  onLogin(): void {
    if (!this.userName) {
      this.messError = MessageList.MSG2;
      return;
    }

    if (!this.passWd) {
      this.messError = MessageList.MSG3;
      return;
    }

    this.userSer.getAccountUserLogin(this.userName, this.passWd).subscribe((msg: string) => {
      if (msg !== MessageList.MSGSuccess) {
        this.messError = msg;
      } else {
        this.router.navigateByUrl('dashboard')
      }
    });
  }

  onReset(): void {
    this.userName = null!;
    this.passWd = null!;
    this.messError = null!;
  }

  onMore(): void {
    this.panelOpenState = !this.panelOpenState
  }

}
