var perform: Function;
var toggle: Function;
var swap: Function;

let recentExtraPanelSelector: string = null;

$(document).ready(function() {
  perform = (name: string, content: any) => {
    let element = document.getElementById('construction') as HTMLFrameElement;
    let contentWindow = element.contentWindow;
    contentWindow.postMessage(JSON.stringify({
      name: name,
      content: content
    }), '*');
  };
  
  toggle = (name: string, iconSelector: string) => {
    let icon = $(iconSelector);
    if (icon.hasClass('fa-toggle-on')) {
      icon.removeClass('fa-toggle-on').addClass('fa-toggle-off');
    } else {
      icon.removeClass('fa-toggle-off').addClass('fa-toggle-on');
    }
    perform('toggle', name);
  };
  
  swap = (panelSelector: string, extraPanelSelector: string=null, replacingIconSelector: string=null, iconClass: string=null) => {
    let panel = $(panelSelector);
    
    panel.parent().find('> .panel').removeClass('active');
    panel.addClass('active');
    
    if (replacingIconSelector != null) {
      let replacingIconElement = $(replacingIconSelector)[0];
      replacingIconElement.className = replacingIconElement.className.replace(/fa\-[a-z\-]+/g, iconClass);
    }
    
    if (recentExtraPanelSelector != null) {
      let recentExtraPanel = $(recentExtraPanelSelector);
      recentExtraPanel.removeClass('active');
    }
    
    if (extraPanelSelector != null) {
      let extraPanel = $(extraPanelSelector);
      extraPanel.addClass('active');
    }
    
    recentExtraPanelSelector = extraPanelSelector;
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