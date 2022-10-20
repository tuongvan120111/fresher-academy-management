import { Injectable } from "@angular/core";
import firebase from "firebase/compat/app";
import * as moment from "moment";
import { IFirebaseDate } from "../model/candidate.interface";
import firestore = firebase.firestore;

@Injectable({
  providedIn: "root",
})
export class UtilService {
  constructor() {}

  _formatTime(value: IFirebaseDate): Date {
    return new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
  }

  _formatFirebaseDate(date: string | Date) {
    let momentDate;
    if (typeof date === "string") {
      momentDate = moment(date).toDate();
    } else {
      momentDate = date;
    }
    return firestore.Timestamp.fromDate(momentDate);
  }

  _generateAccountName(name: string): string {
    let accountName: any = name.split(" ");
    const lastName = accountName.pop();
    accountName.unshift(lastName);
    for (let i = 1; i < accountName.length; i++) {
      accountName[i] = accountName[i][0].toUpperCase();
    }
    accountName = accountName.join("");
    return accountName;
  }
}
