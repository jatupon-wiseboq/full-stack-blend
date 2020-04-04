import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {EventHelper} from '../../helpers/EventHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
    representing: string;
    onVisibleChanged(visible: boolean);
    autohide: boolean;
}

interface State extends IState {
}

class DropDownControl extends React.Component<Props, State> {
    static defaultProps: Props = {
        options: [],
        autohide: true
    }
    
    private documentOnClickDelegate: Function = null;
    
    constructor() {
        super();
        
        this.documentOnClickDelegate = this.documentOnClick.bind(this);
    }
    
    componentDidMount() {
        let $this = this;
        let button = ReactDOM.findDOMNode(this.refs.button);
        let dropdown = ReactDOM.findDOMNode(this.refs.dropdown);
        
        button.addEventListener('click', (event) => {
            if (this.props.autohide) {
                window.document.body.click();
            }
            
            let position = HTMLHelper.getPosition(button);
            let size = HTMLHelper.getSize(button);
            let buttonWidth = size[0];
            
            dropdown.className = 'fsb-dropdown-menu dropdown-menu show measure';
            window.document.body.appendChild(dropdown);
            
            let dropDownMinWidth = dropdown.clientWidth + 1;
            let windowWidth = window.innerWidth;
            
            dropdown.className = 'fsb-dropdown-menu dropdown-menu show';
            
            dropdown.style.position = 'fixed';
            if (position[0] + Math.max(dropDownMinWidth, buttonWidth) < windowWidth) {
                dropdown.style.left = (position[0]) + 'px';
            } else {
                dropdown.style.left = (windowWidth - Math.max(dropDownMinWidth, buttonWidth)) + 'px';
            }
            dropdown.style.top = (position[1] + size[1]) + 'px';
            dropdown.style.width = Math.max(dropDownMinWidth, buttonWidth) + 'px';
            dropdown.style.maxHeight = (window.innerHeight - position[1] - size[1] - 5) + 'px';
            
            window.document.body.addEventListener('click', this.documentOnClickDelegate, false);
            
            if (this.props.onVisibleChanged) {
                this.props.onVisibleChanged(true);
            }
            
            return EventHelper.cancel(event);
        });
    }
    
    componentWillUnmount() {
        window.document.body.removeEventListener('click', this.documentOnClickDelegate, false);
        
        if (this.props.onVisibleChanged) {
            this.props.onVisibleChanged(false);
        }
    }
    
    public hide() {
        let group = ReactDOM.findDOMNode(this.refs.group);
        let dropdown = ReactDOM.findDOMNode(this.refs.dropdown);
        
        dropdown.style.position = '';
        dropdown.style.left = '';
        dropdown.style.top = '';
        dropdown.style.width = 'auto';
        dropdown.style.maxHeight = '';
        
        dropdown.className = 'fsb-dropdown-menu dropdown-menu';
        group.appendChild(dropdown);
        
        window.document.body.removeEventListener('click', this.documentOnClickDelegate, false);
        
        if (this.props.onVisibleChanged) {
            this.props.onVisibleChanged(false);
        }
    }
    
    private documentOnClick(event) {
        if (EventHelper.checkIfDenyForHandle(event)) return;
        
        this.hide();
    }
    
    render() {
      return (
        pug `
          .fsb-dropdown-container(ref="group", internal-fsb-event-no-propagate="click")
            .fsb-dropdown-button(ref="button", aria-haspopup="true", aria-expanded="false")
              if (this.props.representing == null)
                span &nbsp;
              else
                span(dangerouslySetInnerHTML={__html: this.props.representing})
            .fsb-dropdown-menu.dropdown-menu(ref="dropdown", internal-fsb-event-no-propagate="click")
              = this.props.children
        `
      )
    }
}

DeclarationHelper.declare('Controls.DropDownControl', DropDownControl);

export {Props, State, DropDownControl};