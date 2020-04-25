import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props {
}

interface State {
}

class LayoutInfo extends React.Component<Props, State> {
    static defaultProps: Props = {
    }
    
    constructor() {
        super();
    }
    
    public currentActiveLayout() {
      let refNames = ['xs', 'sm', 'md', 'lg', 'xl'];
      for (let i=0; i<refNames.length; i++) {
        if (ReactDOM.findDOMNode(this.refs[refNames[i]]).offsetWidth > 0) {
          return i;
        }
      }
      return 0;
    }
    
    render() {
        return (
            pug `
              .internal-layout-info
                .d-block.d-sm-none(ref='xs')
                .d-none.d-sm-block.d-md-none(ref='sm')
                .d-none.d-md-block.d-lg-none(ref='md')
                .d-none.d-lg-block.d-xl-none(ref='lg')
                .d-none.d-xl-block(ref='xl')
            `
        )
    }
}

DeclarationHelper.declare('Controls.LayoutInfo', LayoutInfo);

export {Props, State, LayoutInfo};