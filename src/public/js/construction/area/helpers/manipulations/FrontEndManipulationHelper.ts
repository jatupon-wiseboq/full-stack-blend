import {HTMLHelper} from '../../../helpers/HTMLHelper';
import {RandomHelper} from '../../../helpers/RandomHelper';
import {Accessories, EditorHelper} from '../EditorHelper';
import {WorkspaceHelper} from '../WorkspaceHelper';
import {LayoutHelper} from '../LayoutHelper';
import {TimelineHelper} from '../TimelineHelper';
import {StylesheetHelper} from '../StylesheetHelper';
import {CapabilityHelper} from '../CapabilityHelper';
import {ManipulationHelper} from '../ManipulationHelper';
import {FrontEndDOMHelper} from '../FrontEndDOMHelper';
import {StatusHelper} from '../StatusHelper';
import {FORWARD_STYLE_TO_CHILDREN_CLASS_LIST, SINGLE_DOM_CONTAINER_ELEMENTS} from '../../../Constants';

let composedUntitledNameCount: any = {};
let composedUntitledNameDictionary: any = {};

var FrontEndManipulationHelper = {
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
    let isComponentInsertion: boolean = false;
    
    switch (content.klass) {
      case 'FlowLayout':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element.internal-fsb-strict-layout.internal-fsb-allow-cursor(style={paddingLeft: '0px', paddingRight: '0px'})
        `, element);
        break;
      case 'TableLayout':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          table.internal-fsb-element.internal-fsb-table-layout(style={tableLayout: 'fixed', paddingLeft: '0px', paddingRight: '0px'}, internal-fsb-table-collapse="false")
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
          .internal-fsb-element(style={paddingLeft: '0px', paddingRight: '0px'})
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
      case 'Link':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          a.internal-fsb-element.internal-fsb-allow-cursor.col-2
            .internal-fsb-element(contentEditable='true', suppressContentEditableWarning=true, internal-fsb-class='TextElement', internal-fsb-guid=content.guid + '-text', internal-fsb-name='TextElement')
              | Link
        `, element);
        break;
      case 'Rectangle':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element.internal-fsb-allow-cursor(style={paddingLeft: '0px', paddingRight: '0px', width: '100%'})
        `, element);
        break;
      case 'Iframe':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element(style={display: 'block', borderTopStyle: 'none', borderRightStyle: 'none', borderBottomStyle: 'none', borderLeftStyle: 'none', width: '100%', minHeight: '300px'})
            iframe
        `, element);
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
        break;
      case 'Select':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element(style={display: 'block', width: '100%'})
            select
        `, element);
        break;
      case 'Radio':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element(style={display: 'block'})
            input(type='radio')
        `, element);
        break;
      case 'Checkbox':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element(style={display: 'block'})
            input(type='checkbox')
        `, element);
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
        break;
      case 'Button':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          button.internal-fsb-element.internal-fsb-allow-cursor.col-2(type='button')
            .internal-fsb-element(contentEditable='true', suppressContentEditableWarning=true, internal-fsb-class='TextElement', internal-fsb-guid=content.guid + '-text', internal-fsb-name='TextElement')
              | Link
        `, element);
        break;
      case 'Image':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element.col-4(style={display: 'block', width: '100%', height: '100%', padding: '0px'})
            img
        `, element);
        break;
      case 'Video':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element.col-4(style={display: 'block', width: '100%', height: '100%', padding: '0px'})
            video
        `, element);
        break;
      case 'Flash':
        element = document.createElement('div');
        element = ReactDOM.render(pug `
          .internal-fsb-element.col-4(style={display: 'block', width: '100%', height: '100%', padding: '0px'})
            object(classID='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000', codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0', align='middle')
              param(name='movie')
              param(name='allowScriptAccess', value='sameDomain')
              param(name='quality', value='high')
              param(name='wmode', value='transparent')
              embed(quality='high', wmode='transparent', align='middle', allowscriptaccess='sameDomain', type='application/x-shockwave-flash', pluginspage='http://www.macromedia.com/go/getflashplayer', style={width: '100%', height: '100%', padding: '0px'})
        `, element);
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
        element.innerHTML = WorkspaceHelper.cleanupComponentHTMLData(componentInfo.html.join('\n'));
        element = element.firstElementChild;
        
        WorkspaceHelper.updateInheritingComponents(element);
        WorkspaceHelper.recursiveCleanupComponentPreviewDOM(element, true);
        
        HTMLHelper.setAttribute(element, 'internal-fsb-inheriting', content.id);
        
        isComponentInsertion = true;
        break;
      case 'Pasteboard':
      	element = document.createElement('div');
        element.innerHTML = content.html;
        element = element.firstElementChild;
      	
      	content.guid = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
        content.name = HTMLHelper.getAttribute(element, 'internal-fsb-name');
        
        WorkspaceHelper.updateInheritingComponents(element);
        
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
      
      // Forwarding style to its children capability
      //
      let isForwardingStyleToChildren = (FORWARD_STYLE_TO_CHILDREN_CLASS_LIST.indexOf(content.klass) != -1);
    
      if (!isComponentInsertion && isForwardingStyleToChildren) {
        CapabilityHelper.installCapabilityOfForwardingStyle(element);
      }
      
      // Insert the element before the cursor.
      //
      if (!isComponentInsertion) HTMLHelper.setAttribute(element, 'internal-fsb-class', content.klass);
      if (LayoutHelper.isNestedComponent(Accessories.cursor.getDOMNode().parentNode, content.id)) {
        alert("The editor doesn't allow nest of components.");
        remember = false;
      } if (HTMLHelper.getAttribute(element, 'internal-fsb-class') == 'Button' && HTMLHelper.findAllParentsInClassName('internal-fsb-element', Accessories.cursor.getDOMNode()).some(element => element.getAttribute('internal-fsb-class') == 'Button')) {
      	alert("The editor doesn't allow nest of buttons.");
        remember = false;
      } else {
        if (HTMLHelper.getAttribute(Accessories.cursor.getDOMNode(), 'internal-cursor-mode') == 'relative') {
          if (!isComponentInsertion && !isForwardingStyleToChildren && SINGLE_DOM_CONTAINER_ELEMENTS.indexOf(content.klass) == -1) HTMLHelper.addClass(element, 'col-12');
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
    }
    
    ManipulationHelper.updateComponentData(element);
    LayoutHelper.invalidate();
    TimelineHelper.invalidate();
    FrontEndDOMHelper.invalidate();
    StatusHelper.invalidate(element);
    
    return [accessory, remember, link];
  }
}

export {FrontEndManipulationHelper}