import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveReview } from './leave-review';

describe('LeaveReview', () => {
  let component: LeaveReview;
  let fixture: ComponentFixture<LeaveReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveReview],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveReview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
