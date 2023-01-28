import {TextHelper} from '../../../helpers/TextHelper';
import {CodeHelper} from '../../../helpers/CodeHelper';
import {IProps, IState, DefaultProps, DefaultState, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import {ITreeNode} from './../TreeNode';
import '../../controls/Tree';
import {LIBRARIES} from '../../../Constants';

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
        insertable: true,
        dragable: true,
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