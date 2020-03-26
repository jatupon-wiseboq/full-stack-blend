import {EventHelper} from '../../helpers/EventHelper.js';
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
    inline: boolean
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
        inline: false
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
    
    protected dropdownOnUpdate(identity: any, value: any, index: any) {
        this.setState({
            index: index
        });
        if (this.props.watchingStyleNames[0]) {
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
        if (this.props.watchingStyleNames[0]) {
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
        
        let splited = this.props.watchingStyleNames[0].split('[');
        if (splited[1]) {
            let tokens = splited[1].split(',');
            let index = parseInt(tokens[0]);
            let count = parseInt(tokens[1].split(']')[0]);
            
            let values = (this.state.styleValues[this.props.watchingStyleNames[1]] || this.defaultValue(count)).split(' ');
            values[index] = composedValue;
            
            return values.join(' ');
        } else {
            return composedValue;
        }
    }
    
    private defaultValue(count: number) {
        let tokens = new Array(count);
        for (let i=0; i<tokens.length; i++) {
            tokens[i] = "0";
        }
        return tokens.join(' ');
    }
    
    public hide() {
        this.refs.dropdown.hide();
    }
    
    render() {
        if (this.props.inline) {
            return (
                <div className="input-group" internal-fsb-event-no-propagate="click">
                    <FullStackBlend.Controls.Textbox preRegExp="(\-)?([0-9]+)?(\.[0-9]*)?" postRegExp="(\-)?[0-9]+(\.[0-9]+)?" onUpdate={this.textboxOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
                    <div className="input-group-append">
                        <FullStackBlend.Controls.DropDownList ref="dropdown" customClassName="btn-secondary" options={SIZES_IN_DESCRIPTION} autohide={false} dropDownWidth={185} onUpdate={this.dropdownOnUpdate.bind(this)}>
                            <span>{SIZES_IN_UNIT[this.state.index]}</span>
                        </FullStackBlend.Controls.DropDownList>
                        <div className="btn btn-sm btn-secondary">
                            <i className="fa fa-check-circle m-0" />
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className={"size-picker " + this.props.additionalClassName}>
                    <FullStackBlend.Controls.DropDownControl representing={this.getRepresentedValue()} dropDownWidth={120} >
                        <div className="input-group">
                            <FullStackBlend.Controls.Textbox preRegExp="(\-)?([0-9]+)?(\.[0-9]*)?" postRegExp="(\-)?[0-9]+(\.[0-9]+)?" onUpdate={this.textboxOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
                            <div className="input-group-append">
                                <FullStackBlend.Controls.DropDownList ref="dropdown" customClassName="btn-secondary" options={SIZES_IN_DESCRIPTION} autohide={false} dropDownWidth={185} onUpdate={this.dropdownOnUpdate.bind(this)}>
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