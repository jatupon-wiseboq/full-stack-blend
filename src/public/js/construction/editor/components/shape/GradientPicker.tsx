import {TextHelper} from '../../../helpers/TextHelper.js';
import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {EventHelper} from '../../../helpers/EventHelper.js';
import {HTMLHelper} from '../../../helpers/HTMLHelper.js';
import {Point, MathHelper} from '../../../helpers/MathHelper.js';
import {IProps, IState, DefaultProps, DefaultState, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../../controls/Tree.js';
import '../../controls/Textbox.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
    onSelectionChange(color: String);
    onValueChange(color: String);
    value: String;
}

interface State extends IState {
    pickers: [{position: Number, color: String}],
    draggingIndex: number,
    degree: number
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
    pickers: [
        {position: 0, color: 'rgba(0, 0, 0, 1.0)'},
        {position: 100, color: 'rgba(0, 0, 0, 1.0)'}
    ],
    draggingIndex: -1,
    degree: 90
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
        let recentGUID = this.state.attributeValues[this.props.watchingAttributeNames[0]];
        
        if (!super.update(properties)) return;
        
        if (this.state.styleValues[this.props.watchingStyleNames[1]] === null) {
            this.deselect();
        }
        if (recentGUID != this.state.attributeValues[this.props.watchingAttributeNames[0]]) {
            let backgroundStyleValue = this.state.styleValues[this.props.watchingStyleNames[0]];
            if (backgroundStyleValue) {
                let match = backgroundStyleValue.match(/(radial|linear)-gradient\(([0-9]+deg, )?(.+)\)$/);
                if (match) {
                    this.deselect()
                    this.state.pickers = [];
                    
                    let splited = match[3].split('%, ');
                    for (let token of splited) {
                        let lastIndex = token.lastIndexOf(' ');
                        let color = token.substring(0, lastIndex);
                        let percent = token.substring(lastIndex + 1, token.length);
                        
                        this.state.pickers.push({
                            position: parseFloat(percent),
                            color: color
                        });
                    }
                    
                    this.forceUpdate();
                }
            }
        }
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
        
        if (this.props.onSelectionChange) this.props.onSelectionChange(this.state.pickers[this.state.draggingIndex].color);
        
        return EventHelper.cancel(event);
    }
    
    private documentOnMouseMove(event: HTMLEvent) {
        let mousePosition = EventHelper.getMousePosition(event);
        
        let percent = (this.originalElementPos.x + mousePosition[0] - this.originalMousePos.x + 5.0) / this.containerWidth;
        percent = MathHelper.clamp(percent, 0.0, 1.0) * 100.0;
        
        this.state.pickers[this.state.draggingIndex].position = percent;
        this.forceUpdate();
        
        if (this.props.onValueChange) this.props.onValueChange();
        
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
            this.deselect();
            this.forceUpdate();
        }
    }
    
    public setCurrentPickerColor(color: string) {
        if (this.state.draggingIndex == -1) return;
        
        this.state.pickers[this.state.draggingIndex].color = color;
        this.forceUpdate();
    }
    
    public generateCSSGradientBackgroundValue(radial: boolean=false, rotate: boolean=false) {
        let pickers = CodeHelper.clone(this.state.pickers);
        pickers = pickers.sort((a, b) => {
          return (a.position > b.position) ? 1 : -1;
        });
        return `${radial ? 'radial' : 'linear'}-gradient(${radial ? '' : `${(rotate) ? this.state.degree : 90}deg, `}${pickers.map(picker => picker.color + ' ' + picker.position + '%').join(', ')})`;
    }
    
    protected rotationPickerOnUpdate(value: string) {
        this.state.degree = (value == '') ? 90 : parseInt(value);
        this.forceUpdate();
        if (this.props.onValueChange) this.props.onValueChange();
    }
    
    public deselect() {
        this.setState({
            draggingIndex: -1
        });
    }
    
    render() {
      let match = this.props.value && this.props.value.match(/([0-9]+)deg/) || null
      let rotationPicker = (<FullStackBlend.Controls.Textbox placeholder="rotation" value={match && match[1] || '90'} preRegExp="([1-3]|[1-2][0-9]|[1-2][0-9][0-9]|3[0-5]|3[0-5][0-9]|360|[0-9]|[1-9][0-9])?" postRegExp="[0-9]*" onUpdate={this.rotationPickerOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>);
      
      return (
        pug `
          .gradient-picker-container
            .gradient-picker(ref="container" onClick=this.gradientPickerOnClick.bind(this) style={background: this.generateCSSGradientBackgroundValue()})
              each picker, index in this.state.pickers
                .picker(className=((index == this.state.draggingIndex) ? 'active' : ''), key='picker-' + index, style={left: picker.position + '%'}, onMouseDown=this.pickerOnMouseDown.bind(this))
                  .picker-inner-body(style={borderColor: picker.color})
            .gradient-rotation-input
              = rotationPicker
            .gradient-rotation-unit
              | deg
        `
      )
    }
}

DeclarationHelper.declare('Components.GradientPicker', GradientPicker);

export {Props, State, GradientPicker};