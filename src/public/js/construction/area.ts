(() => {
  let performed = [];
  let performedIndex = -1;
  
  function perform(name, content, remember=true) {
    let cursor = document.getElementById('internal-fsb-cursor');
    let accessory = {};
    
    switch (name) {
      case 'append':
        cursor.parentNode.insertBefore(content, cursor);
        break;
      case 'insert':
        let element = null;
        
        switch (content) {
          case 'vertical-layout':
            element = document.createElement('div');
            element.innerHTML = '...';
            break;
          case 'horizontal-layout':
            element = document.createElement('div');
            element.innerHTML = 'aaa';
            break;
          case 'flow-layout':
            element = document.createElement('div');
            element.innerHTML = '+++';
            break;
          case 'absolute-layout':
            element = document.createElement('div');
            element.innerHTML = 'bbb';
            break;
        }
        
        if (element !== null) {
          element.setAttribute('internal-fsb-element', '1');
          cursor.parentNode.insertBefore(element, cursor);
        }
        
        break;
      case 'keydown':
        switch (content) {
          case 37:
          case 38:
            if (cursor.previousSibling) {
              cursor.parentNode.insertBefore(cursor, cursor.previousSibling);
            }
            break;
          case 39:
          case 40:
            if (cursor.nextSibling) {
              cursor.parentNode.insertBefore(cursor, cursor.nextSibling && cursor.nextSibling.nextSibling || null);
            }
            break;
          case 8:
            if (cursor.previousSibling && cursor.previousSibling.getAttribute('internal-fsb-element') === '1') {
              accessory = cursor.previousSibling;
              cursor.parentNode.removeChild(cursor.previousSibling);
            }
            break;
        }
        
        break;
      case 'undo':
        if (performedIndex >= 0) {
          let name = performed[performedIndex].name;
          let content = performed[performedIndex].content;
          let accessory = performed[performedIndex].accessory;
          
          switch (name) {
            case 'insert':
              name = 'keydown';
              content = 8;
              break;
            case 'keydown':
              switch (content) {
                case 37:
                  content = 39;
                  break;
                case 38:
                  content = 40;
                  break;
                case 39:
                  content = 37;
                  break;
                case 40:
                  content = 38;
                  break;
                case 8:
                  name = 'append';
                  content = accessory;
                  break;
              }
              break;
          }
          
          performedIndex -= 1;
          perform(name, content, false);
        }
        
        remember = false;
        break;
      case 'redo':
        if (performedIndex < performed.length - 1) {
          performedIndex += 1;
          perform(performed[performedIndex].name, performed[performedIndex].content, false);
        }
        
        remember = false;
        break;
    }
    
    console.log(name, content, accessory, performedIndex);
    
    if (remember) {
      performedIndex += 1;
      performed = performed.splice(0, performedIndex);
      
      performed.push({
        name: name,
        content: content,
        accessory: accessory
      });
    }
  }
  
  window.addEventListener("message", (event) => {
    let data = JSON.parse(event.data);
    perform(data.name, data.content);
  });
  
  window.addEventListener("keydown", (event) => {
    perform('keydown', event.keyCode);
  });
})();