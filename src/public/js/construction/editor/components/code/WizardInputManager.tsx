import {TextHelper} from '../../../helpers/TextHelper';
import {CodeHelper} from '../../../helpers/CodeHelper';
import {IProps, IState, DefaultProps, DefaultState, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import {ITreeNode} from './../TreeNode';
import '../../controls/Tree';

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
    watchingAttributeNames: ['internal-fsb-data-controls'],
    watchingExtensionNames: ['elementTreeNodesIncludeInheriting']
});

class WizardInputManager extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;

    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        let nodes = CodeHelper.clone(this.state.extensionValues[this.props.watchingExtensionNames[0]]);
        nodes = this.recursiveWalkExtractingNodes(nodes || []);
        
        let guids = (this.state.attributeValues[this.props.watchingAttributeNames[0]] || '').split(' ');
        for (let node of nodes) {
            node.selected = (guids.indexOf(node.tag.guid) != -1);
        }
        
        this.state.nodes = nodes;
        
        this.forceUpdate();
    }
    
    private recursiveWalkExtractingNodes(nodes: [ITreeNode], output: [ITreeNode]=[]) {
        for (let node of nodes) {
            if (['Textbox', 'Select', 'Radio', 'Checkbox', 'File', 'Hidden'].indexOf(node.tag.class) != -1) {
                output.push(node);
            }
            this.recursiveWalkExtractingNodes(node.nodes, output);
        }
        return output;
    }
    
    protected onUpdate(node: ITreeNode) {
        let guids = (this.state.attributeValues[this.props.watchingAttributeNames[0]] || '').split(' ');
        
        if (node.selected) {
            let index = guids.indexOf(node.tag.guid);
            if (index == -1) {
                guids.push(node.tag.guid);
            }
        } else {
            let index = guids.indexOf(node.tag.guid);
            if (index != -1) {
                guids.splice(index, 1);
            }
        }
       	
       	guids = guids.filter(guid => this.state.nodes.some(node => node.tag.guid == guid));
        
        guids.sort();
        
        perform('update', {
            attributes: [{
                name: this.props.watchingAttributeNames[0],
                value: guids.join(' ')
            }]
        });
    }
    
    render() {
      return (
        <FullStackBlend.Controls.Tree nodes={this.state.nodes} onUpdate={this.onUpdate.bind(this)} />
      )
    }
}

DeclarationHelper.declare('Components.WizardInputManager', WizardInputManager);

export {Props, State, WizardInputManager};