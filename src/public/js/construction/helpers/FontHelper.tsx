import {HTMLHelper} from './HTMLHelper';
import {FONTS} from '../Fonts';

let setupFont = {};
let allFontsCache = null;
let fontInfoCache = {};

var FontHelper = {
  generateFontData: () => {
    return setupFont;
  },
  initializeFontData: (data: any, _window: any=window) => {
    if (data == null) return;
    
    setupFont = {};
    fontInfoCache = {};
    
    let elements = [...HTMLHelper.getElementsByClassName('internal-fsb-font', _window.document.body)];
    for (let element of elements) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }
    
    for (let name in data) {
      if (data.hasOwnProperty(name)) {
        FontHelper.load(name, _window);
      }
    }
  },
  listAllFonts: function() {
    if (allFontsCache != null) return allFontsCache;
  
    let list = [];
    for (let info of FONTS.items) {
      list.push(info.family);
    }
    
    allFontsCache = list;
    return list;
  },
  getFontInfo: function(name: string) {
    if (!name) return null;
    if (fontInfoCache[name] !== undefined) return fontInfoCache[name];
    
    for (let info of FONTS.items) {
      if (info.family == name) {
        fontInfoCache[name] = info;
        return info;
      }
    }
    
    return null;
  },
  getAllItalics: function(info: any) {
    if (info == null) return [];
    
    let variants = [];
    for (let variant of info.variants) {
      if (variant == 'italic') {
        variants.push(400);
      } else if (variant.indexOf('italic') != -1) {
        variants.push(parseInt(variant));
      }
    }
    
    return variants;
  },
  getAllNormals: function(info: any) {
    if (info == null) return [];
    
    let variants = [];
    for (let variant of info.variants) {
      if (variant == 'regular') {
        variants.push(400);
      } else if (variant.indexOf('italic') == -1) {
        variants.push(parseInt(variant));
      }
    }
    
    return variants;
  },
  load: function(name: string, _window: any=window) {
    if (!name || setupFont[name]) return;
    
    let info = FontHelper.getFontInfo(name);
    if (info == null) return;
    
    let token = name.split(' ').join('+');
    
    let italics = FontHelper.getAllItalics(info);
    if (italics.length != 0) {
      for (let i=0; i<italics.length; i++) {
        italics[i] = '1,' + italics[i];
      }
    
      let link = _window.document.createElement('link');
      HTMLHelper.setAttribute(link, 'internal-fsb-link', 'true');
      HTMLHelper.setAttribute(link, 'href', 'https://fonts.googleapis.com/css2?family=' + token + ':ital,wght@' + italics.join(';') + '&display=swap');
      HTMLHelper.setAttribute(link, 'rel', 'stylesheet');
      link.className = 'internal-fsb-accessory internal-fsb-font';
      
      _window.document.body.appendChild(link);
    	
    	if (_window.document.head.getElementById('font-' + token + '-ital') == null) {
	      link = _window.document.createElement('link');
	      HTMLHelper.setAttribute(link, 'id', 'font-' + token + '-ital');
	      HTMLHelper.setAttribute(link, 'href', 'https://fonts.googleapis.com/css2?family=' + token + ':ital,wght@' + italics.join(';') + '&display=swap');
	      HTMLHelper.setAttribute(link, 'rel', 'preload');
	      HTMLHelper.setAttribute(link, 'as', 'style');
	      link.className = 'internal-fsb-accessory internal-fsb-font';
	      
	      _window.document.head.appendChild(link);
	    }
    }
    
    let normals = FontHelper.getAllNormals(info);
    if (normals.length != 0) {
      let link = _window.document.createElement('link');
      HTMLHelper.setAttribute(link, 'internal-fsb-link', 'true');
      HTMLHelper.setAttribute(link, 'href', 'https://fonts.googleapis.com/css2?family=' + token + ':wght@' + normals.join(';') + '&display=swap');
      HTMLHelper.setAttribute(link, 'rel', 'stylesheet');
      link.className = 'internal-fsb-accessory internal-fsb-font';
      
      _window.document.body.appendChild(link);
      
      if (_window.document.head.getElementById('font-' + token + '-wght') == null) {
	      link = _window.document.createElement('link');
	      HTMLHelper.setAttribute(link, 'id', 'font-' + token + '-wght');
	      HTMLHelper.setAttribute(link, 'href', 'https://fonts.googleapis.com/css2?family=' + token + ':wght@' + normals.join(';') + '&display=swap');
	      HTMLHelper.setAttribute(link, 'rel', 'preload');
	      HTMLHelper.setAttribute(link, 'as', 'style');
	      link.className = 'internal-fsb-accessory internal-fsb-font';
	      
	      _window.document.head.appendChild(link);
	    }
    }
    
    setupFont[name] = true;
  }
};

export {FontHelper};