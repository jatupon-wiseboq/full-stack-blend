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
class TextElement_738cbdce extends Base {
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
  
  // Auto[onTextElementClick_738cbdce:Begin]--->
  protected onTextElementClick_738cbdce(event: Event) {
    // <---Auto[onTextElementClick_738cbdce:Begin]

    // Handle the event of onTextElementClick (TextElement 4) here:
    // 
    window.open('https://www.softenstorm.com/stackblend-policy-and-terms');
    
    // Auto[onTextElementClick_738cbdce:End]--->
  }
  // <---Auto[onTextElementClick_738cbdce:End]

  // Auto[ClassEnd]--->
  protected render(): any {
    return (
      <div className={"internal-fsb-element col-12 -fsb-preset-08abd2c9 " + (this.props.forward && this.props.forward.classes || '')} internal-fsb-guid="738cbdce" style={Object.assign({'FsbInheritedPresets': '08abd2c9', 'textAlign': 'center', 'textDecorationLine': 'underline', 'WebkitTextDecorationLine': 'underline', 'MozTextDecorationLine': 'underline', 'cursor': 'pointer'}, this.props.forward && this.props.forward.styles || {})} onClick={this.onTextElementClick_738cbdce.bind(this)}>
        Privacy Policy and Terms of Service
      </div>
    )
  }
}
DeclarationHelper.declare('Document', 'Controls.TextElement_738cbdce', TextElement_738cbdce);
// <---Auto[ClassEnd]

// Export variables here:
//
export {IProps, IState, DefaultProps, DefaultState};

    // <--- Auto[Generating:V1]
    // PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.