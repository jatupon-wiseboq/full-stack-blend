import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {RandomHelper} from '../../helpers/RandomHelper.js';
import {EventHelper} from '../../helpers/EventHelper.js';
import {TextHelper} from '../../helpers/TextHelper.js';
import {FontHelper} from '../../helpers/FontHelper.js';
import {Accessories, EditorHelper} from './EditorHelper.js';
import {CursorHelper} from './CursorHelper.js';
import {LayoutHelper} from './LayoutHelper.js';
import {StylesheetHelper} from './StylesheetHelper.js';
import {CapabilityHelper} from './CapabilityHelper.js';
import {ALL_RESPONSIVE_SIZE_REGEX, ALL_RESPONSIVE_OFFSET_REGEX, RESPONSIVE_SIZE_REGEX, RESPONSIVE_OFFSET_REGEX} from '../../Constants.js';

let performed: any = [];
let performedIndex: number = -1;
let previousInfo: any = {};
let isShiftKeyActive: boolean = false;
let isCtrlKeyActive: boolean = false;
let isCommandKeyActive: boolean = false;
let composedUntitledNameCount: any = {};
let composedUntitledNameDictionary: any = {};

function removeAllPresetReferences(presetId: string, link: string) {
	// TODO: should iterate in all documents.
	// 
	let selectingElement = EditorHelper.getSelectingElement();
	
	let elements = HTMLHelper.getElementsByClassName('internal-fsb-element');
	for (let element of elements) {
		let classNames = HTMLHelper.getAttribute(element, 'class');
		let inheritedPresets = StylesheetHelper.getStyleAttribute(element, '-fsb-inherited-presets');
		
		classNames = classNames && classNames.split(' ') || [];
		inheritedPresets = inheritedPresets && inheritedPresets.split(', ') || [];
		
		if (inheritedPresets.indexOf(presetId) != -1) {
			classNames = classNames.filter(klass => klass != '-fsb-preset-' + presetId);
			inheritedPresets = inheritedPresets.filter(_presetId => _presetId != presetId);
			
			ManipulationHelper.perform('select', HTMLHelper.getAttribute(element, 'internal-fsb-guid'), true, false, link);
			ManipulationHelper.perform('update', {
      		attributes: [{
      				name: 'class',
      				value: classNames.join(' ')
      		}],
          styles: [{
              name: '-fsb-inherited-presets',
              value: inheritedPresets.join(', ')
          }]
      }, true, false, link);
		}
	}
	
	if (selectingElement) {
		ManipulationHelper.perform('select', HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid'), true, false, link);
	} else {
		EditorHelper.deselect();
	}
}

var ManipulationHelper = {
  perform: (name: string, content: any, remember: boolean=true, skipAfterPromise: boolean=false, link: any=false) => {
    let accessory = null;
    let resolve = null;
    let promise = new Promise((_resolve) => { resolve = _resolve; });
    let replace = (content && (typeof content === 'object') && content.replace) || false;
    
    switch (name) {
      case 'select':
      	[accessory, remember, link] = ManipulationHelper.handleSelectElement(name, content, remember, promise, link);
        break;
      case 'insert':
      	[accessory, remember, link] = ManipulationHelper.handleInsert(name, content, remember, promise, link);
        break;
      case 'update':
        [accessory, remember, link] = ManipulationHelper.handleUpdate(name, content, remember, promise, link);
        break;
      case 'update[size]':
      	[accessory, remember, link] = ManipulationHelper.handleUpdateElementSize(name, content, remember, promise, link);
        break;
      case 'update[responsive]':
      	[accessory, remember, link] = ManipulationHelper.handleUpdateResponsiveSize(name, content, remember, promise, link);
        break;
      case 'move[cursor]':
      	[accessory, remember, link] = ManipulationHelper.handleMoveCursor(name, content, remember, promise, link);
        break;
      case 'move[element]':
      	[accessory, remember, link] = ManipulationHelper.handleMoveElement(name, content, remember, promise, link);
        break;
      case 'delete':
      	[accessory, remember, link] = ManipulationHelper.handleDeleteElement(name, content, remember, promise, link);
        break;
      case 'keydown':
      	[accessory, remember, link] = ManipulationHelper.handleKeyDown(name, content, remember, promise, link);
        break;
      case 'keyup':
      	[accessory, remember, link] = ManipulationHelper.handleKeyUp(name, content, remember, promise, link);
      	break;
      case 'toggle':
      	[accessory, remember, link] = ManipulationHelper.handleToggleDesignMode(name, content, remember, promise, link);
        break;
      case 'undo':
      	[accessory, remember] = ManipulationHelper.handleUndo(name, content, remember, promise);
        break;
      case 'redo':
      	[accessory, remember] = ManipulationHelper.handleRedo(name, content, remember, promise);
        break;
      case 'swap':
      	[accessory, content, remember] = ManipulationHelper.handleToggleEditorPanel(name, content, remember, promise);
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
        replace: replace,
        link: link
      });
    }
    
    if (!skipAfterPromise) {
      resolve();
    }
    
    EditorHelper.update();
  },
  
  handleInsert: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	let accessory = null;
  	let element = null;
  	
  	if (typeof content === 'string') {
  		if (composedUntitledNameCount[content] === undefined) {
      	composedUntitledNameCount[content] = 0;
      }
      composedUntitledNameCount[content]++;
		      
  		content = {
  			klass: content,
  			guid: RandomHelper.generateGUID(),
  			name: content + ' ' + composedUntitledNameCount[content]
  		}
  	}
    
    accessory = content;
    
    let style: string;
    let isForwardingStyleToChildren: boolean = false;
    
    switch (content.klass) {
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
          table.internal-fsb-element.internal-fsb-table-layout(style={tableLayout: 'fixed'}, internal-fsb-table-collapse="false")
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
        
        style = HTMLHelper.getAttribute(element, 'style');
        style = HTMLHelper.setInlineStyle(style, '-fsb-cell-border-style', 'solid');
        style = HTMLHelper.setInlineStyle(style, '-fsb-cell-border-color', '#000000');
        style = HTMLHelper.setInlineStyle(style, '-fsb-cell-border-size', '1px');
        HTMLHelper.setAttribute(element, 'style', style);
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
          .internal-fsb-element(contentEditable='true', suppressContentEditableWarning=true)
            | ABC
        `, element);
        break;
      case 'Rectangle':
      	element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element.internal-fsb-allow-cursor
        `, element);
        break;
      case 'Iframe':
      	element = document.createElement('div');
        element = ReactDOM.render(pug `
        	.internal-fsb-element(style={display: 'block', borderTopStyle: 'none', borderRightStyle: 'none', borderBottomStyle: 'none', borderLeftStyle: 'none', width: '400px', height: '300px'})
        		iframe
        `, element);
        
        isForwardingStyleToChildren = true;
        break;
      case 'HTML':
      	element = document.createElement('div');
        element = ReactDOM.render(pug `
        	.internal-fsb-element
        		| <b>HTML Content</b>
        `, element);
        break;
      case 'Textbox':
      	element = document.createElement('div');
        element = ReactDOM.render(pug `
        	.internal-fsb-element(style={display: 'block'})
        		input(type='text')
        `, element);
        
        isForwardingStyleToChildren = true;
        break;
      case 'Select':
      	element = document.createElement('div');
        element = ReactDOM.render(pug `
        	.internal-fsb-element(style={display: 'block'})
        		select
        `, element);
        
        isForwardingStyleToChildren = true;
        break;
      case 'Radio':
      	element = document.createElement('div');
        element = ReactDOM.render(pug `
        	.internal-fsb-element(style={display: 'block'})
        		input(type='radio')
        `, element);
        
        isForwardingStyleToChildren = true;
        break;
      case 'Checkbox':
      	element = document.createElement('div');
        element = ReactDOM.render(pug `
        	.internal-fsb-element(style={display: 'block'})
        		input(type='checkbox')
        `, element);
        
        isForwardingStyleToChildren = true;
        break;
      case 'File':
      	element = document.createElement('div');
        element = ReactDOM.render(pug `
        	.internal-fsb-element(style={display: 'block'})
        		input(type='file')
        `, element);
        
        isForwardingStyleToChildren = true;
        break;
      case 'Button':
      	element = document.createElement('div');
        element = ReactDOM.render(pug `
        	.internal-fsb-element(style={display: 'block'})
        		input(type='button')
        `, element);
        
        isForwardingStyleToChildren = true;
        break;
      case 'Image':
      	element = document.createElement('div');
        element = ReactDOM.render(pug `
        	.internal-fsb-element(style={display: 'block', width: '100px', height: '100px'})
        		img
        `, element);
        
        isForwardingStyleToChildren = true;
        break;
      case 'Video':
      	element = document.createElement('div');
        element = ReactDOM.render(pug `
        	.internal-fsb-element(style={display: 'block', width: '300px', height: '150px'})
        		video
        `, element);
        
        isForwardingStyleToChildren = true;
        break;
    }
    
    if (element !== null) {
      // Being selected capability
      // 
      CapabilityHelper.installCapabilityOfBeingSelected(element, content.guid);
      promise.then(() => {
        ManipulationHelper.perform('select', content.guid);
      });
      
      // Moving cursor inside capability
      //
      CapabilityHelper.installCapabilityOfBeingMoveInCursor(element);
      
      if (HTMLHelper.getAttribute(element, 'contentEditable') == 'true') {
      	CapabilityHelper.installCapabilityOfBeingPasted(element);
      }
      
      // Forwarding style to its children capability
      //
      if (isForwardingStyleToChildren) {
      	CapabilityHelper.installCapabilityOfForwardingStyle(element);
      }
      
      // Insert the element before the cursor.
      //
      HTMLHelper.setAttribute(element, 'internal-fsb-class', content.klass);
      if (HTMLHelper.getAttribute(Accessories.cursor.getDOMNode(), 'internal-cursor-mode') == 'relative') {
        if (!isForwardingStyleToChildren) HTMLHelper.addClass(element, 'col-12');
        Accessories.cursor.getDOMNode().parentNode.insertBefore(element, Accessories.cursor.getDOMNode());
      } else {
        StylesheetHelper.setStyleAttribute(element, 'left', Accessories.cursor.getDOMNode().style.left);
        StylesheetHelper.setStyleAttribute(element, 'top', Accessories.cursor.getDOMNode().style.top);
        StylesheetHelper.setStyleAttribute(element, 'width', '150px');
        Accessories.cursor.getDOMNode().parentNode.appendChild(element);
      }
      
      // Name the layer.
      // 
      HTMLHelper.setAttribute(element, 'internal-fsb-name', content.name);
      
      // Update Editor UI
      EditorHelper.updateEditorProperties();
    }
    
    return [accessory, remember, link];
  },
  handleUpdate: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
		let accessory = null;
		let selectingElement = EditorHelper.getSelectingElement();
		
    if (selectingElement) {
      let previousReusablePresetName = HTMLHelper.getAttribute(selectingElement, 'internal-fsb-reusable-preset-name') || null;
      let presetId = HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid');
      
      if (previousReusablePresetName) {
        accessory = {
          attributes: HTMLHelper.getAttributes(selectingElement, true, {
            style: StylesheetHelper.getStylesheetDefinition(presetId)
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
                  StylesheetHelper.setStylesheetDefinition(presetId, nextReusablePresetName, HTMLHelper.getAttribute(selectingElement, 'style') || '');
                  HTMLHelper.removeAttribute(selectingElement, 'style');
                }
              } else {
                if (nextReusablePresetName == null) {
                	found = true;
                	let style = StylesheetHelper.getStylesheetDefinition(presetId);
                	StylesheetHelper.removeStylesheetDefinition(presetId);
                	HTMLHelper.setAttribute(selectingElement, 'style', style);
                } else if (previousReusablePresetName != nextReusablePresetName) {
                  found = true;
                  StylesheetHelper.setStyleAttribute(selectingElement, '-fsb-reusable-name', nextReusablePresetName);
                }
              }
              
              if (nextReusablePresetName) {
                HTMLHelper.setAttribute(selectingElement, 'internal-fsb-reusable-preset-name', nextReusablePresetName);
              } else {
                HTMLHelper.removeAttribute(selectingElement, 'internal-fsb-reusable-preset-name');
                
                link = Math.random();
						  	promise.then(() => {
						  		removeAllPresetReferences(presetId, link);
						  	});
              }
              previousReusablePresetName = nextReusablePresetName;
              break;
            case 'style':
              if (previousReusablePresetName) {
                let style = StylesheetHelper.getStylesheetDefinition(presetId);
                if (style != attribute.value) {
                  found = true;
                  StylesheetHelper.setStylesheetDefinition(presetId, previousReusablePresetName, attribute.value);
                }
              } else {
                if (HTMLHelper.getAttribute(selectingElement, 'style') != attribute.value) {
                  found = true;
                  HTMLHelper.setAttribute(selectingElement, 'style', attribute.value);
                }
              }
              break;
            default:
              if (selectingElement.getAttribute(attribute.name) != attribute.value) {
                found = true;
                if (attribute.value !== null) {
                	HTMLHelper.setAttribute(selectingElement, attribute.name, attribute.value);
                } else {
                	HTMLHelper.removeAttribute(selectingElement, attribute.name);
                }
              }
              break;
          }
        }
      }
      {
      	let inlineStyle = StylesheetHelper.getStyle(selectingElement) || '';
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
          StylesheetHelper.setStyle(selectingElement, inlineStyle);
        }
        
        // Perspective Property
        // 
        if (hash['-fsb-mode']) {
          let strictContainers = HTMLHelper.getElementsByClassName('internal-fsb-strict-layout', selectingElement, 'internal-fsb-element');
          let absoluteContainers = HTMLHelper.getElementsByClassName('internal-fsb-absolute-layout', selectingElement, 'internal-fsb-element');
          let containers = [...strictContainers, ...absoluteContainers];
          let isPerspectiveCamera = (hash['-fsb-mode'] === 'perspective');
          
          for (let container of containers) {
          	let _inlineStyle = HTMLHelper.getAttribute(container, 'style') || '';
          	
          	if (isPerspectiveCamera) {
          		_inlineStyle = HTMLHelper.setInlineStyle(_inlineStyle, 'transform-style', hash['-child-transform-style']);
          		_inlineStyle = HTMLHelper.setInlineStyle(_inlineStyle, 'transform', hash['-child-transform']);
          	} else {
          		_inlineStyle = HTMLHelper.setInlineStyle(_inlineStyle, 'transform-style', '');
          		_inlineStyle = HTMLHelper.setInlineStyle(_inlineStyle, 'transform', '');
          	}
          	
            HTMLHelper.setAttribute(container, 'style', _inlineStyle);
          }
        }
        
        // Table Cell Property (Without Stylesheet)
        //
        if (HTMLHelper.getAttribute(selectingElement, 'internal-fsb-class') == 'TableLayout') {
        	let isCollapse = (hash['border-collapse'] == 'collapse');
        	HTMLHelper.setAttribute(selectingElement, 'internal-fsb-table-collapse', (isCollapse) ? 'true' : 'false');
        	
        	for (let childY of [...selectingElement.childNodes]) {
        		for (let childX of [...childY.childNodes]) {
        			let _inlineStyle = HTMLHelper.getAttribute(childX, 'style') || '';
        			
        			_inlineStyle = HTMLHelper.setInlineStyle(_inlineStyle, 'border-top', '');
        			_inlineStyle = HTMLHelper.setInlineStyle(_inlineStyle, 'border-right', '');
        			_inlineStyle = HTMLHelper.setInlineStyle(_inlineStyle, 'border-bottom', '');
        			_inlineStyle = HTMLHelper.setInlineStyle(_inlineStyle, 'border-left', '');
        			
        			HTMLHelper.setAttribute(childX, 'style', _inlineStyle);
        		}
        	}
        	
        	if (!HTMLHelper.getAttribute(selectingElement, 'internal-fsb-reusable-preset-name')) {
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
				   						let _inlineStyle = HTMLHelper.getAttribute(childX, 'style') || '';
				   						
				   						_inlineStyle = HTMLHelper.setInlineStyle(_inlineStyle, 'border-' + side, style);
				   						
				   						HTMLHelper.setAttribute(childX, 'style', _inlineStyle);
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
    
    return [accessory, remember, link];
  },
  handleUpdateElementSize: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	let accessory = null;
  	
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
      
      StylesheetHelper.setStyleAttribute(selectingElement, 'left', (position[0] - origin[0] + content.dx) + 'px');
      StylesheetHelper.setStyleAttribute(selectingElement, 'top', (position[1] - origin[1] + content.dy) + 'px');
      StylesheetHelper.setStyleAttribute(selectingElement, 'width', (size[0] + content.dw) + 'px');
      StylesheetHelper.setStyleAttribute(selectingElement, 'min-height', (size[1] + content.dh) + 'px');
    } else {
      remember = false;
    }
  	
  	return [accessory, remember, link];
  },
  handleUpdateResponsiveSize: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	let accessory = null;
  	
  	let selectingElement = EditorHelper.getSelectingElement();
    if (selectingElement) {
      if (previousInfo.previousClassName == null) {
        previousInfo.previousClassName = HTMLHelper.getAttribute(selectingElement, 'class');
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
      
      if (currentActiveLayoutForSize == -1) currentActiveLayoutForSize = 0;
      if (currentActiveLayoutForOffset == -1) currentActiveLayoutForOffset = 0;
      let currentOffset = (offsetMatch == null) ? 0 : parseInt(offsetMatch[1]);
      
      let currentSizePrefix = [' col-', ' col-sm-', ' col-md-', ' col-lg-', ' col-xl-'][currentActiveLayoutForSize];
      let currentOffsetPrefix = [' offset-', ' offset-sm-', ' offset-md-', ' offset-lg-', ' offset-xl-'][currentActiveLayoutForOffset];
      
      elementClassName = elementClassName.replace(RESPONSIVE_SIZE_REGEX[currentActiveLayoutForSize], '');
      elementClassName += currentSizePrefix + content.size;
      elementClassName = TextHelper.removeExtraWhitespaces(elementClassName);
      
      elementClassName = elementClassName.replace(RESPONSIVE_OFFSET_REGEX[currentActiveLayoutForOffset], '');
      elementClassName += currentOffsetPrefix + (currentOffset + content.dOffset);
      elementClassName = TextHelper.removeExtraWhitespaces(elementClassName);
      
      if (!remember) {
        HTMLHelper.setAttribute(selectingElement, 'class', elementClassName);
      }
      
      if (remember) {
        promise.then(() => {
          HTMLHelper.setAttribute(selectingElement, 'class', previousInfo.previousClassName);
          previousInfo.previousClassName = null;
          
          let hash = HTMLHelper.getHashMapFromInlineStyle(StylesheetHelper.getStyle(selectingElement) || '');
          
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
  	
  	return [accessory, remember, link];
  },
  handleKeyDown: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	let accessory = null;
  	
  	switch (content) {
      case 37:
        CursorHelper.moveCursorToTheLeft();
        remember = false;
        break;
      case 38:
        CursorHelper.moveCursorUp();
        remember = false;
        break;
      case 39:
        CursorHelper.moveCursorToTheRight();
        remember = false;
        break;
      case 40:
        CursorHelper.moveCursorDown();
        remember = false;
        break;
      case 8:
        {
          if (HTMLHelper.getAttribute(Accessories.cursor.getDOMNode(), 'internal-cursor-mode') == 'relative') {
            if (Accessories.cursor.getDOMNode().previousSibling &&
                HTMLHelper.hasClass(Accessories.cursor.getDOMNode().previousSibling, 'internal-fsb-element')) {
              ManipulationHelper.perform('delete', HTMLHelper.getAttribute(Accessories.cursor.getDOMNode().previousSibling, 'internal-fsb-guid'));
            }
          }
          remember = false;
        }
        break;
      case 27:
        {
          let selectingElement = EditorHelper.getSelectingElement();
          if (selectingElement) {
            accessory = HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid');
          }
      
          EditorHelper.deselect();
        }
        break;
      case 9:
        {
          let selectingElement = EditorHelper.getSelectingElement();
          if (selectingElement) {
            accessory = HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid');
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
  	
  	return [accessory, remember, link];
  },
  handleKeyUp: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	let accessory = null;
  	
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
  	
  	return [accessory, remember, link];
  },
  handleSelectElement: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	let accessory = null;
  	
  	let selectingElement = EditorHelper.getSelectingElement();
    if (selectingElement) {
      accessory = HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid');
    }
    
    if (content) {
      let selecting = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', content as string);
      EditorHelper.select(selecting);
    } else {
      EditorHelper.deselect();
    }
  	
  	return [accessory, remember, link];
  },
  handleDeleteElement: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	let accessory = null;
  	let shouldContinue = true;
  	
  	accessory = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', content);
  	
  	if (accessory && HTMLHelper.getAttribute(accessory, 'internal-fsb-reusable-preset-name')) {
  		if (!confirm('Remove inheriting from the preset "' + HTMLHelper.getAttribute(accessory, 'internal-fsb-reusable-preset-name') + '"?')) {
  			shouldContinue = false;
  		}
  	}
  	
  	link = Math.random();
  	promise.then(() => {
  		let presetId = HTMLHelper.getAttribute(accessory, 'internal-fsb-guid');
			removeAllPresetReferences(presetId, link);
		});
  	
    if (shouldContinue && accessory) {
      accessory.parentNode.removeChild(accessory);
    } else {
    	remember = false;
    }
  	
  	return [accessory, remember, link];
  },
  handleMoveElement: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	let accessory = null;
  	
  	let target = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', content.target);
  	let destination = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', content.destination);
  	
  	if (remember) {
	  	let nextSibling = HTMLHelper.getNextSibling(target, ['internal-fsb-guide', 'internal-fsb-cursor', 'internal-fsb-resizer']);
	  	let previousSibling = HTMLHelper.getPreviousSibling(target, ['internal-fsb-guide', 'internal-fsb-cursor', 'internal-fsb-resizer']);
	  	
	  	if (nextSibling && HTMLHelper.hasAttribute(nextSibling, 'internal-fsb-guid')) {
	  		accessory = {
	  			target: content.target,
	  			destination: HTMLHelper.getAttribute(nextSibling, 'internal-fsb-guid'),
	  			direction: 'insertBefore'
	  		};
	  	} else if (previousSibling && HTMLHelper.hasAttribute(previousSibling, 'internal-fsb-guid')) {
	  		accessory = {
	  			target: content.target,
	  			destination: HTMLHelper.getAttribute(previousSibling, 'internal-fsb-guid'),
	  			direction: 'insertAfter'
	  		};
	  	} else {
	  		let suffix = "";
	  		if (target.parentNode.tagName == 'TD') {
	  			let layout = HTMLHelper.findTheParentInClassName('internal-fsb-element', target.parentNode);
	  			let row = [...layout.childNodes].indexOf(target.parentNode.parentNode);
	  			let column = [...target.parentNode.parentNode.childNodes].indexOf(target.parentNode);
	  			
	  			suffix = ':' + row + ',' + column;
	  		}
	  		let destination = HTMLHelper.getAttribute(HTMLHelper.findTheParentInClassName('internal-fsb-element', target.parentNode, true), 'internal-fsb-guid');
	  		accessory = {
	  			target: content.target,
	  			destination: (destination == null) ? '0' : destination + suffix,
	  			direction: 'appendChild'
	  		};
	  	}
	  	
	  	link = RandomHelper.generateGUID();
  		
	  	let elementClassName = HTMLHelper.getAttribute(target, 'class') || '';
	  	
	  	if (HTMLHelper.getAttribute(destination, 'internal-fsb-class') == 'Rectangle') {
	  		elementClassName = elementClassName.replace(ALL_RESPONSIVE_SIZE_REGEX, '');
				elementClassName = elementClassName.replace(ALL_RESPONSIVE_OFFSET_REGEX, '');
	  	}
    	
			promise.then(() => {
	      elementClassName = TextHelper.removeExtraWhitespaces(elementClassName);
				ManipulationHelper.perform('update', {
					attributes: [{
						name: 'class',
						value: elementClassName
					}]
				}, true, false, link);
			});
		}
		
		switch (content.direction) {
    	case 'appendChild':
    	  switch (HTMLHelper.getAttribute(destination, 'internal-fsb-class')) {
      		case 'FlowLayout':
      			destination = HTMLHelper.getElementByClassName('internal-fsb-allow-cursor', destination);
      			break;
      		case 'TableLayout':
      			let info = content.destination.split(':')[1].split(',');
      			let row = parseInt(info[0]);
      			let column = parseInt(info[1]);
      			
      			destination = destination.childNodes[row].childNodes[column];
      			break;
      		case 'AbsoluteLayout':
      			destination = HTMLHelper.getElementByClassName('internal-fsb-allow-cursor', destination);
      			break;
      	}
    	default:
    		EditorHelper.move(target, destination, content.direction);
    		break;
    }
  	
  	return [accessory, remember, link];
  },
  handleMoveCursor: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	let accessory = null;
  	
  	if (Accessories.cursor.getDOMNode().parentNode != null && CursorHelper.findWalkPathForCursor().join(',') == content.join(',')) {
      remember = false;
    }
    if (remember) {
      accessory = CursorHelper.findWalkPathForCursor();
    }
    CursorHelper.placingCursorUsingWalkPath(content);
  	
  	return [accessory, remember, link];
  },
  handleToggleDesignMode: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	let accessory = null;
  	
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
  	
  	return [accessory, remember, link];
  },
  handleUndo: (name: string, content: any, remember: boolean, promise: Promise) => {
  	let accessory = null;
    let link = false;
  	
  	if (performedIndex >= 0) {
      let name = performed[performedIndex].name;
      let content = performed[performedIndex].content;
      let accessory = performed[performedIndex].accessory;
      let done = false;
      
      link = performed[performedIndex].link;
      
      console.log('undo', name, content, accessory);
      
      switch (name) {
        case 'insert':
          name = 'delete';
          content = accessory.guid;
          break;
        case 'delete':
        	Accessories.cursor.getDOMNode().parentNode.insertBefore(accessory, Accessories.cursor.getDOMNode());
        	done = true;
        	break;
        case 'keydown':
          switch (content) {
            case 8:
              done = true;
              break;
            case 27:
            case 9:
              name = 'select';
              content = accessory;
              break;
          }
          break;
        default:
        	content = accessory;
        	break;
      }
      
      performedIndex -= 1;
      if (!done) {
        ManipulationHelper.perform(name, content, false, true);
      }
    }
    
    remember = false;
    
    if (link && performedIndex >= 0 && performed[performedIndex].link === link) {
    	promise.then(() => {
        ManipulationHelper.perform('undo', null);
      });
    }
  	
  	return [accessory, remember];
  },
  handleRedo: (name: string, content: any, remember: boolean, promise: Promise) => {
  	let accessory = null;
    let link = false;
  	
  	if (performedIndex < performed.length - 1) {
      performedIndex += 1;
      
      let name = performed[performedIndex].name;
      let content = performed[performedIndex].content;
      let accessory = performed[performedIndex].accessory;
      
      link = performed[performedIndex].link;
      
      console.log('redo', name, content, accessory);
      
      ManipulationHelper.perform(name, (name == 'insert') ? accessory : content, false, true);
    }
    
    remember = false;
    
    if (link && performedIndex + 1 < performed.length - 1 && performed[performedIndex + 1].link === link) {
    	promise.then(() => {
        ManipulationHelper.perform('redo', null);
      });
    }
  	
  	return [accessory, remember];
  },
  handleToggleEditorPanel: (name: string, content: any, remember: boolean, promise: Promise) => {
    let accessory = null;
    let link = false;
    
    if (content.accessory) {
      // The action has taken before this line.
      // 
      accessory = content.accessory;
      content = content.id;
    } else {
      // This line is trying to undo/redo. Send the action out.
      // 
      if (content != null) {
        EditorHelper.synchronize('swap', content);
      }
    }
    
    return [accessory, content, remember];
  }
};

export {ManipulationHelper};