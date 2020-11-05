import {TextHelper} from '../../../helpers/TextHelper.js';
import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {IProps, IState, DefaultProps, DefaultState, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {ITreeNode} from '../../controls/TreeNode.js';
import '../../controls/Tree.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
    nodes: [ITreeNode]
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
    nodes: []
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
    watchingExtensionNames: ['animationDefinitionRevision']
});

class AnimationPicker extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;

    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        let nodes: [ITreeNode] = [];
        let dict = JSON.parse(this.state.attributeValues[this.props.watchingAttributeNames[0]] || '{}');
        let items = dict[this.props.keyName] || [];
        
        if (properties.extensions && properties.extensions.animationDefinitionKeys) {
		        for (let info of properties.extensions.animationDefinitionKeys) {
		            nodes.push({
		            		id: info.id,
		                name: info.name || 'Untitled',
		                selectable: true,
		                disabled: false,
		                selected: (items.indexOf(info.id) != -1),
		                nodes: []
		            });
		        }
      	}
        
        this.state.nodes = nodes;
        
        this.forceUpdate();
    }
    
    protected onUpdate(node: ITreeNode) {
        let items = [];
        for (let node of this.state.nodes) {
            if (node.selected) {
                items.push(node.id);
            }
        }
        items.sort();
        
        let dict = JSON.parse(this.state.attributeValues[this.props.watchingAttributeNames[0]] || '{}');
        dict[this.props.keyName] = items;
        
        perform('update', {
        		attributes: [{
        				name: this.props.watchingAttributeNames[0],
        				value: JSON.stringify(dict)
        		}]
        });
    }
    
    render() {
      return (
        <FullStackBlend.Controls.Tree nodes={this.state.nodes} onUpdate={this.onUpdate.bind(this)} />
      )
    }
}

DeclarationHelper.declare('Components.AnimationPicker', AnimationPicker);

export {Props, State, AnimationPicker};