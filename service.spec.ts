import { fakeAsync, tick } from '@angular/core/testing';

describe('IconComponent ngOnInit (lines 78–79)', () => {
  it('TRUE path: iframe open + non-empty expandcbIconText → chatIconText=true & class removed', fakeAsync(() => {
    const el = document.createElement('div');
    el.classList.add('rsc-clicked');

    // If component checks both names, set both
    (component as any).expandcbIconText = 'someText';
    (component as any).expanecbIconText = 'someText';
    component.chatIconText = false;

    spyOn(component['storageService'], 'getSettingFromSessionStorage').and.returnValue(true);
    spyOn(component['el'].nativeElement, 'querySelector').and.returnValue(el);

    component.ngOnInit();
    tick(); // flush setTimeout(...)

    expect(component.chatIconText).toBeTrue();
    expect(el.classList.contains('rsc-clicked')).toBeFalse(); // removed
  }));

  it('ELSE path: empty, undefined, iframeClosed, no-element → chatIconText=false & class NOT removed', fakeAsync(() => {
    let isOpen = false;
    let domEl: HTMLElement | null = null;

    spyOn(component['storageService'], 'getSettingFromSessionStorage').and.callFake(() => isOpen);
    spyOn(component['el'].nativeElement, 'querySelector').and.callFake(() => domEl);

    const cases = [
      { name: 'empty string',     isOpen: true,  expand: '',          typo: '',          wantEl: true },
      { name: 'undefined',        isOpen: true,  expand: undefined,   typo: undefined,   wantEl: true },
      { name: 'iframe closed',    isOpen: false, expand: 'someText',  typo: 'someText',  wantEl: true },
      { name: 'no element found', isOpen: true,  expand: 'someText',  typo: 'someText',  wantEl: false },
    ];

    for (const c of cases) {
      const el = document.createElement('div');
      el.classList.add('rsc-clicked');

      isOpen = c.isOpen;
      domEl  = c.wantEl ? el : null;

      // force opposite, prove flip to false
      component.chatIconText = true;
      (component as any).expandcbIconText = c.expand as any;
      (component as any).expanecbIconText = c.typo as any;

      component.ngOnInit();
      tick(); // flush setTimeout(...)

      expect(component.chatIconText).toBeFalse();

      if (c.wantEl) {
        // class should NOT be removed in else branch
        expect(el.classList.contains('rsc-clicked')).toBeTrue();
      }
    }
  }));
});
