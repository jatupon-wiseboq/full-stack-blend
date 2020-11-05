import {INTERNAL_CLASSES_GLOBAL_REGEX, NON_SINGLE_CONSECUTIVE_SPACE_GLOBAL_REGEX} from '../Constants.js';

const KEYSTRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function utf8_encode(source: string) {
    source = source.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < source.length; n++) {
        var c = source.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }

    return utftext;
}

var CodeHelper = {
  clone: (obj: any) => {
    return JSON.parse(JSON.stringify(obj));
  },
  convertToBase64: (source: string) => {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    source = utf8_encode(source);

    while (i < source.length) {
      chr1 = source.charCodeAt(i++);
      chr2 = source.charCodeAt(i++);
      chr3 = source.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output +
      KEYSTRING.charAt(enc1) + KEYSTRING.charAt(enc2) +
      KEYSTRING.charAt(enc3) + KEYSTRING.charAt(enc4);
    }
    
    return output;
	},
	getCustomClasses: (value: string) => {
    return (value || '').replace(INTERNAL_CLASSES_GLOBAL_REGEX, '').replace(NON_SINGLE_CONSECUTIVE_SPACE_GLOBAL_REGEX, ' ').trimStart();
  },  
  getInternalClasses: (value: string) => {
    return (value || '').match(INTERNAL_CLASSES_GLOBAL_REGEX).join(' ');
  },
  convertDictionaryIntoPairs: (dictionary: {[Identifier: string]: any}) => {
    let pairs = [];
    
    for (let key in dictionary) {
      if (dictionary.hasOwnProperty(key)) {
        pairs.push({
          name: key,
          value: dictionary[key]
        });
      }
    }
    
    return pairs;
  },
  equals: (x: any, y: any) => {
    'use strict';

    if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
    // after this just checking type of one would be enough
    if (x.constructor !== y.constructor) { return false; }
    // if they are functions, they should exactly refer to same one (because of closures)
    if (x instanceof Function) { return x === y; }
    // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
    if (x instanceof RegExp) { return x === y; }
    if (x === y || x.valueOf() === y.valueOf()) { return true; }
    if (Array.isArray(x) && x.length !== y.length) { return false; }

    // if they are dates, they must had equal valueOf
    if (x instanceof Date) { return false; }

    // if they are strictly equal, they both need to be object at least
    if (!(x instanceof Object)) { return false; }
    if (!(y instanceof Object)) { return false; }

    // recursive object equality check
    var p = Object.keys(x);
    return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) &&
        p.every(function (i) { return CodeHelper.equals(x[i], y[i]); });
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
  deleteEmptyKeys: (object: any) => {
  	let result: boolean;
  	do {
  		result = false;
  		const keys = Object.keys(object);
  		for (let key of keys) {
  			result = result || CodeHelper.recursiveDeleteEmptyKeys(object, key);
  		}
  	} while (result);
  },
  recursiveDeleteEmptyKeys: (object: any, previousKey: string): boolean => {
  	if ((typeof object[previousKey] !== 'object') || object[previousKey] === null || object[previousKey] === undefined) return false;
  	
  	const keys = Object.keys(object[previousKey]);
  	if (keys.length == 0) {
  		delete object[previousKey];
  		return true;
  	} else {
  		let result = false;
  		for (let nextKey of keys) {
  			result = result || CodeHelper.recursiveDeleteEmptyKeys(object[previousKey], nextKey);
  		}
  		return result;
  	}
  },
};

export {CodeHelper};