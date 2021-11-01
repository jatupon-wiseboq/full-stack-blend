// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.
import { strict as assert } from 'assert';

const CodeHelper = {
	recursiveEvaluate: (obj: any, evaluate: any) => {
		if (Array.isArray(obj)) {
			for (const value of obj) {
				CodeHelper.recursiveEvaluate(value, evaluate);
			}
		} else if (typeof obj === 'object' && obj !== null && obj.constructor === Object) {
			for (const key in obj) {
				if (obj.hasOwnProperty(key)) {
					CodeHelper.recursiveEvaluate(obj[key], evaluate);
				}
			}
		} else {
			evaluate(obj);
		}
	},
  clone: (obj: any) => {
  	// TODO: to support Infinity, NaN, RegEX (, undefined)
  	// TODO to support Date => Date
    //
    CodeHelper.recursiveEvaluate(obj, (obj: any) => {
    	assert(['number', 'boolean', 'string'].indexOf(typeof obj) != -1 || obj instanceof Date || obj === null, 'Can cantain only string, number, boolean, date, and null.');
    	assert(!(typeof obj === 'number' && (obj === Infinity || obj === -Infinity)), 'Can not contain Infinity.');
    	assert(!(typeof obj === 'number' && isNaN(obj)), 'Can not contain NaN.');
    });
    
    return JSON.parse(JSON.stringify(obj));
  },
  equals: (x: any, y: any) => {
  	// Credit: https://stackoverflow.com/questions/30476150/javascript-deep-comparison-recursively-objects-and-properties
    // TODO: to support NaN == NaN
    // 
    assert(!(typeof x === 'number' && isNaN(x) && typeof y === 'number' && isNaN(y)), 'Cannot compare NaN with NaN.');
    
    "use strict";

    if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
    // after this just checking type of one would be enough
    if (x.constructor !== y.constructor) { return false; }
    // if they are functions, they should exactly refer to same one (because of closures)
    if (x instanceof Function) { return x === y; }
    // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
    if (x instanceof RegExp) { return String(x) === String(y); }
    if (x === y || x.valueOf() === y.valueOf()) { return true; }
    if (Array.isArray(x) && x.length !== y.length) { return false; }

    // if they are dates, they must had equal valueOf
    if (x instanceof Date) { return false; }

    // if they are strictly equal, they both need to be object at least
    if (!(x instanceof Object)) { return false; }
    if (!(y instanceof Object)) { return false; }

    // recursive object equality check
    const p = Object.keys(x);
    return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) &&
        p.every(function (i) { return CodeHelper.equals(x[i], y[i]); });
  },
  escape: (unsafe: string) => {
  	unsafe = unsafe || "";
  	return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
  },
  sortHashtable: (object: any) => {
  	return CodeHelper.recursiveSortHashtable(object);
  },
  recursiveSortHashtable: (object: any) => {
  	if (Array.isArray(object)) {
  		for (let i=0; i<object.length; i++) {
  			object[i] = CodeHelper.recursiveSortHashtable(object[i]);
  		}
  		
  		return object;
  	} else if ((typeof object === 'object') && object != null) {
  		let keys = Object.keys(object);
  		keys.sort();
  		
  		let result = {};
  		for (let key of keys) {
  			result[key] = CodeHelper.recursiveSortHashtable(object[key]);
  		}
  		return result;
  	} else {
  		return object;
  	}
  },
  label: (data: string): string => {
    let current: string = null;
    let category: number = 0;
    const lines = data.split('\n');
    
    for (let i=0; i<lines.length; i++) {
      const starting = lines[i].match(/^    "([0-9a-f]{8,8})": {/) || lines[i].match(/^            "guid": "([0-9a-f]{8,8})",/);
      const ending = ((category == 1 && (lines[i] == '    }' || lines[i] == '    },')) ||
      								(category == 2 && (lines[i] == '          }' || lines[i] == '          },')));
      
      if (starting != null) {
      	category = (lines[i].indexOf('            "guid": "') == -1) ? 1 : 2;
        current = starting[1];
        lines[i] = `${current}${lines[i]}`;
      	if (category == 2) {
      		if (lines[i-1].indexOf('}') == -1) lines[i-1] = `${current}${lines[i-1]}`;
      		if (lines[i-2].indexOf('}') == -1) lines[i-2] = `${current}${lines[i-2]}`;
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
    
    for (let i=0; i<lines.length; i++) {
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