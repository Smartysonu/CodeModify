this.socketService.getStreamMessages().subscribe(event => {

  if (!this.currentStreamingMessage) {
    this.currentStreamingMessage = {
      text: '',
      isStreaming: true
    };
    this.messages.push(this.currentStreamingMessage);
  }

  if (event.chunk) {
    this.currentStreamingMessage.text += event.chunk;
  }

  if (event.done) {
    this.currentStreamingMessage.isStreaming = false;
    this.currentStreamingMessage = null;
  }
});
