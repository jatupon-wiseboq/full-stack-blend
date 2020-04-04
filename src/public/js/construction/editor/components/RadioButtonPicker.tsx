import {TextHelper} from '../../helpers/TextHelper.js';
import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import * as CONSTANTS from '../../Constants.js';

let options = {
    "text-align": CONSTANTS.TEXT_ALIGN_OPTIONS,
    "font-style": CONSTANTS.FONT_STYLE_OPTIONS
}

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
    customClassName: string
}

interface State extends IState {
}

class RadioButtonPicker extends Base<Props, State> {
    state: IState = {classNameStatuses: {}, styleValues: {}}

    static defaultProps: Props = {
        watchingClassNames: [],
        watchingStyleNames: [],
        customClassName: null
    }
    
    constructor(props) {
        super(props);
    }
    
    public update(properties: any) {
        super.update(properties);
        
        this.forceUpdate();
    }
    
    protected buttonOnClick(index: number) {
        let list = options[this.props.watchingStyleNames[0]];
        let value = list[index];
        let splited = value[0].split(':');
        let name = splited[0];
        let current = this.state.styleValues[name];
        let target = splited[1];
        
        perform('update', {
            aStyle: {
                name: name,
                value: (current == target) ? null : target
            }
        });
    }
    
    render() {
        return (
          pug `
            .btn-group.btn-group-sm.mr-1.mb-1(role="group")
              each value, index in options[this.props.watchingStyleNames[0]]
                button.btn.text-center(key="item-" + value, className=((this.state.styleValues[value[0].split(':')[0]] == value[0].split(':')[1]) ? 'btn-primary' : (this.props.customClassName || 'btn-light')), onClick=this.buttonOnClick.bind(this, index))
                  i.m-0(className="fa "+ value[1], style={fontSize: '12px'})
          `
        )
    }
}

DeclarationHelper.declare('Components.RadioButtonPicker', RadioButtonPicker);

export {Props, State, RadioButtonPicker};