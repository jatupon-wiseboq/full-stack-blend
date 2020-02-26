import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props {
}

interface State {
}

class Guide extends React.Component<Props, State> {
    static defaultProps: Props = {
    }
    
    render() {
        return (
            pug `
              .internal-fsb-guide
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