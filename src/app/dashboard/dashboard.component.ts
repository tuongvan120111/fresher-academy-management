import { Component, OnInit } from '@angular/core';
import { map, Observable, timer } from 'rxjs';
import { DashboardFilter, SelectedItem } from '../shared/models/common.model';
import { Country, LocationsService } from '../shared/services/locations.service';
import { ClearStr, DashboardForEnum, DashboardForStr, StatusEnum, StatusStr, TypeDashboardEnum, TypeDashboardStr } from './dashboard.constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  TypeDashboardEnum = TypeDashboardEnum;
  dashboardFors: SelectedItem[] = []
  locations!: SelectedItem[];
  typeDashboards: SelectedItem[] = []
  status: SelectedItem[] = []

  itemLocation!: any;
  itemDashboard!: any;
  itemType!: any;
  itemStatus!: any;
  isLoading = false;

  private filterCond: DashboardFilter = {
    dashboard: '',
    location: '',
    type: '',
    status: ''
  };

  private timerLoading: Observable<number> = new Observable<number>();

  constructor(private locationSer: LocationsService) { }

  ngOnInit(): void {

    this.getInitDate();
    this.locationSer.getAllLocation().subscribe((item: Country[]) => {
      setTimeout(() => {
        this.locations = item.map((location: Country) => {
          return {
            id: location.id,
            isDisable: false,
            name: location.name
          }
        })

        this.locations = this.locations.sort((a: SelectedItem, b: SelectedItem) => a.name.localeCompare(b.name));

        this.locations.unshift({
          id: StatusEnum.All.toString(),
          isDisable: false,
          name: StatusStr.All
        })

        this.locations.push({
          id: ClearStr,
          isDisable: false,
          name: ClearStr
        })

        if (this.locations && this.locations.length > 0) {
          this.itemLocation = this.locations[0]
        }
      }, 500);
    })
  }

  onChangeDashboardFor(item: SelectedItem): void {
    if (item.name === ClearStr) {
      this.itemDashboard = null;
      setTimeout(() => {
        this.itemDashboard = this.dashboardFors[0]
        this.filterCond.dashboard = this.itemDashboard.id
        this.onChangeFilter();
      });
    } else {
      this.itemDashboard = item;
      this.onChangeFilter();
    }

  }

  onChangeLocation(item: SelectedItem): void {
    if (item.name === ClearStr) {
      this.itemLocation = null;
      setTimeout(() => {
        this.itemLocation = this.locations[0]
        this.filterCond.location = this.itemLocation.id
        this.onChangeFilter();
      });
    } else {
      this.itemLocation = item;
      this.onChangeFilter();
    }
  }

  onChangeType(item: SelectedItem): void {
    if (item.name === ClearStr) {
      this.itemType = null;
      setTimeout(() => {
        this.itemType = this.typeDashboards[0]
        this.filterCond.type = this.itemType.id
        this.onChangeFilter();
      });
    } else {
      this.itemType = item;
      this.onChangeFilter();
    }
  }

  onChangeStatus(item: SelectedItem): void {
    if (item.name === ClearStr) {
      this.itemStatus = null;
      setTimeout(() => {
        this.itemStatus = this.status[0]
        this.filterCond.status = this.itemStatus.id
        this.onChangeFilter();
      });
    } else {
      this.itemStatus = item;
      this.onChangeFilter();
    }
  }

  private getInitDate(): void {
    this.dashboardFors = [
      {
        id: DashboardForEnum.Class.toString(),
        isDisable: false,
        name: DashboardForStr.Class
      },
      {
        id: DashboardForEnum.Candidate.toString(),
        isDisable: false,
        name: DashboardForStr.Candidate
      },
      {
        id: DashboardForEnum.Trainee.toString(),
        isDisable: false,
        name: DashboardForStr.Trainee
      },
      {
        id: DashboardForEnum.Trainer.toString(),
        isDisable: false,
        name: DashboardForStr.Trainer
      },
      {
        id: ClearStr,
        isDisable: false,
        name: ClearStr
      }
    ]
    this.itemDashboard = this.dashboardFors[0];

    this.typeDashboards = [
      {
        id: TypeDashboardEnum.Table.toString(),
        isDisable: false,
        name: TypeDashboardStr.Table
      },
      {
        id: TypeDashboardEnum.Chart.toString(),
        isDisable: false,
        name: TypeDashboardStr.Chart
      },
      {
        id: ClearStr,
        isDisable: false,
        name: ClearStr
      }
    ]
    this.itemType = this.typeDashboards[0]

    this.status = [
      {
        id: StatusEnum.All.toString(),
        isDisable: false,
        name: StatusStr.All
      },
      {
        id: StatusEnum.Pass.toString(),
        isDisable: false,
        name: StatusStr.Pass
      },
      {
        id: StatusEnum.Failed.toString(),
        isDisable: false,
        name: StatusStr.Failed
      },
      {
        id: ClearStr,
        isDisable: false,
        name: ClearStr
      }
    ]
    this.itemStatus = this.status[0]
  }

  private onChangeFilter(): void {
    console.log('filter', this.filterCond);
    this.isLoading = true
    setTimeout(() => {
      this.isLoading = false
    }, 1000);
  }

}
