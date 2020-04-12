import {TextHelper} from '../../helpers/TextHelper.js';
import {FontHelper} from '../../helpers/FontHelper.js';
import {CodeHelper} from '../../helpers/CodeHelper.js';
import {IProps, IState, DefaultState, DefaultProps, Base} from './Base.js';
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
    "unicode-bidi": CONSTANTS.UNICODE_BIDI_OPTIONS,
    "text-transform": CONSTANTS.TEXT_TRANSFORM_OPTIONS,
    "vertical-align": CONSTANTS.VERTICAL_ALIGN_OPTIONS,
    "font-size": CONSTANTS.FONT_SIZE_OPTIONS,
    "font-weight": CONSTANTS.FONT_WEIGHT_OPTIONS,
    "font-stretch": CONSTANTS.FONT_STRETCH_OPTIONS,
    "text-justify": CONSTANTS.TEXT_JUSTIFY_OPTIONS,
    "font-family": CONSTANTS.FONT_FAMILY_OPTIONS
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
let reject = {
    "font-weight": function(scope) {
        let family = scope.state.styleValues['font-family'];
        let normals = (scope.state.styleValues['font-style'] == 'italic') ?
            FontHelper.getAllItalics(FontHelper.getFontInfo(family)) :
            FontHelper.getAllNormals(FontHelper.getFontInfo(family));
        let list = [];
        for (let i=100; i<=900; i+=100) {
            if (normals.indexOf(i) == -1) {
                list.push(i);
            }
        }
        return list;
    }
}

let defaults = {
    "font-family": "Roboto"
}

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
    customClassName: string,
    searchBox: boolean,
    useMaximumHeight: boolean
}

interface State extends IState {
    controls: any,
    index: number,
    value: any
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
    index: 0,
    value: null,
    controls: null
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
    customClassName: null,
    searchBox: false,
    useMaximumHeight: false
});

class DropDownPicker extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;
    
    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        let index = this.getOptions().indexOf(this.state.styleValues[this.props.watchingStyleNames[0]] || defaults[this.props.watchingStyleNames[0]]);
        if (index == -1) {
            index = 0;
        }
        
        this.setState({
            index: index
        });
    }
    
    protected dropdownOnUpdate(identity: any, value: any, index: any) {
        this.setState({
            index: index,
            value: value
        });
        
        value = this.getFinalizedValue(value);
        
        perform('update', {
            aStyle: [{
                name: identity.split('[')[0],
                value: value
            }]
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
    
    private getOptions() {
        let filteredOptions = options[this.props.watchingStyleNames[0]];
        
        if (reject[this.props.watchingStyleNames[0]]) {
            let list = reject[this.props.watchingStyleNames[0]](this);
            filteredOptions = filteredOptions.filter(option => list.indexOf(option) == -1);
        }
        
        return filteredOptions;
    }
    
    render() {
        let filteredOptions = this.getOptions();
        
        if (this.state.controls == null) {
            this.state.controls = this.getComponentInstances(filteredOptions);
        }
        
        return (
            <div className="btn-group btn-group-sm mr-1 mb-1 dropdown-picker" role="group">
                <FullStackBlend.Controls.DropDownList customClassName={this.props.customClassName} options={filteredOptions} identity={this.props.watchingStyleNames[0]} onUpdate={this.dropdownOnUpdate.bind(this)} controls={this.state.controls} searchBox={this.props.searchBox} useMaximumHeight={this.props.useMaximumHeight}>
                    <span>{(map[this.props.watchingStyleNames[0]] || this.props.watchingStyleNames[0]).replace(/(background|object|text|list)\-/, '')}: </span><span>{(this.props.watchingStyleNames[0].indexOf('-image') == -1) ? this.state.styleValues[this.props.watchingStyleNames[0]] : (this.state.styleValues[this.props.watchingStyleNames[0]] ? 'selected' : '')}</span>
                </FullStackBlend.Controls.DropDownList>
            </div>
        )
    }
}

DeclarationHelper.declare('Components.DropDownPicker', DropDownPicker);

export {Props, State, DropDownPicker};