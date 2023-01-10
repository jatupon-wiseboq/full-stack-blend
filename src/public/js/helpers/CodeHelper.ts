// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

const CodeHelper = {
  clone: (obj: any) => {
    return JSON.parse(JSON.stringify(obj));
  },
  equals: (x: any, y: any) => {
    'use strict';

    if (x === null || x === undefined || y === null || y === undefined) {return x === y;}
    // after this just checking type of one would be enough
    if (x.constructor !== y.constructor) {return false;}
    // if they are functions, they should exactly refer to same one (because of closures)
    if (x instanceof Function) {return x === y;}
    // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
    if (x instanceof RegExp) {return x === y;}
    if (x === y || x.valueOf() === y.valueOf()) {return true;}
    if (Array.isArray(x) && x.length !== y.length) {return false;}

    // if they are dates, they must had equal valueOf
    if (x instanceof Date) {return false;}

    // if they are strictly equal, they both need to be object at least
    if (!(x instanceof Object)) {return false;}
    if (!(y instanceof Object)) {return false;}

    // recursive object equality check
    var p = Object.keys(x);
    return Object.keys(y).every(function(i) {return p.indexOf(i) !== -1;}) &&
      p.every(function(i) {return CodeHelper.equals(x[i], y[i]);});
  },
  escape: (unsafe: string) => {
    unsafe = unsafe || '';
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },
  toSecuredDataString: (data: any): string => {
    switch (typeof data) {
      case 'string':
        return data;
      case 'number':
      case 'boolean':
        return data.toString();
      case 'object':
      case 'undefined':
        return '';
    }
  },
  label: (data: string): string => {
    let current: string = null;
    let category: number = 0;
    const lines = data.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const starting = lines[i].match(/^    "([0-9a-f]{8,8})": {/) || lines[i].match(/^            "guid": "([0-9a-f]{8,8})",/);
      const ending = ((category == 1 && (lines[i] == '    }' || lines[i] == '    },')) ||
        (category == 2 && (lines[i] == '          }' || lines[i] == '          },')));

      if (starting != null) {
        category = (lines[i].indexOf('            "guid": "') == -1) ? 1 : 2;
        current = starting[1];
        lines[i] = `${current}${lines[i]}`;
        if (category == 2) {
          if (lines[i - 1].indexOf('}') == -1) lines[i - 1] = `${current}${lines[i - 1]}`;
          if (lines[i - 2].indexOf('}') == -1) lines[i - 2] = `${current}${lines[i - 2]}`;
        }
      } else if (current && ending) {
        lines[i] = `${current}${lines[i]}`;
        current = null;
        category = 0;
      } else if (current) {
        lines[i] = `${current}${lines[i]}`;
      }
    }

    return lines.join('\n');
  },
  unlabel: (data: string): string => {
    const lines = data.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const matched = lines[i].match(/^([0-9a-f]{8,8}) (.*)/);
      if (matched) {
        lines[i] = ` ${matched[2]}`;
      }
    }

    return lines.join('\n');
  }
};

export {CodeHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.