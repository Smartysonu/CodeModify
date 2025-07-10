describe('HeaderComponent', () => {
  beforeEach(() => {
    (translationsService.getLanguage as jasmine.Spy).and.returnValue('en');
    configService.chatId = 'abc123';
  });

  it('should skip the first bot message if group.firstReply is true', () => {
    const mockMessages = [
      {
        timestampId: '123456789',
        sender: 'bot',
        messages: [
          {
            sender: 'bot',
            message: 'ChatID or system init message',
            timeStamp: '2025-07-08T10:00:00Z',
            firstReply: true,
          },
          {
            sender: 'bot',
            message: 'Actual first response',
            timeStamp: '2025-07-08T10:00:10Z',
          }
        ]
      }
    ];

    (observableService.getMessageGroups as jasmine.Spy).and.returnValue(mockMessages);

    const clickSpy = jasmine.createSpy('click');
    const anchor = { href: '', download: '', click: clickSpy } as any;

    spyOn(document, 'createElement').and.returnValue(anchor);
    spyOn(document.body, 'appendChild');
    spyOn(document.body, 'removeChild');
    spyOn(window.URL, 'createObjectURL').and.callFake(() => 'blob:url');

    component.downloadTranscript();

    expect(anchor.download).toBe('Proximus-Assistant-abc123.txt');
    expect(anchor.href).toContain('Bot: Actual first response');
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should set sender as "Agent" when sender is Agent', () => {
    const mockMessages = [
      {
        timestampId: '456',
        sender: 'bot',
        messages: [
          {
            sender: 'Agent',
            message: 'Agent message here',
            timeStamp: '2025-07-08T10:01:00Z'
          }
        ]
      }
    ];

    (observableService.getMessageGroups as jasmine.Spy).and.returnValue(mockMessages);

    const clickSpy = jasmine.createSpy('click');
    const anchor = { href: '', download: '', click: clickSpy } as any;

    spyOn(document, 'createElement').and.returnValue(anchor);
    spyOn(document.body, 'appendChild');
    spyOn(document.body, 'removeChild');
    spyOn(window.URL, 'createObjectURL').and.callFake(() => 'blob:url');

    component.downloadTranscript();

    expect(anchor.href).toContain('Agent: Agent message here');
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should use userLanguage when sender is unknown', () => {
    (translationsService.getLanguage as jasmine.Spy).and.returnValue('Hindi');

    const mockMessages = [
      {
        timestampId: '789',
        sender: 'bot',
        messages: [
          {
            sender: 'Supervisor',
            message: 'Hello supervisor!',
            timeStamp: '2025-07-08T10:02:00Z'
          }
        ]
      }
    ];

    (observableService.getMessageGroups as jasmine.Spy).and.returnValue(mockMessages);

    const clickSpy = jasmine.createSpy('click');
    const anchor = { href: '', download: '', click: clickSpy } as any;

    spyOn(document, 'createElement').and.returnValue(anchor);
    spyOn(document.body, 'appendChild');
    spyOn(document.body, 'removeChild');
    spyOn(window.URL, 'createObjectURL').and.callFake(() => 'blob:url');

    component.downloadTranscript();

    expect(anchor.href).toContain('Hindi: Hello supervisor!');
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should fallback to empty text if message.message is undefined', () => {
    const mockMessages = [
      {
        timestampId: '999',
        sender: 'bot',
        messages: [
          {
            sender: 'Agent',
            message: undefined,
            timeStamp: '2025-07-08T10:03:00Z'
          }
        ]
      }
    ];

    (observableService.getMessageGroups as jasmine.Spy).and.returnValue(mockMessages);

    const clickSpy = jasmine.createSpy('click');
    const anchor = { href: '', download: '', click: clickSpy } as any;

    spyOn(document, 'createElement').and.returnValue(anchor);
    spyOn(document.body, 'appendChild');
    spyOn(document.body, 'removeChild');
    spyOn(window.URL, 'createObjectURL').and.callFake(() => 'blob:url');

    component.downloadTranscript();

    expect(anchor.href).toContain('Agent: ');
    expect(clickSpy).toHaveBeenCalled();
  });
});
