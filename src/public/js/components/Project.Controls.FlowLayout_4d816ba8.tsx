// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

// Auto[Import]--->
import {Project as $Project, DeclarationHelper} from '../helpers/DeclarationHelper';
import {CodeHelper} from '../helpers/CodeHelper';
import {EventHelper} from '../helpers/EventHelper';
import {HTMLHelper} from '../helpers/HTMLHelper';
import {AnimationHelper} from '../helpers/AnimationHelper';
import {TestHelper} from '../helpers/TestHelper';
import {SourceType, HierarchicalDataTable, HierarchicalDataRow} from '../helpers/DataManipulationHelper';
import {IBaseProps, IBaseState, DefaultBaseProps, DefaultBaseState, Button as $Button, Base as $Base} from './Base';

// Assign to an another one to override the base class.
// 
let Base: any = $Base;

// <---Auto[Import]

// Import additional modules here:
// 

// Auto[Declare]--->

declare let React: any;
declare let ReactDOM: any;
declare let window: any;
declare let DataManipulationHelper: any;
declare let pug: any;

let Button = $Button;
let Project = $Project;

/*enum SourceType {
  Relational,
  PrioritizedWorker,
  Document,
  VolatileMemory,
  RESTful,
  Dictionary,
  Collection
}*/
// <---Auto[Declare]

// Declare private static variables here:
//

// Auto[Interface]--->
/*interface HierarchicalDataTable {
	source: SourceType;
	group: string;
  rows: HierarchicalDataRow[];
}
interface HierarchicalDataRow {
  keys: {[Identifier: string]: any};
  columns: {[Identifier: string]: any};
  relations: {[Identifier: string]: HierarchicalDataTable};
}*/
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
  currentTab: number;
  submitting: boolean;
}

let DefaultProps = Object.assign({}, DefaultBaseProps, {
  
});
let DefaultState = Object.assign({}, DefaultBaseState, {
  currentTab: 0,
  submitting: false
});

// Auto[ClassBegin]--->
class FlowLayout_4d816ba8 extends Base {
  state: IState = null;
  protected static defaultProps: IProps = DefaultProps;
  
  constructor(props) {
    super(props);
    this.state = CodeHelper.clone(DefaultState);
    
    this.initialize();
  }
  
  register() {
    TestHelper.identify();
    function ready(a){"loading"!=document.readyState?a(new Event('ready')):document.addEventListener?document.addEventListener("DOMContentLoaded",a):(document.onreadystatechange=function(e){"complete"==document.readyState&&a(e)})};
        
    DataManipulationHelper.register("954a291a", "navigate", ["1b650e66","22d343bd"], {initClass: null, submitCrossType: null, enabledRealTimeUpdate: false, manipulateInto: () => { return null; }});
    DataManipulationHelper.register("b2b66792", "navigate", ["1b650e66","22d343bd","d3de6c93"], {initClass: null, submitCrossType: null, enabledRealTimeUpdate: false, manipulateInto: () => { return null; }});
  }
  // <---Auto[ClassBegin]
  
  // Declare class variables and functions here:
  //
  protected initialize(): void {
  }
  
  protected componentDidMount(): void {
  	this.register();
  }
  
  protected componentWillUnmount(): void {
  }
  
  // Providing data array base on dot notation:
  // 
  protected getDataFromNotation(notation: string, inArray: boolean=false): any {
    return super.getDataFromNotation(notation, inArray);
  }
  
  // Auto[Merging]--->
  protected onButtonClick_d7d59dd2(event: Event) {

    // Handle the event of onButtonClick (Button 1) here:
    // 
    this.setState({currentTab: 0});
    
  }

  protected onButtonClick_875ac000(event: Event) {

    // Handle the event of onButtonClick (Button 4) here:
    // 
    this.setState({currentTab: 1});
    
  }

  protected onButtonSubmitting_954a291a(event: CustomEvent) {

    // Handle the event of onButtonSubmitting (Button 3) here:
    // 
    this.setState({submitting: true});
    
  }

  protected onButtonFailed_954a291a(event: CustomEvent) {

    // Handle the event of onButtonFailed (Button 3) here:
    // 
    this.setState({submitting: false});
    
  }

  protected onButtonSubmitting_b2b66792(event: CustomEvent) {

    // Handle the event of onButtonSubmitting (Button 1) here:
    // 
    this.setState({submitting: true});
    
  }

  protected onButtonFailed_b2b66792(event: CustomEvent) {

    // Handle the event of onButtonFailed (Button 1) here:
    // 
    this.setState({submitting: false});
    
  }
  // <---Auto[Merging]
  
  // Auto[ClassEnd]--->
  protected render(): any {
    TestHelper.identify();
    return pug `
      div(style=Object.assign({'FsbInheritedPresets': '245bc127'}, this.props.forward && this.props.forward.styles || {}), internal-fsb-class="FlowLayout", className="-fsb-preset-245bc127 internal-fsb-element internal-fsb-strict-layout " + (this.props.forward && this.props.forward.classes || ''), internal-fsb-guid="4d816ba8")
        .col-6.internal-fsb-element.offset-0(style={'MsFlexDirection': 'column', 'MsFlexWrap': 'nowrap', 'MsOverflowX': 'hidden', 'MsOverflowY': 'auto', 'WebkitFlexDirection': 'column', 'WebkitFlexWrap': 'nowrap', 'background': 'rgba(3, 115, 252, 1)', 'bottom': '-1px', 'display': 'flex', 'flexDirection': 'column', 'flexWrap': 'nowrap', 'left': '-1px', 'overflowX': 'hidden', 'overflowY': 'auto', 'paddingBottom': '15px', 'paddingTop': '15px', 'position': 'absolute', 'top': '-1px'}, internal-fsb-guid="257894ed")
          .internal-fsb-element(style={'color': 'rgba(255, 255, 255, 1)', 'display': 'block', 'fontSize': '24px', 'width': '100%'}, internal-fsb-guid="08a05b72")
            | StackBlend Studio
          .internal-fsb-element(style={'WebkitFlexGrow': '1', 'flexGrow': '1', 'width': '100%'}, internal-fsb-guid="e80dd7c1")
          .internal-fsb-element(style={'MozHyphens': 'auto', 'MsHyphens': 'auto', 'MsOverflowY': 'auto', 'MsWordBreak': 'break-word', 'WebkitHyphens': 'auto', 'color': 'rgba(255, 255, 255, 1)', 'display': 'block', 'fontSize': '10px', 'hyphens': 'auto', 'overflowY': 'auto', 'textAlign': 'justify', 'textTransform': 'uppercase', 'width': '100%', 'wordBreak': 'break-word'}, internal-fsb-guid="e55072d1")
            div
              | ALL SOFTWARES AND GENERATED OUTPUT FILES ON GITHUB ARE PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
            div
              br
            div
              | By using this StackBlend studio, you are further agreeing that your software isn't include content that is offensive, insensitive, upsetting, and intended to disgust, for examples:
            div
              | - Defamatory, discriminatory, or mean-spirited content
            div
              | - encourage violence
            div
              | - encourage illegal or reckless use of weapons
            div
              | - sexual or pornographic material
            div
              | - inaccurate or misleading quotations of religious
            div
              | - False information and features
            div
              | - Liquors, beer, narcotic drug, or tobacco
            div
              br
              | Copyright (c) SoftenStorm Foundation and other contributors. All rights reserved under BSD 4-clause license. 
              span(style={'fontFamily': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'})
                | ANY ALLEGED SOFTWARES ARE SUBJECT TO LOCAL LAW ENFORCEMENT AND WILL BE REMOVED WITHOUT ANY CONSENT.
        .col-6.internal-fsb-element.offset-6(style={'MsFlexDirection': 'column', 'MsOverflowX': 'hidden', 'MsOverflowY': 'auto', 'WebkitFlexDirection': 'column', 'bottom': '0px', 'display': 'flex', 'flexDirection': 'column', 'overflowX': 'hidden', 'overflowY': 'auto', 'position': 'absolute', 'right': '0px', 'top': '0px'}, internal-fsb-guid="b20bb476")
          .internal-fsb-element(style={'WebkitFlexGrow': '1', 'flexGrow': '1'}, internal-fsb-guid="73b5e922")
          .internal-fsb-element.internal-fsb-strict-layout(style={'WebkitFlexBasis': '300px', 'flexBasis': '300px'}, internal-fsb-class="FlowLayout", internal-fsb-guid="35e36a4a")
            .col-12.internal-fsb-element(style={'color': 'rgba(166, 166, 166, 1)', 'fontSize': '13px', 'marginBottom': '15px', 'textAlign': 'center'}, internal-fsb-guid="e439a68e")
              | Please login or signup to start using StackBlend studio
            .col-12.internal-fsb-element.internal-fsb-strict-layout(style={'marginBottom': '15px', 'paddingLeft': '0px', 'paddingRight': '15px'}, internal-fsb-class="FlowLayout", internal-fsb-guid="89972713")
              Button.-fsb-self-d7d59dd2.col-5.internal-fsb-element.offset-1(style={background: (()=>{return (this.state.currentTab == 0) ? '' : 'transparent';})(), borderBottomStyle: (()=>{return (this.state.currentTab == 0) ? '' : 'none';})(), color: (()=>{return (this.state.currentTab == 0) ? '' : 'rgba(200, 200, 200, 1)';})()}, disabled=this.state.submitting, type="button", onClick=this.onButtonClick_d7d59dd2.bind(this), internal-fsb-guid="d7d59dd2")
                .internal-fsb-element(internal-fsb-guid="d7d59dd2-text")
                  | Login
              Button.-fsb-preset-d7d59dd2.col-5.internal-fsb-element.offset-0(style={'FsbInheritedPresets': 'd7d59dd2', 'marginLeft': '15px', background: (()=>{return (this.state.currentTab == 1) ? '' : 'transparent';})(), borderBottomStyle: (()=>{return (this.state.currentTab == 1) ? '' : 'none';})(), color: (()=>{return (this.state.currentTab == 1) ? '' : 'rgba(200, 200, 200, 1)';})()}, disabled=this.state.submitting, type="button", onClick=this.onButtonClick_875ac000.bind(this), internal-fsb-guid="875ac000")
                .internal-fsb-element(internal-fsb-guid="875ac000-text")
                  | Signup
            .-fsb-self-1b650e66.col-10.internal-fsb-element.offset-1(style={padding: '0px'}, internal-fsb-forward="1", internal-fsb-guid="1b650e66")
              input.form-control.form-control-sm(placeholder="Email address", type="text", disabled=this.state.submitting, required=true)
            .-fsb-preset-1b650e66.col-10.internal-fsb-element.offset-1(style={padding: '0px'}, internal-fsb-forward="1", internal-fsb-guid="22d343bd")
              input.form-control.form-control-sm(style={'FsbInheritedPresets': '1b650e66', 'display': 'block', 'height': '34px', 'marginTop': '10px', 'width': '100%'}, placeholder="Password", type="password", disabled=this.state.submitting, required=true)
            .col-12.internal-fsb-element.internal-fsb-strict-layout(style={'paddingLeft': '0px', 'paddingRight': '0px', display: (()=>{return (this.state.currentTab == 0) ? 'none' : 'block';})()}, internal-fsb-class="FlowLayout", internal-fsb-guid="4729c240")
              .col-10.internal-fsb-element.offset-1(style={padding: '0px'}, internal-fsb-forward="1", internal-fsb-guid="d3de6c93")
                input.form-control.form-control-sm(style={'display': 'block', 'height': '34px', 'marginTop': '10px', 'width': '100%'}, placeholder="Confirm password", type="password", disabled=this.state.submitting, required=true)
            Button.btn.btn-md.btn-primary.col-6.internal-fsb-element.offset-3(style={'marginTop': '10px', display: (()=>{return (this.state.currentTab == 0) ? 'block' : 'none';})()}, onClick=((event) => { window.internalFsbSubmit('954a291a', 'User', event, ((results) => { this.manipulate('954a291a', 'User', results); }).bind(this)); }).bind(this), disabled=this.state.submitting, type="button", onFailed=this.onButtonFailed_954a291a.bind(this), onSubmitting=this.onButtonSubmitting_954a291a.bind(this), internal-fsb-guid="954a291a")
              .internal-fsb-element(internal-fsb-guid="954a291a-text")
                | Continue
            Button.btn.btn-md.btn-primary.col-6.internal-fsb-element.offset-3(style={'marginTop': '10px', display: (()=>{return (this.state.currentTab == 1) ? 'block' : 'none';})()}, onClick=((event) => { window.internalFsbSubmit('b2b66792', 'User', event, ((results) => { this.manipulate('b2b66792', 'User', results); }).bind(this)); }).bind(this), disabled=this.state.submitting, type="button", onFailed=this.onButtonFailed_b2b66792.bind(this), onSubmitting=this.onButtonSubmitting_b2b66792.bind(this), internal-fsb-guid="b2b66792")
              .internal-fsb-element(internal-fsb-guid="b2b66792-text")
                | Continue
          .internal-fsb-element(style={'WebkitFlexGrow': '1', 'flexGrow': '1'}, internal-fsb-guid="d5903637")
    `
  }
}
DeclarationHelper.declare('Site', 'Controls.FlowLayout_4d816ba8', FlowLayout_4d816ba8);
// <---Auto[ClassEnd]

// Export variables here:
//
export {IProps, IState, DefaultProps, DefaultState};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.