// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

import {Project, DeclarationHelper} from './helpers/DeclarationHelper';
import {HTMLHelper} from './helpers/HTMLHelper';
import {EventHelper} from './helpers/EventHelper';
import './components/Project.Controls.FlowLayout_4d816ba8';
import './components/Project.Controls.Settings';

declare let React: any;
declare let ReactDOM: any;
declare let window: any;
declare let DataManipulationHelper: any;

let expandingPlaceholders = Array.from(document.querySelectorAll('[internal-fsb-init-class]'));
for (let expandingPlaceholder of expandingPlaceholders) {
  let forward = JSON.parse((expandingPlaceholder.getAttribute('internal-fsb-init-forward') || '{}').replace(/'/g, '"'));
  ReactDOM.render(React.createElement(DeclarationHelper.get(expandingPlaceholder.getAttribute('internal-fsb-init-class')), {forward: forward, data: window.data || null}, null), expandingPlaceholder);
  expandingPlaceholder.parentNode.insertBefore(expandingPlaceholder.firstElementChild, expandingPlaceholder);
  expandingPlaceholder.parentNode.removeChild(expandingPlaceholder);
}

window.internalFsbSubmit = (guid: string, notation: string, event, callback: any) => {
  DataManipulationHelper.request(guid, notation, event, callback);
}

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.