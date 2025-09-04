describe('IconComponent ngOnInit condition', () => {
  let storageSpy: jasmine.Spy;
  let querySpy: jasmine.Spy;

  beforeEach(() => {
    // create spies once per spec, do not call fixture.detectChanges()
    storageSpy = spyOn(component['storageService'], 'getSettingFromSessionStorage');
    querySpy   = spyOn(component['el'].nativeElement, 'querySelector');
  });

  it('TRUE path: iframe open + non-empty expandcbIconText → chatIconText=true & remove class', () => {
    const el = document.createElement('div');
    el.classList.add('rsc-clicked');

    // handle typo in component code
    (component as any).expandcbIconText = 'someText';
    (component as any).expanecbIconText = 'someText';

    storageSpy.and.returnValue(true);   // isIframeOpen = true
    querySpy.and.returnValue(el);       // element exists

    component.ngOnInit();

    expect(component.chatIconText).toBeTrue();
    // positive: should remove class
    expect(el.classList.contains('rsc-clicked')).toBeFalse();
  });

  it('ELSE path: empty, undefined, iframeClosed, and no-element → chatIconText=false & class not removed', () => {
    let isOpen = false;
    let domEl: HTMLElement | null = null;

    storageSpy.and.callFake(() => isOpen);
    querySpy.and.callFake(() => domEl);

    const cases = [
      { name: 'empty string',     isOpen: true,  expand: '',          typo: '',          wantEl: true },
      { name: 'undefined',        isOpen: true,  expand: undefined,   typo: undefined,   wantEl: true },
      { name: 'iframe closed',    isOpen: false, expand: 'someText',  typo: 'someText',  wantEl: true },
      { name: 'no element found', isOpen: true,  expand: 'someText',  typo: 'someText',  wantEl: false },
    ];

    cases.forEach(c => {
      const el = document.createElement('div');
      el.classList.add('rsc-clicked');

      isOpen = c.isOpen;
      domEl  = c.wantEl ? el : null;

      // reset state
      component.chatIconText = true;
      (component as any).expandcbIconText = c.expand as any;
      (component as any).expanecbIconText = c.typo as any;

      component.ngOnInit();

      // ELSE branch always sets to false
      expect(component.chatIconText).toBeFalse();

      if (c.wantEl) {
        // negative assertion: class should remain, not removed
        expect(el.classList.contains('rsc-clicked')).toBeTrue();
      } else {
        // no element case: just make sure it didn't throw
        expect(component.chatIconText).toBeFalse();
      }

      storageSpy.calls.reset();
      querySpy.calls.reset();
    });
  });
});
