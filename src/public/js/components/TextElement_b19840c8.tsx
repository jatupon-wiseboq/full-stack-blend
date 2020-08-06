// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

// Auto[Import]--->
import {Project, DeclarationHelper} from '../helpers/DeclarationHelper.js';
import {CodeHelper} from '../helpers/CodeHelper.js';
import {EventHelper} from '../helpers/EventHelper.js';
import {HTMLHelper} from '../helpers/HTMLHelper.js';
import {IBaseProps, IBaseState, DefaultBaseProps, DefaultBaseState, Base} from './Base.js';
// <---Auto[Import]

// Import additional modules here:
//

// Auto[Declare]--->

declare let React: any;
declare let ReactDOM: any;
declare let window: any;
declare let DataManipulationHelper: any;

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
class TextElement_b19840c8 extends Base {
  state: IState = null;
  protected static defaultProps: IProps = DefaultProps;
  
  constructor(props) {
    super(props);
    this.state = CodeHelper.clone(DefaultState);
    
    this.initialize();
  }
  
  register() {

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
  
  // Auto[onTextElementClick_b19840c8:Begin]--->
  protected onTextElementClick_b19840c8(event: Event) {
    // <---Auto[onTextElementClick_b19840c8:Begin]

    // Handle the event of onTextElementClick (TextElement 2) here:
    // 
    window.open('https://staging.stackblend.com/signup');
    
    // Auto[onTextElementClick_b19840c8:End]--->
  }
  // <---Auto[onTextElementClick_b19840c8:End]

  // Auto[ClassEnd]--->
  protected render(): any {
    return (
      <div className={"internal-fsb-element col-12 -fsb-preset-bb6cddae " + (this.props.forward && this.props.forward.classes || '')} internal-fsb-guid="b19840c8" style={Object.assign({'FsbInheritedPresets': 'bb6cddae'}, this.props.forward && this.props.forward.styles || {})} onClick={this.onTextElementClick_b19840c8.bind(this)}>
        Open Sign Up Page
      </div>
    )
  }
}
DeclarationHelper.declare('Document', 'Controls.TextElement_b19840c8', TextElement_b19840c8);
// <---Auto[ClassEnd]

// Export variables here:
//
export {IProps, IState, DefaultProps, DefaultState};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.