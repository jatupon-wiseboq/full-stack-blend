import {TextHelper} from '../../helpers/TextHelper.js';
import {FontHelper} from '../../helpers/FontHelper.js';
import {IProps, IState, DefaultState, DefaultProps, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import * as CONSTANTS from '../../Constants.js';

let options = {
    "text-align": CONSTANTS.TEXT_ALIGN_OPTIONS,
    "font-style": CONSTANTS.FONT_STYLE_OPTIONS,
    "table-cell": CONSTANTS.TABLE_CELL_OPTIONS
}

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
    customClassName: string
}

interface State extends IState {
}

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
    customClassName: null
});

class RadioButtonPicker extends Base<Props, State> {
    protected static defaultProps: Props = ExtendedDefaultProps;
    
    constructor(props) {
    		super(props);
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
    }
    
    protected buttonOnClick(value: any, mode: string) {
    		let currentState = this.getState(value, mode);
    		let nameOrArrayOfRegularExpression = value[0];
    		let target = (typeof value[1] == 'function') ? value[1].call(this) : value[1];
    		
        if (typeof nameOrArrayOfRegularExpression === 'object') { // Array of Regular Expression
        		let results: any = null;
        		
          	switch(mode) {
		            case 'style':
			            	results = this.state.styleValues[nameOrArrayOfRegularExpression];
						        break;
		            case 'attribute':
                		results = this.state.attributeValues[nameOrArrayOfRegularExpression];
						        break;
		            case 'extension':
                		results = this.state.extensionValues[nameOrArrayOfRegularExpression];
						        break;
            }
            
            let keys = Object.keys(results || {});
            
            switch(mode) {
		            case 'style':
		            case 'extension':
			            	for (let key of keys) {
				        				perform('update', {
								            styles: [{
								                name: key,
								                value: (currentState) ? null : target
								            }]
								        });
				          	}
						        break;
		            case 'attribute':
                		for (let key of keys) {
				        				perform('update', {
								            styles: [{
								                name: key,
								                value: (currentState) ? null : target
								            }]
								        });
				          	}
						        break;
            }
        } else {
            switch(mode) {
		            case 'style':
		            		perform('update', {
						            styles: [{
						                name: nameOrArrayOfRegularExpression,
						                value: (currentState) ? null : target
						            }]
						        });
						        break;
		            case 'attribute':
		            		perform('update', {
						            attributes: [{
						                name: nameOrArrayOfRegularExpression,
						                value: (currentState) ? null : target
						            }]
						        });
						        break;
		            case 'extension':
		            		perform('style', {
						            styles: [{
						                name: nameOrArrayOfRegularExpression,
						                value: (currentState) ? null : target
						            }]
						        });
						        break;
            }
        }
    }
    
    private getState(value: any, mode: string): boolean {
    		let nameOrArrayOfRegularExpression = value[0];
    		let target = (typeof value[1] == 'function') ? value[1].call(this) : value[1];
    		
        if (typeof nameOrArrayOfRegularExpression === 'object') { // Array of Regular Expression
    				let results = {};
          	switch(mode) {
	            case 'style':
	            		results = this.state.styleValues;
		            	break;
	            case 'attribute':
	            		results = this.state.attributeValues;
		            	break;
	            case 'extension':
	            		results = this.state.extensionValues;
		            	break;
     				}
     				
     				let found = true;
     				for (let regularExpression of nameOrArrayOfRegularExpression) {
     							if (!results[regularExpression] || Object.keys(results[regularExpression]).length == 0) {
     									found = false;
     									break;
     							}
     				}
     				
     				return found;
        } else {
            switch(mode) {
		            case 'style':
		            		return this.state.styleValues[nameOrArrayOfRegularExpression] == target;
		            case 'attribute':
		            		return this.state.attributeValues[nameOrArrayOfRegularExpression] == target;
		            case 'extension':
		            		return this.state.extensionValues[nameOrArrayOfRegularExpression] == target;
            }
        }
    }
    
    render() {
        return (
          pug `
            .btn-group.btn-group-sm.mr-1.mb-1(role="group")
              if options[this.props.watchingStyleNames[0]]
                each value, index in options[this.props.watchingStyleNames[0]]
                  button.btn.text-center(key="item-style-" + index, className=(this.getState(value, 'style') ? 'btn-primary' : (this.props.customClassName || 'btn-light')), onClick=this.buttonOnClick.bind(this, value, 'style'))
                    i.m-0(className="fa "+ value[1], style={fontSize: '12px'})
              if options[this.props.watchingAttributeNames[0]]
                each value, index in options[this.props.watchingAttributeNames[0]]
                  button.btn.text-center(key="item-attribute-" + index, className=(this.getState(value, 'attribute') ? 'btn-primary' : (this.props.customClassName || 'btn-light')), onClick=this.buttonOnClick.bind(this, value, 'attribute'))
                    i.m-0(className="fa "+ value[1], style={fontSize: '12px'})
              if options[this.props.watchingExtensionNames[0]]
                each value, index in options[this.props.watchingExtensionNames[0]]
                  button.btn.text-center(key="item-extension-" + index, className=(this.getState(value, 'extension') ? 'btn-primary' : (this.props.customClassName || 'btn-light')), onClick=this.buttonOnClick.bind(this, value, 'extension'))
                    i.m-0(className="fa "+ value[1], style={fontSize: '12px'})
          `
        )
    }
}

DeclarationHelper.declare('Components.RadioButtonPicker', RadioButtonPicker);

export {Props, State, RadioButtonPicker};