// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {CodeHelper} from '../helpers/CodeHelper.js';
import {Project, DeclarationHelper} from '../helpers/DeclarationHelper.js';
import {HierarchicalDataTable} from '../helpers/DataManipulationHelper.js';

declare let React: any;
declare let ReactDOM: any;
declare let DataManipulationHelper: any;

interface IBaseProps {
	data: {[Identifier: string]: HierarchicalDataTable};
}

interface IBaseState {
	data: {[Identifier: string]: HierarchicalDataTable};
}

let DefaultBaseProps: any = {
	data: null
};
let DefaultBaseState: any = {
	data: null
};

const controls: any = [];
const update = (data: any) => {
  for (let control of controls) {
    try {
      control.update(data);
    } catch { /* void */ }
  }
};

class Base extends React.Component {
  constructor(props) {
    super(props);
    controls.push(this);
  }
  
  public update(data: any) {
    this.setState({
      data: data
    });
  }
  
  protected getDataFromNotation(notation: string, inArray: boolean=false): any {
    if (!notation) {
      console.error("There was an error processing hierarchical data on client side (notation isn't a string).");
      return [];
    }
    
    if (this.state.data) {
    	return DataManipulationHelper.getDataFromNotation(notation, this.state.data, inArray);
    } else if (this.props.data) {
    	return DataManipulationHelper.getDataFromNotation(notation, this.props.data, inArray);
    } else {
      return [''];
    }
  }
  
  public manipulate(guid: string, notation: string, results: any) {
    let data = this.getDataFromNotation(notation);
    let {action, options} = DataManipulationHelper.getInfo(guid);
    
    switch (action) {
      case 'insert':
        for (let result of results) {
          data.push(result);
        }
        break;
      case 'update':
        for (let result of results) {
          data = [...data].map((row) => {
            for (let key in row.keys) {
              if (row.keys.hasOwnProperty(key)) {
                if (row.keys[key] != result.keys[key]) {
                  return row;
                }
              }
            }
            return result;
          });
        }
        break;
      case 'delete':
        for (let result of results) {
          let collection = data.filter((row) => {
            for (let key in row.keys) {
              if (row.keys.hasOwnProperty(key)) {
                if (row.keys[key] != result.keys[key]) return false;
              }
            }
            return true;
          });
          for (let item of collection) {
          	let index = data.indexOf(item);
          	data.splice(index, 1);
          }
        }
        break;
      case 'retrieve':
        update(results);
        break;
      case 'popup':
        let container = document.createElement('div');
        ReactDOM.render(React.createElement(DeclarationHelper.get(options.initClass), {data: results}, null), container);
        document.body.appendChild(container.firstChild);
        break;
      case 'navigate':
        /* handled */
        break;
    }
    
    this.forceUpdate();
  }
  
  protected render() { }
}

DeclarationHelper.declare('Site', 'Components.Base', Base);

export {IBaseProps, IBaseState, DefaultBaseProps, DefaultBaseState, Base};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.
