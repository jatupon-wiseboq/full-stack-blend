import {HTMLHelper} from '../../helpers/HTMLHelper.js';

var SchemaHelper = {
  generateDataSchema: (): any => {
    let tables = {};
    
    const groups = ['RelationalTable', 'DocumentTable', 'WorkerInstance', 'VolatileMemory'];
    const entities = ['RelationalColumn', 'DocumentNotation', 'WorkerQueue', 'VolatilePrefix'];
    
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
          
          if (columnType == 'primary') {
            keys[columnName] = {
              name: columnName,
            	guid: columnGUID,
            	fieldType: fieldType,
            	required: (required == 'true'),
            	unique: (unique == 'true'),
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
          source: ['relational', 'worker', 'document', 'volatile-memory'][i],
          group: tableName,
          guid: tableGUID,
          keys: keys,
          columns: columns,
          relations: relations,
          modifyingPermission: SchemaHelper.generatePermission(columnElement, 'data-lock'),
          retrievingPermission: SchemaHelper.generatePermission(columnElement, 'data-rendering-condition')
        };
      }
    }
    
    return tables;
  },
  generatePermission: (element: HTMLElement, prefix: string): any => {
  	return {
  		mode: HTMLHelper.getAttribute(element, prefix + '-mode'),
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
  }
};

export {SchemaHelper};