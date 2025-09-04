import { Subject } from 'rxjs';
import { fakeAsync, flush } from '@angular/core/testing';

it('TRUE path: iframe open + non-empty expandcbIconText → chatIconText=true & class removed', fakeAsync(() => {
  // hot stream so ngOnInit subscription actually runs
  const incoming$ = new Subject<any>();
  (component as any).observableService = { currentIncomingMessages$: incoming$ } as any;

  // DOM element returned by querySelector
  const el = document.createElement('div');
  el.classList.add('rsc-clicked');

  // pre-state + flags
  component.chatIconText = false;
  (component as any).expandcbIconText = 'someText';
  (component as any).expanecbIconText = 'someText'; // remove this line if your component has NO typo

  // stub methods locally (no global spyOn)
  (component as any).storageService.getSettingFromSessionStorage =
    jasmine.createSpy('getSettingFromSessionStorage').and.returnValue(true); // isIframeOpen = true

  (component as any).el.nativeElement.querySelector =
    jasmine.createSpy('querySelector').and.returnValue(el);

  // run
  component.ngOnInit();
  incoming$.next([]);  // trigger subscribe body
  flush();             // flush setTimeout

  // assert
  expect(component.chatIconText).toBeTrue();
  expect(el.classList.contains('rsc-clicked')).toBeFalse(); // removed
}));
it('ELSE path: empty/undefined/iframeClosed/no-element → chatIconText=false & class NOT removed', fakeAsync(() => {
  const incoming$ = new Subject<any>();
  (component as any).observableService = { currentIncomingMessages$: incoming$ } as any;

  let isOpen = false;
  let domEl: HTMLElement | null = null;

  // dynamic local stubs (no spyOn in beforeEach)
  (component as any).storageService.getSettingFromSessionStorage =
    jasmine.createSpy('getSettingFromSessionStorage').and.callFake(() => isOpen);

  (component as any).el.nativeElement.querySelector =
    jasmine.createSpy('querySelector').and.callFake(() => domEl);

  const cases = [
    { name: 'empty',          isOpen: true,  expand: '',          typo: '',          wantEl: true  },
    { name: 'undefined',      isOpen: true,  expand: undefined,   typo: undefined,   wantEl: true  },
    { name: 'iframe closed',  isOpen: false, expand: 'someText',  typo: 'someText',  wantEl: true  },
    { name: 'no element',     isOpen: true,  expand: 'someText',  typo: 'someText',  wantEl: false },
  ];

  for (const c of cases) {
    const el = document.createElement('div');
    el.classList.add('rsc-clicked');

    // set dynamic returns
    isOpen = c.isOpen;
    domEl  = c.wantEl ? el : null;

    // pre-state opposite → prove it flips to false
    component.chatIconText = true;
    (component as any).expandcbIconText = c.expand as any;
    (component as any).expanecbIconText = c.typo as any; // remove if no typo in component

    // run
    component.ngOnInit();
    incoming$.next([]);  // fire subscription
    flush();             // flush setTimeout

    // assert
    expect(component.chatIconText).toBeFalse();
    if (c.wantEl) {
      expect(el.classList.contains('rsc-clicked')).toBeTrue(); // NOT removed in else
    }
  }
}));
