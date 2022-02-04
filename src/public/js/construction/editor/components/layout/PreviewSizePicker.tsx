import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
}

let ExtendedDefaultState = Object.assign({}, DefaultState);

let ExtendedDefaultProps = Object.assign({}, DefaultProps);

class PreviewSizePicker extends Base<Props, State> {
    protected static defaultProps: Props = ExtendedDefaultProps;
    
    constructor(props) {
        super(props);
    }
    
    render() {
      return (
        pug `
          .preview-size-picker.btn-group
            each index in [0, 1, 2, 3, 4]
              .btn-group(key="group-" + index)
                label.btn.btn-light.btn-sm
                  i(className=["fa fa-mobile", "fa fa-tablet", "fa fa-tablet fa-rotate-90", "fa fa-laptop", "fa fa-desktop"][index] + ((this.state.extensionValues['currentActiveLayout'] == index) ? ' active' : ' inactive'))
        `
      )
    }
}

DeclarationHelper.declare('Components.PreviewSizePicker', PreviewSizePicker);

export {Props, State, ExtendedDefaultState, ExtendedDefaultProps, PreviewSizePicker};