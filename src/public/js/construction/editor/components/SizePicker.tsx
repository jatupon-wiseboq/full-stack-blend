import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../controls/Textbox.js';
import '../controls/DropDownList.js';
import '../controls/DropDownControl.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
}

interface State extends IState {
}

class SizePicker extends Base<Props, State> {
    static defaultProps: Props = {
    }
    
    constructor() {
        super();
    }
    
    render() {
        return (
            <div className={"size-picker " + this.props.additionalClassName}>
                <FullStackBlend.Controls.DropDownControl representingValue="123">
                    <FullStackBlend.Controls.Textbox></FullStackBlend.Controls.Textbox>
                    <FullStackBlend.Controls.DropDownList options={["pixels", "points", "relative to font-size", "relative to font-size of root", "relative to viewport width", "relative to viewport height", "relative to parent"]}></FullStackBlend.Controls.DropDownList>
                </FullStackBlend.Controls.DropDownControl>
            </div>
        )
    }
}

DeclarationHelper.declare('Components.SizePicker', SizePicker);

export {Props, State, SizePicker};