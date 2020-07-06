// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

// Auto[Import]--->
import {Project, DeclarationHelper} from '../helpers/DeclarationHelper.js';
import {CodeHelper} from '../helpers/CodeHelper.js';
import {EventHelper} from '../helpers/EventHelper.js';
import {IBaseProps, IBaseState, DefaultBaseProps, DefaultBaseState, Base} from './Base.js';
// <---Auto[Import]

// Import additional modules here:
//

// Auto[Declare]--->

declare let React: any;
declare let ReactDOM: any;
declare let window: any;

// <---Auto[Declare]

// Declare private static variables here:
//

// Auto[Interface]--->
interface IAutoBaseProps extends IBaseProps {
  forward: {classes: String, styles: any};
}
interface IAutoBaseState extends IBaseState {
}
// <---Auto[Interface]

// Declare or extend interfaces here:
//
interface IProps extends IAutoBaseProps {
  
}
interface IState extends IAutoBaseState { 
}

let DefaultProps = Object.assign({}, DefaultBaseProps, {
  
});
let DefaultState = Object.assign({}, DefaultBaseState, {
  
});

// Auto[ClassBegin]--->
class TextElement_bb6cddae extends Base {
  state: IState = null;
  protected static defaultProps: IProps = DefaultProps;
  
  constructor(props) {
    super(props);
    this.state = CodeHelper.clone(DefaultState);
    
    this.initialize();
  }
  // <---Auto[ClassBegin]
  
  // Declare class variables and functions here:
  //
  protected initialize(): void {
  }
  
  // Providing data array base on dot notation:
  // 
  protected getDataFromNotation(notation: string): any {
    return super.getDataFromNotation(notation);
  }
  
  // Auto[Merging]--->
  // <---Auto[Merging]
  
  // Auto[onTextElementClick_bb6cddae:Begin]--->
  protected onTextElementClick_bb6cddae(event: Event) {
    // <---Auto[onTextElementClick_bb6cddae:Begin]

    // Handle the event of onTextElementClick (TextElement 1) here:
    // 
    window.open('https://github.com/SoftenStorm/boilerplate');
    
    // Auto[onTextElementClick_bb6cddae:End]--->
  }
  // <---Auto[onTextElementClick_bb6cddae:End]

  // Auto[ClassEnd]--->
  protected render(): any {
    return (
      <div className={"internal-fsb-element col-12 -fsb-self-bb6cddae -fsb-preset-08abd2c9 " + (this.props.forward && this.props.forward.classes || '')} internal-fsb-guid="bb6cddae" style={Object.assign({}, this.props.forward && this.props.forward.styles || {})} onClick={this.onTextElementClick_bb6cddae.bind(this)}>
        Get Started
      </div>
    )
  }
}
DeclarationHelper.declare('Document', 'Controls.TextElement_bb6cddae', TextElement_bb6cddae);
// <---Auto[ClassEnd]

// Export variables here:
//
export {IProps, IState, DefaultProps, DefaultState};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.