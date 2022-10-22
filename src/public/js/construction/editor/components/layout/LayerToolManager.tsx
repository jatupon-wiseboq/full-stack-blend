import {CodeHelper} from '../../../helpers/CodeHelper';
import {HTMLHelper} from '../../../helpers/HTMLHelper';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import {ITreeNode, InsertDirection} from '../../controls/TreeNode';
import '../../controls/Tree';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
	height: any;
	filter: string;
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
	height: 'auto'
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
	watchingAttributeNames: ['internal-fsb-guid'],
	watchingExtensionNames: ['currentActiveLayerToolAvailable', 'currentActiveLayerHidden', 'currentActiveLayerRemovable']
});

class LayerToolManager extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;
    
    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
    }
    
    private onLayerVisibleToggled() {
    		if (!this.state.extensionValues['currentActiveLayerToolAvailable']) return;
    		
    		perform('update', {
		        extensions: [{
		            name: 'currentActiveLayerHidden',
		            value: !this.state.extensionValues['currentActiveLayerHidden']
		        }]
		    });
    }
    private onLayerRemoved() {
    		if (!this.state.extensionValues['currentActiveLayerToolAvailable']) return;
    		
    		perform('delete', this.state.attributeValues['internal-fsb-guid']);
    }
    
    render() {
      return (
      	<div style={{fontSize: '12.4px', opacity: (this.state.extensionValues['currentActiveLayerToolAvailable'] ? undefined : '0.5'), pointerEvents: (this.state.extensionValues['currentActiveLayerToolAvailable'] ? undefined : 'none')}}>
    	  	{(() => {
	    			return (
	    				<i className={(!this.state.extensionValues['currentActiveLayerHidden']) ? "fa fa-eye" : "fa fa-eye-slash"} style={{position: "absolute", left: "6px", top: "6px", color: "rgba(0, 0, 0, 0.35)", cursor: "pointer"}} onClick={this.onLayerVisibleToggled.bind(this)} />
	    			);
	    		})()}
	    		{(() => {
	    			if (this.state.extensionValues['currentActiveLayerRemovable'])
	    			return (
	    				<i className="fa fa-remove" style={{position: "absolute", left: "25px", top: "6px", color: "rgba(0, 0, 0, 0.35)", cursor: "pointer"}} onClick={this.onLayerRemoved.bind(this)} />
	    			);
	    		})()}
    		</div>
      );
    }
}

DeclarationHelper.declare('Components.LayerToolManager', LayerToolManager);

export {Props, State, LayerToolManager};