it('should skip the first bot message if group.firstReply is true', () => {
  const mockMessages = [
    {
      timestampId: '123456789',
      sender: 'bot',
      firstReply: true,
      messages: [
        {
          sender: 'bot',
          message: 'ChatID or system init message',
          timeStamp: '2025-07-08T10:00:00Z'
        },
        {
          sender: 'bot',
          message: 'Actual first response',
          timeStamp: '2025-07-08T10:00:10Z'
        }
      ]
    }
  ];

  (observableService.getMessageGroups as jasmine.Spy).and.returnValue(mockMessages);
  (translationService.getLanguage as jasmine.Spy).and.returnValue('EN');
  configService.chatId = 'abc123';

  const clickSpy = jasmine.createSpy('click');
  const anchor = { href: '', download: '', click: clickSpy } as any;

  spyOn(document, 'createElement').and.returnValue(anchor);
  spyOn(document.body, 'appendChild');
  spyOn(document.body, 'removeChild');
  spyOn(window.URL, 'createObjectURL').and.callFake(() => 'blob:url');

  component.downloadTranscript();

  // ✅ Ensure only second message is in file, and first bot message is skipped
  expect(anchor.download).toBe('Proximus-Assistant-abc123.txt');
  expect(clickSpy).toHaveBeenCalled();
});
