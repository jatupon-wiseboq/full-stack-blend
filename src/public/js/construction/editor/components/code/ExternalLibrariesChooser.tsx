import {TextHelper} from '../../../helpers/TextHelper.js';
import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {IProps, IState, DefaultProps, DefaultState, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {ITreeNode} from './../TreeNode.js';
import '../../controls/Tree.js';
import {LIBRARIES} from '../../../Constants.js';

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
    watchingExtensionNames: ["externalLibraries"]
});

class ExternalLibrariesChooser extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;

    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        let values: string[] = (this.state.extensionValues[this.props.watchingExtensionNames[0]] || '').split(' ');
        let nodes: [ITreeNode] = [];
        for (let library of LIBRARIES) {
            nodes.push({
            		id: library.id,
                name: library.name + ' ' + library.version,
                selectable: true,
                disabled: library.prerequisite,
                selected: values.indexOf(library.id) != -1,
                nodes: []
            });
        }
        
        this.state.nodes = nodes;
        this.forceUpdate();
    }
    
    protected onUpdate(node: ITreeNode) {
        let presets = [];
        for (let node of this.state.nodes) {
            if (node.selected) {
                presets.push(node.id);
            }
        }
        presets.sort();
        
        perform('update', {
        		extensions: [{
        				name: this.props.watchingExtensionNames[0],
        				value: presets.join(' ')
        		}]
        });
    }
    
    render() {
      return (
        <FullStackBlend.Controls.Tree nodes={this.state.nodes} onUpdate={this.onUpdate.bind(this)} />
      )
    }
}

DeclarationHelper.declare('Components.ExternalLibrariesChooser', ExternalLibrariesChooser);

export {Props, State, ExternalLibrariesChooser};