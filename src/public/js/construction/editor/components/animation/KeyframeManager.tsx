import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {HTMLHelper} from '../../../helpers/HTMLHelper.js';
import {EventHelper} from '../../../helpers/EventHelper.js';
import {RandomHelper} from '../../../helpers/RandomHelper.js';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {ITreeNode, InsertDirection} from '../../controls/TreeNode.js';
import '../../controls/Tree.js';
import './Keyframe.js';
import {SECOND_SPAN_SIZE} from '../../../Constants.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
	tag: any;
}

interface State extends IState {
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
	watchingExtensionNames: ['editingKeyframeID']
});

class KeyframeManager extends Base<Props, State> {
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
  			name: 'editingAnimationID',
  			value: this.props.tag.tag.key
  		}, {
  			name: 'editingKeyframeID',
  			value: RandomHelper.generateGUID()
  		}]
  	});
  	
  	let element = EventHelper.getCurrentElement(event);
  	let position = HTMLHelper.getPosition(element);
  	let mouse = EventHelper.getMousePosition(event);
  	
  	perform('update', {
  		styles: [{
  			name: '-fsb-animation-keyframe-time',
  			value: (mouse[0] - position[0]) / SECOND_SPAN_SIZE
  		}]
  	});
  }
  
  render() {
  	if (this.props.tag.tag.root) return (<div />);
  	else {
	    return (
	    	<div ref="container" className="keyframe-manager-container" onClick={this.onClick.bind(this)}>
	    		{this.props.tag.tag.keyframes.map((value, index) => {
  					return (
  						<FullStackBlend.Components.Keyframe key={'keyframe-' + value.id}
  							keyframe={value.id} tag={this.props.tag}
  							selected={value.id == this.state.extensionValues[this.props.watchingExtensionNames[0]]}
  							time={value.time}></FullStackBlend.Components.Keyframe>
  					)
  				})}
	    	</div>
	    );
	  }
  }
}

DeclarationHelper.declare('Components.KeyframeManager', KeyframeManager);

export {Props, State, KeyframeManager};