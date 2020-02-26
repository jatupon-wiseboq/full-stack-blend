import {EditorHelper} from './EditorHelper.js';
import {HTMLHelper} from '../../helpers/HTMLHelper.js';

var LayoutHelper = {
  calculateColumnSize: function(width: number) {
    let selectingElement = EditorHelper.getSelectingElement();
    if (selectingElement) {
      let measure = document.createElement('div');
      let i: number;
      
      selectingElement.parentNode.insertBefore(measure, selectingElement.parentNode.firstChild);
      
      for (i=1; i<=12; i++) {
        measure.className = 'col-' + i;
        if (HTMLHelper.getSize(measure)[0] >= width) break;
      }

      selectingElement.parentNode.removeChild(measure);
      
      return Math.min(12, i);
    } else {
      return null;
    }
  }
};

export {LayoutHelper};