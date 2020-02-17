import {HTMLHelper} from './helpers/HTMLHelper.js';
import {EditorHelper} from './helpers/EditorHelper.js';
import {RandomHelper} from './helpers/RandomHelper.js';
import {LayoutHelper} from './helpers/LayoutHelper.js';
import {EventHelper} from './helpers/EventHelper.js';
import {FullStackBlend, DeclarationHelper} from '../helpers/DeclarationHelper.js';
import './components/Cursor.js';
import './components/Dragger.js';

declare let React: any;
declare let ReactDOM: any;

(() => {
  let performed: any = [];
  let performedIndex: number = -1;
  
  let cursor = document.createElement('div');
  ReactDOM.render(<FullStackBlend.Components.Cursor />, cursor);
  cursor = cursor.firstChild;
  
  function draggerOnUpdate(diffX: number, diffY: number, diffW: number, diffH: number) {
    let size = LayoutHelper.calculateColumnSize(diffW);
    if (size !== null) {
      perform('update[columnSize]', size);
    }
  }
  
  let dragger = document.createElement('div');
  ReactDOM.render(<FullStackBlend.Components.Dragger onUpdate={draggerOnUpdate} />, dragger);
  dragger = dragger.firstChild;
  
  function perform(name: string, content: any, remember: boolean=true, skipAfterPromise: boolean=false) {
    let accessory = null;
    let resolve = null;
    let promise = new Promise((_resolve) => { resolve = _resolve; });
    
    switch (name) {
      case 'append':
        cursor.parentNode.insertBefore(content, cursor);
        break;
      case 'update[columnSize]':
        let selectingElement = EditorHelper.getSelectingElement();
        if (selectingElement) {
          accessory = parseInt(selectingElement.className.match(/col\-([1-9]+)/)[1] || 12);
          selectingElement.className = selectingElement.className
            .replace(/col\-[1-9]+/gi, '')
            .replace(/  /gi, '')
            .trim() + ' col-' + content;
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
                    | 0
            `, element);
            break;
          case 'HorizontalStackLayout':
            element = document.createElement('div');
            element = ReactDOM.render(pug `
              .col-12.internal-fsb-element
                .container-fluid
                  .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
                    | 1
            `, element);
            break;
          case 'TableLayout':
            element = document.createElement('div');
            element.innerHTML = '---';
            break;
          case 'FlowLayout':
            element = document.createElement('div');
            element.innerHTML = '+++';
            break;
          case 'AbsoluteLayout':
            element = document.createElement('div');
            element.innerHTML = 'bbb';
            break;
        }
        
        if (element !== null) {
          element.setAttribute('internal-fsb-guid', guid);
          element.addEventListener('click', (event) => {
            if (EditorHelper.getSelectingElement() != EventHelper.getCurrentElement(event)) {
              perform('select', guid);
            }
            return EventHelper.cancel(event);
          }, false);
          
          promise.then(() => {
            perform('select', guid);
          });
          
          element.setAttribute('internal-fsb-class', content);
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
            if (cursor.previousSibling && (cursor.previousSibling as HTMLElement).className.indexOf('internal-fsb-element') != -1) {
              accessory = cursor.previousSibling;
              cursor.parentNode.removeChild(cursor.previousSibling);
            }
            break;
        }
        
        break;
      case 'select':
        let willSelectedElement = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', content as string);
        if (willSelectedElement) {
          accessory = dragger.parentNode.getAttribute('internal-fsb-guid');
          
          willSelectedElement.appendChild(dragger);
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
          perform(name, content, false, true);
        }
        
        remember = false;
        break;
      case 'redo':
        if (performedIndex < performed.length - 1) {
          performedIndex += 1;
          perform(performed[performedIndex].name, performed[performedIndex].content, false, true);
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
  
  window.addEventListener("message", (event) => {
    let data = JSON.parse(event.data);
    perform(data.name, data.content);
  });
  
  window.addEventListener("keydown", (event) => {
    perform('keydown', event.keyCode);
  });
  
  window.addEventListener("click", (event) => {
    EditorHelper.synchronize("click", null);
  });
  
  let element = HTMLHelper.getElementByClassName('internal-fsb-allow-cursor');
  if (element) {
    element.appendChild(cursor);
  }
})();