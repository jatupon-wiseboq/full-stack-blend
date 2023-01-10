// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {RequestHelper} from './RequestHelper';
import {NotificationHelper} from './NotificationHelper';
import {HTMLHelper} from './HTMLHelper';
import {EventHelper} from './EventHelper';

declare let window: any;

enum SourceType {
  Relational,
  PrioritizedWorker,
  Document,
  VolatileMemory,
  RESTful,
  Dictionary,
  Collection
}
interface HierarchicalDataTable {
  source: SourceType;
  group: string;
  rows: HierarchicalDataRow[];
  notification?: string;
}
interface HierarchicalDataRow {
  keys: {[Identifier: string]: any};
  columns: {[Identifier: string]: any};
  relations: {[Identifier: string]: HierarchicalDataTable};
  timestamp?: number;
}

const fieldManipulatorsInfoDict: any = {};
const actionManipulatorsInfoDict: any = {};
const optionsManipulatorsInfoDict: any = {};
const isDevelopmentMachine = ['localhost:3000', 'develop.stackblend.com', 'staging.stackblend.com', 'www.stackblend.com'].indexOf(location.host) != -1;
const registeredEndpoint: string = (isDevelopmentMachine) ? window.ENDPOINT || null : null;
const currentPath: string = (isDevelopmentMachine) ? window.PATH || null : null;

const removeAndRestoreDisabledAttributeForInvoking = (button: any, callback: any) => {
  const disabled = HTMLHelper.getAttribute(button, 'disabled');
  const setAttribute = button.setAttribute;
  const getAttribute = button.getAttribute;
  const removeAttribute = button.removeAttribute;

  let detectedChange = false;
  button.setAttribute = (name, value) => {if (name && name.toLowerCase() == 'disabled') {detectedChange = true; setAttribute.call(button, name, value);} };
  button.getAttribute = (name) => {if (name && name.toLowerCase() == 'disabled') {return disabled;} else {return getAttribute.call(button, name);} };
  button.removeAttribute = (name) => {if (name && name.toLowerCase() == 'disabled') {detectedChange = true; removeAttribute.call(button, name);} };

  callback();

  button.setAttribute = setAttribute;
  button.getAttribute = getAttribute;
  button.removeAttribute = removeAttribute;

  if (!detectedChange && HTMLHelper.getAttribute(button, 'disabled') == null && disabled != null) HTMLHelper.setAttribute(button, 'disabled', disabled);
};

const DataManipulationHelper = {
  register: (guid: string, action: string, fields: string[], options: any) => {
    if (!fieldManipulatorsInfoDict[guid]) {
      fieldManipulatorsInfoDict[guid] = fields;
      actionManipulatorsInfoDict[guid] = action;
      optionsManipulatorsInfoDict[guid] = options;
    }
  },
  getInfo: (guid: string): any => {
    return {
      fields: fieldManipulatorsInfoDict[guid],
      action: actionManipulatorsInfoDict[guid],
      options: optionsManipulatorsInfoDict[guid]
    };
  },
  request: (guid: string, notation: string, event: Event, callback: any) => {
    if (fieldManipulatorsInfoDict[guid]) {
      const params = {};
      const fields = fieldManipulatorsInfoDict[guid];
      const action = actionManipulatorsInfoDict[guid];
      const options = optionsManipulatorsInfoDict[guid];

      let current = EventHelper.getOriginalElement(event);
      current = current.parentNode;

      let lastOneUnderIndexing = null;
      let firstOneOfContainer = null;
      let foundAll = false;
      const foundRadio = {};

      while (!foundAll && current != null && current != document) {
        foundAll = true;

        if (HTMLHelper.hasAttribute(current, 'data-fsb-index')) {
          lastOneUnderIndexing = current;
        }

        for (const field of fields) {
          const elements = HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-guid', field, current) as any;

          if (elements.length == 0) {
            foundAll = false;
          } else if (!firstOneOfContainer) {
            firstOneOfContainer = current;
          }
        }

        if (foundAll) break;

        current = current.parentNode;
      }

      if (firstOneOfContainer && HTMLHelper.getElementsByAttribute('data-fsb-index', firstOneOfContainer, true).length != 0) {
        current = lastOneUnderIndexing || firstOneOfContainer;
      }

      for (const field of fields) {
        const elements = HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-guid', field, current) as any;

        for (let index = 0; index < elements.length; index++) {
          let element = elements[index];

          // All of inputs are a forwarding element. To get the actual input,
          // we must look into their children.
          // 
          if (element.tagName != 'INPUT') {
            element = element.firstElementChild;
          }

          let indexes = [];
          let parent = element.parentNode;

          while (parent != document && parent != current) {
            if (HTMLHelper.hasAttribute(parent, 'data-fsb-index')) {
              indexes.push(HTMLHelper.getAttribute(parent, 'data-fsb-index'));
            }

            parent = parent.parentNode;
          }

          indexes.reverse();
          if (indexes.length == 0) indexes.push(index);

          const name = (elements.length > 1) ? `${field}[${indexes.join(',')}]` : field;

          switch (HTMLHelper.getAttribute(element, 'type')) {
            case 'radio':
              if (foundRadio[element.name] === undefined) {
                foundRadio[element.name] = name;
              }
              if (element.checked) {
                foundRadio[element.name] = true;
                params[name] = element.value;
              }
              break;
            case 'checkbox':
              params[name] = element.checked ? 'true' : 'false';
              break;
            default:
              params[name] = element.value;
              break;
          }
        }
      }

      for (let name in foundRadio) {
        if (foundRadio.hasOwnProperty(name)) {
          if (foundRadio[name] !== true) {
            params[foundRadio[name]] = null;
          }
        }
      }

      params['guid'] = guid;
      params['notation'] = notation;

      const button = EventHelper.getCurrentElement(event);

      if (button) {
        const event = new CustomEvent('submitting', {
          detail: {
            params: params
          },
          cancelable: true
        });

        removeAndRestoreDisabledAttributeForInvoking(button, () => {
          button.dispatchEvent(event);
        });
        if (event.defaultPrevented) return;
      }

      RequestHelper.post((registeredEndpoint || `${location.protocol}//${location.host}`) + (currentPath || `${location.pathname}`), params)
        .then((json) => {
          if (button) {
            const event = new CustomEvent('submitted', {
              detail: {
                params: params,
                response: json
              },
              cancelable: true
            });

            removeAndRestoreDisabledAttributeForInvoking(button, () => {
              button.dispatchEvent(event);
            });
            if (event.defaultPrevented) return;
          }

          if (json.success) {
            if (button) {
              const event = new CustomEvent('success', {
                detail: {
                  params: params,
                  response: json
                },
                cancelable: true
              });

              removeAndRestoreDisabledAttributeForInvoking(button, () => {
                button.dispatchEvent(event);
              });
              if (event.defaultPrevented) return;
            }

            if (json.redirect) {
              window.location = json.redirect;
            } else {
              if (callback) {
                callback(json.results);
              } else {
                alert("The submit button should be containing in a react control, so that it can be fetched by using data notations.");
              }
            }
          } else {
            if (button) {
              const event = new CustomEvent('failed', {
                detail: {
                  params: params,
                  response: json
                },
                cancelable: true
              });

              removeAndRestoreDisabledAttributeForInvoking(button, () => {
                button.dispatchEvent(event);
              });
              if (event.defaultPrevented) return;
            }

            if (json.error) {
              console.log(json.error);
              alert(json.error);
            } else {
              console.error(json);
              alert("There is an error occured, please try again.");
            }
          }
        })
        .catch((status) => {
          console.error(status);
          alert("There is an error occured, please check your internet connection.");
        })
        .finally(() => {

        });
    }
  },
  getDataFromKey: (key: string, current: any, index: number = -1): any => {
    if (Array.isArray(current)) {
      current = current[0] || {};
    }

    // Search HierarchicalDataRow
    //     
    let table = (current.relations || {})[key];
    if (table) {
      if (index != -1) {
        return table.rows[index];
      } else {
        return table.rows;
      }
    } else {
      // Search HierarchicalDataColumn
      // 
      let column = (current.keys || {})[key] || (current.columns || {})[key];
      if (column !== undefined) {
        return column;
      } else {
        return null;
      }
    }
  },
  getDataFromNotation: (notation: string, data: any = window.data, inArray: boolean = false): any => {
    if (!notation) {
      console.error("The notation is null, undefined or empty.");
      alert("There is an error occured, please try again.");
      return [];
    }

    let splited = notation.split('.');
    let current;

    if (data.keys && data.columns) {
      current = data;
    } else {
      current = {
        keys: null,
        columns: null,
        relations: data
      };
    }

    let shifted = splited.shift();
    while (current && shifted) {
      let tokens = shifted.split('[');
      if (tokens.length == 1) {
        current = DataManipulationHelper.getDataFromKey(tokens[0], current);
      } else if (tokens.length == 2) {
        current = DataManipulationHelper.getDataFromKey(tokens[0], current, parseInt(tokens[1].split(']')[0]));
      } else {
        current = null;
      }
      shifted = splited.shift();
    }

    if (inArray) {
      if (Array.isArray(current)) {
        return current;
      } else if (current !== null && current !== undefined) {
        return [current];
      } else {
        return [];
      }
    } else {
      return current;
    }
  }
};

export {HierarchicalDataTable, HierarchicalDataRow, SourceType, DataManipulationHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.