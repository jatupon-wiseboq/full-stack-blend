import {TextHelper} from '../../../helpers/TextHelper';
import {FontHelper} from '../../../helpers/FontHelper';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import * as CONSTANTS from '../../../Constants';

let options = {
		// Front-End Options
		// 
    "text-align": CONSTANTS.TEXT_ALIGN_OPTIONS,
    "font-style": CONSTANTS.FONT_STYLE_OPTIONS,
    "table-cell-0": CONSTANTS.TABLE_CELL_0_OPTIONS,
    "table-cell-1": CONSTANTS.TABLE_CELL_1_OPTIONS,
    "internal-fsb-react-mode": CONSTANTS.REACT_MODE_OPTIONS,
    "disabled": CONSTANTS.ENABLED_OPTIONS,
    "checked": CONSTANTS.CHECKED_OPTIONS,
    "readonly": CONSTANTS.READONLY_OPTIONS,
    "required": CONSTANTS.REQUIRE_OPTIONS,
    "multiple": CONSTANTS.MULTIPLE_OPTIONS,
    "data-source-type-1": CONSTANTS.DATA_SOURCE_TYPE_OPTIONS_1,
    "data-source-type-2": CONSTANTS.DATA_SOURCE_TYPE_OPTIONS_2,
    "data-source-type-3": CONSTANTS.DATA_SOURCE_TYPE_OPTIONS_3,
    "data-wizard-type-1": CONSTANTS.DATA_WIZARD_TYPE_OPTIONS_1,
    "data-wizard-type-2": CONSTANTS.DATA_WIZARD_TYPE_OPTIONS_2,
    "data-wizard-type-3": CONSTANTS.DATA_WIZARD_TYPE_OPTIONS_3,
    "internal-fsb-textbox-mode": CONSTANTS.TEXTBOX_MODE_OPTIONS,
    "-fsb-background-type": CONSTANTS.BACKGROUND_TYPE_OPTIONS,
    "type": CONSTANTS.TEXT_INPUT_TYPE_OPTIONS,
    "data-wizard-cross-operation": CONSTANTS.CROSS_OPERATION_OPTIONS,
    "data-wizard-real-time-update": CONSTANTS.DATA_WIZARD_REAL_TIME_UPDATE,
    "data-value-source": CONSTANTS.DATA_VALUE_SOURCE_OPTIONS,
    "data-validation-format-1": CONSTANTS.DATA_VALUE_FORMAT_OPTIONS_1,
    "data-validation-format-2": CONSTANTS.DATA_VALUE_FORMAT_OPTIONS_2,
    "data-validation-format-3": CONSTANTS.DATA_VALUE_FORMAT_OPTIONS_3,
    "internal-fsb-react-division": CONSTANTS.REACT_FIELD_DIVISION_OPTIONS,
    "internal-fsb-react-accumulate": CONSTANTS.REACT_ACCUMULATE_OPTIONS,
    "internal-fsb-react-display-logic": CONSTANTS.REACT_DISPLAY_LOGIC_OPTIONS,
    
    // Back-End Options
		// 
		"data-column-type": CONSTANTS.BACKEND_DATA_COLUMN_TYPE,
		"data-field-type-1": CONSTANTS.BACKEND_DATA_FIELD_TYPE_1,
		"data-field-type-2": CONSTANTS.BACKEND_DATA_FIELD_TYPE_2,
		"data-field-type-3": CONSTANTS.BACKEND_DATA_FIELD_TYPE_3,
		"data-field-type-4": CONSTANTS.BACKEND_DATA_FIELD_TYPE_4,
		"data-required": CONSTANTS.BACKEND_DATA_REQUIRED,
		"data-unique": CONSTANTS.BACKEND_DATA_UNIQUE,
		"data-force-constraint": CONSTANTS.BACKEND_DATA_FORCE_CONSTRAINT,
		"data-lock-mode": CONSTANTS.BACKEND_DATA_LOCK_MODE,
		"data-lock-mode-1": CONSTANTS.BACKEND_DATA_LOCK_MODE_1,
		"data-lock-matching-mode": CONSTANTS.BACKEND_DATA_LOCK_MATCHING_MODE,
		"data-rendering-condition-mode": CONSTANTS.BACKEND_DATA_RENDERING_CONDITION_MODE,
		"data-rendering-condition-mode-1": CONSTANTS.BACKEND_DATA_RENDERING_CONDITION_MODE_1,
		"data-rendering-condition-matching-mode": CONSTANTS.BACKEND_DATA_RENDERING_CONDITION_MATCHING_MODE,
		"data-verb": CONSTANTS.BACKEND_VERB,
		"data-forward-mode": CONSTANTS.BACKEND_FORWARD_MODE_OPTIONS,
		"data-forward-option": CONSTANTS.BACKEND_FORWARD_OPTIONS,
		"data-forward-recursive": CONSTANTS.BACKEND_FORWARD_RECURSIVE_OPTIONS,
		"data-missing-enable": CONSTANTS.BACKEND_SCHEMA_MISSING_ENABLE_OPTIONS,
		"data-missing-default": CONSTANTS.BACKEND_SCHEMA_MISSING_DEFAULT_OPTIONS,
		"data-missing-action-development": CONSTANTS.BACKEND_SCHEMA_MISSING_ACTION_DEVELOPMENT_OPTIONS,
		"data-missing-action-production": CONSTANTS.BACKEND_SCHEMA_MISSING_ACTION_PRODUCTION_OPTIONS,
		"data-mismatch-enable": CONSTANTS.BACKEND_SCHEMA_MISMATCH_ENABLE_OPTIONS,
		"data-mismatch-default": CONSTANTS.BACKEND_SCHEMA_MISMATCH_DEFAULT_OPTIONS,
		"data-mismatch-action-development": CONSTANTS.BACKEND_SCHEMA_MISMATCH_ACTION_DEVELOPMENT_OPTIONS,
		"data-mismatch-action-production": CONSTANTS.BACKEND_SCHEMA_MISMATCH_ACTION_PRODUCTION_OPTIONS,
		"data-mismatch-action": CONSTANTS.BACKEND_SCHEMA_MISMATCH_ACTION_OPTIONS,
		"data-timing-days": CONSTANTS.BACKEND_TIMING_DAYS_OPTIONS,
		"data-timing-minutes-1": CONSTANTS.BACKEND_TIMING_MINUTES_OPTIONS_1,
		"data-timing-minutes-2": CONSTANTS.BACKEND_TIMING_MINUTES_OPTIONS_2,

		// Animations
		// 
		"animation-mode": CONSTANTS.ANIMATION_TIMING_MODE,
		"animation-scrolling-triggering": CONSTANTS.ANIMATION_SCROLLING_TRIGGERING,
		"animation-easing-mode": CONSTANTS.ANIMATION_EASING_MODE,
		"animation-easing-fn-1": CONSTANTS.ANIMATION_EASING_FN_1,
		"animation-repeating-mode": CONSTANTS.ANIMATION_REPEATING_MODE,
		"animation-state": CONSTANTS.ANIMATION_DEFAULT_STATE,
		"animation-test-state": CONSTANTS.ANIMATION_DEFAULT_TEST_STATE,
		"animation-synchronize": CONSTANTS.ANIMATION_SYNCHRONIZE_MODE
}
let map = {
    "data-source-type-1": "internal-fsb-data-source-type",
    "data-source-type-2": "internal-fsb-data-source-type",
    "data-source-type-3": "internal-fsb-data-source-type",
    "data-wizard-type-1": "internal-fsb-data-wizard-type",
    "data-wizard-type-2": "internal-fsb-data-wizard-type",
    "data-wizard-type-3": "internal-fsb-data-wizard-type",
    "data-field-type-1": "data-field-type",
    "data-field-type-2": "data-field-type",
    "data-field-type-3": "data-field-type"
}

const Mode = Object.freeze({
    STYLE:   Symbol("style"),
    ATTRIBUTE:  Symbol("attribute"),
    EXTENSION: Symbol("extension")
});

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
    customClassName: string;
    options: any;
    onValueChange(value: any);
    required: boolean;
    todoOverriding: boolean;
}

interface State extends IState {
}

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
    customClassName: null,
    options: null,
    required: false
});

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
});

class RadioButtonPicker extends Base<Props, State> {
    protected static defaultProps: Props = ExtendedDefaultProps;
    
    constructor(props) {
    		super(props);
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
    }
    
    protected buttonOnClick(value: any, mode: Mode) {
    		let currentState = this.getState(value, mode);
    		let nameOrArrayOfRegularExpression = value[0];
    		let target = (typeof value[1] == 'function') ? value[1].call(this) : value[1];
    		
    		if (this.props.required && currentState) return;
    		
        if (typeof nameOrArrayOfRegularExpression === 'object') { // Array of Regular Expression
		        let list = [];
        		
        		for (let regularExpression of nameOrArrayOfRegularExpression) {
        				let results: any = null;
        			
		          	switch(mode) {
				            case Mode.STYLE:
					            	results = this.state.styleValues[regularExpression];
								        break;
				            case Mode.ATTRIBUTE:
		                		results = this.state.attributeValues[regularExpression];
								        break;
				            case Mode.EXTENSION:
		                		results = this.state.extensionValues[regularExpression];
								        break;
		            }
		            
		            let keys = Object.keys(results || {});
		            
		            for (let key of keys) {
				      			list.push({
				                name: key.split(':').splice(-1)[0],
				                value: (currentState) ? null : target
				            });
								}
		        }
		        
            switch(mode) {
		            case Mode.STYLE:
		            case Mode.EXTENSION:
		        				perform('update', {
						            styles: list
						        });
						        break;
		            case Mode.ATTRIBUTE:
                		perform('update', {
						            attributes: list
						        });
						        break;
            }
        } else if (this.getOptions()[0][1] && this.getOptions()[0][1][0] == '{') {
            let target = this.getOptions()[0][1];
            let current;
            
            switch(mode) {
		            case Mode.STYLE:
		            		current = this.state.styleValues[map[nameOrArrayOfRegularExpression] || nameOrArrayOfRegularExpression];
		            		break;
		            case Mode.ATTRIBUTE:
		            		current = this.state.attributeValues[map[nameOrArrayOfRegularExpression] || nameOrArrayOfRegularExpression];
		            		break;
		            case Mode.EXTENSION:
		            		current = this.state.extensionValues[map[nameOrArrayOfRegularExpression] || nameOrArrayOfRegularExpression];
		            		break;
            }
            
            let currentDict = JSON.parse(current || '{}');
            let targetDict = JSON.parse(target);
            
            if (!currentState) {
                for (let target in targetDict) {
                    if (targetDict.hasOwnProperty(target)) {
                        currentDict[target] = targetDict[target];
                    }
                }
            } else {
                for (let target in targetDict) {
                    if (targetDict.hasOwnProperty(target)) {
                        delete currentDict[target];
                    }
                }
            }
            
            switch(mode) {
		            case Mode.STYLE:
		            		perform('update', {
						            styles: [{
						                name: map[nameOrArrayOfRegularExpression] || nameOrArrayOfRegularExpression,
						                value: JSON.stringify(currentDict)
						            }]
						        });
						        break;
		            case Mode.ATTRIBUTE:
		            		perform('update', {
						            attributes: [{
						                name: map[nameOrArrayOfRegularExpression] || nameOrArrayOfRegularExpression,
						                value: JSON.stringify(currentDict)
						            }]
						        });
						        break;
		            case Mode.EXTENSION:
		            		perform('style', {
						            styles: [{
						                name: map[nameOrArrayOfRegularExpression] || nameOrArrayOfRegularExpression,
						                value: JSON.stringify(currentDict)
						            }]
						        });
						        break;
            }
        } else {
            switch(mode) {
		            case Mode.STYLE:
		            		perform('update', {
						            styles: [{
						                name: map[nameOrArrayOfRegularExpression] || nameOrArrayOfRegularExpression,
						                value: (currentState) ? null : target
						            }]
						        });
						        break;
		            case Mode.ATTRIBUTE:
		            		perform('update', {
						            attributes: [{
						                name: map[nameOrArrayOfRegularExpression] || nameOrArrayOfRegularExpression,
						                value: (currentState) ? null : target
						            }]
						        });
						        break;
		            case Mode.EXTENSION:
		            		if (this.props.todoOverriding) {
		            			perform('update', {
							            extensions: [{
							                name: map[nameOrArrayOfRegularExpression] || nameOrArrayOfRegularExpression,
							                value: (currentState) ? null : target
							            }]
							        });
		            		} else {
			            		perform('style', {
							            styles: [{
							                name: map[nameOrArrayOfRegularExpression] || nameOrArrayOfRegularExpression,
							                value: (currentState) ? null : target
							            }]
							        });
							      }
						        break;
            }
        }
        
        if (this.props.onValueChange) this.props.onValueChange((currentState) ? null : target);
    }
    
    private getState(value: any, mode: Mode): boolean {
    		let nameOrArrayOfRegularExpression = value[0];
    		let target = (typeof value[1] == 'function') ? value[1].call(this) : value[1];
    		
        if (typeof nameOrArrayOfRegularExpression === 'object') { // Array of Regular Expression
    				let results = {};
          	switch(mode) {
	            case Mode.STYLE:
	            		results = this.state.styleValues;
		            	break;
	            case Mode.ATTRIBUTE:
	            		results = this.state.attributeValues;
		            	break;
	            case Mode.EXTENSION:
	            		results = this.state.extensionValues;
		            	break;
     				}
     				
     				let found = true;
     				for (let regularExpression of nameOrArrayOfRegularExpression) {
     							if (!results[regularExpression]) {
     									found = false;
     									break;
     							} else {
     									let keys = Object.keys(results[regularExpression]);
     									if (keys.length == 0) {
     											found = false;
     											break;
     									} else {
		     									for (let key of keys) {
		     											if (!results[regularExpression][key]) {
		     													found = false;
		     													break;
		     											}
		     									}
		     							}
     							}
     				}
     				
     				return found;
        } else if (this.getOptions()[0][1] && this.getOptions()[0][1][0] == '{') {
            let _target = this.getOptions()[0][1];
            let current;
            
            switch(mode) {
		            case Mode.STYLE:
		            		current = this.state.styleValues[map[nameOrArrayOfRegularExpression] || nameOrArrayOfRegularExpression];
		            		break;
		            case Mode.ATTRIBUTE:
		            		current = this.state.attributeValues[map[nameOrArrayOfRegularExpression] || nameOrArrayOfRegularExpression];
		            		break;
		            case Mode.EXTENSION:
		            		current = this.state.extensionValues[map[nameOrArrayOfRegularExpression] || nameOrArrayOfRegularExpression];
		            		break;
            }
            
            let currentDict = JSON.parse(current || '{}');
            let targetDict = JSON.parse(_target || '{}');
            
            let isHavingAll = true;
            for (let target in targetDict) {
                if (targetDict.hasOwnProperty(target)) {
                    if (currentDict[target] !== targetDict[target]) {
                        isHavingAll = false;
                    }
                }
            }
            
            return isHavingAll;
        } else {
            switch(mode) {
		            case Mode.STYLE:
		            		return this.state.styleValues[map[nameOrArrayOfRegularExpression] || nameOrArrayOfRegularExpression] == target;
		            case Mode.ATTRIBUTE:
		            		return this.state.attributeValues[map[nameOrArrayOfRegularExpression] || nameOrArrayOfRegularExpression] == target;
		            case Mode.EXTENSION:
		            		return this.state.extensionValues[map[nameOrArrayOfRegularExpression] || nameOrArrayOfRegularExpression] == target;
            }
        }
    }
    
    private getOptions() {
    		let _options = null
    		
        if (this.props.watchingStyleNames[0]) {
            _options = options[this.props.watchingStyleNames[0]] || this.props.options;
        } else if (this.props.watchingAttributeNames[0]) {
            _options = options[this.props.watchingAttributeNames[0]] || this.props.options;
        } else if (this.props.watchingExtensionNames[0]) {
            _options = options[this.props.watchingExtensionNames[0]] || this.props.options;
        }
        
        if (_options && _options[0] && _options[0][0] == '-fsb-background-type') {
        		if (this.state.extensionValues['editorCurrentMode'] !== 'animation') {
        				_options = _options.slice(0, 3);
        		}
        }
        
        return _options;
    }
    
    render() {
        return (
          pug `
            .btn-group.btn-group-sm.mr-1.mb-1(role="group", className=((this.props.isSupportAnimatable === false) ? 'is-not-animatable' : ''))
              if this.props.watchingStyleNames[0]
                each value, index in this.getOptions()
                  .btn.text-center(key="item-style-" + index, className=(this.getState(value, Mode.STYLE) ? 'btn-primary' : (this.props.customClassName || 'btn-light')), onClick=this.buttonOnClick.bind(this, value, Mode.STYLE) style={fontSize: '12px'})
                    if typeof value[2] == 'string'
                      i.m-0(className="fa "+ value[2])
                    else
                      i.m-0(className="fa "+ value[2][0])
                      = ' ' + value[2][1]
              else if this.props.watchingAttributeNames[0]
                each value, index in this.getOptions()
                  .btn.text-center(key="item-attribute-" + index, className=(this.getState(value, Mode.ATTRIBUTE) ? 'btn-primary' : (this.props.customClassName || 'btn-light')), onClick=this.buttonOnClick.bind(this, value, Mode.ATTRIBUTE) style={fontSize: '12px'})
                    if typeof value[2] == 'string'
                      i.m-0(className="fa "+ value[2])
                    else
                      i.m-0(className="fa "+ value[2][0])
                      = ' ' + value[2][1]
              else if this.props.watchingExtensionNames[0]
                each value, index in this.getOptions()
                  .btn.text-center(key="item-extension-" + index, className=(this.getState(value, Mode.EXTENSION) ? 'btn-primary' : (this.props.customClassName || 'btn-light')), onClick=this.buttonOnClick.bind(this, value, Mode.EXTENSION) style={fontSize: '12px'})
                    if typeof value[2] == 'string'
                      i.m-0(className="fa "+ value[2])
                    else
                      i.m-0(className="fa "+ value[2][0])
                      = ' ' + value[2][1]
          `
        )
    }
}

DeclarationHelper.declare('Components.RadioButtonPicker', RadioButtonPicker);

export {Props, State, ExtendedDefaultProps, ExtendedDefaultState, RadioButtonPicker};