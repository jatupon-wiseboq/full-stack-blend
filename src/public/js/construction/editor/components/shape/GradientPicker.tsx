import {TextHelper} from '../../../helpers/TextHelper.js';
import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {EventHelper} from '../../../helpers/EventHelper.js';
import {HTMLHelper} from '../../../helpers/HTMLHelper.js';
import {Point, MathHelper} from '../../../helpers/MathHelper.js';
import {IProps, IState, DefaultProps, DefaultState, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../../controls/Tree.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
    onChangeSelection(color: String);
}

interface State extends IState {
    pickers: [{position: Number, color: String}],
    draggingIndex: number
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
    pickers: [
        {position: 0, color: 'rgba(0, 0, 0, 1.0)'},
        {position: 100, color: 'rgba(0, 0, 0, 1.0)'}
    ],
    draggingIndex: -1
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
});

class GradientPicker extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;
    
    private documentOnMouseMoveDelegate: any;
    private documentOnMouseUpDelegate: any;
    private documentOnKeyDownDelegate: any;
    
    private originalMousePos: Point = {
  			x: 0,
  			y: 0
		};
		private originalElementPos: Point = {
  			x: 0,
  			y: 0
		};
		private containerWidth: number = 0;
    
    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
        
        this.documentOnMouseMoveDelegate = this.documentOnMouseMove.bind(this);
        this.documentOnMouseUpDelegate = this.documentOnMouseUp.bind(this);
        this.documentOnKeyDownDelegate = this.documentOnKeyDown.bind(this);
        
        document.body.addEventListener('keydown', this.documentOnKeyDownDelegate, false);
    }
    
    componentWillUnmount() {
        document.body.removeEventListener('keydown', this.documentOnKeyDownDelegate, false);
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
    }
    
    protected gradientPickerOnClick(event: HTMLEvent) {
        if (EventHelper.checkIfDenyForHandle(event)) return;
        
        let container = ReactDOM.findDOMNode(this.refs.container);
        let containerPosition = HTMLHelper.getPosition(container);
        let containerSize = HTMLHelper.getSize(container);
        let mousePosition = EventHelper.getMousePosition(event);
        
        let percent = (mousePosition[0] - containerPosition[0]) * 100.0 / containerSize[0];
        
        this.state.pickers.push({
            position: percent,
            color: 'rgba(0, 0, 0, 1.0)'
        });
        this.state.draggingIndex = this.state.pickers.length - 1;
        this.forceUpdate();
    }
    
    private pickerOnMouseDown(event: HTMLEvent) {
        document.body.addEventListener('mousemove', this.documentOnMouseMoveDelegate, false);
        document.body.addEventListener('mouseup', this.documentOnMouseUpDelegate, false);
        document.body.addEventListener('mouseleave', this.documentOnMouseUpDelegate, false);
        
        let currentElement = EventHelper.getCurrentElement(event);
        this.state.draggingIndex = [...currentElement.parentNode.children].indexOf(currentElement);
        this.forceUpdate();
        
        let container = ReactDOM.findDOMNode(this.refs.container);
        let containerPosition = HTMLHelper.getPosition(container);
        let containerSize = HTMLHelper.getSize(container);
        let mousePosition = EventHelper.getMousePosition(event);
        let elementPosition = HTMLHelper.getPosition(currentElement);
        
        this.originalMousePos.x = mousePosition[0];
        this.originalMousePos.y = mousePosition[1];
        this.originalElementPos.x = elementPosition[0] - containerPosition[0];
        this.originalElementPos.y = elementPosition[1] - containerPosition[1];
        this.containerWidth = containerSize[0];
        
        if (this.props.onChangeSelection) this.props.onChangeSelection(this.state.pickers[this.state.draggingIndex].color);
        
        return EventHelper.cancel(event);
    }
    
    private documentOnMouseMove(event: HTMLEvent) {
        let mousePosition = EventHelper.getMousePosition(event);
        
        let percent = (this.originalElementPos.x + mousePosition[0] - this.originalMousePos.x + 5.0) / this.containerWidth;
        percent = MathHelper.clamp(percent, 0.0, 1.0) * 100.0;
        
        this.state.pickers[this.state.draggingIndex].position = percent;
        this.forceUpdate();
        
        return EventHelper.cancel(event);
    }
    
    private documentOnMouseUp(event: HTMLEvent) {
        EventHelper.setDenyForHandle('click', true);
        
        document.body.removeEventListener('mousemove', this.documentOnMouseMoveDelegate, false);
        document.body.removeEventListener('mouseup', this.documentOnMouseUpDelegate, false);
        document.body.removeEventListener('mouseleave', this.documentOnMouseUpDelegate, false);
        
        EventHelper.setDenyForHandle('click', false, 100);
        return EventHelper.cancel(event);
    }
    
    private documentOnKeyDown(event: HTMLEvent) {
        if (this.state.draggingIndex == -1) return;
        if (this.state.pickers.length <= 2) return;
        
        if (event.keyCode == 8) {
            this.state.pickers.splice(this.state.draggingIndex, 1);
            this.state.draggingIndex = -1;
            this.forceUpdate();
        }
    }
    
    public setCurrentPickerColor(color: string) {
        if (this.state.draggingIndex == -1) return;
        
        this.state.pickers[this.state.draggingIndex].color = color;
        this.forceUpdate();
    }
    
    public generateCSSGradientBackgroundValue() {
        let pickers = CodeHelper.clone(this.state.pickers);
        pickers = pickers.sort((a, b) => {
          return a.position > b.position;
        });
        return `linear-gradient(90deg, ${pickers.map(picker => picker.color + ' ' + picker.position + '%').join(', ')})`;
    }
    
    render() {
      return (
        pug `
          .gradient-picker-container
            .gradient-picker(ref="container" onClick=this.gradientPickerOnClick.bind(this) style={background: this.generateCSSGradientBackgroundValue()})
              each picker, index in this.state.pickers
                .picker(className=((index == this.state.draggingIndex) ? 'active' : ''), key='picker-' + index, style={left: picker.position + '%'}, onMouseDown=this.pickerOnMouseDown.bind(this))
                  .picker-inner-body(style={borderColor: picker.color})
        `
      )
    }
}

DeclarationHelper.declare('Components.GradientPicker', GradientPicker);

export {Props, State, GradientPicker};