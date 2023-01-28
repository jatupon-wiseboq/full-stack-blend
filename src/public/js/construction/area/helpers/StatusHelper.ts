import {StylesheetHelper} from './StylesheetHelper';
import {AnimationHelper} from './AnimationHelper';
import {EditorHelper} from './EditorHelper';
import {InternalProjectSettings} from './WorkspaceHelper';
import {HTMLHelper} from '../../helpers/HTMLHelper';
import {CAMEL_OF_EVENTS_DICTIONARY} from '../../Constants';

let cachedElementAuthoringStatuses = null;
let cachedElementAuthoringRevision = 0;

var StatusHelper = {
  invalidate: function(element: HTMLElement) {
    cachedElementAuthoringStatuses = null;
    cachedElementAuthoringRevision++;
  },
  getElementAuthoringStatuses: () => {
    if (cachedElementAuthoringStatuses != null) return cachedElementAuthoringStatuses;

    const statuses = {};

    const elements = Array.from(HTMLHelper.getElementsByAttribute('internal-fsb-guid'));
    const selecting = HTMLHelper.getElementByClassName('internal-fsb-selecting');
    if (selecting) elements.push(selecting);
    for (const element of elements) {
      const guid = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
      const isTableLayoutCell = (element.tagName == 'TD' && HTMLHelper.hasClass(element, 'internal-fsb-allow-cursor'));
      const isTableLayoutRow = (element.tagName == 'TR');
      const id = (isTableLayoutCell) ? HTMLHelper.getAttribute(element.parentNode.parentNode.parentNode, 'internal-fsb-guid') : ((isTableLayoutRow) ? HTMLHelper.getAttribute(element.parentNode.parentNode, 'internal-fsb-guid') : HTMLHelper.getAttribute(element, 'internal-fsb-guid')); // TODO: Move into an unit code or a different helper.

      statuses[(isTableLayoutRow) ? id + ':' + [...element.parentNode.childNodes].indexOf(element) : guid] = StatusHelper.getElementAuthoringStatus(element);
    }

    cachedElementAuthoringRevision++;

    cachedElementAuthoringStatuses = statuses;
    return cachedElementAuthoringStatuses;
  },
  getElementAuthoringStatus: (element: HTMLElement) => {
    const statuses = [''];

    const style = StylesheetHelper.getStyle(element);
    if (style && (style + ';').replace(/-fsb-[^;]+;+/g, '').trim()) statuses.push('has-design');
    if (style && style.indexOf('-fsb-design-lock') != -1) {
      statuses.push('has-design');
      statuses.push('has-design-locking');
    }
    if (style && style.indexOf('-fsb-code-lock') != -1) {
      statuses.push('has-coding');
      statuses.push('has-code-locking');
    }

    if (AnimationHelper.hasKeyframes(HTMLHelper.getAttribute(element, 'internal-fsb-guid'))) statuses.push('has-animation');

    const info = HTMLHelper.getAttributes(element, false);
    let found = false;
    for (const name of Object.keys(CAMEL_OF_EVENTS_DICTIONARY)) {
      if (info[name]) {
        const value = JSON.parse(info[name]);
        if (value.event) {
          found = true;
          break;
        }
      }
    }

    if (!found) {
      for (const name in info) {
        if (name.indexOf('internal-fsb-react-') == 0 || name.indexOf('internal-fsb-data-') == 0) {
          found = true;
          break;
        }

        if (info.hasOwnProperty(name)) {
          for (const key of ['SETTING', 'PROPERTY', 'STATE', 'CODE']) {
            if (info[name] && info[name].indexOf(key) == 0) {
              found = true;
              break;
            }
          }
        }
        if (found) break;
      }
    }

    if (found) statuses.push('has-coding');

    const reactMode = HTMLHelper.getAttribute(element, 'internal-fsb-react-mode');
    const presetName = HTMLHelper.getAttribute(element, 'internal-fsb-reusable-preset-name');
    const isHidden = HTMLHelper.hasClass(element, 'internal-fsb-layer-off');

    if (reactMode) statuses.push('is-react-component');
    if (presetName) statuses.push('is-containing-preset');
    if (isHidden) statuses.push('has-preview-off');

    if (HTMLHelper.hasClass(element, 'internal-fsb-selecting')) {
      statuses.push('-fsb-selecting');
    }

    return Array.from(new Set(statuses)).join(' ').trim();
  },
  getElementAuthoringRevision: function() {
    return cachedElementAuthoringRevision;
  },
  hasElementAndDescendantsCodeAuthoringStatus: (element: HTMLElement | string, status: string = 'has-coding'): boolean => {
    if (typeof element === 'string') element = HTMLHelper.getElementByAttributeNameAndValue('internal-fsb-guid', element);
    if (!element) return false;

    console.log(status);
    console.log(StatusHelper.getElementAuthoringStatus(element));

    if (HTMLHelper.hasAttribute(element, 'internal-fsb-guid') && StatusHelper.getElementAuthoringStatus(element).indexOf(status) != -1) return true;
    else {
      let child = element.firstElementChild;
      while (child) {
        if (StatusHelper.hasElementAndDescendantsCodeAuthoringStatus(child, status)) return true;

        child = element.nextElementChild;
      }
    }
  },
  hasElementAndDescendantsDesignLockAuthoringStatus: (element: HTMLElement | string): boolean => {
    return StatusHelper.hasElementAndDescendantsCodeAuthoringStatus(element, 'has-design-locking');
  },
  hasElementAndDescendantsCodeLockAuthoringStatus: (element: HTMLElement | string): boolean => {
    return StatusHelper.hasElementAndDescendantsCodeAuthoringStatus(element, 'has-code-locking');
  },
};

export {StatusHelper};