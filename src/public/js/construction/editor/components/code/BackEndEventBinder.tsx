import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import '../../controls/DropDownControl';
import '../generic/RadioButtonPicker';
import * as CONSTANTS from '../../../Constants';

let options = {
		"onfsbsourceinsert": CONSTANTS.REACT_EVENT_HANDLING_OPTIONS,
		"onfsbsourceupsert": CONSTANTS.REACT_EVENT_HANDLING_OPTIONS,
		"onfsbsourceupdate": CONSTANTS.REACT_EVENT_HANDLING_OPTIONS,
		"onfsbsourcedelete": CONSTANTS.REACT_EVENT_HANDLING_OPTIONS,
		"onfsbsourceretrieve": CONSTANTS.REACT_EVENT_HANDLING_OPTIONS,
		"onfsbtargetinsert": CONSTANTS.REACT_EVENT_HANDLING_OPTIONS,
		"onfsbtargetupsert": CONSTANTS.REACT_EVENT_HANDLING_OPTIONS,
		"onfsbtargetupdate": CONSTANTS.REACT_EVENT_HANDLING_OPTIONS,
		"onfsbtargetdelete": CONSTANTS.REACT_EVENT_HANDLING_OPTIONS,
		"onfsbtargetretrieve": CONSTANTS.REACT_EVENT_HANDLING_OPTIONS
}

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
		mode: string;
}

interface State extends IState {
		enabled: boolean;
		visible: boolean;
}

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
		mode: 'coding'
});

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
		enabled: false,
		visible: false
});

class BackEndEventBinder extends Base<Props, State> {
    protected static defaultProps: Props = ExtendedDefaultProps;
    
    constructor(props) {
    		super(props);
    }
    
    public update(properties: any) {
        this.refs.picker.update(properties);
      
        if (!super.update(properties)) return;
        
        let option: any = this.state.attributeValues[this.props.watchingAttributeNames[0]];
        option = option && JSON.parse(option) || {};
        
        this.setState({
        	enabled: (option.event === true)
        });
        
        if (this.refs.dropdown && this.state.visible) this.refs.dropdown.updateHeight();
    }
    
    private getState() {
        let value = this.state.attributeValues[this.props.watchingAttributeNames[0]];
        if (value) value = JSON.parse(value);
        else value = {};
        
        return (value.event == true);
    }
    
    private dropDownOnVisibleChanged(visible: boolean, tag: any) {
    		this.state.visible = visible;
    }
    
    render() {
        return (
            <div className="btn-group btn-group-sm">
                <a className={"btn text-center p-0 mr-1 mb-1" + ((this.getState()) ? " btn-primary" : " btn-light")} style={{fontSize: '12px', color: (this.getState()) ? "#ffffff" : ""}}>
                	{(() => {
              			return (
	                		<FullStackBlend.Controls.DropDownControl ref="dropdown" representing={'<div class="px-2 py-1">' + this.props.watchingAttributeNames[0].replace(/onfsb(source|target)?/, '') + "</div>"} offsetX={-8} offsetY={7} onVisibleChanged={this.dropDownOnVisibleChanged.bind(this)}>
                        <div className="section-container" style={{width: '225px'}}>
		                        <div className="section-title">Customize Binding</div>
		                        <div className="section-subtitle">Binding</div>
		                        <div className="section-body"><FullStackBlend.Components.RadioButtonPicker ref="picker" watchingAttributeNames={[this.props.watchingAttributeNames[0]]} options={[[this.props.watchingAttributeNames[0], '{"event": true}', ["fa-power-off", "enable"]]]}/></div>
		                    </div>
	                    </FullStackBlend.Controls.DropDownControl>
              			)
                	})()}
                </a>
            </div>
        )
    }
}

DeclarationHelper.declare('Components.BackEndEventBinder', BackEndEventBinder);

export {ExtendedDefaultProps, ExtendedDefaultState, BackEndEventBinder};