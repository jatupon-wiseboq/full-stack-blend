import {FullStackBlend, DeclarationHelper} from '../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props {
}

interface State {
}

class Dragger extends React.Component<Props, State> {

    static defaultProps: Props = {
    }

    render() {
        return (
            <div />
        )
    }
}

DeclarationHelper.declare('Components.Dragger', Dragger);