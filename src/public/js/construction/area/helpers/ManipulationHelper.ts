import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {RandomHelper} from '../../helpers/RandomHelper.js';
import {EventHelper} from '../../helpers/EventHelper.js';
import {TextHelper} from '../../helpers/TextHelper.js';
import {FontHelper} from '../../helpers/FontHelper.js';
import {Accessories, EditorHelper} from './EditorHelper.js';
import {LayoutHelper} from './LayoutHelper.js';
import {RESPONSIVE_SIZE_REGEX, RESPONSIVE_OFFSET_REGEX} from '../../Constants.js';

let performed: any = [];
let performedIndex: number = -1;
let previousInfo: any = {};
let isShiftKeyActive: boolean = false;
let isCtrlKeyActive: boolean = false;
let isCommandKeyActive: boolean = false;

var ManipulationHelper = {
  perform: (name: string, content: any, remember: boolean=true, skipAfterPromise: boolean=false) => {
    let accessory = null;
    let resolve = null;
    let promise = new Promise((_resolve) => { resolve = _resolve; });
    let replace = (content && (typeof content === 'object') && content.replace) || false;
    
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
            let previousReusablePresetName = selectingElement.getAttribute('internal-fsb-reusable-preset-name') || null;
            
            if (previousReusablePresetName) {
              accessory = {
                attributes: HTMLHelper.getAttributes(selectingElement, true, {
                  style: EditorHelper.getStylesheetDefinition(previousReusablePresetName)
                })
              };
            } else {
              accessory = {
                attributes: HTMLHelper.getAttributes(selectingElement, true, {
                  'internal-fsb-reusable-preset-name': null
                })
              };
            }
            
            let found = false;
            
            if (content.attributes !== undefined) {
              for (let attribute of content.attributes) {
                switch (attribute.name) {
                  case 'internal-fsb-reusable-preset-name':
                    let nextReusablePresetName = attribute.value || null;
                    
                    if (previousReusablePresetName == null) {
                      if (nextReusablePresetName != null) {
                        found = true;
                        EditorHelper.setStylesheetDefinition(nextReusablePresetName,
                                                             selectingElement.getAttribute('style') || '',
                                                             selectingElement.getAttribute('internal-fsb-guid'));
                        selectingElement.removeAttribute('style');
                      }
                    } else {
                      if (nextReusablePresetName == null) {
                        found = true;
                        let style = EditorHelper.getStylesheetDefinition(previousReusablePresetName);
                        EditorHelper.removeStylesheetDefinition(previousReusablePresetName, selectingElement.getAttribute('internal-fsb-guid'));
                        selectingElement.setAttribute('style', style);
                      } else if (previousReusablePresetName != nextReusablePresetName) {
                        found = true;
                        EditorHelper.swapStylesheetName(previousReusablePresetName, nextReusablePresetName);
                      }
                    }
                    
                    if (nextReusablePresetName) {
                      selectingElement.setAttribute('internal-fsb-reusable-preset-name', nextReusablePresetName);
                      if (!selectingElement.getAttribute('internal-fsb-inherited-presets')) {
                        selectingElement.setAttribute('internal-fsb-inherited-presets', '+' + nextReusablePresetName + '+');
                      }
                    } else {
                      selectingElement.removeAttribute('internal-fsb-reusable-preset-name');
                    }
                    previousReusablePresetName = nextReusablePresetName;
                    break;
                  case 'style':
                    if (previousReusablePresetName) {
                      let style = EditorHelper.getStylesheetDefinition(previousReusablePresetName);
                      if (style != attribute.value) {
                        found = true;
                        EditorHelper.setStylesheetDefinition(previousReusablePresetName,
                                                             attribute.value,
                                                             selectingElement.getAttribute('internal-fsb-guid'));
                      }
                    } else {
                      if (selectingElement.getAttribute('style') != attribute.value) {
                        found = true;
                        selectingElement.setAttribute('style', attribute.value);
                      }
                    }
                    break;
                  default:
                    if (selectingElement.getAttribute(attribute.name) != attribute.value) {
                      found = true;
                      selectingElement.setAttribute(attribute.name, attribute.value);
                    }
                    break;
                }
              }
            }
            {
            	let inlineStyle = EditorHelper.getStyle(selectingElement) || '';
              let hash = HTMLHelper.getHashMapFromInlineStyle(inlineStyle);
              
              if (content.styles != undefined) {
	              for (let aStyle of content.styles) {
	                let name = aStyle.name.toString().trim();
	                if (hash[name] != aStyle.value) {
	                  found = true;
	                  
	                  hash[name] = aStyle.value;
	                  if (HTMLHelper.hasVendorPrefix('-webkit-', name)) hash['-webkit-' + name] = aStyle.value;
	                  if (HTMLHelper.hasVendorPrefix('-moz-', name)) hash['-moz-' + name] = aStyle.value;
	                  if (HTMLHelper.hasVendorPrefix('-ms-', name)) hash['-ms-' + name] = aStyle.value;
	                  
	                  if (aStyle.name == 'font-family') {
	                    FontHelper.load(aStyle.value);
	                  }
	                }
	              }
	              
	              inlineStyle = HTMLHelper.getInlineStyleFromHashMap(hash);
	              EditorHelper.setStyle(selectingElement, inlineStyle);
	            }
	            
	            // Perspective Property
              // 
              if (hash['-fsb-mode']) {
	              let strictContainers = HTMLHelper.getElementsByClassName('internal-fsb-strict-layout', selectingElement, 'internal-fsb-element');
	              let absoluteContainers = HTMLHelper.getElementsByClassName('internal-fsb-absolute-layout', selectingElement, 'internal-fsb-element');
	              let containers = [...strictContainers, ...absoluteContainers];
	              let isPerspectiveCamera = (hash['-fsb-mode'] === 'perspective');
	              
	              for (let container of containers) {
	              	let _inlineStyle = container.getAttribute('style') || '';
	              	
	              	if (isPerspectiveCamera) {
	              		_inlineStyle = HTMLHelper.updateInlineStyle(_inlineStyle, 'transform-style', hash['-child-transform-style']);
	              		_inlineStyle = HTMLHelper.updateInlineStyle(_inlineStyle, 'transform', hash['-child-transform']);
	              	} else {
	              		_inlineStyle = HTMLHelper.updateInlineStyle(_inlineStyle, 'transform-style', '');
	              		_inlineStyle = HTMLHelper.updateInlineStyle(_inlineStyle, 'transform', '');
	              	}
	              	
	                container.setAttribute('style', _inlineStyle);
	              }
	            }
	            
	            // Table Cell Property (Without Stylesheet)
	            //
	            if (selectingElement.getAttribute('internal-fsb-class').split(':')[0] == 'TableLayout') {
	            	let isCollapse = (hash['border-collapse'] == 'collapse');
	            	selectingElement.setAttribute('internal-fsb-table-collapse', (isCollapse) ? 'true' : 'false');
	            	
	            	for (let childY of [...selectingElement.childNodes]) {
	            		for (let childX of [...childY.childNodes]) {
	            			let _inlineStyle = childX.getAttribute('style') || '';
	            			
	            			_inlineStyle = HTMLHelper.updateInlineStyle(_inlineStyle, 'border-top', '');
	            			_inlineStyle = HTMLHelper.updateInlineStyle(_inlineStyle, 'border-right', '');
	            			_inlineStyle = HTMLHelper.updateInlineStyle(_inlineStyle, 'border-bottom', '');
	            			_inlineStyle = HTMLHelper.updateInlineStyle(_inlineStyle, 'border-left', '');
	            			
	            			childX.setAttribute('style', _inlineStyle);
	            		}
	            	}
	            	
	            	if (!selectingElement.getAttribute('internal-fsb-reusable-preset-name')) {
		            	let tableCellDefinitions = inlineStyle.match(/-fsb-cell-([0-9]+)-([0-9]+)-(top|right|left|bottom)\: ([^;]+)/g);
		            	if (tableCellDefinitions !== null) {
								   	for (let tableCellDefinition of tableCellDefinitions) {
							   			let matchedInfo = tableCellDefinition.match(/-fsb-cell-([0-9]+)-([0-9]+)-(top|right|left|bottom)\: ([^;]+)/);
							   			
							   			let x = parseInt(matchedInfo[1]);
							   			let y = parseInt(matchedInfo[2]);
							   			let side = matchedInfo[3];
							   			let style = matchedInfo[4];
							   			
							   			let childY = selectingElement.childNodes[y];
							   			if (childY) {
							   				if (childY.childNodes[x]) {
							   					let childX = childY.childNodes[x];
							   					if (childX) {
							   						let _inlineStyle = childX.getAttribute('style') || '';
							   						
							   						_inlineStyle = HTMLHelper.updateInlineStyle(_inlineStyle, 'border-' + side, style);
							   						
							   						childX.setAttribute('style', _inlineStyle);
							   					}
							   				}
							   			}
								   	}
								  }
								}
	            }
            }
            
            if (remember && !found) {
              remember = false;
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
            
            EditorHelper.setStyleAttribute(selectingElement, 'left', (position[0] - origin[0] + content.dx) + 'px');
            EditorHelper.setStyleAttribute(selectingElement, 'top', (position[1] - origin[1] + content.dy) + 'px');
            EditorHelper.setStyleAttribute(selectingElement, 'width', (size[0] + content.dw) + 'px');
            EditorHelper.setStyleAttribute(selectingElement, 'min-height', (size[1] + content.dh) + 'px');
          } else {
            remember = false;
          }
        }
        break;
      case 'update[responsive]':
        {
          let selectingElement = EditorHelper.getSelectingElement();
          if (selectingElement) {
            if (previousInfo.previousClassName == null) {
              previousInfo.previousClassName = selectingElement.getAttribute('class');
            }
            
            let elementClassName = previousInfo.previousClassName;
            
            let currentActiveLayoutForSize = Accessories.layoutInfo.currentActiveLayout();
            let currentActiveLayoutForOffset = currentActiveLayoutForSize;
            let offsetMatch = null;
            
            for (currentActiveLayoutForSize; currentActiveLayoutForSize >= 0; currentActiveLayoutForSize--) {
              if (elementClassName.match(RESPONSIVE_SIZE_REGEX[currentActiveLayoutForSize])) break;
            }
            
            for (currentActiveLayoutForOffset; currentActiveLayoutForOffset >= 0; currentActiveLayoutForOffset--) {
              let _offsetMatch = elementClassName.match(RESPONSIVE_OFFSET_REGEX[currentActiveLayoutForOffset]);
              if (_offsetMatch) {
                offsetMatch = _offsetMatch;
                break;
              }
            }
            
            if (currentActiveLayoutForOffset == -1) currentActiveLayoutForOffset = 0;
            let currentOffset = (offsetMatch == null) ? 0 : parseInt(offsetMatch[1]);
            
            let currentSizePrefix = [' col-', ' col-sm-', ' col-md-', ' col-lg-'][currentActiveLayoutForSize];
            let currentOffsetPrefix = [' offset-', ' offset-sm-', ' offset-md-', ' offset-lg-'][currentActiveLayoutForOffset];
            
            elementClassName = elementClassName.replace(RESPONSIVE_SIZE_REGEX[currentActiveLayoutForSize], '');
            elementClassName += currentSizePrefix + content.size;
            elementClassName = TextHelper.removeExtraWhitespaces(elementClassName);
            
            elementClassName = elementClassName.replace(RESPONSIVE_OFFSET_REGEX[currentActiveLayoutForOffset], '');
            elementClassName += currentOffsetPrefix + (currentOffset + content.dOffset);
            elementClassName = TextHelper.removeExtraWhitespaces(elementClassName);
            
            if (!remember) {
              selectingElement.setAttribute('class', elementClassName);
            }
            
            if (remember) {
              promise.then(() => {
                selectingElement.setAttribute('class', previousInfo.previousClassName);
                previousInfo.previousClassName = null;
                
                let hash = HTMLHelper.getHashMapFromInlineStyle(EditorHelper.getStyle(selectingElement) || '');
                
                if (content.dh != 0) {
                  hash['min-height'] = (content.h + content.dh) + 'px';
                }
                if (content.dy != 0) {
                  let position = HTMLHelper.getPosition(selectingElement, false);
                  hash['margin-top'] = (position[1] + content.dy) + 'px';
                }
                
                ManipulationHelper.perform('update', {
                  attributes: [{
                    name: 'class',
                    value: elementClassName
                  }, {
                    name: 'style',
                    value: HTMLHelper.getInlineStyleFromHashMap(hash)
                  }]
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
                table.internal-fsb-element.internal-fsb-table-layout(internal-fsb-table-collapse="false")
                  tr
                    td.internal-fsb-strict-layout.internal-fsb-allow-cursor
                    td.internal-fsb-strict-layout.internal-fsb-allow-cursor
                    td.internal-fsb-strict-layout.internal-fsb-allow-cursor
                  tr
                    td.internal-fsb-strict-layout.internal-fsb-allow-cursor
                    td.internal-fsb-strict-layout.internal-fsb-allow-cursor
                    td.internal-fsb-strict-layout.internal-fsb-allow-cursor
                  tr
                    td.internal-fsb-strict-layout.internal-fsb-allow-cursor
                    td.internal-fsb-strict-layout.internal-fsb-allow-cursor
                    td.internal-fsb-strict-layout.internal-fsb-allow-cursor
              `, element);
              element.setAttribute('style', 'table-layout: fixed; -fsb-cell-border-style: solid; -fsb-cell-border-color: #000000; -fsb-cell-border-size: 1px');
              break;
            case 'AbsoluteLayout':
              element = document.createElement('div');
              element = ReactDOM.render(pug `
                .internal-fsb-element
                  .container-fluid
                    .row.internal-fsb-absolute-layout.internal-fsb-allow-cursor
              `, element);
              break;
            case 'TextElement':
              element = document.createElement('div');
              element = ReactDOM.render(pug `
                .internal-fsb-element(contentEditable='true')
                  | ABC
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
            
            if (element.getAttribute('contentEditable') == 'true') {
            	EditorHelper.installCapabilityOfBeingPasted(element);
            }
            
            // Insert the element before the cursor.
            //
            element.setAttribute('internal-fsb-class', content);
            if (Accessories.cursor.getDOMNode().getAttribute('internal-cursor-mode') == 'relative') {
              HTMLHelper.addClass(element, 'col-12');
              HTMLHelper.addClass(element, 'col');
              Accessories.cursor.getDOMNode().parentNode.insertBefore(element, Accessories.cursor.getDOMNode());
            } else {
              EditorHelper.setStyleAttribute(element, 'left', Accessories.cursor.getDOMNode().style.left);
              EditorHelper.setStyleAttribute(element, 'top', Accessories.cursor.getDOMNode().style.top);
              EditorHelper.setStyleAttribute(element, 'width', '150px');
              Accessories.cursor.getDOMNode().parentNode.appendChild(element);
            }
            
            // Update Editor UI
            EditorHelper.updateEditorProperties();
          }
        }
        break;
      case 'keydown':
        {
          switch (content) {
            case 37:
              EditorHelper.moveCursorToTheLeft();
              remember = false;
              break;
            case 38:
              EditorHelper.moveCursorUp();
              remember = false;
              break;
            case 39:
              EditorHelper.moveCursorToTheRight();
              remember = false;
              break;
            case 40:
              EditorHelper.moveCursorDown();
              remember = false;
              break;
            case 8:
              {
                if (Accessories.cursor.getDOMNode().getAttribute('internal-cursor-mode') == 'relative') {
                  if (Accessories.cursor.getDOMNode().previousSibling &&
                      HTMLHelper.hasClass(Accessories.cursor.getDOMNode().previousSibling, 'internal-fsb-element')) {
                    accessory = Accessories.cursor.getDOMNode().previousSibling;
                    Accessories.cursor.getDOMNode().parentNode.removeChild(Accessories.cursor.getDOMNode().previousSibling);
                  }
                } else {
                  remember = false;
                }
              }
              break;
            case 27:
              {
                let selectingElement = EditorHelper.getSelectingElement();
                if (selectingElement) {
                  accessory = selectingElement.getAttribute('internal-fsb-guid');
                }
            
                EditorHelper.deselect();
              }
              break;
            case 9:
              {
                let selectingElement = EditorHelper.getSelectingElement();
                if (selectingElement) {
                  accessory = selectingElement.getAttribute('internal-fsb-guid');
                }
                
                EditorHelper.selectNextElement();
              }
              break;
            case 16:
              isShiftKeyActive = true;
              remember = false;
              break;
            case 17:
              isCtrlKeyActive = true;
              remember = false;
              break;
            case 91:
              isCommandKeyActive = true;
              remember = false;
              break;
            case 90:
              {
                console.log(isShiftKeyActive, isCommandKeyActive, isCtrlKeyActive);
                
                if ((!isShiftKeyActive && isCommandKeyActive && !isCtrlKeyActive) ||
                    (!isShiftKeyActive && !isCommandKeyActive && isCtrlKeyActive)) { // Undo
                  ManipulationHelper.perform('undo', null);
                  remember = false;
                } else if ((isShiftKeyActive && isCommandKeyActive && !isCtrlKeyActive) ||
                           (isShiftKeyActive && !isCommandKeyActive && isCtrlKeyActive)) { // Redo
                  ManipulationHelper.perform('redo', null);
                  remember = false;
                }
              }
              break;
          }
        }
        break;
      case 'keyup':
        {
          switch (content) {
            case 16:
              isShiftKeyActive = false;
              break;
            case 17:
              isCtrlKeyActive = false;
              break;
            case 91:
              isCommandKeyActive = false;
              break;
          }
          remember = false;
        }
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
                  case 27:
                  case 9:
                    name = 'select';
                    content = accessory;
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
      if (replace && performedIndex >= 0) {
        if (performed[performed.length - 1].replace === replace) {
          performedIndex -= 1;
          accessory = performed.splice(-1)[0].accessory;
        }
      }
      
      console.log('remember', name, content, accessory, replace);
      
      performedIndex += 1;
      performed = performed.splice(0, performedIndex);
      
      performed.push({
        name: name,
        content: content,
        accessory: accessory,
        replace: replace
      });
    }
    
    if (!skipAfterPromise) {
      resolve();
    }
    
    EditorHelper.update();
  }
};

export {ManipulationHelper};