import {TextHelper} from '../../helpers/TextHelper.js';
import {IProps, IState, DefaultProps, DefaultState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../controls/Textbox.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
}

interface State extends IState {
}

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
    watchingAttributeNames: ['internal-fsb-reusable-preset-name'],
    watchingExtensionNames: ['stylesheetDefinitionRevision']
});

let stylesheetDefinitionKeys: any = [];

class CSSPresetName extends Base<Props, State> {
    protected static defaultProps: Props = ExtendedDefaultProps;

    constructor(props) {
        super(props);
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        stylesheetDefinitionKeys = properties.stylesheetDefinitionKeys || [];
        this.state.value = (this.state.attributeValues[this.props.watchingAttributeNames[0]] || '').replace(/_/g, ' ');
        
        this.forceUpdate();
    }
    
    protected textboxOnUpdate(value: any) {
    		value = value.replace(/ /g, '_');
    	
        if (stylesheetDefinitionKeys.indexOf(value) != -1) {
            return this.state.value;
        } else {
            this.state.value = value;
            perform('update', {
                attributes: [{
                    name: this.props.watchingAttributeNames[0],
                    value: value
                }],
                replace: this.props.watchingAttributeNames[0]
            });
        }
    }
    
    render() {
      return (
        <FullStackBlend.Controls.Textbox ref="input" value={this.state.value} preRegExp="([a-zA-Z]|[a-zA-Z][a-zA-Z0-9 ]+)?" postRegExp="[a-zA-Z0-9 ]*" onUpdate={this.textboxOnUpdate.bind(this)} />
      )
    }
}

DeclarationHelper.declare('Components.CSSPresetName', CSSPresetName);

export {Props, State, CSSPresetName};