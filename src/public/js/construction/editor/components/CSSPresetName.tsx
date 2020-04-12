import {TextHelper} from '../../helpers/TextHelper.js';
import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../controls/Textbox.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
}

interface State extends IState {
}

class CSSPresetName extends Base<Props, State> {
    constructor(props) {
        super(props);
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        let original = this.state.styleValues[this.props.watchingStyleNames[0]];
        if (original) {
            original = original.replace(/^'|'$/gm, '');
        }
        this.state.value = original;
        
        this.forceUpdate();
    }
    
    protected textboxOnUpdate(value: any) {
        this.state.value = value;
        if (this.props.watchingStyleNames[0] && !this.props.manual) {
            perform('update', {
                aStyle: [{
                    name: this.props.watchingStyleNames[0].split('[')[0],
                    value: this.composeValue(value)
                }],
                replace: this.props.watchingStyleNames[0]
            });
        }
    }
    
    render() {
      return (
        <FullStackBlend.Controls.Textbox value={this.state.value} preRegExp="[^']*" postRegExp="[^']*" onUpdate={this.textboxOnUpdate.bind(this)} />
      )
    }
}

DeclarationHelper.declare('Components.CSSPresetName', CSSPresetName);

export {Props, State, CSSPresetName};