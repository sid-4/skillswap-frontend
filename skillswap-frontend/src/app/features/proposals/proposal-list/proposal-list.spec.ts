import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalList } from './proposal-list';

describe('ProposalList', () => {
  let component: ProposalList;
  let fixture: ComponentFixture<ProposalList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProposalList],
    }).compileComponents();

    fixture = TestBed.createComponent(ProposalList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
