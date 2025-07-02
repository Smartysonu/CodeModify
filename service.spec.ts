import { UiService } from './ui.service';

describe('UiService', () => {
  let service: UiService;

  beforeEach(() => {
    service = new UiService();
  });

  it('should set scrollLeft when slider and current exist', () => {
    const mockCurrent = { offsetLeft: 200 };
    const mockSlider = {
      querySelector: jasmine.createSpy().and.returnValue(mockCurrent),
      scrollLeft: 0
    };

    spyOn(document, 'querySelector').and.callFake((selector: string) => {
      if (selector === '.rs-metroline-mobile ul') return mockSlider as any;
      return null;
    });

    // Simulate global _get function
    (window as any)._get = (obj: any, prop: string) => obj[prop];

    service.handleMetrolineCounterMobile();

    expect(mockSlider.scrollLeft).toBe(200 - window.innerWidth / 2 + 5);
  });

  it('should not scroll if slider is null', () => {
    spyOn(document, 'querySelector').and.returnValue(null);
    service.handleMetrolineCounterMobile();
    // nothing to expect – just ensuring no error is thrown
  });

  it('should not scroll if current is null', () => {
    const mockSlider = {
      querySelector: jasmine.createSpy().and.returnValue(null),
      scrollLeft: 0
    };
    spyOn(document, 'querySelector').and.returnValue(mockSlider as any);
    service.handleMetrolineCounterMobile();
    expect(mockSlider.scrollLeft).toBe(0); // unchanged
  });

  it('should use fallback if offsetLeft is undefined', () => {
    const mockCurrent = {}; // no offsetLeft
    const mockSlider = {
      querySelector: jasmine.createSpy().and.returnValue(mockCurrent),
      scrollLeft: 0
    };

    spyOn(document, 'querySelector').and.callFake((selector: string) => {
      if (selector === '.rs-metroline-mobile ul') return mockSlider as any;
      return null;
    });

    (window as any)._get = () => null; // simulate _get returning falsy

    service.handleMetrolineCounterMobile();
    expect(mockSlider.scrollLeft).toBe(0 - window.innerWidth / 2 + 5);
  });
});
