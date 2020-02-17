import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props {
}

interface State {
}

class Cursor extends React.Component<Props, State> {
    static defaultProps: Props = {
    }
    
    render() {
        return (
            pug `
              .internal-fsb-cursor.col-1(id='internal-fsb-cursor')
                .internal-fsb-guide
                  .container-fluid
                    .row
                      .col-1
                      .col-1
                      .col-1
                      .col-1
                      .col-1
                      .col-1
                      .col-1
                      .col-1
                      .col-1
                      .col-1
                      .col-1
                      .col-1
            `
        )
    }
}

DeclarationHelper.declare('Components.Cursor', Cursor);