import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TimeSlotPickerComponent } from './time-slot-picker.component';
import { DSDatePickerComponent } from '@dch/pxs-angular-design-system';
import { McseService, SessionStorageService } from '@app_services';
import { ChangeDetectorRef } from '@angular/core';

describe('TimeSlotPickerComponent', () => {
  let component: TimeSlotPickerComponent;
  let fixture: ComponentFixture<TimeSlotPickerComponent>;
  let mockDatePicker: jasmine.SpyObj<DSDatePickerComponent>;
  let mockSession: jasmine.SpyObj<SessionStorageService>;
  let mockCdr: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(() => {
    mockDatePicker = jasmine.createSpyObj('DSDatePickerComponent', ['selectDate'], {
      isSelectable: jasmine.createSpy('isSelectable')
    });

    mockSession = jasmine.createSpyObj('SessionStorageService', ['getItem']);
    mockCdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    TestBed.configureTestingModule({
      declarations: [TimeSlotPickerComponent],
      providers: [
        { provide: McseService, useValue: {} },
        { provide: SessionStorageService, useValue: mockSession },
        { provide: ChangeDetectorRef, useValue: mockCdr }
      ]
    });

    fixture = TestBed.createComponent(TimeSlotPickerComponent);
    component = fixture.componentInstance;
  });

  // ✅ Positive case — when datePicker is defined
  it('should initialize uniqueDates, override isSelectable, and select first available date', fakeAsync(() => {
    component.datePicker = mockDatePicker;
    mockSession.getItem.and.returnValue([
      { startTime: '2025-10-18T08:00:00Z' },
      { startTime: '2025-10-19T10:00:00Z' },
      { startTime: '2025-10-18T09:00:00Z' }
    ]);

    spyOn(component, 'onSelectDate');

    // Run lifecycle method
    component.ngAfterViewInit();
    tick(); // flush setTimeout

    // ✅ uniqueDates are extracted correctly
    expect(component.uniqueDates).toEqual(['2025-10-18', '2025-10-19']);

    // ✅ isSelectable overridden and works for enabled date
    const testDate = new Date('2025-10-18T00:00:00Z');
    const result = (component.datePicker.isSelectable as any)(testDate, null);
    expect(result).toBeTrue();

    // ✅ isSelectable returns false for non-matching date
    const badDate = new Date('2025-11-01T00:00:00Z');
    const result2 = (component.datePicker.isSelectable as any)(badDate, null);
    expect(result2).toBeFalse();

    // ✅ selectDate, onSelectDate, and detectChanges called
    expect(mockDatePicker.selectDate).toHaveBeenCalledWith(new Date('2025-10-18'));
    expect(component.onSelectDate).toHaveBeenCalledWith([new Date('2025-10-18')]);
    expect(mockCdr.detectChanges).toHaveBeenCalled();
  }));

  // ✅ Negative case — when datePicker is not defined
  it('should gracefully skip logic if datePicker is undefined', () => {
    component.datePicker = undefined as any;
    mockSession.getItem.and.returnValue([]);

    // Should not throw any error
    expect(() => component.ngAfterViewInit()).not.toThrow();

    // Nothing should be modified
    expect(component.uniqueDates).toEqual([]);
    expect(mockCdr.detectChanges).not.toHaveBeenCalled();
  });
});
