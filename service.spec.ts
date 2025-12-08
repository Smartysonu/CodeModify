 it('should replace {{AgentName}} with strong tag when nickname is valid', () => {
  component.liveAgentNickName = 'Sarah';

  spyOn(translationsService, 'getLocalTranslation')
    .and.returnValue('Chat with {{AgentName}} now');

  component['getTranslations']();

  expect(component.livewithlabel)
    .toBe('Chat with <strong>Sarah</strong> now');
});

it('should return label unchanged when nickname is blank', () => {
  component.liveAgentNickName = ' '; // fails IF condition

  spyOn(translationsService, 'getLocalTranslation')
    .and.returnValue('Chat with {{AgentName}} now');

  component['getTranslations']();

  expect(component.livewithlabel)
    .toBe('Chat with {{AgentName}} now');
});


it('should return label unchanged when placeholder is missing', () => {
  component.liveAgentNickName = 'Sarah';

  spyOn(translationsService, 'getLocalTranslation')
    .and.returnValue('Welcome to support');

  component['getTranslations']();

  expect(component.livewithlabel).toBe('Welcome to support');
});

