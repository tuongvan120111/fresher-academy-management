import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { CountryAllowed } from '../constants/common.constants';
import { CommonService } from './common.service';
import { HttpService } from './http.service';

export interface Country {
  alpha2Code: string;
  acronym: string;
  name: string;
  id: string
}

@Injectable({
  providedIn: 'root'
})
export class LocationsService extends HttpService {
  protected override dbPath: string = '/locations';
  protected override tutorialsRef!: AngularFirestoreCollection<any>;

  constructor(private dbInit: AngularFirestore,
    private commonSer: CommonService,
    private httpSer: HttpClient) {
    super(dbInit);
    this.tutorialsRef = dbInit.collection(this.dbPath);

    this.commonSer.getListDataFromApi(this.tutorialsRef).pipe(
      switchMap((userList) => {
        if (!userList || !userList.length) {
          return this.httpSer.get<Country[]>("https://restcountries.com/v2/all");
        } else {
          return of(false);
        }
      }),
    ).subscribe((res: boolean | Country[]) => {
      if (!res) {
        return;
      }

      const countries = res as Country[];
      const location = countries.filter((item: Country) => CountryAllowed.includes(item.alpha2Code))
      location.forEach((item: Country) => {
        const locationPipe = {
          name: item.name,
          acronym: item.alpha2Code
        }
        this.tutorialsRef.add(locationPipe)
      })
    })
  }

  getAllLocation(): Observable<Country[]> {
    return this.commonSer.getListDataFromApi(this.tutorialsRef)
  }
}
