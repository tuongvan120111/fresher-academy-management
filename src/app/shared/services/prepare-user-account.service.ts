import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { forkJoin, from, map, Observable, of, switchMap } from 'rxjs';
import { ListRoleuser, Loclastorage, RoleUser } from '../constants/common.constants';
import { MessageList } from '../constants/message-list.constants';
import { Authentications, LoginInfor } from '../models/common.model';
import { CommonService } from './common.service';
import { HttpService } from './http.service';


@Injectable({
  providedIn: 'root'
})
export class PrepareUserAccountService extends HttpService {

  protected override dbPath: string = '/authentications';
  protected override tutorialsRef!: AngularFirestoreCollection<any>;

  private rolesList: Authentications[] = ListRoleuser.map((role: RoleUser) => {
    return {
      role: role,
      isLogged: false,
      buzUnit: '',
      fullName: ''
    }
  });

  private userName: string[] = ['van', 'linh', 'nguyen', 'hoang']
  private passHash!: string;

  constructor(private dbInit: AngularFirestore,
    private commonSer: CommonService) {
    super(dbInit);
    this.tutorialsRef = dbInit.collection(this.dbPath);

    this.commonSer.getListDataFromApi(this.tutorialsRef).pipe(
      switchMap((userList) => {
        if (!userList || !userList.length) {
          return of(true);
        } else {
          return of(false);
        }
      })
    ).subscribe((res: boolean) => {
      if (!res) {
        return;
      }

      this.getInitUserName().forEach((item: Authentications, index: number) => {
        this.tutorialsRef.add(item);
      })
    })

    from(this.commonSer.digestMessage('Abc@123')).subscribe((pass: string) => this.passHash = pass);
  }

  getAccountUserLogin(userName: string, passWd: string): Observable<string> {
    return this.commonSer.getListDataFromApi(this.tutorialsRef).pipe(switchMap((userList: Authentications[]) => {
      const userLogin = userList.find((user: Authentications) => user.userName === userName);
      if (!userLogin) {
        return of(MessageList.MSG1);
      }

      return from(this.commonSer.digestMessage(passWd)).pipe(map((passWdHashed: string) => {
        if (this.passHash === passWdHashed) {
          userLogin.isLogged = true;
          localStorage.setItem(Loclastorage.UserLogin, JSON.stringify(userLogin))
          this.commonSer.loginSignal$.next(true)
          this.tutorialsRef.doc(userLogin.id).update({ isLogged: true });
          return MessageList.MSGSuccess;
        } else {
          return MessageList.MSG1;
        }
      }));
    }))
  }

  logout(): void {
    const userLogin = this.commonSer.getCurrentUser();
    if (userLogin) {
      this.tutorialsRef.doc(userLogin.id).update({ isLogged: false });
      localStorage.removeItem(Loclastorage.UserLogin)
      this.commonSer.loginSignal$.next(false)
    }
  }

  private getInitUserName(): Authentications[] {
    return this.userName.reduce((list: Authentications[], userName: string) => {
      const rolesTemp = JSON.parse(JSON.stringify(this.rolesList));

      rolesTemp.forEach((item: Authentications) => {
        const userNameConvert = userName + '_' + this.commonSer.getRoleUserLogin(item.role)
        item.userName = userNameConvert;
        item.passWd = this.passHash;
        switch (userName) {
          case this.userName[0]:
            item.fullName = 'Tăng Tường Vân';
            break;
          case this.userName[1]:
            item.fullName = 'Nguyễn Văn Linh';
            break;
          case this.userName[2]:
            item.fullName = 'Bui Si Nguyen';
            break;
          case this.userName[3]:
            item.fullName = 'Phan Thanh Hoang';
            break;
        }

        switch (item.role) {
          case RoleUser.FAManager:
            item.buzUnit = 'FHM.FAM';
            break;
          case RoleUser.DeliveryManager:
            item.buzUnit = 'FHM.DM';
            break;
          case RoleUser.ClassAdmin:
            item.buzUnit = 'FHM.CA';
            break;
          case RoleUser.FARec:
            item.buzUnit = 'FHM.FR';
            break;
          case RoleUser.Trainer:
            item.buzUnit = 'FHM.Trainer';
            break;
          case RoleUser.SystemAdmin:
            item.buzUnit = 'FHM.SA';
            break;
          default:
            item.buzUnit = 'FHM.EC';
            break;
        }
      })

      list = list.concat(rolesTemp);
      return list;
    }, [])
  }
}
