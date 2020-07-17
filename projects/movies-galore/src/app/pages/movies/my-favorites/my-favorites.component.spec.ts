import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFavoritesComponent } from './my-favorites.component';

describe('MyFavoritesComponent', () => {
  let component: MyFavoritesComponent;
  let fixture: ComponentFixture<MyFavoritesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFavoritesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
