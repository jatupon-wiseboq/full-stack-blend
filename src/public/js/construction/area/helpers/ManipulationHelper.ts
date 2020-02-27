import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {RandomHelper} from '../../helpers/RandomHelper.js';
import {EventHelper} from '../../helpers/EventHelper.js';
import {TextHelper} from '../../helpers/TextHelper.js';
import {Accessories, EditorHelper} from './EditorHelper.js';
import {LayoutHelper} from './LayoutHelper.js';
import {RESPONSIVE_SIZE_REGEX} from '../../Constants.js';

let performed: any = [];
let performedIndex: number = -1;
let previousClassName: string = null;

var ManipulationHelper = {
  perform: (name: string, content: any, remember: boolean=true, skipAfterPromise: boolean=false) => {
    let accessory = null;
    let resolve = null;
    let promise = new Promise((_resolve) => { resolve = _resolve; });
    
    switch (name) {
      case 'delete':
        {
          accessory = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', content);
          if (accessory) {
            accessory.parentNode.removeChild(accessory);
          }
        }
        break;
      case 'move[cursor]':
        {
          if (Accessories.cursor.getDOMNode().parentNode != null && EditorHelper.findWalkPathForCursor().join(',') == content.join(',')) {
            remember = false;
          }
          if (remember) {
            accessory = EditorHelper.findWalkPathForCursor();
          }
          EditorHelper.placingCursorUsingWalkPath(content);
        }
        break;
      case 'update':
        {
          let selectingElement = EditorHelper.getSelectingElement();
          if (selectingElement) {
            accessory = {
              elementClassName: selectingElement.getAttribute('class'),
              elementStyle: selectingElement.getAttribute('style')
            }
            if (content.elementClassName !== undefined) {
              selectingElement.setAttribute('class', content.elementClassName);
            }
            if (content.elementStyle !== undefined) {
              selectingElement.setAttribute('style', content.elementStyle);
            }
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
              dx: -content.dx,
              dy: -content.dy,
              dw: -content.dw,
              dh: -content.dh
            }
            
            HTMLHelper.updateInlineStyle(selectingElement, 'left', (position[0] - origin[0] + content.dx) + 'px');
            HTMLHelper.updateInlineStyle(selectingElement, 'top', (position[1] - origin[1] + content.dy) + 'px');
            HTMLHelper.updateInlineStyle(selectingElement, 'width', (size[0] + content.dw) + 'px');
          } else {
            remember = false;
          }
        }
        break;
      case 'update[columnSize]':
        {
          let selectingElement = EditorHelper.getSelectingElement();
          if (selectingElement) {
            if (!remember) {
              if (previousClassName == null) {
                previousClassName = selectingElement.getAttribute('class');
              }
            }
            
            let elementClassName = selectingElement.getAttribute('class');
            
            let currentActiveLayout = Accessories.layoutInfo.currentActiveLayout();
            for (currentActiveLayout; currentActiveLayout >= 0; currentActiveLayout--) {
              if (elementClassName.match(RESPONSIVE_SIZE_REGEX[currentActiveLayout])) break;
            }
            
            let currentPrefix = [' col-', ' col-sm-', ' col-md-', ' col-lg-'][currentActiveLayout];
            
            elementClassName = elementClassName.replace(RESPONSIVE_SIZE_REGEX[currentActiveLayout], '');
            elementClassName += currentPrefix + content;
            elementClassName = TextHelper.removeExtraWhitespaces(elementClassName);
            
            if (!remember) {
              selectingElement.setAttribute('class', elementClassName);
            }
            
            if (remember) {
              promise.then(() => {
                if (previousClassName != null) {
                  selectingElement.setAttribute('class', previousClassName);
                  previousClassName = null;
                }
                ManipulationHelper.perform('update', {
                  elementClassName: elementClassName
                });
              });
            }
          }
          remember = false;
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
          
          accessory = guid;
          
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
            if (Accessories.cursor.getDOMNode().getAttribute('internal-cursor-mode') == 'relative') {
              HTMLHelper.addClass(element, 'col-12');
              HTMLHelper.addClass(element, 'col');
              Accessories.cursor.getDOMNode().parentNode.insertBefore(element, Accessories.cursor.getDOMNode());
            } else {
              HTMLHelper.updateInlineStyle(selectingElement, 'left', Accessories.cursor.getDOMNode().style.left);
              HTMLHelper.updateInlineStyle(selectingElement, 'top', Accessories.cursor.getDOMNode().style.top);
              HTMLHelper.updateInlineStyle(selectingElement, 'width', '150px');
              Accessories.cursor.getDOMNode().parentNode.appendChild(element);
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
              if (Accessories.cursor.getDOMNode().getAttribute('internal-cursor-mode') == 'relative') {
                if (Accessories.cursor.getDOMNode().previousSibling &&
                    HTMLHelper.hasClass(Accessories.cursor.getDOMNode().previousSibling, 'internal-fsb-element')) {
                  accessory = Accessories.cursor.getDOMNode().previousSibling;
                  Accessories.cursor.getDOMNode().parentNode.removeChild(Accessories.cursor.getDOMNode().previousSibling);
                }
              } else {
                remember = false;
              }
              break;
          }
        }
        break;
      case 'select':
        {
          let selectingElement = EditorHelper.getSelectingElement();
          if (selectingElement) {
            accessory = selectingElement.getAttribute('internal-fsb-guid');
          }
          
          if (content) {
            let selecting = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', content as string);
            EditorHelper.select(selecting);
          } else {
            EditorHelper.deselect();
          }
        }
        break;
      case 'undo':
        {
          if (performedIndex >= 0) {
            let name = performed[performedIndex].name;
            let content = performed[performedIndex].content;
            let accessory = performed[performedIndex].accessory;
            let done = false;
            
            console.log('undo', name, content, accessory);
            
            switch (name) {
              case 'move[cursor]':
              case 'update':
              case 'update[size]':
              case 'update[columnSize]':
              case 'select':
                content = accessory;
                break;
              case 'insert':
                name = 'delete';
                content = accessory;
                break;
              case 'keydown':
                switch (content) {
                  case 8:
                    Accessories.cursor.getDOMNode().parentNode.insertBefore(accessory, Accessories.cursor.getDOMNode());
                    done = true;
                    break;
                }
                break;
            }
            
            performedIndex -= 1;
            if (!done) {
              ManipulationHelper.perform(name, content, false, true);
            }
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
      case 'toggle':
        {
          switch (content) {
            case 'guide':
              if (HTMLHelper.hasClass(window.document.body, 'internal-fsb-guide-on')) {
                HTMLHelper.removeClass(window.document.body, 'internal-fsb-guide-on');
                HTMLHelper.addClass(window.document.body, 'internal-fsb-guide-off');
              } else {
                HTMLHelper.removeClass(window.document.body, 'internal-fsb-guide-off');
                HTMLHelper.addClass(window.document.body, 'internal-fsb-guide-on');
              }
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