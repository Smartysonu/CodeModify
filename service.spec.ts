import { Subject } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

it('ngOnInit: calls key functions (no pxEventManager) and toggles icon correctly', fakeAsync(() => {
  // ----- streams ngOnInit subscribes to -----
  const lang$ = new Subject<any>();
  const incoming$ = new Subject<any>();
  (component as any).translationsService = { language$: lang$ } as any;
  (component as any).observableService   = { currentIncomingMessages$: incoming$ } as any;

  // ----- uiService test double -----
  (component as any).uiService = {
    _isVisible: true,
    get isVisible() { return this._isVisible; },
    checkIsFrameOpen: jasmine.createSpy('checkIsFrameOpen'),
    onWindowOpen: jasmine.createSpy('onWindowOpen'),
  } as any;

  // ----- NO pxEventManager; ensure window exists but without event manager -----
  (component as any).window = (component as any).window || {};
  // guard matchMedia if used elsewhere in ngOnInit
  (component as any).window.matchMedia = (q: string) =>
    ({ matches: false, addEventListener() {}, removeEventListener() {} } as any);

  // ----- DOM node returned by querySelector (#chatBotIcon) -----
  const iconEle = document.createElement('div');
  iconEle.id = 'chatBotIcon';
  iconEle.classList.add('rsc-clicked');
  spyOn((component as any).el.nativeElement, 'querySelector').and.returnValue(iconEle);

  // ----- storage flag used in condition & method invoked in the subscribe -----
  const getSessSpy = spyOn(component['storageService'], 'getSettingFromSessionStorage');
  const handleSpy  = spyOn(component as any, 'handleIncomingMessages');

  // ================= TRUE branch =================
  getSessSpy.and.returnValue(true);              // iframe open
  (component as any).expandcbIconText = 'text';  // non-empty

  component.ngOnInit();
  // drive the subscriptions so inner setTimeout runs
  lang$.next('en');
  incoming$.next(5);  // any number → handleIncomingMessages(amount) should be called
  tick();

  // function calls
  expect((component as any).uiService.checkIsFrameOpen).toHaveBeenCalled();
  expect((component as any).uiService.onWindowOpen).toHaveBeenCalled();
  expect(handleSpy).toHaveBeenCalledWith(5);

  // icon toggled
  expect(component.chatIconText).toBeTrue();
  expect(iconEle.classList.contains('rsc-clicked')).toBeFalse();

  // ================= ELSE branch =================
  iconEle.classList.remove('rsc-clicked'); // reset DOM
  getSessSpy.and.returnValue(false);       // iframe closed
  (component as any).expandcbIconText = ''; // empty

  component.ngOnInit();
  lang$.next('en');
  incoming$.next(0);
  tick();

  // icon toggled back
  expect(component.chatIconText).toBeFalse();
  expect(iconEle.classList.contains('rsc-clicked')).toBeTrue();
}));
