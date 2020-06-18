import {HTMLHelper} from '../../../helpers/HTMLHelper.js';
import {RandomHelper} from '../../../helpers/RandomHelper.js';
import {Accessories, EditorHelper} from '../EditorHelper.js';
import {WorkspaceHelper} from '../WorkspaceHelper.js';
import {LayoutHelper} from '../LayoutHelper.js';
import {StylesheetHelper} from '../StylesheetHelper.js';
import {CapabilityHelper} from '../CapabilityHelper.js';
import {ManipulationHelper} from '../ManipulationHelper.js';

let composedUntitledNameCount: any = {};
let composedUntitledNameDictionary: any = {};

var BackEndManipulationHelper = {
  handleInsert: (name: string, content: any, remember: boolean, promise: Promise, link: any) => {
    let accessory = null;
    let element = null;
    
    if (!Accessories.cursor.getDOMNode().parentNode) {
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
    
    switch (content.klass) {
      case 'RelationalDatabase':
      	if (!HTMLHelper.hasClass(Accessories.cursor.getDOMNode().parentNode, 'internal-fsb-begin-layout')) {
      		alert('Please place a cursor outside outside any element to insert a relational database.');
      		return [accessory, false, link];
      	}
      	
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element
            .internal-fsb-title
              | Relational Database
            .container-fluid
              .row.internal-fsb-absolute-layout.internal-fsb-allow-cursor(style={position: 'absolute', top: '0px', right: '0px', bottom: '0px', left: '0px'})
        `, element);
        break;
      case 'RelationalTable':
      	parent = HTMLHelper.findTheParentInClassName('internal-fsb-element', Accessories.cursor.getDOMNode());
      	if (!parent || HTMLHelper.getAttribute(parent, 'internal-fsb-class') != 'RelationalDatabase') {
      		alert('Please place a cursor inside a relational database to insert a relational table.');
      		return [accessory, false, link];
      	}
      	
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element
            .internal-fsb-title
              | Relational Table
            .container-fluid
              .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
        `, element);
        break;
      case 'RelationalColumn':
      	parent = HTMLHelper.findTheParentInClassName('internal-fsb-element', Accessories.cursor.getDOMNode());
      	if (!parent || HTMLHelper.getAttribute(parent, 'internal-fsb-class') != 'RelationalTable') {
      		alert('Please place a cursor inside a relational table to insert a relational column.');
      		return [accessory, false, link];
      	}
      	
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element
            .internal-fsb-title
              | Relational Column
        `, element);
        break;
      case 'DocumentDatabase':
      	if (!HTMLHelper.hasClass(Accessories.cursor.getDOMNode().parentNode, 'internal-fsb-begin-layout')) {
      		alert('Please place a cursor outside outside any element to insert a document database.');
      		return [accessory, false, link];
      	}
      	
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element
            .internal-fsb-title
              | Document Database
            .container-fluid
              .row.internal-fsb-absolute-layout.internal-fsb-allow-cursor(style={position: 'absolute', top: '0px', right: '0px', bottom: '0px', left: '0px'})
        `, element);
        break;
      case 'DocumentTable':
      	parent = HTMLHelper.findTheParentInClassName('internal-fsb-element', Accessories.cursor.getDOMNode());
      	if (!parent || HTMLHelper.getAttribute(parent, 'internal-fsb-class') != 'DocumentDatabase') {
      		alert('Please place a cursor inside a document database to insert a document table.');
      		return [accessory, false, link];
      	}
      	
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element
            .internal-fsb-title
              | Document Table
            .container-fluid
              .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
        `, element);
        break;
      case 'DocumentNotation':
      	parent = HTMLHelper.findTheParentInClassName('internal-fsb-element', Accessories.cursor.getDOMNode());
      	if (!parent || HTMLHelper.getAttribute(parent, 'internal-fsb-class') != 'DocumentTable') {
      		alert('Please place a cursor inside a document table to insert a document notation.');
      		return [accessory, false, link];
      	}
      	
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element
            .internal-fsb-title
              | Document Column
        `, element);
        break;
      case 'WorkerInstance':
      	if (!HTMLHelper.hasClass(Accessories.cursor.getDOMNode().parentNode, 'internal-fsb-begin-layout')) {
      		alert('Please place a cursor outside outside any element to insert a worker instance.');
      		return [accessory, false, link];
      	}
      	
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element
            .internal-fsb-title
              | Worker Instance
            .container-fluid
              .row.internal-fsb-strict-layout.internal-fsb-allow-cursor
        `, element);
        break;
      case 'WorkerQueue':
      	parent = HTMLHelper.findTheParentInClassName('internal-fsb-element', Accessories.cursor.getDOMNode());
      	if (!parent || HTMLHelper.getAttribute(parent, 'internal-fsb-class') != 'WorkerInstance') {
      		alert('Please place a cursor inside a worker instance to insert a worker queue.');
      		return [accessory, false, link];
      	}
      	
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element
            .internal-fsb-title
              | Worker Queue
        `, element);
        break;
      case 'VolatileMemory':
      	if (!HTMLHelper.hasClass(Accessories.cursor.getDOMNode().parentNode, 'internal-fsb-begin-layout')) {
      		alert('Please place a cursor outside outside any element to insert a relational database.');
      		return [accessory, false, link];
      	}
      	
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element
            .internal-fsb-title
              | Volatile Memory
        `, element);
        break;
      case 'Connection':
      	parent = HTMLHelper.findTheParentInClassName('internal-fsb-element', Accessories.cursor.getDOMNode());
      	if (!HTMLHelper.hasClass(Accessories.cursor.getDOMNode().parentNode, 'internal-fsb-begin-layout') &&
      		['RelationalDatabase', 'DocumentDatabase'].indexOf(HTMLHelper.getAttribute(parent, 'internal-fsb-class')) == -1) {
      		alert('Please place a cursor outside outside any element for cross database relation, or inside a database element for cross table relation, to insert such a relation.');
      		return [accessory, false, link];
      	}
      	
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element
            .internal-fsb-title
              | Relation
        `, element);
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
      promise.then(() => {
        ManipulationHelper.perform('select', content.guid);
      });
      
      // Insert the element before the cursor.
      //
      HTMLHelper.setAttribute(element, 'internal-fsb-class', content.klass);
      
      if (HTMLHelper.getAttribute(Accessories.cursor.getDOMNode(), 'internal-cursor-mode') == 'relative') {
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
    return [accessory, remember, link];
  }
}

export {BackEndManipulationHelper}