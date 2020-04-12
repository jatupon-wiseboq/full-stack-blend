import {EventHelper} from '../../helpers/EventHelper.js';
import {TextHelper} from '../../helpers/TextHelper.js';
import {IProps, IState, DefaultState, DefaultProps, Base} from './Base.js';
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

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
    value: null,
    visible: false
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
    inline: false,
    manual: false
});

class ColorPicker extends Base<Props, State> {
    protected state: State = Object.assign({}, ExtendedDefaultState);
    protected static defaultProps: Props = ExtendedDefaultProps;
    
    constructor(props) {
        super(props);
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        let original = this.state.styleValues[this.props.watchingStyleNames[0]];
        this.state.value = original || null;
        
        this.forceUpdate();
    }
    
    protected colorPickerOnUpdate(value: any) {
        let composedValue = '#' + value;
        this.state.value = composedValue;
        if (this.props.watchingStyleNames[0] && !this.props.manual) {
            perform('update', {
                aStyle: [{
                    name: this.props.watchingStyleNames[0].split('[')[0],
                    value: composedValue
                }],
                replace: this.props.watchingStyleNames[0]
            });
        }
    }
    
    protected onVisibleChanged(visible: boolean) {
        this.setState({
            visible: visible
        });
    }
    
    protected colorPickerOnRequestHiding() {
        this.refs.dropdownControl.hide();
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
                    <div className="btn btn-secondary btn-sm" internal-fsb-event-no-propagate="click" style={{flex: 'auto'}}>
                        <FullStackBlend.Controls.DropDownControl ref="dropdownControl" representing={this.state.value} autohide={false} onVisibleChanged={this.onVisibleChanged.bind(this)}>
                            <div className="section-container">
                                <div className="section-body">
                                    <FullStackBlend.Controls.ColorPicker value={this.state.value} visible={this.state.visible} onUpdate={this.colorPickerOnUpdate.bind(this)} onRequestHiding={this.colorPickerOnRequestHiding.bind(this)}></FullStackBlend.Controls.ColorPicker>
                                </div>
                            </div>
                        </FullStackBlend.Controls.DropDownControl>
                    </div>
                    <div className="input-group-append">
                        <div className="btn btn-sm btn-secondary" internal-fsb-event-always-propagate="click">
                            <i className="fa fa-check-circle m-0" internal-fsb-event-always-propagate="click" />
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="btn-group btn-group-sm mr-1 mb-1" role="group">
                    <button className={"btn btn-light color-picker p-0 " + this.props.additionalClassName}>
                        <FullStackBlend.Controls.DropDownControl ref="dropdownControl" representing={"<div style=\"width: 36px; height: 28px; padding: 4px 8px;\"><div style=\"width: 20px; height: 20px; background-color: " + this.state.value + "; \" /></div>"} onVisibleChanged={this.onVisibleChanged.bind(this)}>
                            <FullStackBlend.Controls.ColorPicker value={this.state.styleValues[this.props.watchingStyleNames[0]]}  visible={this.state.visible} onUpdate={this.colorPickerOnUpdate.bind(this)} onRequestHiding={this.colorPickerOnRequestHiding.bind(this)}></FullStackBlend.Controls.ColorPicker>
                        </FullStackBlend.Controls.DropDownControl>
                    </button>
                </div>
            )
        }
    }
}

DeclarationHelper.declare('Components.ColorPicker', ColorPicker);

export {Props, State, ColorPicker}; 