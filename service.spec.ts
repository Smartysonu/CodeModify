describe('IconComponent ngOnInit (lines 78–79)', () => {
  beforeAll(() => {
    jasmine.getEnv().allowRespy(true); // allow re-spy across tests
  });

  it('TRUE path: iframe open + non-empty expandcbIconText → chatIconText=true and class removed', () => {
    const el = document.createElement('div');
    el.classList.add('rsc-clicked');

    (component as any).expandcbIconText = 'someText';
    (component as any).expanecbIconText = 'someText'; // remove if no typo
    component.chatIconText = false;

    spyOn(component['storageService'], 'getSettingFromSessionStorage').and.returnValue(true);
    spyOn(component['el'].nativeElement, 'querySelector').and.returnValue(el);

    component.ngOnInit();

    expect(component.chatIconText).toBeTrue();
    expect(el.classList.contains('rsc-clicked')).toBeFalse(); // removed
  });

  it('ELSE path: empty, undefined, iframeClosed, no-element → chatIconText=false & class NOT removed', () => {
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

    cases.forEach(c => {
      const el = document.createElement('div');
      el.classList.add('rsc-clicked');

      isOpen = c.isOpen;
      domEl  = c.wantEl ? el : null;

      component.chatIconText = true; // prove it flips to false
      (component as any).expandcbIconText = c.expand as any;
      (component as any).expanecbIconText = c.typo as any;

      component.ngOnInit();

      expect(component.chatIconText).toBeFalse();
      if (c.wantEl) {
        expect(el.classList.contains('rsc-clicked')).toBeTrue(); // not removed
      }
    });
  });
});
