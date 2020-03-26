import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../controls/DropDownList.js';
import * as CONSTANTS from '../../Constants.js';

let options = {
    "object-fit": CONSTANTS.OBJECT_FIT_OPTIONS,
    "object-position-x": CONSTANTS.OBJECT_POSITION_OPTIONS,
    "object-position-y": CONSTANTS.OBJECT_POSITION_OPTIONS,
    "overflow-x": CONSTANTS.OVERFLOW_OPTIONS,
    "overflow-y": CONSTANTS.OVERFLOW_OPTIONS,
    "position": CONSTANTS.POSITION_OPTIONS
}

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
}

class DropDownPicker extends Base<Props, State> {
    state: IState = {classNameStatuses: {}, styleValues: {}, properties: {}, index: 0}

    static defaultProps: Props = {
        watchingClassNames: [],
        watchingStyleNames: []
    }
    
    constructor(props) {
        super(props);
    }
    
    public update(properties: any) {
        super.update(properties);
        
        let index = options[this.props.watchingStyleNames[0]].indexOf(this.state.styleValues[this.props.watchingStyleNames[0]]);
        if (index == -1) {
            index = 0;
        }
        
        this.setState({
            index: index
        });
    }
    
    protected dropdownOnUpdate(identity: any, value: any, index: any) {
        this.setState({
            index: index
        });
        
        perform('update', {
            aStyle: {
                name: identity,
                value: value
            }
        });
    }
    
    render() {
        return (
            <span className="dropdown-picker">
                <FullStackBlend.Controls.DropDownList options={options[this.props.watchingStyleNames[0]]} identity={this.props.watchingStyleNames[0]} dropDownMinWidth={this.props.dropDownMinWidth} onUpdate={this.dropdownOnUpdate.bind(this)}>
                    <span>{this.props.watchingStyleNames[0]}: </span><span>{options[this.props.watchingStyleNames[0]][this.state.index]}</span>
                </FullStackBlend.Controls.DropDownList>
            </span>
        )
    }
}

DeclarationHelper.declare('Components.DropDownPicker', DropDownPicker);

export {Props, State, DropDownPicker};