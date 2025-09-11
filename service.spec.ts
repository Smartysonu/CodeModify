it('should do nothing if slider is not found', () => {
  document.body.innerHTML = ''; // no slider
  service.handleMetroLineCounterMobile();
  expect(true).toBeTrue(); // no crash, branch covered
});

it('should not scroll if slider has no selected element', () => {
  const slider = document.createElement('div');
  slider.className = 'rs-metroline mobile ui';
  document.body.appendChild(slider);

  service.handleMetroLineCounterMobile();

  expect(slider.scrollLeft).toBe(0);
});

it('should scroll slider to center if current is selected', () => {
  const slider = document.createElement('div');
  slider.className = 'rs-metroline mobile ui';

  const current = document.createElement('div');
  current.className = 'rs-selected';
  Object.defineProperty(current, 'offsetLeft', { value: 100, configurable: true });

  slider.appendChild(current);
  document.body.appendChild(slider);

  service.handleMetroLineCounterMobile();

  expect(slider.scrollLeft).toBe(100 - window.innerWidth / 2 + 5);
});
