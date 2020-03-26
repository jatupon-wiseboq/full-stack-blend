import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {EventHelper} from '../../helpers/EventHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
    representing: string;
    onVisibleChanged(visible: boolean);
}

interface State extends IState {
}

class DropDownControl extends React.Component<Props, State> {
    static defaultProps: Props = {
        options: []
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
            window.document.body.click();
            
            let position = HTMLHelper.getPosition(button);
            let size = HTMLHelper.getSize(button);
            let dropDownWidth = (this.props.dropDownWidth != null) ? this.props.dropDownWidth : size[0];
            let windowWidth = window.innerWidth;
            
            dropdown.style.position = 'fixed';
            if (position[0] + dropDownWidth < windowWidth) {
                dropdown.style.left = (position[0]) + 'px';
            } else {
                dropdown.style.left = (windowWidth - dropDownWidth) + 'px';
            }
            dropdown.style.top = (position[1] + size[1]) + 'px';
            dropdown.style.width = dropDownWidth + 'px';
            dropdown.style.maxHeight = (window.innerHeight - position[1] - size[1] - 5) + 'px';
            
            dropdown.className = 'fsb-dropdown-menu dropdown-menu show';
            window.document.body.appendChild(dropdown);
            
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
        dropdown.style.width = '';
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