import {HTMLHelper} from '../../helpers/HTMLHelper';

let cachedElementTreeNodes = null;

var SchemaHelper = {
	invalidate: function() {
		cachedElementTreeNodes = null;
	},
  generateDataSchema: (): any => {
    let tables = {};
    
    const groups = ['RelationalTable', 'DocumentTable', 'WorkerInstance', 'VolatileMemory', 'RESTful'];
    const entities = ['RelationalColumn', 'DocumentNotation', 'WorkerQueue', 'VolatilePrefix', 'Verb'];
    
    for (const [i, group] of groups.entries()) {
      let tableElements = HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-class', group);
      
      for (let tableElement of tableElements) {
        let tableName = HTMLHelper.getAttribute(tableElement, 'data-title-name');
        let tableGUID = HTMLHelper.getAttribute(tableElement, 'internal-fsb-guid');
        let columnElements = HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-class', entities[i], tableElement);
        let relationElements = HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-class', 'Connection');
        
        let keys = {};
        let columns = {};
        let relations = {};
        
        for (let columnElement of columnElements) {
          let columnName = HTMLHelper.getAttribute(columnElement, 'data-title-name');
          let columnGUID = HTMLHelper.getAttribute(columnElement, 'internal-fsb-guid');
          let columnType = HTMLHelper.getAttribute(columnElement, 'data-column-type');
          let fieldType = HTMLHelper.getAttribute(columnElement, 'data-field-type');
          let required = HTMLHelper.getAttribute(columnElement, 'data-required');
          let unique = HTMLHelper.getAttribute(columnElement, 'data-unique');
          let verb = HTMLHelper.getAttribute(columnElement, 'data-verb');
          let url = HTMLHelper.getAttribute(columnElement, 'data-url');
          
          if (columnType == 'primary') {
            keys[columnName] = {
              name: columnName,
            	guid: columnGUID,
            	fieldType: fieldType,
            	required: (required == 'true'),
            	unique: (unique == 'true'),
            	verb: verb,
            	url: url,
              modifyingPermission: SchemaHelper.generatePermission(columnElement, 'data-lock'),
              retrievingPermission: SchemaHelper.generatePermission(columnElement, 'data-rendering-condition')
            }
          } else {
            columns[columnName] = {
              name: columnName,
            	guid: columnGUID,
            	fieldType: fieldType,
            	required: (required == 'true'),
            	unique: (unique == 'true'),
            	verb: verb,
            	url: url,
              modifyingPermission: SchemaHelper.generatePermission(columnElement, 'data-lock'),
              retrievingPermission: SchemaHelper.generatePermission(columnElement, 'data-rendering-condition')
            }
          }
        }
        
        for (let relationElement of relationElements) {
          let relationName = HTMLHelper.getAttribute(relationElement, 'data-title-name');
          let relationGUID = HTMLHelper.getAttribute(relationElement, 'internal-fsb-guid');
          let sourceGroupName = HTMLHelper.getAttribute(relationElement, 'data-source-group-name');
          let sourceEntityName = HTMLHelper.getAttribute(relationElement, 'data-source-entity-name');
          let targetGroupName = HTMLHelper.getAttribute(relationElement, 'data-target-group-name');
          let targetEntityName = HTMLHelper.getAttribute(relationElement, 'data-target-entity-name');
          
          if (sourceGroupName && sourceEntityName && targetGroupName && targetEntityName) {
            if (tableName == sourceGroupName) {
              relations[targetGroupName] = {
                name: relationName,
              	guid: relationGUID,
                sourceGroup: sourceGroupName,
                sourceEntity: sourceEntityName,
                targetGroup: targetGroupName,
                targetEntity: targetEntityName
              };
            } else if (tableName == targetGroupName) {
              relations[sourceGroupName] = {
                name: relationName,
              	guid: relationGUID,
                sourceGroup: targetGroupName,
                sourceEntity: targetEntityName,
                targetGroup: sourceGroupName,
                targetEntity: sourceEntityName
              };
            }
          }
        }
        
        tables[tableName] = {
          source: ['relational', 'worker', 'document', 'volatile-memory', 'RESTful'][i],
          group: tableName,
          guid: tableGUID,
          keys: keys,
          columns: columns,
          relations: relations,
          modifyingPermission: SchemaHelper.generatePermission(tableElement, 'data-lock'),
          retrievingPermission: SchemaHelper.generatePermission(tableElement, 'data-rendering-condition')
        };
      }
    }
    
    return tables;
  },
  generatePermission: (element: HTMLElement, prefix: string): any => {
  	let mode = HTMLHelper.getAttribute(element, prefix + '-mode');
  	if (mode == null) return null;
  	
  	return {
  		mode: mode,
		  relationModeSourceGroup: HTMLHelper.getAttribute(element, prefix + '-source-group'),
		  relationModeSourceEntity: HTMLHelper.getAttribute(element, prefix + '-source-entity'),
		  relationMatchingMode: HTMLHelper.getAttribute(element, prefix + '-matching-mode'),
		  relationMatchingConstantValue: HTMLHelper.getAttribute(element, prefix + '-relation-matching-constant-value'),
		  relationMatchingSessionName: HTMLHelper.getAttribute(element, prefix + '-relation-matching-session-name'),
		  sessionMatchingSessionName: HTMLHelper.getAttribute(element, prefix + '-session-matching-session-name'),
		  sessionMatchingConstantValue: HTMLHelper.getAttribute(element, prefix + '-session-matching-constant-value')
  	}
  },
  recursiveAccumulateDotNotations: (notations: string[]=[], current: HTMLElement=document.body, accumulatedNotation: string=null, isContainingInReactClass: boolean=false): any => {
    if (HTMLHelper.hasAttribute(current, 'internal-fsb-react-mode')) {
      isContainingInReactClass = true;
    }
    
    if (isContainingInReactClass) {
      let reactData = HTMLHelper.getAttribute(current, 'internal-fsb-react-data');
      let reactPagingSize = HTMLHelper.getAttribute(current, 'internal-fsb-react-paging');
      
      if (reactData) {
        if (accumulatedNotation == null) {
          accumulatedNotation = reactData;
        } else {
          accumulatedNotation = accumulatedNotation + '.' + reactData;
        }
        
        if (reactPagingSize) {
          accumulatedNotation = accumulatedNotation + '[' + reactPagingSize + ']';
        }
        
        notations.push(accumulatedNotation);
      }
    }
    
    for (let element of [...current.children]) {
      if (element.tagName) {
        SchemaHelper.recursiveAccumulateDotNotations(notations, element, accumulatedNotation, isContainingInReactClass);
      }
    }
    
    return notations;
  },
  declareNamespace: (tree: any, path: string) => {
    let splited = path.split('.');
    let current: any = tree;
    
    splited.forEach((name) => {
      if (current[name] === undefined) {
        current[name] = {};
      }
      current = current[name];
    });
    
    return current;
  },
  generateTreeOfDotNotations: (): any => {
    let notations = SchemaHelper.recursiveAccumulateDotNotations();
    let tree = {};
    
    for (let notation of notations) {
      SchemaHelper.declareNamespace(tree, notation);
    }
    
    return tree;
  },
  getElementTreeNodes: function() {
  	if (cachedElementTreeNodes) return cachedElementTreeNodes;
  	
  	let tables = SchemaHelper.generateDataSchema();
  	let nodes = [];
  	
  	for (let tableName in tables) {
  		if (tables.hasOwnProperty(tableName)) {
	  		let table = tables[tableName];
	  		let keys = [];
	  		let columns = [];
	  		let relations = [];
	  		
	  		nodes.push({
					id: null,
					customClassName: 'title',
					name: table.group,
					selectable: false,
					dropable: false,
					insertable: true,
					dragable: true,
					disabled: false,
					selected: false,
					nodes: [{
						id: null,
						customClassName: 'subtitle',
						name: 'keys',
						selectable: false,
						dropable: false,
						disabled: false,
						selected: false,
						nodes: keys,
						tag: null
					}, {
						id: null,
						customClassName: 'subtitle',
						name: 'columns',
						selectable: false,
						dropable: false,
						disabled: false,
						selected: false,
						nodes: columns,
						tag: null
					}, {
						id: null,
						customClassName: 'subtitle',
						name: 'relations',
						selectable: false,
						dropable: false,
						disabled: false,
						selected: false,
						nodes: relations,
						tag: null
					}],
					tag: null
				});
				
				nodes.sort((a, b) => {
				  return (a.name < b.name) ? -1 : 1;
				});
				
				for (let key in table.keys) {
					if (table.keys.hasOwnProperty(key)) {
						keys.push({
							id: null,
							customClassName: 'item',
							name: table.keys[key].name,
							selectable: false,
							dropable: false,
							disabled: false,
							selected: false,
							nodes: [],
							tag: null
						});
					}
				}
				for (let key in table.columns) {
					if (table.columns.hasOwnProperty(key)) {
						columns.push({
							id: null,
							customClassName: 'item',
							name: table.columns[key].name,
							selectable: false,
							dropable: false,
							disabled: false,
							selected: false,
							nodes: [],
							tag: null
						});
					}
				}
				for (let key in table.relations) {
					if (table.relations.hasOwnProperty(key)) {
						relations.push({
							id: null,
							customClassName: 'item',
							name: `${table.relations[key].targetGroup}.${table.relations[key].targetEntity}`,
							selectable: false,
							dropable: false,
							disabled: false,
							selected: false,
							nodes: [],
							tag: null
						});
					}
				}
				
				keys.sort((a, b) => {
				  return (a.name < b.name) ? -1 : 1;
				});
				columns.sort((a, b) => {
				  return (a.name < b.name) ? -1 : 1;
				});
				relations.sort((a, b) => {
				  return (a.name < b.name) ? -1 : 1;
				});
			}
  	}
  	
  	cachedElementTreeNodes = nodes;
  	return nodes;
  }
};

export {SchemaHelper};