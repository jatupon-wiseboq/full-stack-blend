var TextHelper = {
  removeExtraWhitespaces: (text: string) => {
    return text.replace(/[ ]+/g, ' ').trim();
  },
  composeIntoMultipleValue: (definition: string, value: string, destination: string, defaultValue: string) => {
    if (!value) return value;
    
    let splited = definition.split('[');
    if (splited[1]) {
        let tokens = splited[1].split(',');
        let index = parseInt(tokens[0]);
        let count = parseInt(tokens[1].split(']')[0]);
        
        let values = (destination || TextHelper.defaultMultipleValue(count, defaultValue)).split(' ');
        values[index] = value;
        
        return values.join(' ');
    } else {
        return value;
    }
  },
  defaultMultipleValue: (count: number, value: string) => {
    let tokens = new Array(count);
    for (let i=0; i<tokens.length; i++) {
        tokens[i] = value;
    }
    return tokens.join(' ');
  }
};

export {TextHelper};