import { DragDropDirective } from './drag-drop.directive';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `<div appDragDrop (onFileDropped)="handleFileDropped($event)"></div>`,
})
export class TestComponent {
  uploadedFiles: File[] = [];

  handleFileDropped(event: File[]) {
    this.uploadedFiles = event;
  }
}

describe('DragDropDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, DragDropDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement.query(By.directive(DragDropDirective));
  }));

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  it('should trigger dragover event', () => {
    const event = new DragEvent('dragover', { bubbles: true });
    el.nativeElement.dispatchEvent(event);
    fixture.detectChanges();
  });

  it('should trigger dragleave event', () => {
    const event = new DragEvent('dragleave', { bubbles: true });
    el.nativeElement.dispatchEvent(event);
    fixture.detectChanges();
  });

  it('should trigger drop event and emit files', () => {
    const mockFile = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    const event = new DragEvent('drop', {
      bubbles: true,
    });

    Object.defineProperty(event, 'dataTransfer', {
      value: {
        files: [mockFile],
      },
    });

    spyOn(component, 'handleFileDropped');

    el.nativeElement.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.handleFileDropped).toHaveBeenCalledWith([mockFile]);
  });

  it('should not emit event if no files are dropped', () => {
    const event = new DragEvent('drop', {
      bubbles: true,
    });

    Object.defineProperty(event, 'dataTransfer', {
      value: {
        files: [],
      },
    });

    spyOn(component, 'handleFileDropped');

    el.nativeElement.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.handleFileDropped).not.toHaveBeenCalled();
  });
});
