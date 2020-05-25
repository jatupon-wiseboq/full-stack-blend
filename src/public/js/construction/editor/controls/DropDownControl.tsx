import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {EventHelper} from '../../helpers/EventHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
    representing: string;
    onVisibleChanged(visible: boolean, tag: any);
    autohide: boolean;
    offsetX: number;
    offsetY: number;
    width: number;
    tag: any;
}

interface State extends IState {
}

class DropDownControl extends React.Component<Props, State> {
    static defaultProps: Props = {
        options: [],
        autohide: true,
        offsetX: 0,
        offsetY: 0,
        width: 0,
        tag: null
    }
    
    private documentOnClickDelegate: Function = null;
    private maximumWidth: number = 0;
    
    constructor(props) {
        super(props);
        
        this.documentOnClickDelegate = this.documentOnClick.bind(this);
    }
    
    componentDidMount() {
        let $this = this;
        let button = ReactDOM.findDOMNode(this.refs.button);
        let dropdown = ReactDOM.findDOMNode(this.refs.dropdown);
        
        button.addEventListener('click', (event) => {
            if (dropdown.className != 'fsb-dropdown-menu dropdown-menu hide') return EventHelper.cancel(event);
        
            if (this.props.autohide) {
                window.document.body.click();
            }
            
            if (this.props.onVisibleChanged) {
                this.props.onVisibleChanged(true, this.props.tag);
            }
            
            this.measureAndPosition();
            
            // Handling Events
            //
            
            window.document.body.addEventListener('click', this.documentOnClickDelegate, false);
            
            return EventHelper.cancel(event);
        });
    }
    
    componentWillUnmount() {
        window.document.body.removeEventListener('click', this.documentOnClickDelegate, false);
        
        if (this.props.onVisibleChanged) {
            this.props.onVisibleChanged(false, this.props.tag);
        }
    }
    
    private measureAndPosition(recalculate: boolean=false) {
        let button = ReactDOM.findDOMNode(this.refs.button);
        let dropdown = ReactDOM.findDOMNode(this.refs.dropdown);
        
        // Measure Size & Position
        //       
        let position = HTMLHelper.getPosition(button);
        let size = HTMLHelper.getSize(button);
        let buttonWidth = size[0];
        
        dropdown.className = 'fsb-dropdown-menu dropdown-menu show measure';
        window.document.body.appendChild(dropdown);
        
        let dropDownClientWidth = Math.max(dropdown.clientWidth + 2, this.maximumWidth);
        dropDownClientWidth = Math.max(dropDownClientWidth, this.props.width);
        this.maximumWidth = dropDownClientWidth;
        let dropDownClientHeight = dropdown.clientHeight + 5;
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        let dropDownMaxHeight = windowHeight - position[1] - size[1] - 2;
        let overflowY = false;
        if (dropDownClientHeight > dropDownMaxHeight) {
            dropDownClientWidth += 7;
            overflowY = true;
        }
        
        // Assign Size & Position
        //
        position[0] += this.props.offsetX;
        position[1] += this.props.offsetY;
        
        if (position[0] + Math.max(dropDownClientWidth, size[0]) < windowWidth) {
            dropdown.style.left = (position[0] - 1) + 'px';
        } else {
            dropdown.style.left = (windowWidth - Math.max(dropDownClientWidth, size[0])) + 'px';
        }
        
        dropdown.style.position = 'fixed';
        dropdown.style.top = (position[1] + size[1]) + 'px';
        dropdown.style.width = Math.max(dropDownClientWidth, size[0]) + 'px';
        dropdown.style.height = Math.min(dropDownClientHeight, dropDownMaxHeight) + 'px';
        dropdown.style.overflowY = (overflowY) ? 'auto' : 'hidden';
        
        dropdown.className = 'fsb-dropdown-menu dropdown-menu hide';
        dropdown.className = 'fsb-dropdown-menu dropdown-menu show';
    }
    
    public updateHeight() {
        this.hide(false);
        this.measureAndPosition();
    }
    
    public hide(invokeEvent: boolean=true) {
        let group = ReactDOM.findDOMNode(this.refs.group);
        let dropdown = ReactDOM.findDOMNode(this.refs.dropdown);
        
        dropdown.style.position = '';
        dropdown.style.left = '';
        dropdown.style.top = '';
        dropdown.style.width = 'auto';
        dropdown.style.height = 'auto';
        dropdown.style.overflowY = '';
        
        dropdown.className = 'fsb-dropdown-menu dropdown-menu hide';
        group.appendChild(dropdown);
        
        if (invokeEvent && this.props.onVisibleChanged) {
            window.document.body.removeEventListener('click', this.documentOnClickDelegate, false);
        
            this.props.onVisibleChanged(false, this.props.tag);
        }
    }
    
    private documentOnClick(event) {
        if (EventHelper.checkIfDenyForHandle(event)) return;
        
        this.hide();
    }
    
    render() {
      return (
        pug `
          div(className=("fsb-dropdown-container" + (this.props.customClassName ? ' ' + this.props.customClassName : '')) ref="group", internal-fsb-event-no-propagate="click")
            .fsb-dropdown-button(ref="button", aria-haspopup="true", aria-expanded="false")
              if (this.props.representing == null)
                span &nbsp;
              else if (typeof this.props.representing == 'string' && this.props.representing.indexOf('ICON:') == 0)
                i(className=this.props.representing.split('ICON:')[1])
              else
                span(dangerouslySetInnerHTML={__html: this.props.representing})
            .fsb-dropdown-menu.dropdown-menu.hide(ref="dropdown", internal-fsb-event-no-propagate="click")
              = this.props.children
        `
      )
    }
}

DeclarationHelper.declare('Controls.DropDownControl', DropDownControl);

export {Props, State, DropDownControl};