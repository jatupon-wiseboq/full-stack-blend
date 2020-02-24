var perform: Function;
var toggle: Function;
var explore: Function;
var design: Function;

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
  
  explore = (name: string, icon: string) => {
    $('.explorer > div').removeClass('active');
    $('#' + name).addClass('active');
    
    let exploreIcon = $('#exploreIcon')[0];
    exploreIcon.className = exploreIcon.className.replace(/fa\-[a-z\-]+/g, icon);
  };
  
  design = (name: string) => {
    $('.sidebar > div').removeClass('active');
    $('#' + name).addClass('active');
    
    if (name == 'animation') {
      $('#timeline').addClass('active');
    } else {
      $('#timeline').removeClass('active');
    }
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