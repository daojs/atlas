onmessage = function handler(event) {
  self.console.log('Message received from main script');
  const workerResult = `Result: ${(event.data[0] * event.data[1])}`;
  self.console.log('Posting message back to main script');
  postMessage(workerResult);
};
