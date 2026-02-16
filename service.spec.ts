private handleStreamingChunk(data: {
  chatId: string;
  text: string;
  isStreaming: boolean;
}): void {

  let groupIndex = -1;
  let messageIndex = -1;

  // 🔍 find existing streaming bot message
  this.messageGroups.some((group, gIdx) => {
    const idx = group.messages.findIndex(
      (m: Message) => m.chatId === data.chatId && m.isStreaming
    );

    if (idx !== -1) {
      groupIndex = gIdx;
      messageIndex = idx;
      return true;
    }
    return false;
  });

  // 🟢 first chunk → create new bot message
  if (messageIndex === -1) {
    const streamingMessage: Message = {
      chatId: data.chatId,
      sender: 'bot',
      text: data.text || '',
      isStreaming: true
    };

    // 🔴 use EXISTING grouping logic
    if (!this.messageGroups.length) {
      this.messageGroups.push({
        date: new Date(),
        messages: [streamingMessage]
      });
    } else {
      this.messageGroups[this.messageGroups.length - 1]
        .messages.push(streamingMessage);
    }

    return;
  }

  // 🟡 append chunk
  this.messageGroups[groupIndex]
    .messages[messageIndex]
    .text += data.text || '';

  // 🔴 stream finished
  if (!data.isStreaming) {
    this.messageGroups[groupIndex]
      .messages[messageIndex]
      .isStreaming = false;
  }
}
