import { CodeHelper } from '../../../helpers/CodeHelper';
import { HTMLHelper } from '../../../helpers/HTMLHelper';
import { EventHelper } from '../../../helpers/EventHelper';
import { Point, MathHelper } from '../../../helpers/MathHelper';
import { IProps, IState, DefaultState, DefaultProps, Base } from '../Base';
import { FullStackBlend, DeclarationHelper } from '../../../helpers/DeclarationHelper';
import { ITreeNode, InsertDirection } from '../../controls/TreeNode';
import '../../controls/Tree';
import { SECOND_SPAN_SIZE, MAXIMUM_OF_SECONDS } from '../../../Constants';

declare let React : any;
declare let ReactDOM : any;
declare let perform : any;

interface Props extends IProps {
  keyframe : string;
  time : number;
  tag : any;
  selected : boolean;
  transition : boolean;
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
  protected state : State = {};
  protected static defaultProps : Props = ExtendedDefaultProps;
  private mouseUpDelegate : any = null;
  private mouseMoveDelegate : any = null;

  constructor(props) {
    super(props);
    Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));

    this.mouseUpDelegate = this.mouseUp.bind(this);
    this.mouseMoveDelegate = this.mouseMove.bind(this);
  }

  private originalMousePos : Point = {
    x: 0,
    y: 0
  };
  private originalElementPos : Point = {
    x: 0,
    y: 0
  };
  private originalElement : HTMLElement = null;

  private isMouseMoveReachedThreshold : boolean = false;

  public update(properties : any) {
    if (!super.update(properties)) return;
  }

  private installEventHandlers() {
    document.body.addEventListener('mouseup', this.mouseUpDelegate, false);
    document.body.addEventListener('mousemove', this.mouseMoveDelegate, false);
    document.getElementById('area').contentWindow.document.body.addEventListener('mouseup', this.mouseUpDelegate, false);
    document.getElementById('area').contentWindow.document.body.addEventListener('mousemove', this.mouseMoveDelegate, false);
  }
  private uninstallEventHandlers() {
    document.body.removeEventListener('mouseup', this.mouseUpDelegate, false);
    document.body.removeEventListener('mousemove', this.mouseMoveDelegate, false);
    document.getElementById('area').contentWindow.document.body.removeEventListener('mouseup', this.mouseUpDelegate, false);
    document.getElementById('area').contentWindow.document.body.removeEventListener('mousemove', this.mouseMoveDelegate, false);
  }

  private mouseClick(event) {
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
        value: this.props.keyframe
      }],
      link: link
    });

    document.activeElement && document.activeElement.blur();

    return EventHelper.cancel(event);
  }
  private mouseDown(event) {
    let originalElement = ReactDOM.findDOMNode(this.refs.container);
    this.originalElement = originalElement;
    let currentWindow = originalElement.ownerDocument.defaultView || originalElement.ownerDocument.parentWindow;

    let mousePosition = HTMLHelper.getOriginalPosition(EventHelper.getMousePosition(event), currentWindow);

    this.originalMousePos.x = mousePosition[0];
    this.originalMousePos.y = mousePosition[1];

    this.originalElementPos.x = parseFloat(originalElement.style.left);
    this.originalElementPos.y = 0;

    this.installEventHandlers();

    return EventHelper.cancel(event);
  }
  private mouseMove(event) {
    let originalElement = EventHelper.getCurrentElement(event);
    let currentWindow = originalElement.ownerDocument.defaultView || originalElement.ownerDocument.parentWindow;

    let mousePosition = HTMLHelper.getOriginalPosition(EventHelper.getMousePosition(event), currentWindow);
    let mousePositionInPoint = { x: mousePosition[0], y: mousePosition[1] };

    if (!this.isMouseMoveReachedThreshold &&
      Math.abs(mousePositionInPoint.x - this.originalMousePos.x) < 5 &&
      Math.abs(mousePositionInPoint.y - this.originalMousePos.y) < 5) {
      return;
    }

    if (!this.isMouseMoveReachedThreshold) {
      this.isMouseMoveReachedThreshold = true;
    }

    if (this.isMouseMoveReachedThreshold) {
      this.moveDraggingContent(mousePositionInPoint);
    }
  }
  private mouseUp(event) {
    this.uninstallEventHandlers();

    if (this.isMouseMoveReachedThreshold) {
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
          value: this.props.keyframe
        }],
        link: link
      });
      perform('update', {
        styles: [{
          name: '-fsb-animation-keyframe-time',
          value: parseFloat(this.originalElement.style.left) / SECOND_SPAN_SIZE
        }],
        link: link
      });
    }
    this.isMouseMoveReachedThreshold = false;

    return EventHelper.cancel(event);
  }

  private moveDraggingContent(mousePosition : Point) {
    let diffX = mousePosition.x - this.originalMousePos.x;
    let diffY = mousePosition.y - this.originalMousePos.y;

    this.originalElement.style.left = MathHelper.clamp(this.originalElementPos.x + diffX, 0, MAXIMUM_OF_SECONDS * SECOND_SPAN_SIZE) + 'px';
  }

  render() {
    return (
      <div ref="container" className={"keyframe-container" + (this.props.selected ? ' selected' : '') + (this.props.transition ? ' with-transition' : '')}
        style={{ left: (this.props.time * SECOND_SPAN_SIZE) + 'px' }} onClick={this.mouseClick.bind(this)} onMouseDown={this.mouseDown.bind(this)}></div>
    );
  }
}

DeclarationHelper.declare('Components.Keyframe', Keyframe);

export { Props, State, Keyframe };