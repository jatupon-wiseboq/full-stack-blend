import {EventHelper} from '../../helpers/EventHelper.js';
import {TextHelper} from '../../helpers/TextHelper.js';
import {IProps, IState, DefaultState, DefaultProps, Base} from './Base.js';
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

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
    index: 0,
    value: null
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
    inline: false,
    manual: false
});

class SizePicker extends Base<Props, State> {
    protected state: State = Object.assign({}, ExtendedDefaultState);
    protected static defaultProps: Props = ExtendedDefaultProps;
    
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
        if (!super.update(properties)) return;
        
        let original = this.state.styleValues[this.props.watchingStyleNames[0]];
        let isString = typeof original === 'string';
        let value = (isString) ? parseInt(original) : null;
        let matched = (isString) ? original.match(/[a-z]+/) || null : null;
        let unit = (matched !== null) ? matched[0] : null;
        
        let index = SIZES_IN_UNIT.indexOf(unit);
        if (index == -1) {
            index = 0;
        }
        
        this.state.value = value;
        this.state.index = index;
        
        this.forceUpdate();
    }
    
    protected dropdownOnUpdate(identity: any, value: any, index: any) {
        this.setState({
            index: index
        });
        if (this.props.watchingStyleNames[0] && !this.props.manual) {
            perform('update', {
                aStyle: [{
                    name: this.props.watchingStyleNames[0].split('[')[0],
                    value: this.composeValue(this.state.value, index)
                }],
                replace: this.props.watchingStyleNames[0]
            });
        }
    }
    
    protected textboxOnUpdate(value: any) {
        this.state.value = value;
        if (this.props.watchingStyleNames[0] && !this.props.manual) {
            perform('update', {
                aStyle: [{
                    name: this.props.watchingStyleNames[0].split('[')[0],
                    value: this.composeValue(value, this.state.index)
                }],
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
                <div className="input-group inline" internal-fsb-event-no-propagate="click">
                    <FullStackBlend.Controls.Textbox value={this.state.value} preRegExp="([\-])?(([0-9])|([0-9][\.])|([0-9][\.][0-9]*)|([1-9][0-9]*)|([1-9][0-9]*[\.])|([1-9][0-9]*[\.][0-9]*)|([1-9][0-9]*))?" postRegExp="([\-])?(([0][\.][0-9]+)|([1-9][0-9]*[\.][0-9]+)|([1-9][0-9]*)|([0]))" onUpdate={this.textboxOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
                    <div className="input-group-append">
                        <FullStackBlend.Controls.DropDownList ref="dropdown" value={SIZES_IN_UNIT[this.state.index]} customClassName="btn-secondary" options={SIZES_IN_DESCRIPTION} autohide={false} onUpdate={this.dropdownOnUpdate.bind(this)}>
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
                    <FullStackBlend.Controls.DropDownControl representing={this.getRepresentedValue()}>
                        <div className="input-group">
                            <FullStackBlend.Controls.Textbox value={this.state.value} preRegExp="([\-])?(([0-9])|([0-9][\.])|([0-9][\.][0-9]*)|([1-9][0-9]*)|([1-9][0-9]*[\.])|([1-9][0-9]*[\.][0-9]*)|([1-9][0-9]*))?" postRegExp="([\-])?(([0][\.][0-9]+)|([1-9][0-9]*[\.][0-9]+)|([1-9][0-9]*)|([0]))" onUpdate={this.textboxOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
                            <div className="input-group-append">
                                <FullStackBlend.Controls.DropDownList ref="dropdown" value={SIZES_IN_UNIT[this.state.index]} customClassName="btn-secondary" options={SIZES_IN_DESCRIPTION} autohide={false} onUpdate={this.dropdownOnUpdate.bind(this)}>
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