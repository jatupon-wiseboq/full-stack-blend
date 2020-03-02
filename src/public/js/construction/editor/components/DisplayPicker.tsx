import {TextHelper} from '../../helpers/TextHelper.js';
import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
}

class DisplayPicker extends Base<Props, State> {
    static defaultProps: Props = {
        watchingClassNames: ['d-none', 'd-block', 'd-sm-none', 'd-sm-block', 'd-md-none', 'd-md-block', 'd-lg-none', 'd-lg-block'],
        watchingStyleNames: [],
    }
    
    constructor() {
        super();
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
            elementClassName: TextHelper.removeExtraWhitespaces(elementClassName)
        });
    }
    
    render() {
      return (
        pug `
          .display-picker.btn-group
            each index in [0, 1, 2, 3]
              .btn-group(key="group-" + index)
                label.btn.btn-secondary.btn-sm
                  i(className=["fa fa-mobile", "fa fa-tablet", "fa fa-tablet fa-rotate-90", "fa fa-desktop"][index] + ((this.state.properties.currentActiveLayout == index) ? ' active' : ' inactive'))
                  br
                  .form-check
                    input.form-check-input(type="checkbox", checked=!!this.state.classNameStatuses[this.props.watchingClassNames[index * 2]], onChange=this.checkboxItemOnClick.bind(this, index))
        `
      )
    }
}

DeclarationHelper.declare('Components.DisplayPicker', DisplayPicker);

export {Props, State, DisplayPicker};