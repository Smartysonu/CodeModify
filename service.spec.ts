it('TRUE path: iframe open + non-empty expandcbIconText → sets chatIconText=true and removes class', () => {
  const el = document.createElement('div');
  el.classList.add('rsc-clicked');

  component.expandcbIconText = 'someText';
  spyOn(component['storageService'], 'getSettingFromSessionStorage').and.returnValue(true);
  spyOn(component['el'].nativeElement, 'querySelector').and.returnValue(el);

  component.ngOnInit();

  expect(component.chatIconText).toBeTrue();
  expect(el.classList.contains('rsc-clicked')).toBeFalse();
});

it('ELSE path (table-driven): covers empty/undefined/iframeClosed and null element', () => {
  const scenarios = [
    { name: 'empty string',        isIframeOpen: true,  expand: '',          expectClicked: true },
    { name: 'undefined',           isIframeOpen: true,  expand: undefined,   expectClicked: true },
    { name: 'iframe closed',       isIframeOpen: false, expand: 'someText',  expectClicked: true },
    { name: 'no element found',    isIframeOpen: true,  expand: 'someText',  expectClicked: null } // querySelector -> null
  ];

  scenarios.forEach(s => {
    // fresh element per subcase (except null-element case)
    const el = document.createElement('div');
    el.classList.add('rsc-clicked');

    spyOn(component['storageService'], 'getSettingFromSessionStorage').and.returnValue(s.isIframeOpen);
    spyOn(component['el'].nativeElement, 'querySelector')
      .and.returnValue(s.name === 'no element found' ? null : el);

    (component as any).expandcbIconText = s.expand as any;

    component.ngOnInit();

    // common assertion for else branch
    expect(component.chatIconText).toBeFalse();

    // when element exists, class should remain; when null, just ensure no throw (no class assertion)
    if (s.expectClicked !== null) {
      expect(el.classList.contains('rsc-clicked')).toBeTrue();
    }
  });
});
