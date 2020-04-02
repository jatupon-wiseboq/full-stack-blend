import {TextHelper} from '../../helpers/TextHelper.js';
import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../controls/DropDownList.js';
import './SizePicker.js';
import './NumberPicker.js';
import './FilePicker.js';
import * as CONSTANTS from '../../Constants.js';

let options = {
    "object-fit": CONSTANTS.OBJECT_FIT_OPTIONS,
    "object-position[0,2]": CONSTANTS.OBJECT_POSITION_OPTIONS,
    "object-position[1,2]": CONSTANTS.OBJECT_POSITION_OPTIONS,
    "overflow-x": CONSTANTS.OVERFLOW_OPTIONS,
    "overflow-y": CONSTANTS.OVERFLOW_OPTIONS,
    "position": CONSTANTS.POSITION_OPTIONS,
    "clear": CONSTANTS.CLEAR_OPTIONS,
    "float": CONSTANTS.FLOAT_OPTIONS,
    "cursor": CONSTANTS.CURSOR_OPTIONS,
    "display": CONSTANTS.DISPLAY_OPTIONS,
    "image-rendering": CONSTANTS.IMAGE_RENDERING_OPTIONS,
    "pointer-events": CONSTANTS.POINTER_EVENTS_OPTIONS,
    "z-index": CONSTANTS.Z_INDEX_OPTIONS,
    "background-image": CONSTANTS.BACKGROUND_IMAGE_OPTIONS,
    "background-attachment": CONSTANTS.BACKGROUND_ATTACHMENT_OPTIONS,
    "background-blend-mode": CONSTANTS.BACKGROUND_BLEND_MODE_OPTIONS,
    "background-clip": CONSTANTS.BACKGROUND_CLIP_OPTIONS,
    "background-origin": CONSTANTS.BACKGROUND_ORIGIN_OPTIONS,
    "background-repeat": CONSTANTS.BACKGROUND_REPEAT_OPTIONS,
    "background-size[0,2]": CONSTANTS.BACKGROUND_SIZE_OPTIONS,
    "background-size[1,2]": CONSTANTS.BACKGROUND_SIZE_OPTIONS,
    "mix-blend-mode": CONSTANTS.MIX_BLEND_MODE_OPTIONS
}
let map = {
    "object-position[0,2]": "object-position-x",
    "object-position[1,2]": "object-position-y",
    "background-size[0,2]": "background-size-w",
    "background-size[1,2]": "background-size-h"
}

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
    controls: [any]
}

class DropDownPicker extends Base<Props, State> {
    state: IState = {classNameStatuses: {}, styleValues: {}, index: 0, controls: null}

    static defaultProps: Props = {
        watchingClassNames: [],
        watchingStyleNames: []
    }
    
    constructor(props) {
        super(props);
    }
    
    public update(properties: any) {
        super.update(properties);
        
        let index = options[this.props.watchingStyleNames[0]].indexOf(this.state.styleValues[this.props.watchingStyleNames[0]]);
        if (index == -1) {
            index = 0;
        }
        
        this.setState({
            index: index
        });
    }
    
    protected dropdownOnUpdate(identity: any, value: any, index: any) {
        this.setState({
            index: index
        });
        
        value = this.getFinalizedValue(value);
        
        perform('update', {
            aStyle: {
                name: identity.split('[')[0],
                value: value
            }
        });
    }
    
    private getComponentInstances(options) {
        let controls = {};
        if (options.indexOf('{SIZE}') != -1) {
            controls['{SIZE}'] = <FullStackBlend.Components.SizePicker ref="size" watchingStyleNames={this.props.watchingStyleNames} inline={true} manual={true} />
        } else if (options.indexOf('{NUMBER}') != -1) {
            controls['{NUMBER}'] = <FullStackBlend.Components.NumberPicker ref="number" watchingStyleNames={this.props.watchingStyleNames} inline={true} manual={true} />
        } else if (options.indexOf('{BROWSE}') != -1) {
            controls['{BROWSE}'] = <FullStackBlend.Components.FilePicker ref="file" watchingStyleNames={this.props.watchingStyleNames} inline={true} manual={true} />
        }
        return controls;
    }
    
    private getFinalizedValue(value) {
        switch (value) {
            case '{SIZE}':
                return this.refs.size.getValue();
            case '{NUMBER}':
                return this.refs.number.getValue();
            case '{BROWSE}':
                return this.refs.file.getValue();
            default:
                return TextHelper.composeIntoMultipleValue(this.props.watchingStyleNames[0], value, this.state.styleValues[this.props.watchingStyleNames[1]], '0px');
        }
    }
    
    render() {
        if (this.state.controls == null) {
            this.state.controls = this.getComponentInstances(options[this.props.watchingStyleNames[0]]);
        }
        
        return (
            <span className="dropdown-picker">
                <FullStackBlend.Controls.DropDownList options={options[this.props.watchingStyleNames[0]]} identity={this.props.watchingStyleNames[0]} dropDownMinWidth={this.props.dropDownMinWidth} onUpdate={this.dropdownOnUpdate.bind(this)} controls={this.state.controls}>
                    <span>{map[this.props.watchingStyleNames[0]] || this.props.watchingStyleNames[0]}: </span><span>{(this.props.watchingStyleNames[0] != 'background-image') ? this.state.styleValues[this.props.watchingStyleNames[0]] : (this.state.styleValues[this.props.watchingStyleNames[0]] ? 'selected' : '')}</span>
                </FullStackBlend.Controls.DropDownList>
            </span>
        )
    }
}

DeclarationHelper.declare('Components.DropDownPicker', DropDownPicker);

export {Props, State, DropDownPicker};