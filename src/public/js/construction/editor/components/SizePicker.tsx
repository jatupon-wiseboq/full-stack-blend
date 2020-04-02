import {EventHelper} from '../../helpers/EventHelper.js';
import {TextHelper} from '../../helpers/TextHelper.js';
import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../controls/Textbox.js';
import '../controls/DropDownList.js';
import '../controls/DropDownControl.js';
import {SIZES_IN_DESCRIPTION, SIZES_IN_UNIT} from '../../Constants.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
    inline: boolean,
    manual: boolean
}

interface State extends IState {
    index: number,
    value: null
}

class SizePicker extends Base<Props, State> {
    state: IState = {classNameStatuses: {}, styleValues: {}, properties: {}, index: 0, value: null}
    static defaultProps: Props = {
        watchingClassNames: [],
        watchingStyleNames: [],
        inline: false,
        manual: false
    }
    
    constructor(props) {
        super(props);
    }
    
    private getRepresentedValue() {
        let status = this.state.styleValues[this.props.watchingStyleNames[0]];
        if (status) {
            return parseInt(status);
        } else {
            return null;
        }
    }
    
    public update(properties: any) {
        super.update(properties);
        
        let original = this.state.styleValues[this.props.watchingStyleNames[0]];
        let isString = typeof original === 'string';
        let value = (isString) ? parseInt(original) : null;
        let matched = (isString) ? original.match(/[a-z]+/) || null : null;
        let unit = (matched !== null) ? matched[0] : null;
        
        let index = SIZES_IN_UNIT.indexOf(unit);
        if (index == -1) {
            index = 0;
        }
        
        this.setState({
            value: value,
            index: index
        });
    }
    
    protected dropdownOnUpdate(identity: any, value: any, index: any) {
        this.setState({
            index: index
        });
        if (this.props.watchingStyleNames[0] && !this.props.manual) {
            perform('update', {
                aStyle: {
                    name: this.props.watchingStyleNames[0].split('[')[0],
                    value: this.composeValue(this.state.value, index)
                },
                replace: this.props.watchingStyleNames[0]
            });
        }
    }
    
    protected textboxOnUpdate(value: any) {
        this.setState({
            value: value
        });
        if (this.props.watchingStyleNames[0] && !this.props.manual) {
            perform('update', {
                aStyle: {
                    name: this.props.watchingStyleNames[0].split('[')[0],
                    value: this.composeValue(value, this.state.index)
                },
                replace: this.props.watchingStyleNames[0]
            });
        }
    }
    
    private composeValue(value: any, index: number) {
        let composedValue = (value != null) ? (value.toString() + SIZES_IN_UNIT[index]).trim() : null;
        
        return TextHelper.composeIntoMultipleValue(this.props.watchingStyleNames[0], composedValue, this.state.styleValues[this.props.watchingStyleNames[1]], '0px');
    }
    
    public getValue() {
        return this.composeValue(this.state.value, this.state.index);
    }
    
    public hide() {
        this.refs.dropdown.hide();
    }
    
    render() {
        if (this.props.inline) {
            return (
                <div className="input-group" internal-fsb-event-no-propagate="click">
                    <FullStackBlend.Controls.Textbox value={this.state.value} preRegExp="(\-)?([0-9]+)?(\.[0-9]*)?" postRegExp="(\-)?[0-9]+(\.[0-9]+)?" onUpdate={this.textboxOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
                    <div className="input-group-append">
                        <FullStackBlend.Controls.DropDownList ref="dropdown" value={SIZES_IN_UNIT[this.state.index]} customClassName="btn-secondary" options={SIZES_IN_DESCRIPTION} autohide={false} dropDownWidth={185} onUpdate={this.dropdownOnUpdate.bind(this)}>
                            <span>{SIZES_IN_UNIT[this.state.index]}</span>
                        </FullStackBlend.Controls.DropDownList>
                        <div className="btn btn-sm btn-secondary" internal-fsb-event-always-propagate="click">
                            <i className="fa fa-check-circle m-0" internal-fsb-event-always-propagate="click" />
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className={"size-picker " + this.props.additionalClassName}>
                    <FullStackBlend.Controls.DropDownControl representing={this.state.value} dropDownWidth={120} >
                        <div className="input-group">
                            <FullStackBlend.Controls.Textbox value={this.state.value} preRegExp="(\-)?([0-9]+)?(\.[0-9]*)?" postRegExp="(\-)?[0-9]+(\.[0-9]+)?" onUpdate={this.textboxOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
                            <div className="input-group-append">
                                <FullStackBlend.Controls.DropDownList ref="dropdown" value={SIZES_IN_UNIT[this.state.index]} customClassName="btn-secondary" options={SIZES_IN_DESCRIPTION} autohide={false} dropDownWidth={185} onUpdate={this.dropdownOnUpdate.bind(this)}>
                                    <span>{SIZES_IN_UNIT[this.state.index]}</span>
                                </FullStackBlend.Controls.DropDownList>
                            </div>
                        </div>
                    </FullStackBlend.Controls.DropDownControl>
                </div>
            )
        }
    }
}

DeclarationHelper.declare('Components.SizePicker', SizePicker);

export {Props, State, SizePicker};