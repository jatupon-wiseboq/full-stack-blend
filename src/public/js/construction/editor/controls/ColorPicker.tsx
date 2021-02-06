import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper';

declare let React: any;
declare let ReactDOM: any;
declare let jQuery: any;

let hooks = [];
let picker = document.createElement('div');
let recentRgb = {r: 0, g: 0, b: 0};
let recentOpacity = 1.0;
jQuery(jQuery(picker).colpick({
    flat: true,
    onSubmit: function(hsb,hex,rgb,el,bySetColor) {
        recentRgb = rgb;
        for (const hook of hooks) {
            hook(recentRgb, recentOpacity, true);
        }
    },
    onChange: function(hsb,hex,rgb,el,bySetColor) {
        recentRgb = rgb;
        for (const hook of hooks) {
            hook(recentRgb, recentOpacity, false);
        }
    }
}).children()[0]).css({height: '180px'});

let opacityControl = jQuery(picker).find('.colpick_hex_field').clone();
jQuery(picker).find('.colpick_hex_field').before(opacityControl);
opacityControl.find('.colpick_field_letter').text('A');
opacityControl.css('left', '277px').css('width', '60px');
opacityControl.find('input').attr('maxlength', '6').attr('size', '6').val(recentOpacity.toString());
jQuery(picker).find('.colpick_hex_field').css('width', '60px');

let setControl = jQuery(picker).find('.colpick_submit');
let unsetControl = setControl.clone();
setControl.before(unsetControl);
unsetControl.text('UNSET').css('width', '60px');
setControl.css('left', '277px').css('width', '60px')

opacityControl.find('input').bind('keyup', (event) => {
    if (event.which >= 37 && event.which <= 40) return;
    
    let input = opacityControl.find('input')[0];
    let completingValue = input.value;
    
    if (completingValue.match(/^([01]|[01]\.|0\.[0-9]+)?$/) != null) {
        recentOpacity = parseFloat(completingValue || '0');
        
        for (const hook of hooks) {
            hook(recentRgb, recentOpacity, false);
        }
    } else {
        input.value = recentOpacity;
    }
});

function setOpacityValue(value: number) {
    recentOpacity = value;
    opacityControl.find('input').val(recentOpacity.toString());
}

interface IProps {
    onUpdate(value: any);
    onUnset();
    visible: boolean;
    value: string;
}

interface IState {
}

class ColorPicker extends React.Component<IProps, IState> {
    static defaultProps: Props = {
        value: 'rgba(0, 0, 0, 1.0)'
    };
    
    private onSubmitDelegate: any = null;
    
    constructor() {
        super();
        
        this.onSubmitDelegate = this.onSubmit.bind(this);
        hooks.push(this.onSubmitDelegate);
        
        unsetControl[0].addEventListener('click', this.onUnset.bind(this));
    }
    
    componentWillUnmount() {
        let index = hooks.indexOf(this.onSubmitDelegate);
        if (index != -1) {
            hooks.splice(index, 1);
        }
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (this.props.visible != prevProps.visible) {
            if (this.props.visible) {
                let pickerContainer = ReactDOM.findDOMNode(this.refs.pickerContainer);
                pickerContainer.appendChild(picker);
                
                if (this.props.value != null) {
                    let rgba = this.convertRgbaToHash(this.props.value);
                    setOpacityValue(rgba.a);
                    jQuery(picker).colpickSetColor(rgba, true);
                }
            }
        }
    }
    
    onSubmit(rgb, opacity, hide) {
        rgb['a'] = opacity;
        let value = this.convertHashToRgba(rgb);
        
        if (this.props.visible && value != this.props.value) {
            if (this.props.onUpdate) {
                this.props.onUpdate(value);
            }
        }
        if (hide && this.props.onRequestHiding) {
            this.props.onRequestHiding();
        }
    }
    
    onUnset() {
        if (this.props.visible) {
            if (this.props.onUnset) {
                this.props.onUnset();
            }
        }
        if (this.props.onRequestHiding) {
            this.props.onRequestHiding();
        }
    }
    
    private convertRgbaToHash(value: string) {
        value = value || 'rgba(255, 255, 255, 1.0)';
        let match = value.match(/^rgba\(([0-9]+), ([0-9]+), ([0-9]+), ([0-9\.]+)\)$/);
        if (match == null) return {r: 0, g: 0, b: 0, a: 1.0};
        else return {r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]), a: parseFloat(match[4])};
    }
    
    private convertHashToRgba(rgba: any) {
        return 'rgba(' + rgba.r + ', ' + rgba.g + ', ' + rgba.b + ', ' + rgba.a + ')';
    }
    
    public setCurrentColor(color: string) {
        let rgba = this.convertRgbaToHash(color);
        setOpacityValue(rgba.a);
        jQuery(picker).colpickSetColor(rgba, true);
    }
    
    render() {
      return (
        pug `
          .color-picker(ref="pickerContainer")
        `
      )
    }
}

DeclarationHelper.declare('Controls.ColorPicker', ColorPicker);

export {IProps, IState, ColorPicker};