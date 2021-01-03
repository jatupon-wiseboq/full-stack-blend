import {EventHelper} from '../../../helpers/EventHelper';
import {TextHelper} from '../../../helpers/TextHelper';
import {CodeHelper} from '../../../helpers/CodeHelper';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import '../../controls/Textbox';
import '../../controls/DropDownControl';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
    inline: boolean,
    button: boolean,
    manual: boolean,
    float: boolean
}

interface State extends IState {
    value: any
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
    value: null
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
    inline: false,
    button: true,
    manual: false,
    float: false
});

class NumberPicker extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;
    
    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    private getRepresentedValue() {
        let status = this.state.styleValues[this.props.watchingStyleNames[0]];
        if (status) {
            return status;
        } else {
            return null;
        }
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        let original = null;
        if (this.props.watchingStyleNames[0]) {
        		original = this.state.styleValues[this.props.watchingStyleNames[0]];
        } else if (this.props.watchingAttributeNames[0]) {
        		original = this.state.attributeValues[this.props.watchingAttributeNames[0]];
        } else if (this.props.watchingExtensionNames[0]) {
        		original = this.state.extensionValues[this.props.watchingExtensionNames[0]];
        }
        
        if (original !== null) {
            let isString = typeof original === 'string';
            let value = (isString) ? parseInt(original) : null;
            this.state.value = value;
        } else {
            this.state.value = '';
        }
        
        this.forceUpdate();
    }
    
    protected textboxOnUpdate(value: any) {
        this.state.value = value;
        if (this.props.watchingStyleNames[0] && !this.props.manual) {
            perform('update', {
                styles: [{
                    name: this.props.watchingStyleNames[0].split('[')[0],
                    value: this.composeValue(value)
                }],
                replace: this.props.watchingStyleNames[0]
            });
        }
        if (this.props.watchingAttributeNames[0] && !this.props.manual) {
            perform('update', {
                attributes: [{
                    name: this.props.watchingAttributeNames[0].split('[')[0],
                    value: this.composeValue(value)
                }],
                replace: this.props.watchingAttributeNames[0]
            });
        }
        if (this.props.watchingExtensionNames[0] && !this.props.manual) {
            perform('update', {
                extensions: [{
                    name: this.props.watchingExtensionNames[0].split('[')[0],
                    value: this.composeValue(value)
                }],
                replace: this.props.watchingExtensionNames[0]
            });
        }
    }
    
    private composeValue(value: any) {
    		switch (typeof value) {
    			case 'string':
    				if (!value) return null;
    				break;
    			case 'number':
    				if (isNaN(value)) return null;
    				break;
    			default:
    				return null;
    		}
    	
        if (this.props.watchingStyleNames[0]) {
    				if (this.props.watchingStyleNames[1]) {
        				return TextHelper.composeIntoMultipleValue(this.props.watchingStyleNames[0], value.toString(), this.state.styleValues[this.props.watchingStyleNames[1]], '0');
        		} else {
        				return value.toString();
        		}
        } else if (this.props.watchingAttributeNames[0]) {
        		if (this.props.watchingAttributeNames[1]) {
        				return TextHelper.composeIntoMultipleValue(this.props.watchingAttributeNames[0], value.toString(), this.state.attributeValues[this.props.watchingAttributeNames[1]], '0');
        		} else {
        				return value.toString();
        		}
        } else if (this.props.watchingExtensionNames[0]) {
        		if (this.props.watchingExtensionNames[1]) {
        				return TextHelper.composeIntoMultipleValue(this.props.watchingExtensionNames[0], value.toString(), this.state.extensionValues[this.props.watchingExtensionNames[1]], '0');
        		} else {
        				return value.toString();
        		}
        }
    }
    
    public getValue() {
        return this.composeValue(this.state.value);
    }
    
    public hide() {
    }
    
    render() {
        if (this.props.inline) {
            return (
                <div className="input-group inline" internal-fsb-event-no-propagate="click">
                    <FullStackBlend.Controls.Textbox value={this.state.value} preRegExp={this.props.float ? "(([0-9])|([0-9][\.])|([0-9][\.][0-9]*)|([1-9][0-9]*)|([1-9][0-9]*[\.])|([1-9][0-9]*[\.][0-9]*)|([1-9][0-9]*))?" : "(([0-9]+))?"} postRegExp={this.props.float ? "(([0][\.][0-9]+)|([1-9][0-9]*[\.][0-9]+)|([1-9][0-9]*)|([0]))" : "(([0-9]+))"} onUpdate={this.textboxOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
                    {(() => {
                        if (this.props.button) {
                            return (
                                <div className="input-group-append">
                                    <div className="btn btn-sm btn-secondary" internal-fsb-event-always-propagate="click">
                                        <i className="fa fa-check-circle m-0" internal-fsb-event-always-propagate="click" />
                                    </div>
                                </div>
                            )
                        }
                    })()}
                </div>
            )
        } else {
            return (
                <div className={"number-picker " + this.props.additionalClassName}>
                    <FullStackBlend.Controls.DropDownControl representing={this.state.value}>
                        <div className="input-group">
                            <FullStackBlend.Controls.Textbox value={this.state.value} preRegExp={this.props.float ? "(([0-9])|([0-9][\.])|([0-9][\.][0-9]*)|([1-9][0-9]*)|([1-9][0-9]*[\.])|([1-9][0-9]*[\.][0-9]*)|([1-9][0-9]*))?" : "(([0-9]+))?"} postRegExp={this.props.float ? "(([0][\.][0-9]+)|([1-9][0-9]*[\.][0-9]+)|([1-9][0-9]*)|([0]))" : "(([0-9]+))"} onUpdate={this.textboxOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
                        </div>
                    </FullStackBlend.Controls.DropDownControl>
                </div>
            )
        }
    }
}

DeclarationHelper.declare('Components.NumberPicker', NumberPicker);

export {Props, State, NumberPicker};