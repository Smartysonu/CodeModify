import { UiService } from './ui.service';
import { TestBed } from '@angular/core/testing';
import { UtilsService } from './utils.service';
import * as _ from 'lodash';

describe('UiService', () => {
  let service: UiService;
  let utilsService: UtilsService;
  let slider: HTMLElement;
  let currentElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UiService, UtilsService],
    });

    service = TestBed.inject(UiService);
    utilsService = TestBed.inject(UtilsService);

    // Mocking window.innerWidth for testing
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(1000);

    // Create mock slider and current element
    slider = document.createElement('ul');
    slider.classList.add('rs-metroline-mobile');
    document.body.appendChild(slider);

    currentElement = document.createElement('li');
    currentElement.classList.add('rs-selected');
    currentElement.style.left = '600px'; // This makes offsetLeft > window.innerWidth / 2
    slider.appendChild(currentElement);

    spyOn(slider, 'scrollLeft', 'set').and.callThrough(); // Spy on scrollLeft to check later
  });

  it('should execute scrollLeft when offsetLeft > window.innerWidth / 2', () => {
    // Spy on lodash.get to simulate 'offset Left' property for the current element
    spyOn(_, 'get').and.returnValue(currentElement.offsetLeft);

    // Call handleMetrolineCounterMobile method
    service.handleMetrolineCounterMobile();

    // Check if scrollLeft is set correctly
    expect(slider.scrollLeft).toBe(currentElement.offsetLeft - window.innerWidth / 2 + 5);
  });
});
