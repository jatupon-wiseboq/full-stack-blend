import {HTMLHelper} from '../../helpers/HTMLHelper';
import {ManipulationHelper} from './ManipulationHelper';
import {LayoutHelper} from './LayoutHelper';
import {InternalProjectSettings} from './WorkspaceHelper';
import {Accessories, EditorHelper} from './EditorHelper';
import {SINGLE_DOM_CONTAINER_ELEMENTS} from '../../Constants';

var CursorHelper = {
  moveCursorToTheEndOfDocument: (remember: boolean = true) => {
    let element = HTMLHelper.getElementByClassName('internal-fsb-begin');
    if (element) {
      ManipulationHelper.perform('move[cursor]', CursorHelper.createWalkPathForCursor(), remember);
      element.parentNode.appendChild(Accessories.guide.getDOMNode());
      Accessories.guide.invalidate();
    }
  },
  moveCursorToTheLeft: (link: any = Math.random()) => {
    const cursorElement = Accessories.cursor.getDOMNode();
    const isSkipEntering = cursorElement.previousElementSibling && !HTMLHelper.hasClass(cursorElement.previousElementSibling, 'internal-fsb-allow-cursor') || undefined;
    let {theAllowCursorElement, theAllowCursorPosition} = CursorHelper.recusiveFindOnTheLeft(Accessories.cursor.getDOMNode(), isSkipEntering);

    if (theAllowCursorElement.tagName == 'TR') {
      const cursorElement = Accessories.cursor.getDOMNode();
      theAllowCursorElement = cursorElement.parentNode.previousElementSibling || null;

      if (theAllowCursorElement == null) return;

      theAllowCursorPosition = theAllowCursorElement && theAllowCursorElement.children.length;
    }

    const walkPath = CursorHelper.findWalkPathForElement(theAllowCursorElement);
    walkPath[2] = theAllowCursorPosition;

    ManipulationHelper.perform('move[cursor]', walkPath, true, false, link);
  },
  recusiveFindOnTheLeft: (element: HTMLElement, isSkipEntering: boolean = false, willSkipOnce: boolean = true) => {
    if (HTMLHelper.hasClass(element, 'internal-fsb-accessory')) {
      if (element.parentNode.firstElementChild == element) {
        return CursorHelper.recusiveFindOnTheLeft(element.parentNode, true, true);
      } else if (element.previousElementSibling) {
        return CursorHelper.recusiveFindOnTheLeft(element.previousElementSibling, isSkipEntering, willSkipOnce);
      } else {
        return CursorHelper.recusiveFindOnTheLeft(element.parentNode, isSkipEntering, willSkipOnce);
      }
    } else if (HTMLHelper.hasClass(element.parentNode, 'internal-fsb-allow-cursor')) {
      if (!isSkipEntering && HTMLHelper.hasClass(element, 'internal-fsb-allow-cursor') && !HTMLHelper.hasAttribute(element, 'internal-fsb-inheriting')) {
        if (element.lastElementChild) {
          return CursorHelper.recusiveFindOnTheLeft(element.lastElementChild, true, false);
        } else {
          return {theAllowCursorElement: element, theAllowCursorPosition: 0};
        }
      } else {
        if (willSkipOnce) {
          // TODO: Will be removed when there isn't a case that the previousElementSibling may be an internal-fsb-accessory.
          if (element.previousElementSibling && !HTMLHelper.hasClass(element.previousElementSibling, 'internal-fsb-accessory')) {
            isSkipEntering = isSkipEntering || HTMLHelper.hasAttribute(element, 'internal-fsb-inheriting');

            return CursorHelper.recusiveFindOnTheLeft(element.previousElementSibling, isSkipEntering, false);
          } else {
            return {theAllowCursorElement: element.parentNode, theAllowCursorPosition: 0};
          }
        } else {
          let theAllowCursorElement = element.parentNode;
          let theAllowCursorPosition = [...theAllowCursorElement.children].indexOf(element) + 1;

          return {theAllowCursorElement, theAllowCursorPosition};
        }
      }
    } else {
      // TODO: Will be removed when there isn't a case that the previousElementSibling may be an internal-fsb-accessory.
      if (element.previousElementSibling && !HTMLHelper.hasClass(element.previousElementSibling, 'internal-fsb-accessory')) {
        return CursorHelper.recusiveFindOnTheLeft(element.previousElementSibling, isSkipEntering, false);
      } else {
        return {theAllowCursorElement: element.parentNode, theAllowCursorPosition: 0};
      }
    }
  },
  moveCursorUp: () => {
    let walkPath = [...CursorHelper.findWalkPathForCursor()];
    walkPath[2] = Math.max(0, walkPath[2] - 1);

    if (walkPath[2] == 0) {
      if (Accessories.cursor.getDOMNode().parentNode.tagName == 'TD' &&
        HTMLHelper.getPreviousSibling(Accessories.cursor.getDOMNode().parentNode.parentNode) &&
        HTMLHelper.getPreviousSibling(Accessories.cursor.getDOMNode().parentNode.parentNode).tagName == 'TR') {

        let colIndex = [...Accessories.cursor.getDOMNode().parentNode.parentNode.children].indexOf(Accessories.cursor.getDOMNode().parentNode);
        let nextContainer = HTMLHelper.getPreviousSibling(Accessories.cursor.getDOMNode().parentNode.parentNode).children[colIndex];

        walkPath[1] -= Accessories.cursor.getDOMNode().parentNode.parentNode.children.length;
        walkPath[2] = nextContainer.children.length;
      }
    }

    ManipulationHelper.perform('move[cursor]', walkPath);
  },
  moveCursorToTheRight: (link: any = Math.random()) => {
    let {theAllowCursorElement, theAllowCursorPosition} = CursorHelper.recusiveFindOnTheRight(Accessories.cursor.getDOMNode());

    if (theAllowCursorElement.tagName == 'TR') {
      const cursorElement = Accessories.cursor.getDOMNode();
      theAllowCursorElement = cursorElement.parentNode.nextElementSibling || null;

      if (theAllowCursorElement == null) return;

      theAllowCursorPosition = theAllowCursorElement && theAllowCursorElement.children.length;
    }

    let walkPath = CursorHelper.findWalkPathForElement(theAllowCursorElement);
    walkPath[2] = theAllowCursorPosition;

    ManipulationHelper.perform('move[cursor]', walkPath, true, false, link);
  },
  recusiveFindOnTheRight: (element: HTMLElement, isSkipEntering: boolean = false, willSkipOnce: boolean = true) => {
    if (HTMLHelper.hasClass(element, 'internal-fsb-accessory')) {
      if (element.parentNode.lastElementChild == element) {
        return CursorHelper.recusiveFindOnTheRight(element.parentNode, true, true);
      } else if (element.nextElementSibling) {
        return CursorHelper.recusiveFindOnTheRight(element.nextElementSibling, isSkipEntering, false);
      } else {
        return CursorHelper.recusiveFindOnTheRight(element.parentNode, isSkipEntering, willSkipOnce);
      }
    } else if (HTMLHelper.hasClass(element.parentNode, 'internal-fsb-allow-cursor')) {
      if (!isSkipEntering && HTMLHelper.hasClass(element, 'internal-fsb-allow-cursor') && !HTMLHelper.hasAttribute(element, 'internal-fsb-inheriting')) {
        return {theAllowCursorElement: element, theAllowCursorPosition: 0};
      } else {
        if (willSkipOnce) {
          // TODO: Will be removed when there isn't a case that the nextElementSibling may be an internal-fsb-accessory.
          if (element.nextElementSibling && !HTMLHelper.hasClass(element.nextElementSibling, 'internal-fsb-accessory')) {
            isSkipEntering = isSkipEntering || HTMLHelper.hasAttribute(element, 'internal-fsb-inheriting');

            return CursorHelper.recusiveFindOnTheRight(element.nextElementSibling, isSkipEntering, false);
          } else {
            return {theAllowCursorElement: element.parentNode, theAllowCursorPosition: element.parentNode.children.length};
          }
        } else {
          let theAllowCursorElement = element.parentNode;
          let theAllowCursorPosition = [...theAllowCursorElement.children].indexOf(element);

          return {theAllowCursorElement, theAllowCursorPosition};
        }
      }
    } else {
      // TODO: Will be removed when there isn't a case that the nextElementSibling may be an internal-fsb-accessory.
      if (element.nextElementSibling && !HTMLHelper.hasClass(element.nextElementSibling, 'internal-fsb-accessory')) {
        return CursorHelper.recusiveFindOnTheRight(element.nextElementSibling, isSkipEntering, false);
      } else {
        return {theAllowCursorElement: element.parentNode, theAllowCursorPosition: element.parentNode.children.length};
      }
    }
  },
  moveCursorDown: () => {
    let walkPath = [...CursorHelper.findWalkPathForCursor()];
    let maximum = walkPath[2];

    let referenceElement = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', walkPath[0]);
    if (referenceElement) {
      let allowCursorElements = (SINGLE_DOM_CONTAINER_ELEMENTS.indexOf(HTMLHelper.getAttribute(referenceElement, 'internal-fsb-class')) != -1) ?
        [referenceElement] : [...HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', referenceElement, 'internal-fsb-element')];
      let theAllowCursorElement = allowCursorElements[walkPath[1]];

      if (theAllowCursorElement) {
        let children = [...theAllowCursorElement.children];
        let count = (children.indexOf(Accessories.cursor.getDOMNode()) !== -1) ? children.length - 1 : children.length;
        maximum = count;
      }
    }

    walkPath[2] = Math.min(maximum, walkPath[2] + 1);

    if (walkPath[2] == Accessories.cursor.getDOMNode().parentNode.children.length - 1) {
      if (Accessories.cursor.getDOMNode().parentNode.tagName == 'TD' &&
        HTMLHelper.getNextSibling(Accessories.cursor.getDOMNode().parentNode.parentNode) &&
        HTMLHelper.getNextSibling(Accessories.cursor.getDOMNode().parentNode.parentNode).tagName == 'TR') {

        let colIndex = [...Accessories.cursor.getDOMNode().parentNode.parentNode.children].indexOf(Accessories.cursor.getDOMNode().parentNode);
        let nextContainer = HTMLHelper.getNextSibling(Accessories.cursor.getDOMNode().parentNode.parentNode).children[colIndex];

        walkPath[1] += Accessories.cursor.getDOMNode().parentNode.parentNode.children.length;
        walkPath[2] = 0;
      }
    }

    ManipulationHelper.perform('move[cursor]', walkPath);
  },
  getDepthFirstReferencesForCursorWalks: (container: HTMLElement = document.body, allAllowCursorElements: [HTMLElement] = [], allAllowCursorPositions: number[] = []) => {
    let isContainerAllowedCursor = HTMLHelper.hasClass(container, 'internal-fsb-allow-cursor');

    let children = [...container.children];
    let count = 0;
    let total = 0;
    for (let i = 0; i < children.length; i++) {
      if (HTMLHelper.hasClass(children[i], 'internal-fsb-accessory')) continue;
      if (isContainerAllowedCursor) {
        allAllowCursorElements.push(container);
        allAllowCursorPositions.push(count);

        count += 1;
      }

      total += 1;

      CursorHelper.getDepthFirstReferencesForCursorWalks(children[i], allAllowCursorElements, allAllowCursorPositions);
    }

    return {allAllowCursorElements, allAllowCursorPositions};
  },
  findWalkPathForElement: function(allowCursorElement: HTMLElement) {
    let referenceElement = HTMLHelper.findTheParentInClassName('internal-fsb-element', allowCursorElement, true) || HTMLHelper.getElementByClassName('internal-fsb-begin');
    let isReferenceElementASingleDomElement = (SINGLE_DOM_CONTAINER_ELEMENTS.indexOf(HTMLHelper.getAttribute(referenceElement, 'internal-fsb-class')) != -1);

    if (isReferenceElementASingleDomElement) {
      referenceElement = allowCursorElement;
    }

    if (referenceElement) {
      let allowCursorElements = isReferenceElementASingleDomElement ?
        [referenceElement] : [...HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', referenceElement, 'internal-fsb-element')];
      let theAllowCursorElement = allowCursorElement;
      let indexOfAllowCursorElement = allowCursorElements.indexOf(theAllowCursorElement);

      if (indexOfAllowCursorElement != -1) {
        let positionInTheAllowCursorElement = theAllowCursorElement.children.length;
        return CursorHelper.createWalkPathForCursor(HTMLHelper.getAttribute(referenceElement, 'internal-fsb-guid'),
          indexOfAllowCursorElement,
          positionInTheAllowCursorElement);
      }
    }

    return CursorHelper.createWalkPathForCursor();
  },
  findWalkPathForCursor: function() {
    let referenceElement = HTMLHelper.findTheParentInClassName('internal-fsb-element', Accessories.cursor.getDOMNode()) || HTMLHelper.getElementByClassName('internal-fsb-begin');
    if (referenceElement) {
      let allowCursorElements = (SINGLE_DOM_CONTAINER_ELEMENTS.indexOf(HTMLHelper.getAttribute(referenceElement, 'internal-fsb-class')) != -1) ?
        [referenceElement] : [...HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', referenceElement, 'internal-fsb-element')];
      let theAllowCursorElement = Accessories.cursor.getDOMNode().parentNode;
      let indexOfAllowCursorElement = allowCursorElements.indexOf(theAllowCursorElement);

      if (indexOfAllowCursorElement != -1) {
        if (HTMLHelper.getAttribute(Accessories.cursor.getDOMNode(), 'internal-cursor-mode') == 'relative') {
          let positionInTheAllowCursorElement = [...theAllowCursorElement.children].indexOf(Accessories.cursor.getDOMNode());

          if (positionInTheAllowCursorElement != -1) {
            return CursorHelper.createWalkPathForCursor(HTMLHelper.getAttribute(referenceElement, 'internal-fsb-guid'),
              indexOfAllowCursorElement,
              positionInTheAllowCursorElement);
          }
        } else {
          return CursorHelper.createWalkPathForCursor(HTMLHelper.getAttribute(referenceElement, 'internal-fsb-guid'),
            indexOfAllowCursorElement,
            parseInt(Accessories.cursor.getDOMNode().style.left),
            parseInt(Accessories.cursor.getDOMNode().style.top));
        }
      }
    }

    return CursorHelper.createWalkPathForCursor();
  },
  createWalkPathForCursor: function(referenceElementGUID: string = '0', indexOfAllowCursorElement: number = 0,
    positionXInTheAllowCursorElement: number = null, positionYInTheAllowCursorElement: number = null) {
    if (positionXInTheAllowCursorElement == null) {
      let children = [...HTMLHelper.getElementByClassName('internal-fsb-begin-layout').children];
      let count = (children.indexOf(Accessories.cursor.getDOMNode()) !== -1) ? children.length - 1 : children.length;
      let maximum = count;
      positionXInTheAllowCursorElement = maximum;
    }

    return [referenceElementGUID, indexOfAllowCursorElement, positionXInTheAllowCursorElement, positionYInTheAllowCursorElement];
  },
  placingCursorUsingWalkPath: function(walkPath: [string, number, number, number]) {
    const walkings = Array.from(HTMLHelper.getElementsByClassName('internal-fsb-walking'));
    for (const walking of walkings) {
      HTMLHelper.removeClass(walking, 'internal-fsb-walking');
    }

    const placings = Array.from(HTMLHelper.getElementsByClassName('internal-fsb-placing-cursor'));
    for (const placing of placings) {
      HTMLHelper.removeClass(placing, 'internal-fsb-placing-cursor');
    }

    let referenceElement = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', walkPath[0]);
    if (referenceElement) {
      let isReferenceElementASingleDomElement = (SINGLE_DOM_CONTAINER_ELEMENTS.indexOf(HTMLHelper.getAttribute(referenceElement, 'internal-fsb-class')) != -1);
      let allowCursorElements = isReferenceElementASingleDomElement ?
        [referenceElement] : [...HTMLHelper.getElementsByClassName('internal-fsb-allow-cursor', referenceElement, 'internal-fsb-element')];
      let theAllowCursorElement = allowCursorElements[walkPath[1]];

      if (theAllowCursorElement) {
        if (walkPath[3] == null) {
          if (Accessories.cursor.getDOMNode().parentNode != null) {
            Accessories.cursor.getDOMNode().parentNode.removeChild(Accessories.cursor.getDOMNode());
          }

          let isTheAllowCursorElementASingleDomElement = (SINGLE_DOM_CONTAINER_ELEMENTS.indexOf(HTMLHelper.getAttribute(theAllowCursorElement, 'internal-fsb-class')) != -1);

          Accessories.cursor.getDOMNode().style.left = '-1.0px';
          Accessories.cursor.getDOMNode().style.top = isTheAllowCursorElementASingleDomElement ? '0px' : '0px';
          HTMLHelper.setAttribute(Accessories.cursor.getDOMNode(), 'internal-cursor-mode', 'relative');
          theAllowCursorElement.insertBefore(Accessories.cursor.getDOMNode(), theAllowCursorElement.children[walkPath[2]] || null);
        } else {
          Accessories.cursor.getDOMNode().style.left = walkPath[2] + 'px';
          Accessories.cursor.getDOMNode().style.top = walkPath[3] + 'px';
          HTMLHelper.setAttribute(Accessories.cursor.getDOMNode(), 'internal-cursor-mode', 'absolute');
          theAllowCursorElement.insertBefore(Accessories.cursor.getDOMNode(), theAllowCursorElement.firstElementChild);
        }

        const element = HTMLHelper.findTheParentInClassName('internal-fsb-element', theAllowCursorElement, true);
        if (element) HTMLHelper.addClass(element, 'internal-fsb-walking');

        if (theAllowCursorElement.tagName == 'TD') HTMLHelper.addClass(theAllowCursorElement, 'internal-fsb-placing-cursor');
      }
    }
  }
};

export {CursorHelper};