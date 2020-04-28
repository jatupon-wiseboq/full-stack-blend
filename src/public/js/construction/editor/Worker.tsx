onmessage = (event) => {
  importScripts('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.0.0/highlight.min.js');
  const result = self.hljs.highlightAuto(event.data);
  postMessage(result.value);
};