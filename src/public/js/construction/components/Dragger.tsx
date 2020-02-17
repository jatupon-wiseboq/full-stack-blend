import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props {
}

interface State {
}

class Dragger extends React.Component<Props, State> {
    static defaultProps: Props = {
    }
    
    mouseDown(event) {
        console.log('event', event)
    }
    
    render() {
        return (
            pug `
                .internal-fsb-dragger(id='internal-fsb-dragger')
                    span.t.l(onMouseDown=this.mouseDown)
                    span.t(onMouseDown=this.mouseDown)
                    span.t.r(onMouseDown=this.mouseDown)
                    span.r(onMouseDown=this.mouseDown)
                    span.b.r(onMouseDown=this.mouseDown)
                    span.b(onMouseDown=this.mouseDown)
                    span.b.l(onMouseDown=this.mouseDown)
                    span.l(onMouseDown=this.mouseDown)
            `
        )
    }
}

DeclarationHelper.declare('Components.Dragger', Dragger);