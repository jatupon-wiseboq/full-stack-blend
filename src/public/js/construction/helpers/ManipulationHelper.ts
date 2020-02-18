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
      case 'append':
        Accessories.cursor.parentNode.insertBefore(content, Accessories.cursor);
        break;
      case 'update[columnSize]':
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
        }
        break;
      case 'insert':
        let element = null;
        let splited = content.split(':');
        let klass = splited[0];
        if (splited[1] === undefined) {
          splited[1] = RandomHelper.generateGUID();
        }
        let guid = splited[1];
        content = splited.join(':');
        
        switch (klass) {
          case 'VerticalStackLayout':
            element = document.createElement('div');
            element = ReactDOM.render(pug `
              .col-12.internal-fsb-element
                .container-fluid
                  .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
            `, element);
            break;
          case 'HorizontalStackLayout':
            element = document.createElement('div');
            element = ReactDOM.render(pug `
              .col-12.internal-fsb-element
                .internal-fsb-strict-layout.internal-fsb-allow-cursor
            `, element);
            break;
          case 'TableLayout':
            element = document.createElement('div');
            element = ReactDOM.render(pug `
              .col-12.internal-fsb-element
                table.table
                  thead
                    tr
                      th.internal-fsb-strict-layout.internal-fsb-allow-cursor
                      th.internal-fsb-strict-layout.internal-fsb-allow-cursor
                      th.internal-fsb-strict-layout.internal-fsb-allow-cursor
                  tbody
                    tr
                      th.internal-fsb-strict-layout.internal-fsb-allow-cursor
                      td.internal-fsb-strict-layout.internal-fsb-allow-cursor
                      td.internal-fsb-strict-layout.internal-fsb-allow-cursor
                    tr
                      th.internal-fsb-strict-layout.internal-fsb-allow-cursor
                      td.internal-fsb-strict-layout.internal-fsb-allow-cursor
                      td.internal-fsb-strict-layout.internal-fsb-allow-cursor
                    tr
                      th.internal-fsb-strict-layout.internal-fsb-allow-cursor
                      td.internal-fsb-strict-layout.internal-fsb-allow-cursor
                      td.internal-fsb-strict-layout.internal-fsb-allow-cursor
            `, element);
            break;
          case 'FlowLayout':
            element = document.createElement('div');
            element = ReactDOM.render(pug `
              .col-12.internal-fsb-element
                .container-fluid
                  .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
            `, element);
            break;
          case 'AbsoluteLayout':
            element = document.createElement('div');
            element = ReactDOM.render(pug `
              .col-12.internal-fsb-element
                .container-fluid
                  .row.internal-fsb-absolute-layout
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
          Accessories.cursor.parentNode.insertBefore(element, Accessories.cursor);
        }
        
        break;
      case 'keydown':
        switch (content) {
          case 37:
          case 38:
            if (Accessories.cursor.previousSibling) {
              Accessories.cursor.parentNode.insertBefore(Accessories.cursor, Accessories.cursor.previousSibling);
            }
            break;
          case 39:
          case 40:
            if (Accessories.cursor.nextSibling) {
              Accessories.cursor.parentNode.insertBefore(Accessories.cursor, Accessories.cursor.nextSibling && Accessories.cursor.nextSibling.nextSibling || null);
            }
            break;
          case 8:
            if (Accessories.cursor.previousSibling && HTMLHelper.hasClass(Accessories.cursor.previousSibling, 'internal-fsb-element')) {
              accessory = Accessories.cursor.previousSibling;
              Accessories.cursor.parentNode.removeChild(Accessories.cursor.previousSibling);
            }
            break;
        }
        
        break;
      case 'select':
        let willSelectedElement = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', content as string);
        if (willSelectedElement) {
          accessory = Accessories.dragger.parentNode.getAttribute('internal-fsb-guid');
          
          willSelectedElement.appendChild(Accessories.dragger);
        }
        
        break;
      case 'undo':
        if (performedIndex >= 0) {
          let name = performed[performedIndex].name;
          let content = performed[performedIndex].content;
          let accessory = performed[performedIndex].accessory;
          
          switch (name) {
            case 'update[columnSize]':
              content = accessory;
              break;
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
            case 'select':
              content = accessory;
              break;
          }
          
          performedIndex -= 1;
          ManipulationHelper.perform(name, content, false, true);
        }
        
        remember = false;
        break;
      case 'redo':
        if (performedIndex < performed.length - 1) {
          performedIndex += 1;
          ManipulationHelper.perform(performed[performedIndex].name, performed[performedIndex].content, false, true);
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
    
    if (!skipAfterPromise) {
      resolve();
    }
  }
};

export {ManipulationHelper};