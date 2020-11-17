// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {CodeHelper} from '../helpers/CodeHelper.js';
import {NotificationHelper} from '../helpers/NotificationHelper.js';
import {Project, DeclarationHelper} from '../helpers/DeclarationHelper.js';
import {HierarchicalDataTable, HierarchicalDataRow} from '../helpers/DataManipulationHelper.js';

declare let React: any;
declare let ReactDOM: any;
declare let DataManipulationHelper: any;

interface IBaseProps {
	row: HierarchicalDataRow;
	data: {[Identifier: string]: HierarchicalDataTable};
}

interface IBaseState {
	data: {[Identifier: string]: HierarchicalDataTable};
}

let DefaultBaseProps: any = {
	row: null,
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
    
    if (props.data) {
    	NotificationHelper.registerTableUpdates(props.data);
    }
    
    window.addEventListener('tableUpdated', (() => {
    	this.forceUpdate();
    }).bind(this));
  }
  
  public update(data: any, retrieveInto: string) {
  	if (!retrieveInto) {
	  	const previous = this.state.data || this.props.data || {};
	  	const next = Object.assign({}, previous, data || {})
	  	
	  	NotificationHelper.unregisterTableUpdates(previous);
	  	NotificationHelper.registerTableUpdates(next);
	  	
	    this.setState({
	      data: next
	    });
	  } else {
	  	const premise = this.getDataFromNotation(retrieveInto);
	  	const previous = premise.relations || {};
	  	const next = Object.assign({}, previous, data || {})
	  	
	  	NotificationHelper.unregisterTableUpdates(previous);
	  	NotificationHelper.registerTableUpdates(next);
	  	
	    premise.relations = next;
	  }
  }
  
  protected getDataFromNotation(notation: string, inArray: boolean=false): any {
    if (!notation) {
      console.error("There was an error processing hierarchical data on client side (notation isn't a string).");
      return [];
    }
    
    if (this.props.row) {
    	return DataManipulationHelper.getDataFromNotation(notation, this.props.row, inArray);
    } else if (this.state.data) {
    	return DataManipulationHelper.getDataFromNotation(notation, this.state.data, inArray);
    } else if (this.props.data) {
    	return DataManipulationHelper.getDataFromNotation(notation, this.props.data, inArray);
    } else {
      return [''];
    }
  }
  
  public manipulate(guid: string, notation: string, results: any) {
    let {action, options} = DataManipulationHelper.getInfo(guid);
    let data = null;
    
    switch (action) {
      case 'insert':
	    	data = this.getDataFromNotation(notation);
	    	if (data == null) return;
	    	
        for (let result of results) {
          data.push(result);
        }
        break;
      case 'update':
	    	data = this.getDataFromNotation(notation);
	    	if (data == null) return;
	    	
        for (let result of results) {
        	let found = null;
        		
        	for (let row of data) {
        		found = row;
        		for (let key in result.keys) {
              if (result.keys.hasOwnProperty(key)) {
                if (row.keys[key] != result.keys[key]) {
                	found = null;
                  break;
                }
              }
            }
            if (found) break;
          }
            
          if (found) {
          	for (let key in result.keys) {
              if (result.keys.hasOwnProperty(key)) {
                found.keys[key] = result.keys[key];
              }
            }
          	for (let key in result.columns) {
              if (result.columns.hasOwnProperty(key)) {
                found.columns[key] = result.columns[key];
              }
            }
          }
      	}
        break;
      case 'upsert':
	    	data = this.getDataFromNotation(notation);
	    	if (data == null) return;
	    	
        for (let result of results) {
        	let found = null;
        	
        	for (let row of data) {
        		found = row;
        		for (let key in result.keys) {
              if (result.keys.hasOwnProperty(key)) {
                if (row.keys[key] != result.keys[key]) {
                	found = null;
                  break;
                }
              }
            }
            if (found) break;
          }
          
          if (found) {
          	for (let key in result.keys) {
              if (result.keys.hasOwnProperty(key)) {
                found.keys[key] = result.keys[key];
              }
            }
          	for (let key in result.columns) {
              if (result.columns.hasOwnProperty(key)) {
                found.columns[key] = result.columns[key];
              }
            }
          } else {
          	data.push(result);
          }
        }
        break;
      case 'delete':
	    	data = this.getDataFromNotation(notation);
	    	if (data == null) return;
	    	
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
        this.update(results, options.retrieveInto);
        break;
      case 'popup':
        let container = document.createElement('div');
        ReactDOM.render(React.createElement(DeclarationHelper.get(options.initClass), {data: results}, null), container);
        document.body.appendChild(container.firstElementChild);
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

class Button extends React.Component {
	constructor(props) {
    super(props);
  }
  
  componentDidMount() {
  	let button = ReactDOM.findDOMNode(this.refs.button);
  	
  	if (this.props.onSubmitting) {
  		button.addEventListener('submitting', this.props.onSubmitting, false);
  	}
  	if (this.props.onSubmitted) {
  		button.addEventListener('submitted', this.props.onSubmitted, false);
  	}
  	if (this.props.onFailed) {
  		button.addEventListener('failed', this.props.onFailed, false);
  	}
  	if (this.props.onSuccess) {
  		button.addEventListener('success', this.props.onSuccess, false);
  	}
  }
  
  protected render(): any {
    return (
      <button ref="button" {...this.props}></button>
    )
  }
}

export {IBaseProps, IBaseState, DefaultBaseProps, DefaultBaseState, Button, Base};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.
