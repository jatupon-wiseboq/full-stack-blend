import {DataManipulationHelper} from './helpers/DataManipulationHelper';
import {TestHelper} from './helpers/TestHelper';
import {AnimationHelper} from './helpers/AnimationHelper';
import {EventHelper} from './helpers/EventHelper';
import * as Ruffle from '../../../dist/public/js/ruffle.js';

declare let window: any;

(() => {
	// Auto Height Layout
	// 
  function update(event) {  
    let elements: any[] = Array.from(document.body.getElementsByClassName('internal-fsb-absolute-layout'));
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
  window.TestHelper = TestHelper;
  window.AnimationHelper = AnimationHelper;
  window.EventHelper = EventHelper;
  window._RuffleLoaded = !!window.Ruffle;
  window._RuffleLoaded && (window.RufflePlayer.config = {
    "publicPath": undefined,
    "polyfills": true,
    "autoplay": "auto",
    "unmuteOverlay": "visible",
    "backgroundColor": null,
    "letterbox": "fullscreen",
    "warnOnUnsupportedContent": true,
    "contextMenu": false,
    "upgradeToHttps": window.location.protocol === "https:",
    "maxExecutionDuration": {"secs": 15, "nanos": 0},
    "logLevel": "error"
	});
})();