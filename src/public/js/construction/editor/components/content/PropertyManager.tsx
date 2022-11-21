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
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
});

class PropertyManager extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;
    
    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    render() {
    	const nodes = [{
    		id: 'property-localization',
			  name: 'Localization',
			  nodes: []
    	}, {
    		id: 'property-settings',
			  name: 'Settings',
			  nodes: []
    	}];
    	
      return (
      	<div ref="container" className="property-manager">
      		<FullStackBlend.Controls.Tree enableDragging={false} nodes={nodes} />
      	</div>
      );
    }
}

DeclarationHelper.declare('Components.PropertyManager', PropertyManager);

export {Props, State, PropertyManager};