import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {HTMLHelper} from '../../../helpers/HTMLHelper.js';
import {EventHelper} from '../../../helpers/EventHelper.js';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {ITreeNode, InsertDirection} from '../../controls/TreeNode.js';
import '../../controls/Tree.js';
import {SECOND_SPAN_SIZE} from '../../../Constants.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
	keyframe: string;
	time: number;
	tag: any;
	selected: boolean;
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
  
  private onClick(event: any) {
  	perform('select[cursor]', this.props.tag.id);
  	perform('update', {
  		extensions: [{
  			name: 'editingKeyframeID',
  			value: this.props.keyframe
  		}]
  	});
  	
  	return EventHelper.cancel(event);
  }
  
  render() {
    return (
    	<div ref="container" className={"keyframe-container " + (this.props.selected ? 'selected' : '')}
    		style={{left: (this.props.time * SECOND_SPAN_SIZE - 7.5) + 'px'}} onClick={this.onClick.bind(this)}></div>
    );
  }
}

DeclarationHelper.declare('Components.Keyframe', Keyframe);

export {Props, State, Keyframe};