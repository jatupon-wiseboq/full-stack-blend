import {HTMLHelper} from '../../../helpers/HTMLHelper';
import {RandomHelper} from '../../../helpers/RandomHelper';
import {Accessories, EditorHelper} from '../EditorHelper';
import {WorkspaceHelper} from '../WorkspaceHelper';
import {SchemaHelper} from '../SchemaHelper';
import {LayoutHelper} from '../LayoutHelper';
import {StylesheetHelper} from '../StylesheetHelper';
import {CapabilityHelper} from '../CapabilityHelper';
import {ManipulationHelper} from '../ManipulationHelper';
import {FrontEndDOMHelper} from '../FrontEndDOMHelper';

let composedUntitledNameCount: any = {};
let composedUntitledNameDictionary: any = {};

var BackEndManipulationHelper = {
  handleInsert: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
    let accessory = null;
    let element = null;
    
    if (!Accessories.cursor || !Accessories.cursor.getDOMNode().parentNode) {
      alert('Please place a cursor anywhere before performing insertion.');
      return [accessory, false, link];
    }
    
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
    let parent: any;
    let isComponentInsertion: boolean = false;
    
    if (!BackEndManipulationHelper.validateCursorPosition(content.klass)) return [accessory, false, link];
    
    switch (content.klass) {
      case 'RelationalDatabase':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element(data-title-name='')
            .internal-fsb-title.internal-fsb-dragging-handle
              | Relational Database
            .container-fluid
              .row.internal-fsb-absolute-layout.internal-fsb-allow-cursor(style={position: 'absolute', top: '0px', right: '0px', bottom: '0px', left: '0px'})
        `, element);
        break;
      case 'RelationalTable':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element(data-title-name='')
            .internal-fsb-title.internal-fsb-dragging-handle
              | Relational Table
            .container-fluid
              .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
        `, element);
        break;
      case 'RelationalColumn':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element.col-12(data-title-name='')
            .internal-fsb-title
              | Relational Column
        `, element);
        break;
      case 'DocumentDatabase':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element(data-title-name='')
            .internal-fsb-title.internal-fsb-dragging-handle
              | Document Database
            .container-fluid
              .row.internal-fsb-absolute-layout.internal-fsb-allow-cursor(style={position: 'absolute', top: '0px', right: '0px', bottom: '0px', left: '0px'})
        `, element);
        break;
      case 'DocumentTable':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element(data-title-name='')
            .internal-fsb-title.internal-fsb-dragging-handle
              | Document Table
            .container-fluid
              .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
        `, element);
        break;
      case 'DocumentNotation':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element.col-12(data-title-name='')
            .internal-fsb-title
              | Document Column
        `, element);
        break;
      case 'Queue':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element(data-title-name='')
            .internal-fsb-title.internal-fsb-dragging-handle
              | Queue
            .container-fluid
              .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
        `, element);
        break;
      case 'Parameter':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element.col-12(data-title-name='')
            .internal-fsb-title
              | Parameter
        `, element);
        break;
      case 'Scheduler':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element(data-title-name='')
            .internal-fsb-title.internal-fsb-dragging-handle
              | Scheduler Instance
            .container-fluid
              .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
        `, element);
        break;
      case 'Timing':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element.col-12(data-title-name='')
            .internal-fsb-title
              | Timing
        `, element);
        break;
      case 'VolatileMemory':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element(data-title-name='')
            .internal-fsb-title.internal-fsb-dragging-handle
              | Volatile Memory
            .container-fluid
              .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
        `, element);
        break;
      case 'VolatilePrefix':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element.col-12(data-title-name='')
            .internal-fsb-title
              | Volatile Prefix
        `, element);
        break;
      case 'Connection':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element.internal-fsb-dragging-handle(data-title-name='')
        `, element);
        break;
      case 'RESTful':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element(data-title-name='')
            .internal-fsb-title.internal-fsb-dragging-handle
              | RESTful
            .container-fluid
              .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
        `, element);
        break;
      case 'Verb':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element.col-12(data-title-name='')
            .internal-fsb-title
              | name
        `, element);
        break;
      case 'Pasteboard':
      	element = document.createElement('div');
        element.innerHTML = content.html;
        element = element.firstElementChild;
        
        if (!BackEndManipulationHelper.validateCursorPosition(HTMLHelper.getAttribute(element, 'internal-fsb-class'))) return [accessory, false, link];
      	
      	content.guid = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
        content.name = HTMLHelper.getAttribute(element, 'internal-fsb-name');
        
        isComponentInsertion = true;
      	break;
    }
    
    if (element !== null) {
      // Assign GUID and name.
      // 
      HTMLHelper.setAttribute(element, 'internal-fsb-guid', content.guid);
      HTMLHelper.setAttribute(element, 'internal-fsb-name', content.name);
      
      // Install capabilities
      // 
      CapabilityHelper.installCapabilitiesForInternalElements(element);
      
      if (!link) link = Math.random();
      promise.then(() => {
        ManipulationHelper.perform('select', content.guid, true, false, link);
      });
      
      // Insert the element before the cursor.
      //
      if (!isComponentInsertion) HTMLHelper.setAttribute(element, 'internal-fsb-class', content.klass);
      
      if (Accessories.cursor && HTMLHelper.getAttribute(Accessories.cursor.getDOMNode(), 'internal-cursor-mode') == 'relative') {
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
    
    ManipulationHelper.updateComponentData(element);
    LayoutHelper.invalidate();
    SchemaHelper.invalidate();
    FrontEndDOMHelper.invalidate();
    
    return [accessory, remember, link];
  },
  validateCursorPosition: (klass: string) => {
  	switch (klass) {
      case 'RelationalDatabase':
      	if (!Accessories.cursor || !HTMLHelper.hasClass(Accessories.cursor.getDOMNode().parentNode, 'internal-fsb-begin-layout')) {
      		alert('Please place a cursor outside any element to insert a relational database.');
      		return false;
      	}
        break;
      case 'RelationalTable':
      	parent = HTMLHelper.findTheParentInClassName('internal-fsb-element', Accessories.cursor.getDOMNode());
      	if (!parent || HTMLHelper.getAttribute(parent, 'internal-fsb-class') != 'RelationalDatabase') {
      		alert('Please place a cursor inside a relational database to insert a relational table.');
      		return false;
      	}
        break;
      case 'RelationalColumn':
      	parent = HTMLHelper.findTheParentInClassName('internal-fsb-element', Accessories.cursor.getDOMNode());
      	if (!parent || HTMLHelper.getAttribute(parent, 'internal-fsb-class') != 'RelationalTable') {
      		alert('Please place a cursor inside a relational table to insert a relational column.');
      		return false;
      	}
        break;
      case 'DocumentDatabase':
      	if (!Accessories.cursor || !HTMLHelper.hasClass(Accessories.cursor.getDOMNode().parentNode, 'internal-fsb-begin-layout')) {
      		alert('Please place a cursor outside any element to insert a document database.');
      		return false;
      	}
        break;
      case 'DocumentTable':
      	parent = HTMLHelper.findTheParentInClassName('internal-fsb-element', Accessories.cursor.getDOMNode());
      	if (!parent || HTMLHelper.getAttribute(parent, 'internal-fsb-class') != 'DocumentDatabase') {
      		alert('Please place a cursor inside a document database to insert a document table.');
      		return false;
      	}
        break;
      case 'DocumentNotation':
      	parent = HTMLHelper.findTheParentInClassName('internal-fsb-element', Accessories.cursor.getDOMNode());
      	if (!parent || HTMLHelper.getAttribute(parent, 'internal-fsb-class') != 'DocumentTable') {
      		alert('Please place a cursor inside a document table to insert a document notation.');
      		return false;
      	}
        break;
      case 'Queue':
      	if (!Accessories.cursor || (!HTMLHelper.hasClass(Accessories.cursor.getDOMNode().parentNode, 'internal-fsb-begin-layout') &&
      		['RelationalDatabase', 'DocumentDatabase'].indexOf(HTMLHelper.getAttribute(parent, 'internal-fsb-class')) == -1)) {
      		alert('Please place a cursor outside any element or inside a database element to insert a queue.');
      		return false;
      	}
        break;
      case 'Parameter':
      	parent = HTMLHelper.findTheParentInClassName('internal-fsb-element', Accessories.cursor.getDOMNode());
      	if (!parent || HTMLHelper.getAttribute(parent, 'internal-fsb-class') != 'Queue') {
      		alert('Please place a cursor inside a Queue to insert a Parameter.');
      		return false;
      	}
        break;
      case 'Scheduler':
      	parent = HTMLHelper.findTheParentInClassName('internal-fsb-element', Accessories.cursor.getDOMNode());
      	if (!Accessories.cursor || (!HTMLHelper.hasClass(Accessories.cursor.getDOMNode().parentNode, 'internal-fsb-begin-layout') &&
      		['RelationalDatabase', 'DocumentDatabase'].indexOf(HTMLHelper.getAttribute(parent, 'internal-fsb-class')) == -1)) {
      		alert('Please place a cursor outside any element for cross database scheduling, or inside a database element for cross table scheduling.');
      		return false;
      	}
        break;
      case 'Timing':
      	parent = HTMLHelper.findTheParentInClassName('internal-fsb-element', Accessories.cursor.getDOMNode());
      	if (!parent || HTMLHelper.getAttribute(parent, 'internal-fsb-class') != 'Scheduler') {
      		alert('Please place a cursor inside a scheduler to insert a scheduler timing.');
      		return false;
      	}
        break;
      case 'VolatileMemory':
      	if (!Accessories.cursor || (!HTMLHelper.hasClass(Accessories.cursor.getDOMNode().parentNode, 'internal-fsb-begin-layout') &&
      		['RelationalDatabase', 'DocumentDatabase'].indexOf(HTMLHelper.getAttribute(parent, 'internal-fsb-class')) == -1)) {
      		alert('Please place a cursor outside any element or inside a database element to insert a volatile memory.');
      		return false;
      	}
        break;
      case 'VolatilePrefix':
      	parent = HTMLHelper.findTheParentInClassName('internal-fsb-element', Accessories.cursor.getDOMNode());
      	if (!parent || HTMLHelper.getAttribute(parent, 'internal-fsb-class') != 'VolatileMemory') {
      		alert('Please place a cursor inside a volatile memory to insert a volatile prefix.');
      		return false;
      	}
        break;
      case 'Connection':
      	parent = HTMLHelper.findTheParentInClassName('internal-fsb-element', Accessories.cursor.getDOMNode());
      	if (!Accessories.cursor || (!HTMLHelper.hasClass(Accessories.cursor.getDOMNode().parentNode, 'internal-fsb-begin-layout') &&
      		['RelationalDatabase', 'DocumentDatabase'].indexOf(HTMLHelper.getAttribute(parent, 'internal-fsb-class')) == -1)) {
      		alert('Please place a cursor outside any element for cross database relation, or inside a database element for cross table relation.');
      		return false;
      	}
        break;
      case 'RESTful':
      	if (!Accessories.cursor || !HTMLHelper.hasClass(Accessories.cursor.getDOMNode().parentNode, 'internal-fsb-begin-layout')) {
      		alert('Please place a cursor outside any element to insert a RESTful collection.');
      		return false;
      	}
        break;
      case 'Verb':
      	parent = HTMLHelper.findTheParentInClassName('internal-fsb-element', Accessories.cursor.getDOMNode());
      	if (!parent || HTMLHelper.getAttribute(parent, 'internal-fsb-class') != 'RESTful') {
      		alert('Please place a cursor inside a RESTful collection to insert a verb.');
      		return false;
      	}
        break;
      case 'Pasteboard':
      	break;
    }
    
    return true;
  }
}

export {BackEndManipulationHelper}