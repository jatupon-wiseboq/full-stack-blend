import {TextHelper} from '../../helpers/TextHelper.js';
import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../controls/DropDownList.js';
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
    currentActiveLayout: number
}

class GridPicker extends Base<Props, State> {
    state: IState = {classNameStatuses: {}, styleValues: {}, currentActiveLayout: -1}
    static defaultProps: Props = {
        watchingClassNames: RESPONSIVE_SIZE_REGEX,
        watchingStyleNames: [],
        options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        defaultOption: 12,
        prefix: 'col',
    }
    
    private recentElement: HTMLElement = null;
    private recentDropdown: HTMLElement = null;
    private documentOnClickDelegate: Function = null;
    private recentElementClassName: string = '';
    
    constructor(props) {
        super(props);
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        this.setState({
            currentActiveLayout: properties.currentActiveLayout
        });
        
        this.recentElementClassName = properties.elementClassName;
    }
    
    protected dropdownOnUpdate(identity: any, value: any, index: any) {
        let elementClassName = this.recentElementClassName;
        
        elementClassName = elementClassName.replace(this.props.watchingClassNames[identity], '');
        if (value != 'Inherit') {
            switch (identity) {
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
        
        ReactDOM.findDOMNode(this.refs["selectedValue" + identity]).innerText = value;
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
        let $this = this;
        return (
            <div className="grid-picker btn-group">
                {[0, 1, 2, 3].map((index) => {
                    return (
                        <FullStackBlend.Controls.DropDownList key={"element-" + index}
                                                          identity={index}
                                                          options={(index != 0) ? ['Inherit', ...this.props.options] : this.props.options}
                                                          onUpdate={this.dropdownOnUpdate.bind(this)}
                        >
                            {pug `
                              i(className=["fa fa-mobile", "fa fa-tablet", "fa fa-tablet fa-rotate-90", "fa fa-desktop"][index] + (($this.state.currentActiveLayout == index) ? ' active' : ' inactive'))
                              br
                              span(ref="selectedValue" + index)
                                | #{$this.getSelectedValue(index)}
                            `}
                        </FullStackBlend.Controls.DropDownList>
                    )
                })}
            </div>
        )
    }
}

DeclarationHelper.declare('Components.GridPicker', GridPicker);

export {Props, State, GridPicker};