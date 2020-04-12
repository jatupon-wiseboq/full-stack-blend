import {TextHelper} from '../../helpers/TextHelper.js';
import {CodeHelper} from '../../helpers/CodeHelper.js';
import {IProps, IState, DefaultState, DefaultProps, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
    currentActiveLayout: number
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
    currentActiveLayout: -1
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
    watchingClassNames: ['d-none', 'd-block', 'd-sm-none', 'd-sm-block', 'd-md-none', 'd-md-block', 'd-lg-none', 'd-lg-block']
});

class DisplayPicker extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;
    
    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    public update(properties: any) {
        super.update(properties);
        
        this.setState({
            currentActiveLayout: properties.currentActiveLayout
        });
        
        this.recentElementClassName = properties.attributes['class'] || '';
    }
    
    protected checkboxItemOnClick(index: number) {
        let name0 = this.props.watchingClassNames[index * 2];
        let name1 = this.props.watchingClassNames[index * 2 + 1];
        let current = !!this.state.classNameStatuses[name0];
        let elementClassName = this.recentElementClassName;
        
        this.state.classNameStatuses[name0] = !current;
        if (name1) this.state.classNameStatuses[name1] = current;
        
        this.props.watchingClassNames.forEach((name) => {
            if (!!name) {
                elementClassName = elementClassName.replace(name, '');
            }
        });
        for (let i=0; i<4; i++) {
            let name0 = this.props.watchingClassNames[i * 2];
            let name1 = this.props.watchingClassNames[i * 2 + 1];
            
            if (this.state.classNameStatuses[name0]) {
                elementClassName += ' ' + name0;
            } else if (!!name1) {
                elementClassName += ' ' + name1;
            }
        }
        
        perform('update', {
            attributes: [{
                name: 'class',
                value: TextHelper.removeExtraWhitespaces(elementClassName)
            }]
        });
    }
    
    render() {
      return (
        pug `
          .display-picker.btn-group
            each index in [0, 1, 2, 3]
              .btn-group(key="group-" + index)
                label.btn.btn-light.btn-sm
                  i(className=["fa fa-mobile", "fa fa-tablet", "fa fa-tablet fa-rotate-90", "fa fa-desktop"][index] + ((this.state.currentActiveLayout == index) ? ' active' : ' inactive'))
                  br
                  .form-check
                    input.form-check-input(type="checkbox", checked=!!this.state.classNameStatuses[this.props.watchingClassNames[index * 2]], onChange=this.checkboxItemOnClick.bind(this, index))
        `
      )
    }
}

DeclarationHelper.declare('Components.DisplayPicker', DisplayPicker);

export {Props, State, ExtendedDefaultState, ExtendedDefaultProps, DisplayPicker};