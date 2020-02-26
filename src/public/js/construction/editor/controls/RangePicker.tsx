import {FullStackBlend, DeclarationHelper} from '../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props {
}

interface State {
}

class RangePicker extends React.Component<Props, State> {
    static defaultProps: Props = {
    }
    
    render() {
        return (
            pug `
              | RangePicker
            `
        )
    }
}

DeclarationHelper.declare('Controls.RangePicker', RangePicker);