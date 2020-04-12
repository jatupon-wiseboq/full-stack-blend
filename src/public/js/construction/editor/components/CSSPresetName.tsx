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
    watchingAttributeNames: ['internal-fsb-reusable-preset-name']
});

class CSSPresetName extends Base<Props, State> {
    protected static defaultProps: Props = ExtendedDefaultProps;

    constructor(props) {
        super(props);
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        this.state.value = this.state.attributeValues[this.props.watchingAttributeNames[0]];
        
        this.forceUpdate();
    }
    
    protected textboxOnUpdate(value: any) {
        this.state.value = value;
        perform('update', {
            attributes: [{
                name: this.props.watchingAttributeNames[0],
                value: value
            }]
        });
    }
    
    render() {
      return (
        <FullStackBlend.Controls.Textbox value={this.state.value} preRegExp="([a-zA-Z_]|[a-zA-Z_][a-zA-Z0-9_]+)?" postRegExp="[a-zA-Z0-9_]*" onUpdate={this.textboxOnUpdate.bind(this)} />
      )
    }
}

DeclarationHelper.declare('Components.CSSPresetName', CSSPresetName);

export {Props, State, CSSPresetName};