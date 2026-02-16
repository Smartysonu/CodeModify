private handleStreamingChunk(dataChunk: MessageChunkEvent) {
  const { chatId, messageId, chunk, done } = dataChunk;

  // TODO: change this lookup if your group doesn't store chatId
  const groupIndex = this.messageGroups.findIndex(g => g.chatId === chatId);
  if (groupIndex === -1) return;

  const group = this.messageGroups[groupIndex];

  let msg = group.messages.find(m => m.messageId === messageId);

  if (!msg) {
    msg = {
      chatId,
      messageId,
      text: '',          // if your field is messageText, change here
      isStreaming: true,
    } as any;

    group.messages.push(msg);
  }

  msg.text = (msg.text || '') + (chunk || '');
  msg.isStreaming = !done;

  this.scrollToBottom?.();
}
