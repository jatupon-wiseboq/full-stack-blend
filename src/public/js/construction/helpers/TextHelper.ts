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
    for (let i = 0; i < tokens.length; i++) {
      tokens[i] = value;
    }
    return tokens.join(' ');
  },
  mergeClassNameWithPrefixedClasses: function(original: string, prefix: string, targets: string[]): string {
    let klasses = original && original.split(' ') || [];
    klasses = klasses.filter(klass => klass.indexOf(prefix) != 0);

    for (let target of targets) {
      if (!target) continue;
      klasses.push(prefix + target);
    }

    return klasses.join(' ').trim();
  },
  removeMultipleBlankLines: function(code: string): string {
    const MULTIPLE_BLANK_LINES_REGEX_GLOBAL = /(\n[ \t]*)(\n[ \t]*)+(\n)/g;
    const MULTIPLE_BLANK_LINES_REGEX_LOCAL = /(\n[ \t]*)(\n[ \t]*)+(\n)/;

    return code.replace(MULTIPLE_BLANK_LINES_REGEX_GLOBAL, (blankLines) => {
      return `${blankLines.match(MULTIPLE_BLANK_LINES_REGEX_LOCAL)[1]}\n`;
    });
  },
  removeBlankLines: function(code: string): string {
    const SINGLE_BLANK_LINES_REGEX_GLOBAL = /(\n[ \t]*)+(\n)/g;
    const SINGLE_BLANK_LINES_REGEX_LOCAL = /(\n[ \t]*)+(\n)/;

    return code.replace(SINGLE_BLANK_LINES_REGEX_GLOBAL, (blankLines) => {
      return `\n`;
    });
  },
  trim: function(str, ch): string {
    let start = 0, end = str.length;

    while (start < end && str[start] === ch) ++start;
    while (end > start && str[end - 1] === ch) --end;

    return (start > 0 || end < str.length) ? str.substring(start, end) : str;
  }
};

export {TextHelper};