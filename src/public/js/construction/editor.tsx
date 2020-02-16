var perform: Function;

$(document).ready(function() {
  perform = (name: string, content: any) => {
    let element = document.getElementById('construction') as HTMLFrameElement;
    let contentWindow = element.contentWindow;
    contentWindow.postMessage(JSON.stringify({
      name: name,
      content: content
    }), '*');
  };
  
  window.addEventListener("keydown", (event: any) => {
    perform('keydown', event.keyCode);
  });
});