import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SendMailService {
  constructor(private httpClient: HttpClient) {}

  sendMail(
    to: string[],
    cc: string[],
    subject: string,
    body: {
      theClass: string;
      className: string;
      status: string;
      link: string;
    }
  ) {
    console.log({
      to: to,
      cc: cc,
      subject: subject,
      body: body,
    });
    return this.httpClient.post('http://localhost:3000/sendmail', {
      to: to,
      cc: cc,
      subject: subject,
      body: body,
    });
  }
}
