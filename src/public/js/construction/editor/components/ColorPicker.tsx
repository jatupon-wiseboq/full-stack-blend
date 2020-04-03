import {EventHelper} from '../../helpers/EventHelper.js';
import {TextHelper} from '../../helpers/TextHelper.js';
import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../controls/ColorPicker.js';
import '../controls/DropDownControl.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
    inline: boolean,
    manual: boolean
}

interface State extends IState {
    value: any,
    visible: boolean
}

class ColorPicker extends Base<Props, State> {
    state: IState = {classNameStatuses: {}, styleValues: {}, value: null, visible: false}
    static defaultProps: Props = {
        watchingClassNames: [],
        watchingStyleNames: [],
        inline: false,
        manual: false
    }
    
    constructor(props) {
        super(props);
    }
    
    public update(properties: any) {
        super.update(properties);
        
        let original = this.state.styleValues[this.props.watchingStyleNames[0]];
        
        this.setState({
            value: original || null
        });
    }
    
    protected colorOnUpdate(value: any) {
        this.setState({
            value: value
        });
        if (this.props.watchingStyleNames[0] && !this.props.manual) {
            perform('update', {
                aStyle: {
                    name: this.props.watchingStyleNames[0].split('[')[0],
                    value: value
                },
                replace: this.props.watchingStyleNames[0]
            });
        }
    }
    
    protected dropdownOnVisibleChanged(visible: boolean) {
        this.setState({
            visible: visible
        });
    }
    
    public getValue() {
        return this.state.value;
    }
    
    public hide() {
    }
    
    render() {
        if (this.props.inline) {
            return (
                <div className="input-group inline" internal-fsb-event-no-propagate="click">
                    <FullStackBlend.Controls.ColorPicker visible={this.props.visible} value={this.state.styleValues[this.props.watchingStyleNames[0]]} onUpdate={this.colorOnUpdate.bind(this)}></FullStackBlend.Controls.ColorPicker>
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
                    <FullStackBlend.Controls.DropDownControl visible={this.state.visible} representing={this.state.value} onVisibleChanged={this.dropdownOnVisibleChanged.bind(this)}>
                        <div className="input-group">
                            <FullStackBlend.Controls.ColorPicker value={this.state.styleValues[this.props.watchingStyleNames[0]]} onUpdate={this.colorOnUpdate.bind(this)}></FullStackBlend.Controls.ColorPicker>
                        </div>
                    </FullStackBlend.Controls.DropDownControl>
                </div>
            )
        }
    }
}

DeclarationHelper.declare('Components.ColorPicker', ColorPicker);

export {Props, State, ColorPicker}; 