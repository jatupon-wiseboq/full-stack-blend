import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {EventHelper} from '../../helpers/EventHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
    representingValue: string
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
            
            dropdown.style.position = 'fixed';
            dropdown.style.left = (position[0]) + 'px';
            dropdown.style.top = (position[1] + size[1]) + 'px';
            dropdown.style.width = 'auto';
            dropdown.style.height = 'auto';
            dropdown.style.maxHeight = (window.innerHeight - position[1] - size[1] - 5) + 'px';
            
            dropdown.className = 'fsb-dropdown-menu dropdown-menu show';
            window.document.body.appendChild(dropdown);
            
            window.document.body.addEventListener('click', this.documentOnClickDelegate, false);
            
            return EventHelper.cancel(event);
        });
        
        dropdown.addEventListener('click', (event) => {
            return EventHelper.cancel(event);
        });
    }
    
    componentWillUnmount() {
        window.document.body.removeEventListener('click', this.documentOnClickDelegate, false);
    }
    
    private documentOnClick(event) {
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
    }
    
    render() {
      return (
        pug `
          .fsb-dropdown-container(ref="group")
            .fsb-dropdown-button(ref="button", aria-haspopup="true", aria-expanded="false")
              = this.props.representingValue
            .fsb-dropdown-menu.dropdown-menu(ref="dropdown")
              = this.props.children
        `
      )
    }
}

DeclarationHelper.declare('Controls.DropDownControl', DropDownControl);

export {Props, State, DropDownControl};