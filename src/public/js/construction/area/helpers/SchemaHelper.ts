var SchemaHelper = {
  generateDataSchema: (): any => {
    let tables = {};
    
    const groups = ['RelationalTable', 'DocumentTable', 'WorkerInstance', 'VolatileMemory'];
    const entities = ['RelationalColumn', 'DocumentNotation', 'WorkerQueue', 'VolatilePrefix'];
    
    for (const [i, group] of groups.entries()) {
      let tableElements = HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-class', group);
      
      for (let tableElement of tableElements) {
        let tableName = HTMLHelper.getElementsByAttributeNameAndValue('data-title-name', tableElement);
        let tableGUID = HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-guid', tableElement);
        let columnElements = HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-class', entities[i], tableElement);
        let relationElements = HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-class', 'Connection');
        
        let keys = {};
        let columns = {};
        let relations = {};
        
        for (let columnElement of columnElements) {
          let columnName = HTMLHelper.getElementsByAttributeNameAndValue('data-title-name', columnElement);
          let columnGUID = HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-guid', columnElement);
          let columnType = HTMLHelper.getElementsByAttributeNameAndValue('data-column-type', columnElement);
          let fieldType = HTMLHelper.getElementsByAttributeNameAndValue('data-field-type', columnElement);
          let required = HTMLHelper.getElementsByAttributeNameAndValue('data-required', columnElement);
          let unique = HTMLHelper.getElementsByAttributeNameAndValue('data-unique', columnElement);
          
          if (columnType == 'primary') {
            keys[columnName] = {
              name: columnName,
            	guid: columnGUID,
            	fieldType: fieldType,
            	required: required,
            	unique: unique
            }
          } else {
            columns[columnName] = {
              name: columnName,
            	guid: columnGUID,
            	fieldType: fieldType,
            	required: required,
            	unique: unique
            }
          }
        }
        
        for (let relationElement of relationElements) {
          let relationName = HTMLHelper.getElementsByAttributeNameAndValue('data-title-name', relationElement);
          let relationGUID = HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-guid', relationElement);
          let sourceGroupName = HTMLHelper.getElementsByAttributeNameAndValue('data-source-group-name', relationElement);
          let sourceEntityName = HTMLHelper.getElementsByAttributeNameAndValue('data-source-entity-name', relationElement);
          let targetGroupName = HTMLHelper.getElementsByAttributeNameAndValue('data-target-group-name', relationElement);
          let targetEntityName = HTMLHelper.getElementsByAttributeNameAndValue('data-target-entity-name', relationElement);
          
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
        
        results[tableName] = {
          source: ['relational', 'worker', 'document', 'volatile-memory'][i],
          group: tableName,
          guid: tableGUID,
          keys: keys,
          columns: columns,
          relations: relations
        };
      }
    }
    
    return results;
  }
};

export {SchemaHelper};