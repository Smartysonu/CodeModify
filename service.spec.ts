import { Subject } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

it('TRUE path → iframe open + non-empty expandcbIconText → chatIconText=true & class removed', fakeAsync(() => {
  // 1) wire a hot stream so ngOnInit subscription actually runs
  const incoming$ = new Subject<any>();
  (component as any).observableService = { currentIncomingMessages$: incoming$ } as any;

  // 2) DOM element returned by querySelector
  const el = document.createElement('div');
  el.classList.add('rsc-clicked');

  // 3) pre-state + condition flags (set both if your component checks both names)
  component.chatIconText = false;
  (component as any).expandcbIconText  = 'someText';
  (component as any).expanecbIconText  = 'someText'; // remove if typo fixed in component

  // 4) spies local to this test
  spyOn(component['storageService'], 'getSettingFromSessionStorage').and.returnValue(true); // isIframeOpen
  spyOn(component['el'].nativeElement, 'querySelector').and.returnValue(el);

  // 5) run init, then emit, then flush timeout
  component.ngOnInit();
  incoming$.next([]);     // triggers subscribe body
  tick();                 // flush setTimeout inside it

  // 6) assertions
  expect(component.chatIconText).toBeTrue();
  expect(el.classList.contains('rsc-clicked')).toBeFalse(); // class removed in TRUE path
}));

it('ELSE path → empty/undefined/iframeClosed/no-element → chatIconText=false & class NOT removed', fakeAsync(() => {
  // 1) hot stream
  const incoming$ = new Subject<any>();
  (component as any).observableService = { currentIncomingMessages$: incoming$ } as any;

  // 2) dynamic fakes so we can table-drive scenarios without re-spying
  let isOpen = false;
  let domEl: HTMLElement | null = null;
  spyOn(component['storageService'], 'getSettingFromSessionStorage').and.callFake(() => isOpen);
  spyOn(component['el'].nativeElement, 'querySelector').and.callFake(() => domEl);

  const cases = [
    { name: 'empty string',     isOpen: true,  expand: '',          typo: '',          wantEl: true  },
    { name: 'undefined',        isOpen: true,  expand: undefined,   typo: undefined,   wantEl: true  },
    { name: 'iframe closed',    isOpen: false, expand: 'someText',  typo: 'someText',  wantEl: true  },
    { name: 'no element found', isOpen: true,  expand: 'someText',  typo: 'someText',  wantEl: false },
  ];

  for (const c of cases) {
    const el = document.createElement('div');
    el.classList.add('rsc-clicked');

    // set dynamic returns
    isOpen = c.isOpen;
    domEl  = c.wantEl ? el : null;

    // pre-state opposite to prove flip
    component.chatIconText = true;
    (component as any).expandcbIconText = c.expand as any;
    (component as any).expanecbIconText = c.typo as any; // remove if typo fixed

    component.ngOnInit();
    incoming$.next([]);  // make the subscribe run
    tick();              // flush setTimeout

    expect(component.chatIconText).toBeFalse();
    if (c.wantEl) {
      expect(el.classList.contains('rsc-clicked')).toBeTrue(); // NOT removed in ELSE path
    }
  }
}));
