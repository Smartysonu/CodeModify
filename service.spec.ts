// put above tests:
let storageSpy: jasmine.Spy;
let querySpy: jasmine.Spy;

beforeEach(() => {
  // create spies ONCE per test
  storageSpy = spyOn(component['storageService'], 'getSettingFromSessionStorage');
  querySpy   = spyOn(component['el'].nativeElement, 'querySelector');
});



// TRUE branch
it('sets chatIconText=true and removes class when iframe open & non-empty expandcbIconText', () => {
  const el = document.createElement('div');
  el.id = 'chatBotIcon';
  el.classList.add('rsc-clicked');

  // IMPORTANT: handle the code’s typo by setting both props
  (component as any).expandcbIconText  = 'someText';
  (component as any).expanecbIconText  = 'someText';

  storageSpy.and.returnValue(true);     // isIframeOpen = true
  querySpy.and.returnValue(el);         // element exists

  component.ngOnInit();

  expect(component.chatIconText).toBeTrue();
  expect(el.classList.contains('rsc-clicked')).toBeFalse();
});
// ELSE branch (table-driven; reconfigure existing spies via callFake)
it('sets chatIconText=false for empty/undefined/iframeClosed and handles null element', () => {
  let isIframeOpenVar = false;
  let elementVar: HTMLElement | null = null;

  storageSpy.and.callFake(() => isIframeOpenVar);
  querySpy.and.callFake(() => elementVar);

  const cases = [
    { name: 'empty string',     isOpen: true,  expand: '',          alsoTypo: '',         wantEl: true },
    { name: 'undefined',        isOpen: true,  expand: undefined,   alsoTypo: undefined,  wantEl: true },
    { name: 'iframe closed',    isOpen: false, expand: 'someText',  alsoTypo: 'someText', wantEl: true },
    { name: 'no element found', isOpen: true,  expand: 'someText',  alsoTypo: 'someText', wantEl: false },
  ];

  cases.forEach(c => {
    const el = document.createElement('div');
    el.id = 'chatBotIcon';
    el.classList.add('rsc-clicked');

    isIframeOpenVar = c.isOpen;
    elementVar = c.wantEl ? el : null;

    (component as any).expandcbIconText = c.expand as any;
    (component as any).expanecbIconText = c.alsoTypo as any; // match the typo in component code

    component.ngOnInit();

    expect(component.chatIconText).toBeFalse();
    if (c.wantEl) {
      expect(el.classList.contains('rsc-clicked')).toBeTrue();
    }
  });
});
