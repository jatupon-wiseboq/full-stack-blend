import {TextHelper} from '../../../helpers/TextHelper.js';
import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {IProps, IState, DefaultProps, DefaultState, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../../controls/Textbox.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
}

interface State extends IState {
}

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
    watchingAttributeNames: ['class']
});

let stylesheetDefinitionKeys: any = [];



class CSSCustomClasses extends Base<Props, State> {
    protected static defaultProps: Props = ExtendedDefaultProps;

    constructor(props) {
        super(props);
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        this.state.value = CodeHelper.getCustomClasses(this.state.attributeValues[this.props.watchingAttributeNames[0]]);
        
        this.forceUpdate();
    }
    
    protected textboxOnUpdate(value: any) {
    		let filteredValue = CodeHelper.getCustomClasses(value);
    		
    		if (this.state.value != filteredValue) {
    		    this.state.value = filteredValue;
    		    
            perform('update', {
            		attributes: [{
        						name: 'class',
        						value: [CodeHelper.getInternalClasses(this.state.attributeValues[this.props.watchingAttributeNames[0]]), filteredValue].sort().join(' ')
        				}],
                replace: 'custom-classname'
            });
        }
        
        if (filteredValue != value) return filteredValue;
    }
    
    render() {
      return (
        <FullStackBlend.Controls.Textbox spellCheck={false} ref="input" value={this.state.value} preRegExp="([a-zA-Z0-9]\-]|[a-zA-Z0-9\- ]+)?" postRegExp="[a-zA-Z0-9\- ]*" onUpdate={this.textboxOnUpdate.bind(this)} />
      )
    }
}

DeclarationHelper.declare('Components.CSSCustomClasses', CSSCustomClasses);

export {Props, State, CSSCustomClasses};