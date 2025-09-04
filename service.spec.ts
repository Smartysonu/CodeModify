import { Subject } from 'rxjs';

it('should trigger session-ended event and call handleSessionHasEnded when data is non-empty', () => {
  // 1) Use the DI instances the component actually uses
  const obsSvc = TestBed.inject(ObservableService as any);      // <-- use your real type
  const respSvc = TestBed.inject(ResponseService as any);       // <-- use your real type

  // 2) Spy on the real service method
  const endSpy = spyOn(obsSvc, 'triggerSessionEndedEvent');

  // 3) Drive the observable the component subscribes to
  const ended$ = new Subject<any>();
  // If it's a public field, just overwrite it:
  (obsSvc as any).triggerSessionHasEndedMessages$ = ended$;

  // 4) Spy on the response handler
  const handleSpy = spyOn(respSvc, 'handleSessionHasEnded');

  // 5) Call the private method (bypass TS with "as any")
  (component as any).getManuallyTriggeredSessionEndedEvent();

  // 6) Emit a NON-empty payload so lodash/isEmpty returns false
  const payload = { reason: 'timeout' };
  ended$.next(payload);

  // 7) Assert
  expect(endSpy).toHaveBeenCalled();
  expect(handleSpy).toHaveBeenCalledWith(payload);
});

it('should trigger session-ended event but NOT call handleSessionHasEnded when data is empty', () => {
  const obsSvc = TestBed.inject(ObservableService as any);
  const respSvc = TestBed.inject(ResponseService as any);

  const endSpy = spyOn(obsSvc, 'triggerSessionEndedEvent');

  const ended$ = new Subject<any>();
  (obsSvc as any).triggerSessionHasEndedMessages$ = ended$;

  const handleSpy = spyOn(respSvc, 'handleSessionHasEnded');

  (component as any).getManuallyTriggeredSessionEndedEvent();

  // Emit an EMPTY object so isEmpty(...) is true → handler should NOT fire
  ended$.next({});

  expect(endSpy).toHaveBeenCalled();
  expect(handleSpy).not.toHaveBeenCalled();
});
