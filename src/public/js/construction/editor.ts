$(document).ready(function() {
  window.perform = (name, content) => {
    let element = document.getElementById('construction');
    let contentWindow = element.contentWindow;
    contentWindow.postMessage(JSON.stringify({
      name: name,
      content: content
    }), '*');
  };
  
  window.addEventListener("keydown", (event) => {
    perform('keydown', event.keyCode);
  });
});