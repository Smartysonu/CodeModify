it('should call all required methods on onInput', () => {
  spyOn(component, 'setNewQuery');
  spyOn(component, 'getSuggestions');
  spyOn(component, 'showSuggestions');
  spyOn(component, 'showHistorySuggestions');
  spyOn(component, 'fetchZonesData');

  component.onInput();

  expect(component.setNewQuery).toHaveBeenCalled();
  expect(component.getSuggestions).toHaveBeenCalled();
  expect(component.showSuggestions).toHaveBeenCalled();
  expect(component.showHistorySuggestions).toHaveBeenCalled();
  expect(component.fetchZonesData).toHaveBeenCalled();
});

it('should call all required methods on onBlur after timeout', (done) => {
  spyOn(component, 'clearSuggestions');
  spyOn(component, 'hideSuggestions');
  spyOn(component, 'hideHistorySuggestions');
  spyOn(component, 'clearZonesData');

  component.onBlur();

  setTimeout(() => {
    expect(component.clearSuggestions).toHaveBeenCalled();
    expect(component.hideSuggestions).toHaveBeenCalled();
    expect(component.hideHistorySuggestions).toHaveBeenCalled();
    expect(component.clearZonesData).toHaveBeenCalled();
    done();
  }, 300); // wait slightly more than 250
});

it('should call all required methods on onSubmit', () => {
  spyOn(component, 'clearSuggestions');
  spyOn(component, 'hideSuggestions');
  spyOn(component, 'clearZonesData');
  spyOn(component, 'searchAnalysis');
  spyOn(component, 'submit');

  component.onSubmit();

  expect(component.clearSuggestions).toHaveBeenCalled();
  expect(component.hideSuggestions).toHaveBeenCalled();
  expect(component.clearZonesData).toHaveBeenCalled();
  expect(component.searchAnalysis).toHaveBeenCalled();
  expect(component.submit).toHaveBeenCalled();
});
