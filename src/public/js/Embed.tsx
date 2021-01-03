import {DataManipulationHelper} from './helpers/DataManipulationHelper';

declare let window: any;

(() => {
	// Auto Height Layout
	// 
  function update(event) {  
    let elements: any[] = [...document.body.getElementsByClassName('internal-fsb-absolute-layout')];
    elements.reverse().forEach((element) => {
      let children: any[] = [...element.children];
      let maximum = 20;
      children.forEach((child) => {
        if (child.getAttribute('id') == 'internal-fsb-cursor') {
          maximum = Math.max(maximum, 20 + child.offsetTop);
        } else {
          maximum = Math.max(maximum, child.offsetHeight + child.offsetTop);
        }
      });
      element.style.minHeight = maximum + 'px';
    });
  }
  
  let previousWindowSize = {width: null, height: null};
  window.addEventListener('resize', (event) => {
    if (previousWindowSize.width != window.innerWidth || previousWindowSize.height != window.innerHeight) {
      previousWindowSize.width = window.innerWidth;
      previousWindowSize.height = window.innerHeight;
      update(event);
    }
  });
  window.addEventListener('update', update);
  window.DataManipulationHelper = DataManipulationHelper;
})();