const mockWorker = new Worker('dist/worker.js');

mockWorker.onmessage = (event) => {
  window.console.log(event.data);
};

export default mockWorker;
