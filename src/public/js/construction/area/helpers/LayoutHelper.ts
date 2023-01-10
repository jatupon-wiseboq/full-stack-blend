import { HTMLHelper } from '../../helpers/HTMLHelper';
import { Accessories, EditorHelper } from './EditorHelper';

let cachedElementTreeNodes = null;
let cachedElementTreeNodesIncludeInheriting = null;

var LayoutHelper = {
  invalidate: function() {
    cachedElementTreeNodes = null;
    cachedElementTreeNodesIncludeInheriting = null;
  },
  calculateColumnSize: function(width : number) {
    let selectingElement = EditorHelper.getSelectingElement();
    if (selectingElement) {
      let measure = document.createElement('div');
      let i : number;

      selectingElement.parentNode.insertBefore(measure, selectingElement.parentNode.firstElementChild);

      for (i = 1; i <= 12; i++) {
        measure.className = 'col-' + i;
        if (HTMLHelper.getSize(measure)[0] >= width) break;
      }

      selectingElement.parentNode.removeChild(measure);

      return Math.min(12, i);
    } else {
      return null;
    }
  },
  getElementTreeNodes: function(includeInheriting : boolean = false, nodes : array = [], container : any = document.body) {
    if (container == document.body && !includeInheriting && cachedElementTreeNodes) return cachedElementTreeNodes;
    if (container == document.body && includeInheriting && cachedElementTreeNodesIncludeInheriting) return cachedElementTreeNodesIncludeInheriting;
    if (!container.childNodes) return nodes;
    if (!includeInheriting && HTMLHelper.hasAttribute(container, 'internal-fsb-inheriting')) return nodes;

    for (let element of container.childNodes) {
      if (!element.getAttribute) continue;

      let name = HTMLHelper.getAttribute(element, 'internal-fsb-name');
      let klass = HTMLHelper.getAttribute(element, 'internal-fsb-class');
      let guid = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
      let isTheBeginElement = HTMLHelper.hasClass(element, 'internal-fsb-begin');
      let isTableLayoutCell = (element.tagName == 'TD' && HTMLHelper.hasClass(element, 'internal-fsb-allow-cursor'));
      let isTableLayoutRow = (element.tagName == 'TR');
      let id = (isTableLayoutCell) ? HTMLHelper.getAttribute(element.parentNode.parentNode.parentNode, 'internal-fsb-guid') : ((isTableLayoutRow) ? HTMLHelper.getAttribute(element.parentNode.parentNode, 'internal-fsb-guid') : HTMLHelper.getAttribute(element, 'internal-fsb-guid')); // TODO: Move into an unit code or a different helper.

      if ((id || isTableLayoutCell || isTableLayoutRow) && !isTheBeginElement) {
        nodes.push({
          id: (isTableLayoutCell) ? id + ':' + [...element.parentNode.parentNode.childNodes].indexOf(element.parentNode) +
            ',' + [...element.parentNode.childNodes].indexOf(element) : ((isTableLayoutRow) ? id + ':' + [...element.parentNode.childNodes].indexOf(element) : id),
          customClassName: '',
          name: (isTableLayoutCell) ? 'cell' : ((isTableLayoutRow) ? 'row' : name),
          selectable: !isTableLayoutCell,
          dropable: !isTableLayoutRow && (isTableLayoutCell ||
            ['FlowLayout', 'AbsoluteLayout', 'Rectangle', 'Button', 'Label', 'Link'].indexOf(klass) != -1) &&
            !HTMLHelper.hasAttribute(element, 'internal-fsb-inheriting'),
          insertable: !isTableLayoutRow,
          dragable: !isTableLayoutRow,
          disabled: false,
          selected: false,
          nodes: this.getElementTreeNodes(includeInheriting, [], element),
          tag: {
            class: klass,
            guid: (isTableLayoutRow) ? id + ':' + [...element.parentNode.childNodes].indexOf(element) : guid,
            options: LayoutHelper.getElementOptions(element)
          }
        });
      } else {
        this.getElementTreeNodes(includeInheriting, nodes, element);
      }
    }
    if (container == document.body && !includeInheriting) cachedElementTreeNodes = nodes;
    if (container == document.body && includeInheriting) cachedElementTreeNodesIncludeInheriting = nodes;
    return nodes;
  },
  getElementOptions: function(element : HTMLElement) {
    if (HTMLHelper.getAttribute(element, 'internal-fsb-class') == 'Select') {
      let children = HTMLHelper.getElementsByTagName('option', element.firstElementChild);
      return [...children].map((child) => {
        if (child.tagName)
          return {
            name: child.innerText,
            value: child.getAttribute('value'),
            selected: child.getAttribute('selected') == 'true'
          }
      });
    } else {
      return null;
    }
  },
  isNestedComponent: function(container : HTMLElement, componentID : string) {
    if (!componentID) return false;

    let elements = HTMLHelper.findAllParentsInClassName('internal-fsb-element', container);

    for (let element of elements) {
      if (HTMLHelper.getAttribute(element, 'internal-fsb-react-mode') == 'Site' &&
        HTMLHelper.getAttribute(element, 'internal-fsb-guid') == componentID) {
        return true;
      }
    }

    return false;
  },
  isContainedInInheritedComponent: function(_element : HTMLElement) {
    if (!_element) return false;

    let elements = [...HTMLHelper.findAllParentsInClassName('internal-fsb-element', _element)];

    for (let element of elements) {
      if (HTMLHelper.hasAttribute(element, 'internal-fsb-inheriting')) {
        return true;
      }
    }

    return false;
  }
};

export { LayoutHelper };