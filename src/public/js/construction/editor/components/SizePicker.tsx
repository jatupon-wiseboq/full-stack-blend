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
}

interface State extends IState {
    index: number,
    value: null
}

class SizePicker extends Base<Props, State> {
    state: IState = {classNameStatuses: {}, styleValues: {}, properties: {}, index: 0, value: null}
    
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
        perform('update', {
            aStyle: {
                name: this.props.watchingStyleNames[0],
                value: (this.state.value != null) ? this.state.value + SIZES_IN_UNIT[index] : null
            },
            replace: this.props.watchingStyleNames[0]
        });
    }
    
    protected textboxOnUpdate(value: any) {
        this.setState({
            value: value
        });
        perform('update', {
            aStyle: {
                name: this.props.watchingStyleNames[0],
                value: (value != null) ? (value.toString() + SIZES_IN_UNIT[this.state.index]).trim() : null
            },
            replace: this.props.watchingStyleNames[0]
        });
    }
    
    render() {
        return (
            <div className={"size-picker " + this.props.additionalClassName}>
                <FullStackBlend.Controls.DropDownControl representing={this.getRepresentedValue()} dropDownWidth={120} >
                    <div className="input-group">
                        <FullStackBlend.Controls.Textbox preRegExp="(\-)?([0-9]+)?(\.[0-9]*)?" postRegExp="(\-)?[0-9]+(\.[0-9]+)?" onUpdate={this.textboxOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
                        <div className="input-group-append">
                            <FullStackBlend.Controls.DropDownList customClassName="btn-secondary" options={SIZES_IN_DESCRIPTION} autohide={false} dropDownWidth={185} onUpdate={this.dropdownOnUpdate.bind(this)}>
                                <span>{SIZES_IN_UNIT[this.state.index]}</span>
                            </FullStackBlend.Controls.DropDownList>
                        </div>
                    </div>
                </FullStackBlend.Controls.DropDownControl>
            </div>
        )
    }
}

DeclarationHelper.declare('Components.SizePicker', SizePicker);

export {Props, State, SizePicker};