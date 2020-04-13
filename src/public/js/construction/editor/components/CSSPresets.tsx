import {TextHelper} from '../../helpers/TextHelper.js';
import {CodeHelper} from '../../helpers/CodeHelper.js';
import {IProps, IState, DefaultProps, DefaultState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {ITreeNode} from './TreeNode.js';
import '../controls/Tree.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
    revision: number
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
    revision: -1
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
    watchingAttributeNames: ['internal-fsb-presets', 'internal-fsb-reusable-preset-name', 'internal-fsb-guid']
});

class CSSPresets extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;

    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    public update(properties: any) {
        if (!super.update(properties) && properties.stylesheetDefinitionRevision == this.state.revision) return;
        
        this.state.revision = properties.stylesheetDefinitionRevision;
        
        let nodes: [ITreeNode] = [];
        for (let key of properties.stylesheetDefinitionKeys) {
            nodes.push({
                name: key,
                disabled: (key === this.state.attributeValues['internal-fsb-reusable-preset-name']),
                selected: (key === this.state.attributeValues['internal-fsb-reusable-preset-name']) ||
                          (!!this.state.attributeValues['internal-fsb-presets'] &&
                          (this.state.attributeValues['internal-fsb-presets'].indexOf('+' + key + '+') != -1)),
                nodes: []
            });
        }
        this.state.nodes = nodes;
        
        this.forceUpdate();
    }
    
    protected onUpdate(node: ITreeNode) {
        console.log('onUpdate', node);
    
        let presets = [];
        for (let node of this.state.nodes) {
            if (node.selected) {
                presets.push(node.name);
            }
        }
    
        perform('update', {
            attributes: [{
                name: 'internal-fsb-presets',
                value: '+' + presets.join('+') + '+'
            }]
        });
    }
    
    render() {
      return (
        <FullStackBlend.Controls.Tree nodes={this.state.nodes} onUpdate={this.onUpdate.bind(this)} />
      )
    }
}

DeclarationHelper.declare('Components.CSSPresets', CSSPresets);

export {Props, State, CSSPresets};