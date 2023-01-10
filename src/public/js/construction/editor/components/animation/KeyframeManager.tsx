import { CodeHelper } from '../../../helpers/CodeHelper';
import { HTMLHelper } from '../../../helpers/HTMLHelper';
import { EventHelper } from '../../../helpers/EventHelper';
import { RandomHelper } from '../../../helpers/RandomHelper';
import { IProps, IState, DefaultState, DefaultProps, Base } from '../Base';
import { FullStackBlend, DeclarationHelper } from '../../../helpers/DeclarationHelper';
import { ITreeNode, InsertDirection } from '../../controls/TreeNode';
import '../../controls/Tree';
import './Keyframe';
import { SECOND_SPAN_SIZE, MAXIMUM_OF_SECONDS } from '../../../Constants';

declare let React : any;
declare let ReactDOM : any;
declare let perform : any;

interface Props extends IProps {
  tag : any;
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
  protected state : State = {};
  protected static defaultProps : Props = ExtendedDefaultProps;

  constructor(props) {
    super(props);
    Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
  }

  public update(properties : any) {
    if (!super.update(properties)) return;
  }

  private onClick(event : any) {
    let link = Math.random().toString();

    perform('select[cursor]', {
      content: this.props.tag.id,
      link: link
    });
    perform('update', {
      extensions: [{
        name: 'editingAnimationID',
        value: this.props.tag.tag.key
      }, {
        name: 'editingKeyframeID',
        value: RandomHelper.generateGUID()
      }],
      link: link
    });

    let element = EventHelper.getCurrentElement(event);
    let position = HTMLHelper.getPosition(element);
    let mouse = EventHelper.getMousePosition(event);

    perform('update', {
      styles: [{
        name: '-fsb-animation-keyframe-time',
        value: (mouse[0] - position[0]) / SECOND_SPAN_SIZE
      }],
      link: link
    });
  }

  render() {
    if (this.props.tag.tag.root) return (<div />);
    else {
      return (
        <div ref="container" className="keyframe-manager-container" onClick={this.onClick.bind(this)} style={{ width: MAXIMUM_OF_SECONDS * SECOND_SPAN_SIZE + 'px' }}>
          <div style={{ position: "relative", left: "-7.5px", opacity: (this.props.tag.tag.display) ? 1.0 : 0.65 }}>
            {this.props.tag.tag.keyframes.map((value, index) => {
              return (
                <FullStackBlend.Components.Keyframe key={'keyframe-' + value.id}
                  keyframe={value.id} tag={this.props.tag} transition={value.containingTransition}
                  selected={value.id == this.state.extensionValues[this.props.watchingExtensionNames[0]]}
                  time={value.time}></FullStackBlend.Components.Keyframe>
              )
            })}
          </div>
        </div>
      );
    }
  }
}

DeclarationHelper.declare('Components.KeyframeManager', KeyframeManager);

export { Props, State, KeyframeManager };