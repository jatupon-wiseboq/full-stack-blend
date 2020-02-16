var EditorHelper = {
  synchronize: (name: string, content: any) => {
    window.top.postMessage(JSON.stringify({
      name: name,
      content: content
    }), '*');
  },
  
  select: (element: HTMLElement) => {
    if (element.className.indexOf('internal-fsb-element') != -1) {
      element.appendChild(dragger);
      
      EditorHelper.synchronize('select', element.getAttribute('internal-fsb-class'));
    }
  }
};

export {EditorHelper};

          
          