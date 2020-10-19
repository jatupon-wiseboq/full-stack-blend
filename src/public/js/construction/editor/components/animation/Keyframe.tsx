import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {HTMLHelper} from '../../../helpers/HTMLHelper.js';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {ITreeNode, InsertDirection} from '../../controls/TreeNode.js';
import '../../controls/Tree.js';
import {SECOND_SPAN_SIZE} from '../../../Constants.js';

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

class Keyframe extends Base<Props, State> {
  protected state: State = {};
  protected static defaultProps: Props = ExtendedDefaultProps;
  
  constructor(props) {
    super(props);
    Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
  }
  
  public update(properties: any) {
    if (!super.update(properties)) return;
  }
  
  render() {
    return (
    	<div ref="container" className="keyframe-container" style={{left: (1.0 * SECOND_SPAN_SIZE - 10) + 'px'}}></div>
    );
  }
}

DeclarationHelper.declare('Components.Keyframe', Keyframe);

export {Props, State, Keyframe};