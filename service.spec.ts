import { Subject } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

it('covers ngOnInit icon toggle (both branches) without spyOnProperty', fakeAsync(() => {
  // ── Fake the two observables ngOnInit() subscribes to ────────────────────────
  const lang$ = new Subject<string>();
  const incoming$ = new Subject<any>();

  (component as any).translationsService = { language$: lang$ } as any;
  (component as any).observableService   = { currentIncomingMessages$: incoming$ } as any;

  // ── Replace uiService with a tiny test double (no spyOnProperty needed) ──────
  const uiDouble = {
    _isVisible: true,
    get isVisible() { return this._isVisible; },
    checkIsFrameOpen: jasmine.createSpy('checkIsFrameOpen'),
    onWindowOpen: jasmine.createSpy('onWindowOpen')
  };
  (component as any).uiService = uiDouble as any;

  // ── Provide the DOM node returned by querySelector ───────────────────────────
  const iconEle = document.createElement('div');
  iconEle.id = 'chatBotIcon';
  iconEle.classList.add('rsc-clicked'); // start with the class -> we can assert removal
  spyOn((component as any).el.nativeElement, 'querySelector').and.returnValue(iconEle);

  // ── Spy the storage flag used by the condition (instance method) ─────────────
  const sessionSpy = spyOn(component['storageService'], 'getSettingFromSessionStorage');

  // ===================== CASE 1: TRUE branch ==================================
  sessionSpy.and.returnValue(true);                  // isIframeOpen = true
  (component as any).expandcbIconText = 'text';      // non-empty

  component.ngOnInit();
  // drive the subscription and the inner setTimeout
  lang$.next('en');
  incoming$.next([]);
  tick();                                            // flush timers queued in subscribe

  expect(component.chatIconText).toBeTrue();
  expect(iconEle.classList.contains('rsc-clicked')).toBeFalse(); // class removed

  // ===================== CASE 2: ELSE branch ==================================
  iconEle.classList.remove('rsc-clicked');           // reset DOM state
  sessionSpy.and.returnValue(false);                 // isIframeOpen = false
  (component as any).expandcbIconText = '';          // empty

  component.ngOnInit();
  lang$.next('en');
  incoming$.next([]);
  tick();

  expect(component.chatIconText).toBeFalse();
  expect(iconEle.classList.contains('rsc-clicked')).toBeTrue();  // class added
}));
