it('should generate transcript and download file with correct format and filename', () => {
  const mockMessages = [
    {
      messages: [
        { sender: 'bot', message: 'Hello!', timeStamp: '2025-07-08T10:00:00Z' },
        { sender: 'user', message: 'Hi!', timeStamp: '2025-07-08T10:00:10Z' }
      ]
    }
  ];

  spyOn(observableService, 'getMessageGroups').and.returnValue(mockMessages);
  spyOn(translationService, 'getLanguage').and.returnValue('EN');
  configService.chatId = 'abc123';

  const clickSpy = jasmine.createSpy('click');
  const anchor = { href: '', download: '', click: clickSpy } as any;

  spyOn(document, 'createElement').and.returnValue(anchor);
  spyOn(document.body, 'appendChild');
  spyOn(document.body, 'removeChild');
  spyOn(window.URL, 'createObjectURL').and.callFake(() => 'blob:url');
  spyOn(window.URL, 'revokeObjectURL');

  component.downloadTranscript();

  expect(anchor.download).toBe('Proximus-Assistant-abc123.txt');
  expect(clickSpy).toHaveBeenCalled();
});

it('should label user as "Vous" for French language', () => {
  const mockMessages = [
    {
      messages: [
        { sender: 'user', message: 'Bonjour!', timeStamp: '2025-07-08T10:00:00Z' }
      ]
    }
  ];

  spyOn(observableService, 'getMessageGroups').and.returnValue(mockMessages);
  spyOn(translationService, 'getLanguage').and.returnValue('FR');
  configService.chatId = 'chatFR';

  const clickSpy = jasmine.createSpy('click');
  const anchor = { href: '', download: '', click: clickSpy } as any;

  spyOn(document, 'createElement').and.returnValue(anchor);
  spyOn(document.body, 'appendChild');
  spyOn(document.body, 'removeChild');
  spyOn(window.URL, 'createObjectURL').and.callFake(() => 'blob:url');

  component.downloadTranscript();

  expect(anchor.download).toBe('Proximus-Assistant-chatFR.txt');
  expect(clickSpy).toHaveBeenCalled();
});

it('should handle empty messageGroups gracefully', () => {
  spyOn(observableService, 'getMessageGroups').and.returnValue([]);
  spyOn(translationService, 'getLanguage').and.returnValue('EN');
  configService.chatId = 'empty123';

  const clickSpy = jasmine.createSpy('click');
  const anchor = { href: '', download: '', click: clickSpy } as any;

  spyOn(document, 'createElement').and.returnValue(anchor);
  spyOn(document.body, 'appendChild');
  spyOn(document.body, 'removeChild');
  spyOn(window.URL, 'createObjectURL').and.callFake(() => 'blob:url');

  component.downloadTranscript();

  expect(anchor.download).toBe('Proximus-Assistant-empty123.txt');
  expect(clickSpy).toHaveBeenCalled();
});
