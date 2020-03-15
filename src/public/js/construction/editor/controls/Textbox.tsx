import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
}

interface State extends IState {
}

class Textbox extends React.Component<Props, State> {
    static defaultProps: Props = {
    }
    
    constructor() {
        super();
    }
    
    render() {
      return (
        pug `
          input.form-control.form-control-sm(type="text")
        `
      )
    }
}

DeclarationHelper.declare('Controls.Textbox', Textbox);

export {Props, State, Textbox};