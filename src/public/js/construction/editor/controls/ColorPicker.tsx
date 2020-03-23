import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;
declare let jQuery: any;

let hooks = [];
let picker = document.createElement('div');
jQuery(jQuery(picker).colpick({
    flat: true,
    onSubmit: function(hsb,hex,rgb,el,bySetColor) {
        for (const hook of hooks) {
            hook(hex, true);
        }
    },
    onChange: function(hsb,hex,rgb,el,bySetColor) {
        for (const hook of hooks) {
            hook(hex, false);
        }
    }
}).children()[0]).css({height: '180px'});

interface Props extends IProps {
    onUpdate(value: any);
    visible: boolean;
    value: string;
}

interface State extends IState {
}

class ColorPicker extends React.Component<Props, State> {
    static defaultProps: Props = {
        value: '#000000'
    }
    
    private onSubmitDelegate: any = null;
    
    constructor() {
        super();
        
        this.onSubmitDelegate = this.onSubmit.bind(this);
        hooks.push(this.onSubmitDelegate);
    }
    
    componentWillUnmount() {
        let index = hooks.indexOf(this.onSubmitDelegate);
        if (index != -1) {
            hooks.splice(index, 1);
        }
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (this.props.visible != prevProps.visible) {
            let pickerContainer = ReactDOM.findDOMNode(this.refs.pickerContainer);
            pickerContainer.appendChild(picker);
            
            if (this.props.value != null) {
                jQuery(picker).colpickSetColor(this.props.value, true);
            }
        }
    }
    
    onSubmit(hex, hide) {
        if (this.props.visible && hex != this.props.value) {
            if (this.props.onUpdate) {
                this.props.onUpdate(hex);
            }
            if (hide && this.props.onRequestHiding) {
                this.props.onRequestHiding();
            }
        }
    }
    
    render() {
      return (
        pug `
          div(ref="pickerContainer")
        `
      )
    }
}

DeclarationHelper.declare('Controls.ColorPicker', ColorPicker);

export {Props, State, ColorPicker};