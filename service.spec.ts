beforeEach(() => {
  // mock jQuery
  (window as any).$ = jasmine.createSpy('$').and.returnValue({
    foundation: jasmine.createSpy('foundation'),
    on: jasmine.createSpy('on'),
    css: jasmine.createSpy('css'),
  });
});

it('should not call chat method if hasChat is false', () => {
  const mockInstance = { name: '', model: {} };
  const mockCmpRef = { instance: mockInstance, hostView: {} as any };

  const vc = TestBed.inject(ViewContainerRef);
  (vc.createComponent as jasmine.Spy).and.returnValue(mockCmpRef);

  const step = { path: 'step1' } as any;
  const html = '<div></div>';
  (component as any).vc = vc;
  (component as any).injector = TestBed.inject(Injector);
  (component as any).hasChat = false; // <-- important

  component.createDynamicComponent(step, html);

  expect((component as any).addChatWithUsFunctionality).not.toHaveBeenCalled();
  expect((component as any).addLogicAfterRenderOfStep).toHaveBeenCalledWith('step1', {});
  expect(component.stepComponentService.replaceKeyValues).toHaveBeenCalledWith(html);
  expect(vc.insert).toHaveBeenCalledWith(mockCmpRef.hostView);
});
