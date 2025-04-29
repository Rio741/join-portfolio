import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucessButtonDialogComponent } from './sucess-button-dialog.component';

describe('SucessButtonDialogComponent', () => {
  let component: SucessButtonDialogComponent;
  let fixture: ComponentFixture<SucessButtonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucessButtonDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SucessButtonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
