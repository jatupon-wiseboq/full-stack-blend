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
    watchingAttributeNames: ['internal-fsb-reusable-preset-name', 'internal-fsb-guid', 'class'],
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
        
        stylesheetDefinitionKeys = (properties.extensions.stylesheetDefinitionKeys || []).map(info => info.name);
        this.state.value = (this.state.attributeValues[this.props.watchingAttributeNames[0]] || '').replace(/_/g, ' ');
        
        this.forceUpdate();
    }
    
    protected textboxOnUpdate(value: any) {
    		value = value.replace(/ /g, '_');
    		
    		if (!value && !confirm('Remove inheriting from the preset "' + this.state.value + '"?')) {
    				return this.state.value;
    		} else if (stylesheetDefinitionKeys.indexOf(value) != -1) {
            return this.state.value;
        } else {
            this.state.value = value;
            
            perform('update', {
            		attributes: [{
        						name: 'class',
        						value: TextHelper.mergeClassNameWithPrefixedClasses(this.state.attributeValues['class'], '-fsb-self-', [this.state.attributeValues['internal-fsb-guid']])
        				},{
            				name: 'internal-fsb-reusable-preset-name',
            				value: value
            		}],
                styles: [{
                    name: '-fsb-reusable-name',
                    value: value
                },{
                    name: '-fsb-reusable-id',
                    value: this.state.attributeValues['internal-fsb-guid']
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