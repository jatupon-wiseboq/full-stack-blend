import {FONTS} from '../Fonts.js';

let setupFont = {};

var FontHelper = {
  listAllFonts: function() {
    let list = [];
    for (let info of FONTS.items) {
      list.push(info.family);
    }
    return list;
  },
  getFontInfo: function(name: string) {
    for (let info of FONTS.items) {
      if (info.family == name) {
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
      link.setAttribute('href', 'https://fonts.googleapis.com/css2?family=' + token + ':wght@' + normals.join(';') + '&display=swap');
      link.setAttribute('rel', 'stylesheet');
      
      document.head.appendChild(link);
    }
    
    let italics = FontHelper.getAllNormals(info);
    if (italics.length != 0) {
      for (let i=0; i<italics.length; i++) {
        italics[i] = '1,' + italics[i];
      }
    
      let link = document.createElement('link');
      link.setAttribute('href', 'https://fonts.googleapis.com/css2?family=' + token + ':ital,wght@' + italics.join(';') + '&display=swap');
      link.setAttribute('rel', 'stylesheet');
      
      document.head.appendChild(link);
    }
    
    setupFont[name] = true;
  }
};

export {FontHelper};