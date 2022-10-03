import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CDropDownComponent } from './c-drop-down.component';

describe('CDropDownComponent', () => {
  let component: CDropDownComponent;
  let fixture: ComponentFixture<CDropDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CDropDownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
