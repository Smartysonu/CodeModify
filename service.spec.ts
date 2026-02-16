@SubscribeMessage('sendMessageStream')
async handleStreamMessage(
  @MessageBody() payload: { message: string; chatId: number },
  @ConnectedSocket() client: Socket,
) {
  const text = payload.message;

  // MOCK streaming for POC
  const chunks = text.match(/.{1,4}/g); // 4-char chunks

  for (const chunk of chunks) {
    client.emit('messageChunk', {
      chatId: payload.chatId,
      chunk,
      done: false,
    });

    await new Promise(res => setTimeout(res, 60));
  }

  client.emit('messageChunk', {
    chatId: payload.chatId,
    done: true,
  });
}
