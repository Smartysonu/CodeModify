import { Subject } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

it('covers ngOnInit icon toggle (both branches)', fakeAsync(() => {
  // ── 1) minimal stubs for everything ngOnInit touches ─────────────────────────
  // translationsService.language$ (stream)
  const lang$ = new Subject<string>();
  (component as any).translationsService.language$ = lang$;

  // observableService.currentIncomingMessages$ (stream)
  const incoming$ = new Subject<any>();
  (component as any).observableService.currentIncomingMessages$ = incoming$;

  // uiService.isVisible getter + methods used
  spyOnProperty(component['uiService'], 'isVisible', 'get').and.returnValue(true);
  spyOn(component['uiService'], 'checkIsFrameOpen').and.stub();
  spyOn(component['uiService'], 'onWindowOpen').and.stub();

  // anything else your ngOnInit calls that can be no-ops
  spyOn(component as any, 'getTranslations').and.stub();

  // ── 2) fake DOM element for #chatBotIcon ─────────────────────────────────────
  const iconEle = document.createElement('div');
  iconEle.id = 'chatBotIcon';
  iconEle.classList.add('rsc-clicked'); // start with the class so we can test removal
  spyOn(component['el'].nativeElement, 'querySelector').and.returnValue(iconEle);

  // Storage read used by the condition
  const getSessionSpy = spyOn(
    component['storageService'],
    'getSettingFromSessionStorage'
  );

  // ── 3) CASE 1: TRUE branch (iframe open + non-empty text) ────────────────────
  getSessionSpy.and.returnValue(true);            // isIframeOpen = true
  (component as any).expandcbIconText = 'text';   // non-empty

  component.ngOnInit();
  // fire the subscribes so inner setTimeout runs
  lang$.next('en');         // any value
  incoming$.next([]);       // any value
  tick();                   // flush setTimeout in the subscribe

  expect(component.chatIconText).toBeTrue();
  expect(iconEle.classList.contains('rsc-clicked')).toBeFalse();

  // ── 4) CASE 2: ELSE branch (iframe closed + empty text) ──────────────────────
  iconEle.classList.remove('rsc-clicked'); // reset DOM state
  getSessionSpy.and.returnValue(false);    // isIframeOpen = false
  (component as any).expandcbIconText = '';

  component.ngOnInit();
  lang$.next('en');
  incoming$.next([]);
  tick();

  expect(component.chatIconText).toBeFalse();
  expect(iconEle.classList.contains('rsc-clicked')).toBeTrue();
}));
