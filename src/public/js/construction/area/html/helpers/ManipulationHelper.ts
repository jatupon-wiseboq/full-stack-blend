import {HTMLHelper} from '../../../helpers/HTMLHelper.js';
import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {RandomHelper} from '../../../helpers/RandomHelper.js';
import {EventHelper} from '../../../helpers/EventHelper.js';
import {TextHelper} from '../../../helpers/TextHelper.js';
import {FontHelper} from '../../../helpers/FontHelper.js';
import {Accessories, EditorHelper} from './EditorHelper.js';
import {InternalProjectSettings, WorkspaceHelper} from './WorkspaceHelper.js';
import {CursorHelper} from './CursorHelper.js';
import {LayoutHelper} from './LayoutHelper.js';
import {StylesheetHelper} from './StylesheetHelper.js';
import {CapabilityHelper} from './CapabilityHelper.js';
import {ALL_RESPONSIVE_SIZE_REGEX, ALL_RESPONSIVE_OFFSET_REGEX, RESPONSIVE_SIZE_REGEX, RESPONSIVE_OFFSET_REGEX, INTERNAL_CLASSES_GLOBAL_REGEX, NON_SINGLE_CONSECUTIVE_SPACE_GLOBAL_REGEX, CELL_STYLE_ATTRIBUTE_REGEX_GLOBAL, CELL_STYLE_ATTRIBUTE_REGEX_LOCAL} from '../../../Constants.js';

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
    let tag = (content && (typeof content === 'object') && content.tag) || null;
    
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
      case 'table':
      	[accessory, remember, link, content] = ManipulationHelper.handleModifyTable(name, content, remember, promise, link);
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
    
    if (content && typeof content === 'object') {
      content.tag = null;
    }
    
    if (remember) {
      if (replace && performedIndex >= 0) {
        if (performed[performed.length - 1].replace === replace) {
          performedIndex -= 1;
          accessory = performed.splice(-1)[0].accessory;
        }
      }
      
      console.log('remember', name, content, accessory, replace, link);
      
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
    
    EditorHelper.update(tag);
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
    let isComponentInsertion: boolean = false;
    
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
            tbody
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
        	.internal-fsb-element(style={display: 'block', borderTopStyle: 'none', borderRightStyle: 'none', borderBottomStyle: 'none', borderLeftStyle: 'none', width: '100%', minHeight: '300px'})
        		iframe
        `, element);
        
        isForwardingStyleToChildren = true;
        break;
      case 'HTML':
      	element = document.createElement('div');
        element = ReactDOM.render(pug `
        	.internal-fsb-element
        	  .html
        `, element);
        break;
      case 'Hidden':
      	element = document.createElement('div');
        element = ReactDOM.render(pug `
        	input.internal-fsb-element(type='hidden')
        `, element);
        break;
      case 'Textbox':
      	element = document.createElement('div');
        element = ReactDOM.render(pug `
        	.internal-fsb-element(style={display: 'block', width: '100%'})
        		input(type='text')
        `, element);
        
        isForwardingStyleToChildren = true;
        break;
      case 'Select':
      	element = document.createElement('div');
        element = ReactDOM.render(pug `
        	.internal-fsb-element(style={display: 'block', width: '100%'})
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
      case 'Label':
      	element = document.createElement('label');
        element = ReactDOM.render(pug `
          label.internal-fsb-element
            .container-fluid
              .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
        `, element);
        break;
      case 'File':
      	element = document.createElement('div');
        element = ReactDOM.render(pug `
        	.internal-fsb-element(style={display: 'block', width: '100%'})
        		input(type='file')
        `, element);
        
        isForwardingStyleToChildren = true;
        break;
      case 'Button':
      	element = document.createElement('div');
        element = ReactDOM.render(pug `
          button.internal-fsb-element.internal-fsb-allow-cursor(type='button')
            .internal-fsb-element(contentEditable='true', suppressContentEditableWarning=true, internal-fsb-class='TextElement', internal-fsb-guid=content.guid + '-text', internal-fsb-name='TextElement')
              | Button
        `, element);
        break;
      case 'Image':
      	element = document.createElement('div');
        element = ReactDOM.render(pug `
        	.internal-fsb-element.col-4(style={display: 'block', width: '100%', minHeight: '100px'})
        		img
        `, element);
        
        isForwardingStyleToChildren = true;
        break;
      case 'Video':
      	element = document.createElement('div');
        element = ReactDOM.render(pug `
        	.internal-fsb-element.col-4(style={display: 'block', width: '100%', minHeight: '150px'})
        		video
        `, element);
        
        isForwardingStyleToChildren = true;
        break;
      case 'Component':
        let componentInfo = WorkspaceHelper.getComponentData(content.id);
        let componentName = componentInfo.name;
  	  
    	  if (composedUntitledNameCount[componentName] === undefined) {
        	composedUntitledNameCount[componentName] = 0;
        }
        composedUntitledNameCount[componentName]++;
        
    	  content.guid = RandomHelper.generateGUID();
    	  content.name = componentName + ' ' + composedUntitledNameCount[componentName];
        
        element = document.createElement('div');
        element.innerHTML = componentInfo.html;
        element = element.firstChild;
        
        HTMLHelper.setAttribute(element, 'internal-fsb-inheriting', content.id);
        
        isComponentInsertion = true;
        break;
    }
    
    if (element !== null) {
      // Assign GUID and name.
      // 
      HTMLHelper.setAttribute(element, 'internal-fsb-guid', content.guid);
      HTMLHelper.setAttribute(element, 'internal-fsb-name', content.name);
      
      // Being selected capability
      // 
      CapabilityHelper.installCapabilityOfBeingSelected(element);
      promise.then(() => {
        ManipulationHelper.perform('select', content.guid);
      });
      
      // Moving cursor inside capability
      //
      if (!isComponentInsertion) CapabilityHelper.installCapabilityOfBeingMoveInCursor(element);
      
      if (!isComponentInsertion && HTMLHelper.getAttribute(element, 'contentEditable') == 'true') {
      	CapabilityHelper.installCapabilityOfBeingPasted(element);
      }
      
      // Forwarding style to its children capability
      //
      if (!isComponentInsertion && isForwardingStyleToChildren) {
      	CapabilityHelper.installCapabilityOfForwardingStyle(element);
      }
      
      // Insert the element before the cursor.
      //
      if (!isComponentInsertion) HTMLHelper.setAttribute(element, 'internal-fsb-class', content.klass);
      if (HTMLHelper.getAttribute(Accessories.cursor.getDOMNode(), 'internal-cursor-mode') == 'relative') {
        if (!isComponentInsertion && !isForwardingStyleToChildren && ['Button'].indexOf(content.klass) == -1) HTMLHelper.addClass(element, 'col-12');
        Accessories.cursor.getDOMNode().parentNode.insertBefore(element, Accessories.cursor.getDOMNode());
      } else {
        StylesheetHelper.setStyleAttribute(element, 'left', Accessories.cursor.getDOMNode().style.left);
        StylesheetHelper.setStyleAttribute(element, 'top', Accessories.cursor.getDOMNode().style.top);
        StylesheetHelper.setStyleAttribute(element, 'width', '150px');
        Accessories.cursor.getDOMNode().parentNode.appendChild(element);
      }
      
      // Update Editor UI
      EditorHelper.updateEditorProperties();
    }
    
    return [accessory, remember, link];
  },
  handleUpdate: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
		let accessory = null;
		let selectingElement = EditorHelper.getSelectingElement() || document.body;
		
    if (selectingElement) {
      let previousReusablePresetName = HTMLHelper.getAttribute(selectingElement, 'internal-fsb-reusable-preset-name') || null;
      let presetId = HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid');
      
      if (previousReusablePresetName) {
        accessory = {
          attributes: HTMLHelper.getAttributes(selectingElement, true, {
            style: StylesheetHelper.getStylesheetDefinition(presetId)
          }),
          extensions: CodeHelper.convertDictionaryIntoPairs(InternalProjectSettings),
          options: LayoutHelper.getElementOptions(selectingElement)
        };
      } else {
        accessory = {
          attributes: HTMLHelper.getAttributes(selectingElement, true, {
            style: HTMLHelper.getAttribute(selectingElement, 'style')
          }),
          extensions: CodeHelper.convertDictionaryIntoPairs(InternalProjectSettings),
          options: LayoutHelper.getElementOptions(selectingElement)
        };
      }
      
      let dictionary = {};
      for (let attribute of accessory.attributes) {
        dictionary[attribute.name] = true;
      }
      if (content.attributes !== undefined) {
        for (let attribute of content.attributes) {
          if (!!attribute.value && !dictionary[attribute.name]) {
            accessory.attributes.push({
              name: attribute.name,
              value: null
            });
          }
        }
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
            case 'internal-fsb-textbox-mode':
              if (HTMLHelper.getAttribute(selectingElement, attribute.name) != attribute.value) {
                found = true;
                if (attribute.value !== null) {
                	HTMLHelper.setAttribute(selectingElement, attribute.name, attribute.value);
                  selectingElement.firstChild.outerHTML = selectingElement.firstChild.outerHTML.replace(/<input/,"<textarea");
                } else {
                	HTMLHelper.removeAttribute(selectingElement, attribute.name);
                  selectingElement.firstChild.outerHTML = selectingElement.firstChild.outerHTML.replace(/<textarea/,"<input");
                }
              }
              break;
            case 'internal-fsb-inner-html':
              if (HTMLHelper.getAttribute(selectingElement, attribute.name) != attribute.value) {
                found = true;
                if (attribute.value !== null) {
                	HTMLHelper.setAttribute(selectingElement, attribute.name, attribute.value);
                  selectingElement.firstChild.innerHTML = attribute.value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<div style="font-family: Courier; font-size: 10px; color: #dc3545;">&lt;script&gt;Please compose custom scripts in coding user interface.&lt;/script&gt;</div>');
                } else {
                	HTMLHelper.removeAttribute(selectingElement, attribute.name);
                  selectingElement.firstChild.innerHTML = '';
                }
              }
              break;
            default:
              if (attribute.name == 'internal-fsb-react-mode' && attribute.value != 'Site') {
                WorkspaceHelper.removeComponentData(HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid'));
              }
              
              if (HTMLHelper.getAttribute(selectingElement, attribute.name) != attribute.value) {
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
        	
        	for (let childY of [...selectingElement.firstChild.childNodes]) {
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
          	let tableCellDefinitions = inlineStyle.match(CELL_STYLE_ATTRIBUTE_REGEX_GLOBAL);
          	if (tableCellDefinitions !== null) {
					   	for (let tableCellDefinition of tableCellDefinitions) {
				   			let matchedInfo = tableCellDefinition.match(CELL_STYLE_ATTRIBUTE_REGEX_LOCAL);
				   			
				   			let x = parseInt(matchedInfo[1]);
				   			let y = parseInt(matchedInfo[2]);
				   			let side = matchedInfo[3];
				   			let style = matchedInfo[4];
				   			
				   			let childY = selectingElement.firstChild.childNodes[y];
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
        
        // Sharing Components
        // 
        if (HTMLHelper.getAttribute(selectingElement, 'internal-fsb-react-mode') == 'Site') {
          WorkspaceHelper.addOrReplaceComponentData(
            HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid'),
            HTMLHelper.getAttribute(selectingElement, 'internal-fsb-name'),
            selectingElement.outerHTML
          );
        }
      }
      {
        if (content.extensions !== undefined) {
          for (let extension of content.extensions) {
            if (InternalProjectSettings[extension.name] != extension.value) {
              found = true;
              
              if (extension.name == 'editingSiteName') {
                accessory = {
                  extensions: [{
                    name: 'editingSiteName',
                    value: InternalProjectSettings.editingSiteName
                  }]
                };
                
                WorkspaceHelper.saveWorkspaceData();
                InternalProjectSettings.editingSiteName = extension.value;
                WorkspaceHelper.loadWorkspaceData();
              } else if (extension.name == 'pages') {
                accessory = {
                  extensions: [{
                    name: 'pages',
                    value: CodeHelper.clone(InternalProjectSettings.pages)
                  }]
                };
                
                InternalProjectSettings[extension.name] = extension.value;
              } else if (extension.name == 'components') {
                accessory = {
                  extensions: [{
                    name: 'components',
                    value: CodeHelper.clone(InternalProjectSettings.components)
                  }]
                };
                
                InternalProjectSettings[extension.name] = extension.value;
              } else if (extension.name == 'externalLibraries') {
                InternalProjectSettings[extension.name] = extension.value;
                EditorHelper.updateExternalLibraries();
              } else {
                InternalProjectSettings[extension.name] = extension.value;
              }
            }
          }
        }
      }
      {
        if (content.options !== undefined && content.options !== null) {
          selectingElement.firstChild.innerText = '';
          found = true;
          for (let option of content.options) {
            let optionElement = document.createElement('option');
            
            optionElement.setAttribute('value', option.value);
            if (option.selected) optionElement.setAttribute('selected', 'true');
            optionElement.innerText = option.name;
            
            selectingElement.firstChild.appendChild(optionElement);
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
  	
  	EditorHelper.synchronize("click", null);
  	
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
          let selectingElement = EditorHelper.getSelectingElement();
          if (selectingElement && selectingElement.parentNode && HTMLHelper.hasClass(selectingElement.parentNode, 'internal-fsb-absolute-layout')) {
            ManipulationHelper.perform('delete', HTMLHelper.getAttribute(selectingElement, 'internal-fsb-guid'));
          } else if (HTMLHelper.getAttribute(Accessories.cursor.getDOMNode(), 'internal-cursor-mode') == 'relative') {
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
  	let element = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', content);
  	
  	if (element && HTMLHelper.getAttribute(element, 'internal-fsb-reusable-preset-name')) {
  		if (!confirm('Remove inheriting from the preset "' + HTMLHelper.getAttribute(element, 'internal-fsb-reusable-preset-name').replace(/_/g, ' ') + '"?')) {
  			shouldContinue = false;
  		}
  	}
  	
  	accessory = {
  	  element: element,
  	  container: element.parentNode
  	}
  	
  	link = Math.random();
  	promise.then(() => {
  		let presetId = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
			removeAllPresetReferences(presetId, link);
			StylesheetHelper.removeStylesheetDefinition(presetId);
		});
  	
    if (shouldContinue && element) {
      element.parentNode.removeChild(element);
    } else {
    	remember = false;
    }
  	
  	return [accessory, remember, link];
  },
  handleModifyTable: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	let accessory = null;
  	
  	if (typeof content === 'string') {
  	  content = {
  	    action: content,
  	    elements: null
  	  }
  	}
  	
  	let selectingElement = EditorHelper.getSelectingElement();
  	let cursorContainer = Accessories.cursor.getDOMNode().parentNode;
  	
    if (selectingElement && cursorContainer.tagName == 'TD') {
      switch (content.action) {
        case 'delete-row':
          if (cursorContainer.parentNode.nextSibling && cursorContainer.parentNode.nextSibling.tagName == 'TR') {
            let colIndex = [...cursorContainer.parentNode.children].indexOf(cursorContainer);
            let td = cursorContainer.parentNode.nextSibling.children[colIndex];
            let rowIndex = [...cursorContainer.parentNode.parentNode.children].indexOf(cursorContainer.parentNode);
            
            link = Math.random();
            let inlineStyle = StylesheetHelper.getStyle(selectingElement) || '';
            let revision = parseInt(HTMLHelper.getInlineStyle(inlineStyle, '-fsb-revision') || '0');
            inlineStyle = HTMLHelper.setInlineStyle(inlineStyle, '-fsb-revision', ++revision);
            ManipulationHelper.perform('update', {styles: [{name: 'style', value: inlineStyle}]}, true, false, link);
            
            ManipulationHelper.perform('move[cursor]', CursorHelper.findWalkPathForElement(td), true, false, link);
            
            promise.then(() => {
              inlineStyle = inlineStyle.replace(CELL_STYLE_ATTRIBUTE_REGEX_GLOBAL, (value) => {
                let matches = value.match(CELL_STYLE_ATTRIBUTE_REGEX_LOCAL);
                
                let row = parseInt(matches[2]);
                if (row == rowIndex) {
                  return '';
                } else if (row > rowIndex) {
                  return `-fsb-cell-${matches[1]}-${row-1}-${matches[3]}: ${matches[4]}`;
                } else {
                  return matches[0];
                }
              });
              
              ManipulationHelper.perform('update', {
                attributes: [{
                  name: 'style',
                  value: inlineStyle
                }]
              }, true, false, link);
            });
            
            content.action = 'delete-row-above';
          } else if (cursorContainer.parentNode.previousSibling && cursorContainer.parentNode.previousSibling.tagName == 'TR') {
            let colIndex = [...cursorContainer.parentNode.children].indexOf(cursorContainer);
            let td = cursorContainer.parentNode.previousSibling.children[colIndex];
            let rowIndex = [...cursorContainer.parentNode.parentNode.children].indexOf(cursorContainer.parentNode);
            
            link = Math.random();
            let inlineStyle = StylesheetHelper.getStyle(selectingElement) || '';
            let revision = parseInt(HTMLHelper.getInlineStyle(inlineStyle, '-fsb-revision') || '0');
            inlineStyle = HTMLHelper.setInlineStyle(inlineStyle, '-fsb-revision', ++revision);
            ManipulationHelper.perform('update', {styles: [{name: 'style', value: inlineStyle}]}, true, false, link);
            
            ManipulationHelper.perform('move[cursor]', CursorHelper.findWalkPathForElement(td), true, false, link);
            
            promise.then(() => {
              inlineStyle = inlineStyle.replace(CELL_STYLE_ATTRIBUTE_REGEX_GLOBAL, (value) => {
                let matches = value.match(CELL_STYLE_ATTRIBUTE_REGEX_LOCAL);
                
                let row = parseInt(matches[2]);
                if (row == rowIndex + 1) {
                  return '';
                } else if (row > rowIndex + 1) {
                  return `-fsb-cell-${matches[1]}-${row-1}-${matches[3]}: ${matches[4]}`;
                } else {
                  return matches[0];
                }
              });
              
              ManipulationHelper.perform('update', {
                attributes: [{
                  name: 'style',
                  value: inlineStyle
                }]
              }, true, false, link);
            });
            
            content.action = 'delete-row-below';
          }
          break;
        case 'delete-column':
          if (cursorContainer.nextSibling && cursorContainer.nextSibling.tagName == 'TD') {
            let td = cursorContainer.nextSibling;
            let colIndex = [...cursorContainer.parentNode.children].indexOf(cursorContainer);
             
            link = Math.random();
            let inlineStyle = StylesheetHelper.getStyle(selectingElement) || '';
            let revision = parseInt(HTMLHelper.getInlineStyle(inlineStyle, '-fsb-revision') || '0');
            inlineStyle = HTMLHelper.setInlineStyle(inlineStyle, '-fsb-revision', ++revision);
            ManipulationHelper.perform('update', {styles: [{name: 'style', value: inlineStyle}]}, true, false, link);
            
            ManipulationHelper.perform('move[cursor]', CursorHelper.findWalkPathForElement(td), true, false, link);
            
            promise.then(() => {
              inlineStyle = inlineStyle.replace(CELL_STYLE_ATTRIBUTE_REGEX_GLOBAL, (value) => {
                let matches = value.match(CELL_STYLE_ATTRIBUTE_REGEX_LOCAL);
                
                let col = parseInt(matches[1]);
                if (col == colIndex) {
                  return '';
                } else if (col > colIndex) {
                  return `-fsb-cell-${col-1}-${matches[2]}-${matches[3]}: ${matches[4]}`;
                } else {
                  return matches[0];
                }
              });
              
              ManipulationHelper.perform('update', {
                attributes: [{
                  name: 'style',
                  value: inlineStyle
                }]
              }, true, false, link);
            });
            
            content.action = 'delete-column-before';
          } else if (cursorContainer.previousSibling && cursorContainer.previousSibling.tagName == 'TD') {
            let td = cursorContainer.previousSibling;
            let colIndex = [...cursorContainer.parentNode.children].indexOf(cursorContainer);
            
            link = Math.random();
            let inlineStyle = StylesheetHelper.getStyle(selectingElement) || '';
            let revision = parseInt(HTMLHelper.getInlineStyle(inlineStyle, '-fsb-revision') || '0');
            inlineStyle = HTMLHelper.setInlineStyle(inlineStyle, '-fsb-revision', ++revision);
            ManipulationHelper.perform('update', {styles: [{name: 'style', value: inlineStyle}]}, true, false, link);
            
            ManipulationHelper.perform('move[cursor]', CursorHelper.findWalkPathForElement(td), true, false, link);
            
            promise.then(() => {
              inlineStyle = inlineStyle.replace(CELL_STYLE_ATTRIBUTE_REGEX_GLOBAL, (value) => {
                let matches = value.match(CELL_STYLE_ATTRIBUTE_REGEX_LOCAL);
                
                let col = parseInt(matches[1]);
                if (col == colIndex + 1) {
                  return '';
                } else if (col > colIndex + 1) {
                  return `-fsb-cell-${col-1}-${matches[2]}-${matches[3]}: ${matches[4]}`;
                } else {
                  return matches[0];
                }
              });
              
              ManipulationHelper.perform('update', {
                attributes: [{
                  name: 'style',
                  value: inlineStyle
                }]
              }, true, false, link);
            });
            
            content.action = 'delete-column-after';
          }
          break;
      }
      
      cursorContainer = Accessories.cursor.getDOMNode().parentNode;
      
    	switch (content.action) {
    	  case 'add-row-above':
    	  case 'add-row-below':
    	    if (content.elements == null) {
    	      let tr = document.createElement('tr');
    	      content.elements = [tr];
    	      
    	      for (let i=0; i<cursorContainer.parentNode.children.length; i++) {
    	        let td = document.createElement('td');
    	        td.className = 'internal-fsb-strict-layout internal-fsb-allow-cursor';
    	        content.elements[0].appendChild(td);
    	      }
    	    }
    	    
    	    if (content.action == 'add-row-above') {
      	    accessory = {
      	      action: 'delete-row-above'
      	    };
      	    cursorContainer.parentNode.parentNode.insertBefore(content.elements[0], cursorContainer.parentNode);
    	    } else {
    	      accessory = {
      	      action: 'delete-row-below'
      	    };
    	      cursorContainer.parentNode.parentNode.insertBefore(content.elements[0], cursorContainer.parentNode.nextSibling);
    	    }
    	    break;
    	  case 'delete-row-above': // Internal Use
    	    if (cursorContainer.parentNode.previousSibling && cursorContainer.parentNode.previousSibling.tagName == 'TR') {
      	    accessory = {
      	      action: 'add-row-above',
      	      elements: [cursorContainer.parentNode.previousSibling]
      	    };
      	    cursorContainer.parentNode.parentNode.removeChild(cursorContainer.parentNode.previousSibling);
      	  } else {
      	    remember = false;
      	  }
    	    break;
    	  case 'delete-row-below': // Internal Use
    	    if (cursorContainer.parentNode.nextSibling && cursorContainer.parentNode.nextSibling.tagName == 'TR') {
      	    accessory = {
      	      action: 'add-row-below',
      	      elements: [cursorContainer.parentNode.nextSibling]
      	    };
      	    cursorContainer.parentNode.parentNode.removeChild(cursorContainer.parentNode.nextSibling);
      	  } else {
      	    remember = false;
      	  }
    	    break;
    	  case 'add-column-before':
    	  case 'add-column-after':
    	    let count = 0;
    	    if (content.elements == null) {
    	      content.elements = [];
    	      for (let i=0; i<cursorContainer.parentNode.parentNode.children.length; i++) {
    	        if (cursorContainer.parentNode.parentNode.children[i].tagName == 'TR') {
    	          count += 1;
    	        }
    	      }
    	      for (let i=0; i<count; i++) {
    	        let td = document.createElement('td');
    	        td.className = 'internal-fsb-strict-layout internal-fsb-allow-cursor';
    	        content.elements.push(td);
    	      }
    	    }
    	    
    	    let colIndex = [...cursorContainer.parentNode.children].indexOf(cursorContainer);
    	    
    	    count = 0;
    	    
    	    for (let i=0; i<cursorContainer.parentNode.parentNode.children.length; i++) {
    	      if (cursorContainer.parentNode.parentNode.children[i].tagName == 'TR') {
    	        cursorContainer.parentNode.parentNode.children[i].insertBefore(
    	          content.elements[count++],
    	          (content.action == 'add-column-before') ?
    	            cursorContainer.parentNode.parentNode.children[i].children[colIndex] :
    	            cursorContainer.parentNode.parentNode.children[i].children[colIndex].nextSibling
    	        );
    	      }
    	    }
    	    
    	    if (content.action == 'add-column-before') {
      	    accessory = {
      	      action: 'delete-column-before'
      	    };
    	    } else {
    	      accessory = {
      	      action: 'delete-column-after'
      	    };
    	    }
    	    break;
    	  case 'delete-column-before': // Internal Use
    	    if (cursorContainer.previousSibling && cursorContainer.previousSibling.tagName == 'TD') {
      	    accessory = {
      	      action: 'add-column-before',
      	      elements: []
      	    };
      	    
      	    let colIndex = [...cursorContainer.parentNode.children].indexOf(cursorContainer);
      	    
      	    for (let i=0; i<cursorContainer.parentNode.parentNode.children.length; i++) {
      	      if (cursorContainer.parentNode.parentNode.children[i].tagName == 'TR') {
      	        accessory.elements.push(cursorContainer.parentNode.parentNode.children[i].children[colIndex].previousSibling);
      	        cursorContainer.parentNode.parentNode.children[i].removeChild(cursorContainer.parentNode.parentNode.children[i].children[colIndex].previousSibling);
      	      }
      	    }
      	  }
    	    break;
    	  case 'delete-column-after': // Internal Use
    	    if (cursorContainer.nextSibling && cursorContainer.nextSibling.tagName == 'TD') {
      	    accessory = {
      	      action: 'add-column-before',
      	      elements: []
      	    };
      	    
      	    let colIndex = [...cursorContainer.parentNode.children].indexOf(cursorContainer);
      	    
      	    for (let i=0; i<cursorContainer.parentNode.parentNode.children.length; i++) {
      	      if (cursorContainer.parentNode.parentNode.children[i].tagName == 'TR') {
      	        accessory.elements.push(cursorContainer.parentNode.parentNode.children[i].children[colIndex].nextSibling);
      	        cursorContainer.parentNode.parentNode.children[i].removeChild(cursorContainer.parentNode.parentNode.children[i].children[colIndex].nextSibling);
      	      }
      	    }
      	  }
    	    break;
    	}
    	
    	Accessories.cellFormater.refresh();
    	CapabilityHelper.installCapabilityOfBeingMoveInCursor(selectingElement);
    }
  	
  	return [accessory, remember, link, content.action];
  },
  handleMoveElement: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
  	let accessory = null;
  	
  	let target = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', content.target);
  	let destination = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', content.destination.split(':')[0]);
  	
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
	  	
	  	if (['Rectangle', 'Button'].indexOf(HTMLHelper.getAttribute(destination, 'internal-fsb-class')) != -1) {
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
          if (HTMLHelper.hasClass(accessory.container, 'internal-fsb-absolute-layout')) {
            accessory.container.appendChild(accessory.element);
          } else {
            Accessories.cursor.getDOMNode().parentNode.insertBefore(accessory.element, Accessories.cursor.getDOMNode());
          }
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
    
    if (link && performedIndex + 1 < performed.length && performed[performedIndex + 1].link === link) {
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
    
    switch (content) {
      case 'designButton':
        EditorHelper.setEditorCurrentMode('design');
        break;
      case 'animationButton':
        EditorHelper.setEditorCurrentMode('animation');
        break;
      case 'codingButton':
        EditorHelper.setEditorCurrentMode('coding');
        break;
    }
    
    return [accessory, content, remember];
  }
};

export {ManipulationHelper};