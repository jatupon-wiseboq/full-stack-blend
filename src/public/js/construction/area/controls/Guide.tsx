import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props {
}

interface State {
}

class Guide extends React.Component<Props, State> {
    static defaultProps: Props = {
    }
    
    private domElement: HTMLElement = null;
    
    constructor() {
        super();
    }
    
    public getDOMNode() {
        return this.domElement;
    }
    public setDOMNode(element: HTMLElement) {
        this.domElement = element;
    }
    
    render() {
        return (
            pug `
              .internal-fsb-guide(id='internal-fsb-guide')
                .container-fluid
                  .row
                    .col-1.p-0
                    .col-1.p-0
                    .col-1.p-0
                    .col-1.p-0
                    .col-1.p-0
                    .col-1.p-0
                    .col-1.p-0
                    .col-1.p-0
                    .col-1.p-0
                    .col-1.p-0
                    .col-1.p-0
                    .col-1.p-0
            `
        )
    }
}

DeclarationHelper.declare('Controls.Guide', Guide);

export {Props, State, Guide};