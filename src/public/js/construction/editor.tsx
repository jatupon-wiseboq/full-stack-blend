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
  
  var synchronize = (name: string, content: any) => {
    switch (name) {
      case 'select':
        break;
      case 'click':
        window.document.body.click();
        break;
    }
  };
  
  window.addEventListener("keydown", (event: any) => {
    perform('keydown', event.keyCode);
  });
  
  window.addEventListener("message", (event) => {
    let data = JSON.parse(event.data);
    synchronize(data.name, data.content);
  });
});