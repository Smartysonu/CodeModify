import { Subject } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

it('ngOnInit: toggles chatIconText and rsc-clicked for both branches', fakeAsync(() => {
  // streams ngOnInit subscribes to
  const lang$ = new Subject<any>();
  const incoming$ = new Subject<any>();
  (component as any).translationsService = { language$: lang$ } as any;
  (component as any).observableService   = { currentIncomingMessages$: incoming$ } as any;

  // minimal uiService double
  (component as any).uiService = {
    _isVisible: true,
    get isVisible() { return this._isVisible; },
    checkIsFrameOpen: () => {},
    onWindowOpen: () => {}
  } as any;

  // anything else ngOnInit touches
  (component as any).window = (component as any).window || window;
  (component as any).window.pxEventManager = { subscribe: () => {} } as any;

  // DOM node for #chatBotIcon
  const iconEle = document.createElement('div');
  iconEle.id = 'chatBotIcon';
  iconEle.classList.add('rsc-clicked');
  spyOn((component as any).el.nativeElement, 'querySelector').and.returnValue(iconEle);

  // storage flag used in the condition
  const getSessSpy = spyOn(component['storageService'], 'getSettingFromSessionStorage');

  // -------- TRUE branch: iframe open + non-empty text --------
  getSessSpy.and.returnValue(true);
  (component as any).expandcbIconText = 'text';

  component.ngOnInit();
  lang$.next('en');
  incoming$.next([]);
  tick();

  expect(component.chatIconText).toBeTrue();
  expect(iconEle.classList.contains('rsc-clicked')).toBeFalse();

  // -------- ELSE branch: iframe closed + empty text --------
  iconEle.classList.remove('rsc-clicked');
  getSessSpy.and.returnValue(false);
  (component as any).expandcbIconText = '';

  component.ngOnInit();
  lang$.next('en');
  incoming$.next([]);
  tick();

  expect(component.chatIconText).toBeFalse();
  expect(iconEle.classList.contains('rsc-clicked')).toBeTrue();
}));
