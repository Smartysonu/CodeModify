import { Subject } from 'rxjs';

it('should trigger session-ended event and call handleSessionHasEnded when data is non-empty', () => {
  // arrange: stub services used inside the private method
  const ended$ = new Subject<any>();
  (component as any).observableService = {
    triggerSessionEndedEvent: jasmine.createSpy('triggerSessionEndedEvent'),
    triggerSessionHasEndedMessages$: ended$
  } as any;

  (component as any).responseService = {
    handleSessionHasEnded: jasmine.createSpy('handleSessionHasEnded')
  } as any;

  // act: invoke the private method and emit a non-empty payload
  (component as any).getManuallyTriggeredSessionEndedEvent();
  const payload = { reason: 'timeout' }; // non-empty -> should be handled
  ended$.next(payload);

  // assert
  expect((component as any).observableService.triggerSessionEndedEvent).toHaveBeenCalled();
  expect((component as any).responseService.handleSessionHasEnded).toHaveBeenCalledWith(payload);
});

it('should trigger session-ended event but NOT call handleSessionHasEnded when data is empty', () => {
  // arrange
  const ended$ = new Subject<any>();
  (component as any).observableService = {
    triggerSessionEndedEvent: jasmine.createSpy('triggerSessionEndedEvent'),
    triggerSessionHasEndedMessages$: ended$
  } as any;

  (component as any).responseService = {
    handleSessionHasEnded: jasmine.createSpy('handleSessionHasEnded')
  } as any;

  // act: invoke and emit an empty payload (lodash isEmpty({}) === true)
  (component as any).getManuallyTriggeredSessionEndedEvent();
  ended$.next({}); // empty -> should NOT be handled

  // assert
  expect((component as any).observableService.triggerSessionEndedEvent).toHaveBeenCalled();
  expect((component as any).responseService.handleSessionHasEnded).not.toHaveBeenCalled();
});
