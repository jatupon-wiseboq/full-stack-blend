import {EventHelper} from '../../helpers/EventHelper.js';
import {TextHelper} from '../../helpers/TextHelper.js';
import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../controls/Textbox.js';
import '../controls/DropDownControl.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
    inline: boolean,
    manual: boolean
}

interface State extends IState {
    value: any
}

class NumberPicker extends Base<Props, State> {
    state: IState = {classNameStatuses: {}, styleValues: {}, value: null}
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
            return status;
        } else {
            return null;
        }
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        let original = this.state.styleValues[this.props.watchingStyleNames[0]];
        let isString = typeof original === 'string';
        let value = (isString) ? parseInt(original) : null;
        this.state.value = value;
        
        this.forceUpdate();
    }
    
    protected textboxOnUpdate(value: any) {
        this.state.value = value;
        if (this.props.watchingStyleNames[0] && !this.props.manual) {
            perform('update', {
                aStyle: {
                    name: this.props.watchingStyleNames[0].split('[')[0],
                    value: this.composeValue(value)
                },
                replace: this.props.watchingStyleNames[0]
            });
        }
    }
    
    private composeValue(value: any) {
        return TextHelper.composeIntoMultipleValue(this.props.watchingStyleNames[0], value, this.state.styleValues[this.props.watchingStyleNames[1]], '0');
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
                    <FullStackBlend.Controls.Textbox value={this.state.value} preRegExp="(([1-9][0-9]*))?" postRegExp="(([1-9][0-9]*))" onUpdate={this.textboxOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
                    <div className="input-group-append">
                        <div className="btn btn-sm btn-secondary" internal-fsb-event-always-propagate="click">
                            <i className="fa fa-check-circle m-0" internal-fsb-event-always-propagate="click" />
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className={"number-picker " + this.props.additionalClassName}>
                    <FullStackBlend.Controls.DropDownControl representing={this.state.value}>
                        <div className="input-group">
                            <FullStackBlend.Controls.Textbox value={this.state.value} preRegExp="(([1-9][0-9]*))?" postRegExp="(([1-9][0-9]*))" onUpdate={this.textboxOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
                        </div>
                    </FullStackBlend.Controls.DropDownControl>
                </div>
            )
        }
    }
}

DeclarationHelper.declare('Components.NumberPicker', NumberPicker);

export {Props, State, NumberPicker};