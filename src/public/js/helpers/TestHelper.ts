// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {HTMLHelper} from './HTMLHelper';
import {RequestHelper} from './RequestHelper';

let timerId = null;
let allocatedIds = {};

declare let window: any;

if (window.installedTestingConsole === undefined) window.installedTestingConsole = false;

const TestHelper = {
  identify: (delay: number = 1000) => {
    TestHelper.installConsoleDebugger();

    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      if (!TestHelper.checkIfSeleniumExists()) return;
      TestHelper.installTestingConsole();

      const elements = HTMLHelper.getElementsByAttribute('internal-fsb-guid');
      const assigned = [];

      for (const element of elements) {
        TestHelper.recursiveAssignId(element, assigned);
      }

      for (const element of assigned) {
        HTMLHelper.setAttribute(element, 'internal-fsb-visited', '1');
      }

      TestHelper.recursiveSortAttributes(assigned);
    }, delay);
  },
  recursiveAssignId: (element: any, assigned: any[], guid: string = '_') => {
    if (!element.tagName) return;

    let currentId = HTMLHelper.getAttribute(element, 'id') || '';

    const _guid = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
    guid = _guid || guid;

    let suffix = '';

    if (_guid) {
      const previousSiblingId = element.previousSibling && HTMLHelper.getAttribute(element.previousSibling, 'id') || null;
      const previousSiblingVisited = element.previousSibling && HTMLHelper.getAttribute(element.previousSibling, 'internal-fsb-visited') || null;

      if (!previousSiblingVisited || !previousSiblingId || previousSiblingId.indexOf('internal-fsb-') == -1) {
        const elements = Array.from(HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-guid', _guid, element.parentNode));
        const index = elements.indexOf(element);

        if (elements.length > 1 && index == elements.length - 1) suffix = '-last';
        else if (index % 10 == 0) suffix = `-${index + 1}st`;
        else if (index % 10 == 1) suffix = `-${index + 1}nd`;
        else if (index % 10 == 2) suffix = `-${index + 1}rd`;
        else suffix = `-${index + 1}th`;
      } else {
        suffix = `${previousSiblingId.match(/-(last|(\d+)(st|nd|rd|th))(-new)*/)[0]}-new`;
      }
    }

    if (!currentId) {
      let indexing = '';
      if (_guid) {
        let indexes = [];
        let parent = element.parentNode;

        while (parent != document) {
          if (HTMLHelper.hasAttribute(parent, 'data-fsb-index')) {
            indexes.push(HTMLHelper.getAttribute(parent, 'data-fsb-index'));
          }

          parent = parent.parentNode;
        }

        indexes.reverse();

        indexing = `[${indexes.join(',')}]`;
      }
      if (indexing == '[]') indexing = '';

      const key = `internal-fsb-${guid}${indexing}${suffix}`;
      if (allocatedIds[key] === undefined) allocatedIds[key] = 0;
      else allocatedIds[key]++;

      let middle = `-${allocatedIds[key]}`;
      if (middle == '-0') middle = '';

      HTMLHelper.setAttribute(element, 'id', `internal-fsb-${guid}${indexing}${middle}${suffix}`);
      assigned.push(element);

      const children = element.children;

      for (let i = 0; i < children.length; i++) {
        TestHelper.recursiveAssignId(children[i], assigned, `${guid}${indexing}${middle}${suffix}${'-' + i}`);
      }
    } else {
      const children = element.children;

      for (let i = 0; i < children.length; i++) {
        TestHelper.recursiveAssignId(children[i], assigned, `${currentId.replace('internal-fsb-', '')}${'-' + i}`);
      }
    }
  },
  recursiveSortAttributes: (elements: any) => {
    for (let j = 0; j < elements.length; j++) {
      if (!elements[j].setAttribute || !elements[j].removeAttribute) continue;

      let attributes = [];
      if (elements[j].hasAttributes()) {
        let attrs = elements[j].attributes;
        for (let attr of attrs) {
          attributes.push({
            name: attr.name,
            value: attr.value
          });
        }
      }

      for (let i = 0; i < attributes.length; i++) {
        elements[j].removeAttribute(attributes[i].name);
      }

      attributes = attributes.sort((a: any, b: any) => {
        if (a.name == 'id') return -1;
        if (b.name == 'id') return 1;

        return 0;
      });

      for (let i = 0; i < attributes.length; i++) {
        elements[j].setAttribute(attributes[i].name, attributes[i].value);
      }

      elements[j].children && TestHelper.recursiveSortAttributes(elements[j].children);
    }
  },
  checkIfSeleniumExists: (): boolean => {
    if (HTMLHelper.getElementById('selenium-ide-indicator')) return true;

    const children = Array.from(document.head.children);

    for (const child of children) {
      if (child.tagName == 'SCRIPT' && (child.getAttribute('src') || '').indexOf('/assets/prompt.js') != -1) {
        return true;
      }
    }

    return false;
  },
  installConsoleDebugger: () => {
    if (window.installConsoleDebugger === true) return;
    window.installConsoleDebugger = true;

    if (window.location.href.indexOf('://localhost') == -1) return;
    if (top === window) return;

    const _error = window.onerror;
    const error = ((msg, url, line, col, error) => {
      top.postMessage(JSON.stringify({
        type: 'error',
        msg: msg,
        url: url,
        line: line,
        col: col,
        error: error
      }), '*');
      if (_error) _error(msg, url, line, col, error);
    });
    window.onerror = error;

    window.console.log = ((...args) => {
      top.postMessage(JSON.stringify({
        type: 'console.log',
        args: args
      }), '*');
    });
    window.console.error = ((...args) => {
      top.postMessage(JSON.stringify({
        type: 'console.error',
        args: args
      }), '*');
    });

    window.addEventListener("message", ((event: any) => {
      let data = null;
      try {
        data = JSON.parse(event.data);
      } catch { /*void*/}

      switch (data.type) {
        case 'execute':
          try {
            window.console.log(eval(data.statement));
          } catch (error) {
            window.console.error(error.message);
          }
          break;
      }
    }).bind(this));
  },
  installTestingConsole: () => {
    if (window.installedTestingConsole === true) return;
    window.installedTestingConsole = true;

    if (document.domain.indexOf('stackblend.org') != -1) {
      document.domain = 'stackblend.org';
    }

    let element = document.createElement('div');
    element.innerHTML = '<div id="internal-fsb-test-expand" style="position: fixed;right: 0px;top: 50%;margin-top: -150px;width: 250px;background-color:#ffffff;border:solid 2px #0066ff;border-right:0;font-size: 13px;font-family: Courier;border-radius: 3px 0 0 3px;box-shadow:rgba(0,0,0,0.25) 0 0 10px;display:none;z-index:2147483647;"><div style="background-color: #0066ff;color: #ffffff;text-align: center;cursor: pointer;padding:2px;">Manipulation Console</div><div style="font-size: 11px; padding: 10px; color: #aaaaaa;"><label style="width: 100%; margin: 0 0 5px;"><div style="padding: 3px 0;">Action</div><select type="text" style="width: 100%; font-size: 13px; padding: 3px; height: 25px; border: solid 1px #0066ff; color: #0066ff;border-radius: 3px 3px 3px 3px;" id="internal-fsb-test-action"><option value="insert">Insert</option><option value="update">Update</option><option value="upsert">Upsert</option><option value="delete">Delete</option></select></label><label style="width: 100%; margin: 0 0 5px;"><div style="padding: 3px 0;">Premise Schema</div><input type="text" style="width: 100%; font-size: 13px; padding: 3px; height: 25px; border: solid 1px #0066ff; color: #0066ff;border-radius: 3px 3px 3px 3px;" id="internal-fsb-test-schema"></label><label style="width: 100%; margin: 0 0 5px;"><div style="padding: 3px 0;">Notations</div><textarea style="width: 100%; font-size: 13px; padding: 3px; border: solid 1px #0066ff; color: #0066ff;border-radius: 3px 3px 3px 3px;" rows="5" id="internal-fsb-test-notations"></textarea></label><button id="internal-fsb-test-submit" style="background-color: #0066ff; color: #ffffff; padding: 5px 15px; border: none;border-radius: 3px 3px 3px 3px;font-size:11px;margin-right: 5px;">Submit</button><button style="background-color: #0066ff; color: #ffffff; padding: 5px 15px; border: none;border-radius: 3px 3px 3px 3px;font-size:11px;" id="internal-fsb-test-toggle-off">Close</button></div></div><div id="internal-fsb-test-collapse" style="position: fixed;right: 0px;top: 50%;margin-top: -75px;height: 150px;background-color: #0066ff;font-size: 13px;font-family: Courier;border-radius: 3px 0 0 3px;box-shadow:rgba(0,0,0,0.25) 0 0 10px;z-index:2147483647;cursor: pointer;"><span style="writing-mode: vertical-rl;color: #ffffff;text-align: center;height: 100%;padding:2px;pointer-events:none;">Manipulation Console</span></div>';

    document.body.appendChild(element);

    const expand = document.getElementById('internal-fsb-test-expand');
    const collapse = document.getElementById('internal-fsb-test-collapse');
    const on = document.getElementById('internal-fsb-test-collapse');
    const off = document.getElementById('internal-fsb-test-toggle-off');
    const submit = document.getElementById('internal-fsb-test-submit');
    const action = document.getElementById('internal-fsb-test-action') as HTMLSelectElement;
    const schema = document.getElementById('internal-fsb-test-schema') as HTMLInputElement;
    const notations = document.getElementById('internal-fsb-test-notations') as HTMLTextAreaElement;

    on.addEventListener('click', () => {
      expand.style.display = 'block';
      collapse.style.display = 'none';
    }, true);
    off.addEventListener('click', () => {
      expand.style.display = 'none';
      collapse.style.display = 'block';
    }, true);
    submit.addEventListener('click', async () => {
      let json = null;
      try {
        json = JSON.parse(notations.value);
      } catch (error) {
        alert('Cannot parse notations into JSON object.');
        return;
      }

      const data = await RequestHelper.post('/test/api', {
        action: action.value,
        schema: schema.value,
        fields: json
      }, 'json');

      if (data.success) window.location.reload();
      else alert(`Error: ${data.error}.`);
    }, true);
  }
}

export {TestHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.