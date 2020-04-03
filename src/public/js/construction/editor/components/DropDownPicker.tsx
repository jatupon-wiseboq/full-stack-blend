import {TextHelper} from '../../helpers/TextHelper.js';
import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../controls/DropDownList.js';
import './SizePicker.js';
import './NumberPicker.js';
import './TextPicker.js';
import './ColorPicker.js';
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
    "background-position[0,2]": CONSTANTS.BACKGROUND_POSITION_OPTIONS,
    "background-position[1,2]": CONSTANTS.BACKGROUND_POSITION_OPTIONS,
    "mix-blend-mode": CONSTANTS.MIX_BLEND_MODE_OPTIONS,
    "opacity": CONSTANTS.OPACITY_OPTIONS,
    "visibility": CONSTANTS.VISIBILITY_OPTIONS,
    "border-collapse": CONSTANTS.BORDER_COLLAPSE_OPTIONS,
    "border-spacing": CONSTANTS.BORDER_SPACING_OPTIONS,
    "caption-side": CONSTANTS.CAPTION_SIDE_OPTIONS,
    "empty-cell": CONSTANTS.EMPTY_CELL_OPTIONS,
    "table-layout": CONSTANTS.TABLE_LAYOUT_OPTIONS,
    "list-style": CONSTANTS.LIST_STYLE_OPTIONS,
    "list-style-image": CONSTANTS.LIST_STYLE_IMAGE_OPTIONS,
    "list-style-position": CONSTANTS.LIST_STYLE_POSITION_OPTIONS,
    "list-style-type": CONSTANTS.LIST_STYLE_TYPE_OPTIONS,
    "text-indent": CONSTANTS.TEXT_INDENT_OPTIONS,
    "letter-spacing": CONSTANTS.LETTER_SPACING_OPTIONS,
    "word-spacing": CONSTANTS.WORD_SPACING_OPTIONS,
    "tab-size": CONSTANTS.TAB_SIZE_OPTIONS,
    "line-height": CONSTANTS.LINE_HEIGHT_OPTIONS,
    "white-space": CONSTANTS.WHITE_SPACE_OPTIONS,
    "word-break": CONSTANTS.WORD_BREAK_OPTIONS,
    "word-wrap": CONSTANTS.WORD_WRAP_OPTIONS,
    "hyphens": CONSTANTS.HYPHENS_OPTIONS,
    "text-overflow": CONSTANTS.TEXT_OVERFLOW_OPTIONS,
    "text-decoration-color": CONSTANTS.TEXT_DECORATION_COLOR_OPTIONS,
    "text-decoration-line": CONSTANTS.TEXT_DECORATION_LINE_OPTIONS,
    "text-decoration-style": CONSTANTS.TEXT_DECORATION_STYLE_OPTIONS,
    "writing-mode": CONSTANTS.WRITING_MODE_OPTIONS,
    "quotes[0,2]": CONSTANTS.QUOTES_OPTIONS,
    "quotes[1,2]": CONSTANTS.QUOTES_OPTIONS,
    "direction": CONSTANTS.DIRECTION_OPTIONS,
    "unicode-bidi": CONSTANTS.UNICODE_BIDI_OPTIONS
}
let map = {
    "object-position[0,2]": "object-position-x",
    "object-position[1,2]": "object-position-y",
    "background-size[0,2]": "background-width",
    "background-size[1,2]": "background-height",
    "background-position[0,2]": "background-position-x",
    "background-position[1,2]": "background-position-y",
    "quotes[0,2]": "quotes-begin",
    "quotes[1,2]": "quotes-end"
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
        } else if (options.indexOf('{TEXT}') != -1) {
            controls['{TEXT}'] = <FullStackBlend.Components.TextPicker ref="text" watchingStyleNames={this.props.watchingStyleNames} inline={true} manual={true} />
        } else if (options.indexOf('{COLOR}') != -1) {
            controls['{COLOR}'] = <FullStackBlend.Components.ColorPicker ref="color" watchingStyleNames={this.props.watchingStyleNames} inline={true} manual={true} />
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
            case '{TEXT}':
                return this.refs.text.getValue();
            case '{COLOR}':
                return this.refs.color.getValue();
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
                <FullStackBlend.Controls.DropDownList options={options[this.props.watchingStyleNames[0]]} identity={this.props.watchingStyleNames[0]} onUpdate={this.dropdownOnUpdate.bind(this)} controls={this.state.controls}>
                    <span>{(map[this.props.watchingStyleNames[0]] || this.props.watchingStyleNames[0]).replace(/(background|object)\-/, '')}: </span><span>{(this.props.watchingStyleNames[0].indexOf('-image') == -1) ? this.state.styleValues[this.props.watchingStyleNames[0]] : (this.state.styleValues[this.props.watchingStyleNames[0]] ? 'selected' : '')}</span>
                </FullStackBlend.Controls.DropDownList>
            </span>
        )
    }
}

DeclarationHelper.declare('Components.DropDownPicker', DropDownPicker);

export {Props, State, DropDownPicker};