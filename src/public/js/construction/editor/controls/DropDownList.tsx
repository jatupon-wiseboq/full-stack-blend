import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {EventHelper} from '../../helpers/EventHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
    options: [any];
    controls: any;
    identity: any;
    onUpdate(identity: any, value: any, index: any);
    onVisibleChanged(visible: boolean, tag: any);
    autohide: boolean;
    customClassName: string;
    searchBox: boolean;
    useMaximumHeight: boolean;
    width: number;
    optionPadding: number;
    tag: any;
}

interface State extends IState {
    filter: string;
}

class DropDownList extends React.Component<Props, State> {
    state: IState = {filter: ''}
    static defaultProps: Props = {
        options: [],
        controls: [],
        autohide: true,
        customClassName: null,
        searchBox: false,
        useMaximumHeight: false,
        width: 0,
        optionPadding: null
    }
    
    private documentOnClickDelegate: Function = null;
    private recentDropDownMaxHeight: number = 0;
    private maximumWidth: number = 0;
    
    constructor(props) {
        super(props);
        
        this.documentOnClickDelegate = this.documentOnClick.bind(this);
    }
    
    componentDidMount() {
        let $this = this;
        let button = ReactDOM.findDOMNode(this.refs.button);
        let dropdown = ReactDOM.findDOMNode(this.refs.dropdown);
        
        button.addEventListener('click', ((event) => {
            if (dropdown.className.indexOf('hide') == -1) return EventHelper.cancel(event);
        
            if (this.props.autohide) {
                document.body.click();
            }
            
            // Measure Size & Position
            //
            
            let position = HTMLHelper.getPosition(button);
            let size = HTMLHelper.getSize(button);
            let buttonWidth = size[0];
            
            dropdown.className = 'fsb-dropdown-menu dropdown-menu show measure';
            document.body.appendChild(dropdown);
            
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
            // position[0] += this.props.offsetX;
            // position[1] += this.props.offsetY;
            
            if (position[0] + Math.max(dropDownClientWidth, size[0]) < windowWidth) {
                dropdown.style.left = (position[0] - 1) + 'px';
            } else {
                dropdown.style.left = (windowWidth - Math.max(dropDownClientWidth, size[0])) + 'px';
            }
            
            let minOfHeights = Math.min(dropDownClientHeight, dropDownMaxHeight);
            let maxOfHeights = Math.max(dropDownClientHeight, dropDownMaxHeight);
            let spaceleft = windowHeight - position[1] - size[1];
            let shiftPositionY = (dropDownClientHeight >= 100 && spaceleft < 100);
            
            dropdown.style.position = 'fixed';
            dropdown.style.top = ((shiftPositionY) ? windowHeight - maxOfHeights : (position[1] + size[1])) + 'px';
            dropdown.style.width = Math.max(dropDownClientWidth, size[0]) + 'px';
            dropdown.style.height = ((shiftPositionY) ? maxOfHeights : minOfHeights) + 'px';
            dropdown.style.overflowY = (overflowY) ? 'auto' : 'hidden';
            
            dropdown.className = 'fsb-dropdown-menu dropdown-menu hide';
            dropdown.className = 'fsb-dropdown-menu dropdown-menu show';
            
            // Handling Events
            //
            
            document.body.addEventListener('click', this.documentOnClickDelegate, false);
            
            if (this.props.onVisibleChanged) {
                this.props.onVisibleChanged(true, this.props.tag);
            }
            
            this.recentDropDownMaxHeight = dropDownMaxHeight;
            
            return EventHelper.cancel(event);
        }).bind(this));
    }
    
    componentWillUnmount() {
        document.body.removeEventListener('click', this.documentOnClickDelegate, false);
        
        if (this.props.onVisibleChanged) {
            this.props.onVisibleChanged(false, this.props.tag);
        }
    }
    
    private documentOnClick(event) {
        if (EventHelper.checkIfDenyForHandle(event)) return;
        
        this.hide();
    }
    
    public hide() {
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
        
        document.body.removeEventListener('click', this.documentOnClickDelegate, false);
        
        if (this.props.onVisibleChanged) {
            this.props.onVisibleChanged(false, this.props.tag);
        }
    }
    
    private dropdownItemOnClick(event) {
        if (EventHelper.checkIfDenyForHandle(event)) return;
    
        if (this.props.onUpdate) {
            this.props.onUpdate(this.props.identity, HTMLHelper.getAttribute(EventHelper.getCurrentElement(event), 'value'), HTMLHelper.getAttribute(EventHelper.getCurrentElement(event), 'index'));
        }
        
        this.hide();
        
        return EventHelper.cancel(event);
    }
    
    protected textboxOnUpdate(value) {
        this.state.filter = value;
        this.forceUpdate();
    }
    
    render() {
      let filtered = this.props.options;
      if (this.state.filter) {
        filtered = filtered.filter(value => value.toLowerCase().indexOf(this.state.filter.toLowerCase().trim()) != -1);
      }
      let textbox = (<FullStackBlend.Controls.Textbox value={this.state.filter} preRegExp="(([a-zA-Z0-9])|([a-zA-Z0-9][a-zA-Z0-9 ]*))?" postRegExp="[a-zA-Z0-9 ]*" onUpdate={this.textboxOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>);
    
      return (
        pug `
          .btn-group(ref="group", internal-fsb-event-no-propagate="click")
            button.btn.btn-sm.dropdown-toggle(ref="button", type="button", className=(this.props.customClassName || "btn-light"), aria-haspopup="true", aria-expanded="false")
              = this.props.children
            .fsb-dropdown-menu.dropdown-menu.hide(ref="dropdown", internal-fsb-event-no-propagate="click")
              if this.props.searchBox
                .fsb-controller-area-container
                  .fsb-controller-area-body
                    = textbox
              .fsb-content-area-container
                .fsb-content-area-body
                  .fsb-content-area-scrollable
                    each value, index in filtered
                      .dropdown-item(key="item-" + value, value=value index=index onClick=this.dropdownItemOnClick.bind(this) internal-fsb-event-no-propagate="click" style={padding: (this.props.optionPadding !== null) ? this.props.optionPadding : ''})
                        if typeof value === 'string' && value[0] === '{' && value[value.length - 1] === '}'
                          = this.props.controls[value]
                        else
                          span(dangerouslySetInnerHTML={__html: (!value && value !== 0) ? "unset" : value.toString()})
        `
      )
    }
}

DeclarationHelper.declare('Controls.DropDownList', DropDownList);

export {Props, State, DropDownList};