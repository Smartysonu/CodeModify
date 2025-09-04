describe('loadActionLib', () => {
  // keep whatever your component reference is:
  // let component: HeaderComponent;  // example

  let originalInception: any;

  beforeEach(() => {
    // snapshot any existing global so we can restore it safely
    originalInception = (component as any).window?.inception;
  });

  afterEach(() => {
    // restore / remove any test mutation
    if ((component as any).window) {
      if (originalInception === undefined) {
        delete (component as any).window.inception;
      } else {
        (component as any).window.inception = originalInception;
      }
    }
  });

  it('should return early when window["inception"] is missing', () => {
    // Arrange: make sure inception is NOT present
    (component as any).window = (component as any).window || (window as any);
    delete (component as any).window.inception;

    // (No spies at all — if the function returns early, nothing to assert gets called)
    // Act
    (component as any).loadActionLib();

    // Assert: nothing threw; optional: assert that property is still undefined
    expect((component as any).window.inception).toBeUndefined();
  });

  it('should call inception.webComponentLoad and inception.actionMenu with component when present', () => {
    // Arrange
    const wcSpy = jasmine.createSpy('webComponentLoad');
    const amSpy = jasmine.createSpy('actionMenu');

    (component as any).window = (component as any).window || (window as any);
    (component as any).window.inception = {
      webComponentLoad: wcSpy,
      actionMenu: amSpy,
    };

    // Act
    (component as any).loadActionLib();

    // Assert
    expect(wcSpy).toHaveBeenCalledTimes(1);
    expect(wcSpy).toHaveBeenCalledWith(component);
    expect(amSpy).toHaveBeenCalledTimes(1);
    expect(amSpy).toHaveBeenCalledWith(component);
  });
});
