import {HTMLHelper} from './HTMLHelper.js';
import {FONTS} from '../Fonts.js';

let setupFont = {};
let allFontsCache = null;
let fontInfoCache = {};

var FontHelper = {
  generateFontData: () => {
    return setupFont;
  },
  initializeFontData: (data: any) => {
    if (data == null) return;
    
    setupFont = {};
    fontInfoCache = {};
    
    let elements = [...HTMLHelper.getElementsByClassName('internal-fsb-font')];
    for (let element of elements) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }
    
    for (let name in data) {
      if (data.hasOwnProperty(name)) {
        FontHelper.load(name);
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
  load: function(name: string) {
    if (!name || setupFont[name]) return;
    
    let info = FontHelper.getFontInfo(name);
    if (info == null) return;
    
    let token = name.split(' ').join('+');
    
    let normals = FontHelper.getAllItalics(info);
    if (normals.length != 0) {
      let link = document.createElement('link');
      HTMLHelper.setAttribute(link, 'internal-fsb-link', 'true');
      HTMLHelper.setAttribute(link, 'href', 'https://fonts.googleapis.com/css2?family=' + token + ':wght@' + normals.join(';') + '&display=swap');
      HTMLHelper.setAttribute(link, 'rel', 'stylesheet');
      link.className = 'internal-fsb-accessory internal-fsb-font';
      
      document.body.appendChild(link);
    }
    
    let italics = FontHelper.getAllNormals(info);
    if (italics.length != 0) {
      for (let i=0; i<italics.length; i++) {
        italics[i] = '1,' + italics[i];
      }
    
      let link = document.createElement('link');
      HTMLHelper.setAttribute(link, 'internal-fsb-link', 'true');
      HTMLHelper.setAttribute(link, 'href', 'https://fonts.googleapis.com/css2?family=' + token + ':ital,wght@' + italics.join(';') + '&display=swap');
      HTMLHelper.setAttribute(link, 'rel', 'stylesheet');
      link.className = 'internal-fsb-accessory internal-fsb-font';
      
      document.body.appendChild(link);
    }
    
    setupFont[name] = true;
  }
};

export {FontHelper};