import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {EventHelper} from '../../helpers/EventHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
    options: [any];
    identity: any;
    onUpdate(identity: any, value: any);
}

interface State extends IState {
}

class DropDownList extends React.Component<Props, State> {
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
            dropdown.style.width = size[0] + 'px';
            dropdown.style.maxHeight = (window.innerHeight - position[1] - size[1] - 5) + 'px';
            
            dropdown.className = 'fsb-dropdown-menu dropdown-menu show';
            window.document.body.appendChild(dropdown);
            
            window.document.body.addEventListener('click', this.documentOnClickDelegate, false);
            
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
    
    private dropdownItemOnClick(value: string) {
        if (this.props.onUpdate) {
            this.props.onUpdate(this.props.identity, value);
        }
    }
    
    render() {
      return (
        pug `
          .btn-group(ref="group")
            button.btn.btn-light.btn-sm.dropdown-toggle(ref="button", type="button", aria-haspopup="true", aria-expanded="false")
              = this.props.children
            .fsb-dropdown-menu.dropdown-menu(ref="dropdown")
              each value in this.props.options
                a.dropdown-item(key="item-" + value, onClick=this.dropdownItemOnClick.bind(this, value))
                  | #{value}
        `
      )
    }
}

DeclarationHelper.declare('Controls.DropDownList', DropDownList);

export {Props, State, DropDownList};