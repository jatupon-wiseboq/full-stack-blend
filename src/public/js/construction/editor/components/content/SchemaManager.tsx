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
  watchingExtensionNames: ['schemataTreeNodes']
});

class SchemaManager extends Base<Props, State> {
  protected state: State = {};
  protected static defaultProps: Props = ExtendedDefaultProps;

  constructor(props) {
    super(props);
    Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
  }

  render() {
    return (
      <div ref="container" className="schema-manager">
        <FullStackBlend.Controls.Tree enableDragging={false} nodes={this.state.extensionValues[this.props.watchingExtensionNames[0]]} />
      </div>
    );
  }
}

DeclarationHelper.declare('Components.SchemaManager', SchemaManager);

export {Props, State, SchemaManager};