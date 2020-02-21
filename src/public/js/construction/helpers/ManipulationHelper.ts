import {HTMLHelper} from './HTMLHelper.js';
import {Accessories, EditorHelper} from './EditorHelper.js';
import {RandomHelper} from './RandomHelper.js';
import {LayoutHelper} from './LayoutHelper.js';
import {EventHelper} from './EventHelper.js';

let performed: any = [];
let performedIndex: number = -1;

var ManipulationHelper = {
  perform: (name: string, content: any, remember: boolean=true, skipAfterPromise: boolean=false) => {
    let accessory = null;
    let resolve = null;
    let promise = new Promise((_resolve) => { resolve = _resolve; });
    
    switch (name) {
      case 'append[cursor]':
        {
          Accessories.cursor.parentNode.insertBefore(content, Accessories.cursor);
        }
        break;
      case 'move[cursor]':
        {
          if (Accessories.cursor.parentNode != null && EditorHelper.findWalkPathForCursor().join(',') == content.join(',')) {
            remember = false;
          }
          if (remember) {
            accessory = EditorHelper.findWalkPathForCursor();
          }
          EditorHelper.placingCursorUsingWalkPath(content);
        }
        break;
      case 'update[columnSize]':
        {
          let selectingElement = EditorHelper.getSelectingElement();
          if (selectingElement) {
            accessory = parseInt(selectingElement.className.match(/col\-([1-9]+)/)[1] || 12);
            
            if (!remember && selectingElement.getAttribute('internal-fsb-preview-accessory') === null) {
              selectingElement.setAttribute('internal-fsb-preview-accessory', accessory);
            }
            if (remember && selectingElement.getAttribute('internal-fsb-preview-accessory') !== null) {
              accessory = selectingElement.getAttribute('internal-fsb-preview-accessory');
            }
            
            selectingElement.className = selectingElement.className.replace(/col\-[1-9]+/gi, '');
            HTMLHelper.addClass(selectingElement, ' col-' + content);
          } else {
            remember = false;
          }
        }
        break;
      case 'update[size]':
        {
          let selectingElement = EditorHelper.getSelectingElement();
          if (selectingElement) {
            let origin = HTMLHelper.getPosition(selectingElement.parentNode);
            let position = HTMLHelper.getPosition(selectingElement);
            let size = HTMLHelper.getSize(selectingElement);
            
            accessory = {
              x: position[0] - origin[0],
              y: position[1] - origin[1],
              w: size[0],
              h: size[1]
            }
            
            selectingElement.style.left = content.x + 'px';
            selectingElement.style.top = content.y + 'px';
            selectingElement.style.width = content.w + 'px';
          } else {
            remember = false;
          }
        }
        break;
      case 'insert':
        {
          let element = null;
          let splited = content.split(':');
          let klass = splited[0];
          if (splited[1] === undefined) {
            splited[1] = RandomHelper.generateGUID();
          }
          let guid = splited[1];
          content = splited.join(':');
          
          switch (klass) {
            case 'FlowLayout':
              element = document.createElement('div');
              element = ReactDOM.render(pug `
                .internal-fsb-element
                  .container-fluid
                    .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
              `, element);
              break;
            case 'TableLayout':
              element = document.createElement('div');
              element = ReactDOM.render(pug `
                .internal-fsb-element
                  .container-fluid.internal-fsb-table-layout
                    .row
                      .col.col-4.p-0
                        .container-fluid
                          .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
                      .col.col-4.p-0
                        .container-fluid
                          .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
                      .col.col-4.p-0
                        .container-fluid
                          .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
                    .row
                      .col.col-4.p-0
                        .container-fluid
                          .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
                      .col.col-4.p-0
                        .container-fluid
                          .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
                      .col.col-4.p-0
                        .container-fluid
                          .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
                    .row
                      .col.col-4.p-0
                        .container-fluid
                          .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
                      .col.col-4.p-0
                        .container-fluid
                          .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
                      .col.col-4.p-0
                        .container-fluid
                          .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
              `, element);
              break;
            case 'AbsoluteLayout':
              element = document.createElement('div');
              element = ReactDOM.render(pug `
                .internal-fsb-element
                  .container-fluid
                    .row.internal-fsb-absolute-layout.internal-fsb-allow-cursor
              `, element);
              break;
          }
          
          if (element !== null) {
            // Being selected capability
            // 
            EditorHelper.installCapabilityOfBeingSelected(element, guid);
            promise.then(() => {
              ManipulationHelper.perform('select', guid);
            });
            
            // Moving cursor inside capability
            //
            EditorHelper.installCapabilityOfBeingMoveInCursor(element);
            
            // Insert the element before the cursor.
            //
            element.setAttribute('internal-fsb-class', content);
            if (Accessories.cursor.getAttribute('internal-cursor-mode') == 'relative') {
              HTMLHelper.addClass(element, 'col-12');
              Accessories.cursor.parentNode.insertBefore(element, Accessories.cursor);
            } else {
              element.style.left = Accessories.cursor.style.left;
              element.style.top = Accessories.cursor.style.top;
              element.style.width = '200px';
              Accessories.cursor.parentNode.appendChild(element);
            }
          }
        }
        break;
      case 'keydown':
        {
          switch (content) {
            case 37:
              EditorHelper.moveCursorUp();
              remember = false;
              break;
            case 38:
              EditorHelper.moveCursorToTheRight();
              remember = false;
              break;
            case 39:
              EditorHelper.moveCursorDown();
              remember = false;
              break;
            case 40:
              EditorHelper.moveCursorToTheLeft();
              remember = false;
              break;
            case 8:
              if (Accessories.cursor.getAttribute('internal-cursor-mode') == 'relative' &&
                  Accessories.cursor.previousSibling &&
                  HTMLHelper.hasClass(Accessories.cursor.previousSibling, 'internal-fsb-element')) {
                accessory = Accessories.cursor.previousSibling;
                Accessories.cursor.parentNode.removeChild(Accessories.cursor.previousSibling);
              } else {
                remember = false;
              }
              break;
          }
        }
        break;
      case 'select':
        {
          if (content) {
            let selecting = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', content as string);
            EditorHelper.select(selecting);
          } else {
            EditorHelper.deselect();
          }
          remember = false;
        }
        break;
      case 'undo':
        {
          if (performedIndex >= 0) {
            let name = performed[performedIndex].name;
            let content = performed[performedIndex].content;
            let accessory = performed[performedIndex].accessory;
            
            console.log('undo', name, content, accessory);
            
            switch (name) {
              case 'move[cursor]':
                content = accessory;
                break;
              case 'update[columnSize]':
                content = accessory;
                break;
              case 'update[size]':
                content = accessory;
                break;
              case 'insert':
                name = 'keydown';
                content = 8;
                break;
              case 'keydown':
                switch (content) {
                  case 8:
                    name = 'append[cursor]';
                    content = accessory;
                    break;
                }
                break;
              case 'select':
                content = accessory;
                break;
            }
            
            performedIndex -= 1;
            ManipulationHelper.perform(name, content, false, true);
          }
          
          remember = false;
        }
        break;
      case 'redo':
        {
          if (performedIndex < performed.length - 1) {
            performedIndex += 1;
            
            let name = performed[performedIndex].name;
            let content = performed[performedIndex].content;
            let accessory = performed[performedIndex].accessory;
            
            console.log('redo', name, content, accessory);
            
            ManipulationHelper.perform(name, content, false, true);
          }
          
          remember = false;
        }
        break;
    }
    
    if (remember) {
      console.log('remember', name, content, accessory);
      
      performedIndex += 1;
      performed = performed.splice(0, performedIndex);
      
      performed.push({
        name: name,
        content: content,
        accessory: accessory
      });
    }
    
    if (!skipAfterPromise) {
      resolve();
    }
    
    EditorHelper.update();
  }
};

export {ManipulationHelper};