import { BehaviorSubject } from 'rxjs';
import { IDatePickerOptions } from '@dch/pxs-angular-design-system';

export class TimeSlotPickerComponent implements OnInit {
  @ViewChild(DSDatePickerComponent, { static: false })
  datePicker!: DSDatePickerComponent;

  // Reactive DatePicker options
  datePickerOptionsSubject$ = new BehaviorSubject<IDatePickerOptions>({
    minDate: new Date(),
    maxDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    isSelectable: () => true
  });

  uniqueDates: string[] = [];

  constructor(private sessionStorageService: SessionStorageService) {}

  ngOnInit(): void {
    // Get timeSlots and update available dates dynamically
    const timeSlots: TimeSlot[] = this.sessionStorageService.getItem(StorageKeys.timeSlots) ?? [];
    this.uniqueDates = Array.from(new Set(timeSlots.map((slot) => slot.startTime.split('T')[0])));

    // ✅ Directly emit a new config into the observable
    this.datePickerOptionsSubject$.next({
      minDate: new Date(this.uniqueDates[0]),
      maxDate: new Date(this.uniqueDates[this.uniqueDates.length - 1]),
      isSelectable: (date: Date) => {
        const formattedDate = date.toISOString().split('T')[0];
        return this.uniqueDates.includes(formattedDate);
      }
    });
  }

  onSelectDate(dateSelection: Date[]) {
    // your existing logic
  }
}
