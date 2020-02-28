import {TextHelper} from '../../helpers/TextHelper.js';
import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {RESPONSIVE_SIZE_REGEX} from '../../Constants.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
    options: [number];
    defaultOption: number;
    prefix: string;
}

interface State extends IState {
}

class GridPicker extends Base<Props, State> {
    static defaultProps: Props = {
        watchingClassNames: RESPONSIVE_SIZE_REGEX,
        watchingStyleNames: [],
        options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        defaultOption: 12,
        prefix: 'col',
    }
    
    constructor() {
        super();
    }
    
    protected dropdownItemOnClick(index: number, value: string) {
        let elementClassName = this.recentElementClassName;
        
        elementClassName = elementClassName.replace(this.props.watchingClassNames[index], '');
        if (value != 'Inherit') {
            switch (index) {
                case 0:
                    elementClassName += ` ${this.props.prefix}-${value}`;
                    break;
                case 1:
                    elementClassName += ` ${this.props.prefix}-sm-${value}`;
                    break;
                case 2:
                    elementClassName += ` ${this.props.prefix}-md-${value}`;
                    break;
                case 3:
                    elementClassName += ` ${this.props.prefix}-lg-${value}`;
                    break;
            }
        }
        
        perform('update', {
            elementClassName: TextHelper.removeExtraWhitespaces(elementClassName)
        });
        
        ReactDOM.findDOMNode(this.refs["selectedValue" + index]).innerText = value;
    }
    
    private getSelectedValue(index: number) {
        let status = this.state.classNameStatuses[this.props.watchingClassNames[index]];
        if (status) {
            return status[1].toString();
        } else {
            return (index == 0) ? this.props.defaultOption.toString() : 'Inherit';
        }
    }
    
    render() {
      return (
        pug `
          .grid-picker.btn-group
            each index in [0, 1, 2, 3]
              .btn-group(key="group-" + index)
                button.btn.btn-secondary.btn-sm.dropdown-toggle(type="button", data-toggle="dropdown", aria-haspopup="true", aria-expanded="false")
                  i(className=["fa fa-mobile", "fa fa-tablet", "fa fa-tablet fa-rotate-90", "fa fa-desktop"][index] + ((this.state.properties.currentActiveLayout == index) ? ' active' : ' inactive'))
                  br
                  span(ref="selectedValue" + index)
                    | #{this.getSelectedValue(index)}
                .dropdown-menu
                  if index != 0
                    a.dropdown-item(onClick=this.dropdownItemOnClick.bind(this, index, 'Inherit'))
                      | Inherit
                  each value in this.props.options
                    a.dropdown-item(key="item-" + value, onClick=this.dropdownItemOnClick.bind(this, index, value.toString()))
                      | #{value}
        `
      )
    }
}

DeclarationHelper.declare('Controls.GridPicker', GridPicker);

export {Props, State, GridPicker};