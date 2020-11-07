// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

// Auto[Import]--->
import {Project as $Project, DeclarationHelper} from '../helpers/DeclarationHelper.js';
import {CodeHelper} from '../helpers/CodeHelper.js';
import {EventHelper} from '../helpers/EventHelper.js';
import {HTMLHelper} from '../helpers/HTMLHelper.js';
import {AnimationHelper} from '../helpers/AnimationHelper.js';
import {IBaseProps, IBaseState, DefaultBaseProps, DefaultBaseState, Button as $Button, Base} from './Base.js';
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
  currentTab: number;
}

let DefaultProps = Object.assign({}, DefaultBaseProps, {
  
});
let DefaultState = Object.assign({}, DefaultBaseState, {
  currentTab: 0
});

// Auto[ClassBegin]--->
class Settings extends Base {
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
  protected onRectangleClick_14382c35(event: Event) {

    // Handle the event of onRectangleClick (Profile Menu) here:
    // 
    this.setState({currentTab: 0});
    
  }

  protected onRectangleClick_5b9e63bb(event: Event) {

    // Handle the event of onRectangleClick (Repository Menu) here:
    // 
    this.setState({currentTab: 1});
    
  }

  protected onRectangleClick_dbcddce6(event: Event) {

    // Handle the event of onRectangleClick (Account Menu) here:
    // 
    this.setState({currentTab: 2});
    
  }
  // <---Auto[Merging]
  
  // Auto[ClassEnd]--->
  protected render(): any {
    return pug `
      div(style=Object.assign({'FsbBackgroundType': 'linear', 'WebkitBorderRadius': '8px 8px 8px 8px', 'background': 'linear-gradient(0deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 1) 100%)', 'borderBottomColor': 'rgba(3, 115, 252, 1)', 'borderBottomStyle': 'solid', 'borderBottomWidth': '5px', 'borderLeftColor': 'rgba(3, 115, 252, 1)', 'borderLeftStyle': 'solid', 'borderLeftWidth': '5px', 'borderRadius': '8px 8px 8px 8px', 'borderRightColor': 'rgba(3, 115, 252, 1)', 'borderRightStyle': 'solid', 'borderRightWidth': '5px', 'borderTopColor': 'rgba(3, 115, 252, 1)', 'borderTopStyle': 'solid', 'borderTopWidth': '5px', 'width': '70vw'}, this.props.forward && this.props.forward.styles || {}), className="internal-fsb-element " + (this.props.forward && this.props.forward.classes || ''), internal-fsb-guid="245bc127")
        .container-fluid
          .internal-fsb-allow-cursor.internal-fsb-strict-layout.row
            .col-3.internal-fsb-allow-cursor.internal-fsb-element(style={'MsFlexDirection': 'column', 'WebkitFlexDirection': 'column', 'bottom': '0px', 'display': 'flex', 'flexDirection': 'column', 'left': '0px', 'paddingLeft': '0px', 'paddingRight': '0px', 'position': 'absolute', 'top': '0px'}, internal-fsb-guid="e2601245")
              .-fsb-self-14382c35.internal-fsb-allow-cursor.internal-fsb-element(style={'FsbReusableId': '14382c35', 'FsbReusableName': '', 'background': (()=>{return (this.state.currentTab == 0) ? 'transparent' : 'rgba(3, 115, 252, 1)';})() || 'rgba(255, 255, 255, 1)', 'paddingBottom': '10px', 'paddingLeft': '15px', 'paddingTop': '10px', color: (()=>{return (this.state.currentTab == 0) ? 'rgba(255, 255, 255, 1)' : 'rgba(3, 115, 252, 1)';})(), cursor: (()=>{return (this.state.currentTab == 0) ? 'default' : 'pointer';})()}, onClick=this.onRectangleClick_14382c35.bind(this), internal-fsb-guid="14382c35")
                .internal-fsb-element(style={'display': 'inline-block'}, internal-fsb-guid="be0d0387")
                  | 👤 
                .-fsb-self-99e5677d.internal-fsb-element(style={'FsbReusableId': '99e5677d', 'color': 'rgba(3, 115, 252, 1)', 'display': 'inline-block'}, internal-fsb-guid="99e5677d")
                  | Profile
              .internal-fsb-allow-cursor.internal-fsb-element(style={'FsbInheritedPresets': '', 'background': (()=>{return (this.state.currentTab == 1) ? 'transparent' : 'rgba(3, 115, 252, 1)';})() || 'rgba(3, 115, 252, 1)', 'paddingBottom': '10px', 'paddingLeft': '15px', 'paddingTop': '10px', color: (()=>{return (this.state.currentTab == 1) ? 'rgba(255, 255, 255, 1)' : 'rgba(3, 115, 252, 1)';})(), cursor: (()=>{return (this.state.currentTab == 1) ? 'default' : 'pointer';})()}, onClick=this.onRectangleClick_5b9e63bb.bind(this), internal-fsb-guid="5b9e63bb")
                .internal-fsb-element(style={'display': 'inline-block'}, internal-fsb-guid="e7896154")
                  | 📎 
                .internal-fsb-element(style={'FsbInheritedPresets': '', 'color': 'rgba(255, 255, 255, 1)', 'display': 'inline-block'}, internal-fsb-guid="a345a908")
                  | Repository
              .internal-fsb-allow-cursor.internal-fsb-element(style={'WebkitFlexGrow': '1', 'background': 'rgba(3, 115, 252, 1)', 'color': 'rgba(3, 115, 252, 1)', 'flexGrow': '1'}, internal-fsb-guid="5c40caec")
              .internal-fsb-allow-cursor.internal-fsb-element(style={'FsbInheritedPresets': '', 'background': (()=>{return (this.state.currentTab == 2) ? 'transparent' : 'rgba(3, 115, 252, 1)';})() || 'rgba(3, 115, 252, 1)', 'paddingBottom': '10px', 'paddingLeft': '15px', 'paddingTop': '10px', color: (()=>{return (this.state.currentTab == 2) ? 'rgba(255, 255, 255, 1)' : 'rgba(3, 115, 252, 1)';})(), cursor: (()=>{return (this.state.currentTab == 2) ? 'default' : 'pointer';})()}, onClick=this.onRectangleClick_dbcddce6.bind(this), internal-fsb-guid="dbcddce6")
                .internal-fsb-element(style={'display': 'inline-block'}, internal-fsb-guid="9aab58ec")
                  | 🔐 
                .internal-fsb-element(style={'FsbInheritedPresets': '', 'color': 'rgba(255, 255, 255, 1)', 'display': 'inline-block'}, internal-fsb-guid="c7844719")
                  | Account
            .col-9.internal-fsb-element.offset-3(style={'background': 'rgba(255, 255, 255, 0.95)', 'height': '45px', 'left': '0px', 'paddingRight': '10px', 'paddingTop': '10px', 'position': 'absolute', 'right': '0px', 'top': '0px', 'zIndex': '900'}, internal-fsb-guid="ea965490")
              .container-fluid
                .internal-fsb-allow-cursor.internal-fsb-strict-layout.row
                  Button.btn.btn-primary.btn-sm.col-2.internal-fsb-allow-cursor.internal-fsb-element.offset-10(type="button", internal-fsb-guid="ea9268d1")
                    .internal-fsb-element(internal-fsb-guid="ea9268d1-text")
                      | Save
            .col-9.internal-fsb-element.offset-3(style={'MsOverflowX': 'hidden', 'MsOverflowY': 'scroll', 'background': 'rgba(255, 255, 255, 0)', 'bottom': '0px', 'overflowX': 'hidden', 'overflowY': 'scroll', 'paddingTop': '10px', 'position': 'absolute', 'right': '0px', 'top': '0px'}, internal-fsb-guid="3096eb71")
              .container-fluid
                .internal-fsb-allow-cursor.internal-fsb-strict-layout.row
                  .col-12.internal-fsb-element(style={'paddingLeft': '0px', 'paddingRight': '0px', display: (()=>{return (this.state.currentTab == 0) ? 'block' : 'none';})()}, internal-fsb-guid="ce3c1a1c")
                    .container-fluid
                      .internal-fsb-allow-cursor.internal-fsb-strict-layout.row
                        .-fsb-self-7003c7d5.col-8.internal-fsb-element.offset-2(internal-fsb-guid="7003c7d5")
                          | Profile Settings
                        .-fsb-self-12bc19e4.col-12.internal-fsb-element(internal-fsb-guid="12bc19e4")
                          | General
                        label.-fsb-self-24bc9bae.col-12.internal-fsb-element(internal-fsb-guid="24bc9bae")
                          .container-fluid
                            .internal-fsb-allow-cursor.internal-fsb-strict-layout.row
                              .-fsb-self-c8d71ae6.col-4.internal-fsb-element(internal-fsb-guid="c8d71ae6")
                                | Email address:
                              .col-7.internal-fsb-element(style={'display': 'block', 'width': '100%', padding: '0px'}, internal-fsb-guid="27d35136")
                                input.form-control.form-control-sm(style={'display': 'block', 'width': '100%'}, type="text", type="text")
                        label.-fsb-preset-24bc9bae.col-12.internal-fsb-element(style={'FsbInheritedPresets': '24bc9bae'}, internal-fsb-guid="81ce8063")
                          .container-fluid
                            .internal-fsb-allow-cursor.internal-fsb-strict-layout.row
                              .-fsb-preset-c8d71ae6.col-4.internal-fsb-element(style={'FsbInheritedPresets': 'c8d71ae6'}, internal-fsb-guid="e40410b7")
                                | Full name:
                              .col-7.internal-fsb-element.offset-0(style={'display': 'block', 'width': '100%', padding: '0px'}, internal-fsb-guid="ece2d619")
                                input.form-control.form-control-sm(style={'display': 'block', 'width': '100%'}, type="text", type="text")
                  .col-12.internal-fsb-element(style={'paddingLeft': '0px', 'paddingRight': '0px', display: (()=>{return (this.state.currentTab == 1) ? 'block' : 'none';})()}, internal-fsb-guid="17704a94")
                    .container-fluid
                      .internal-fsb-allow-cursor.internal-fsb-strict-layout.row
                        .-fsb-preset-7003c7d5.col-8.internal-fsb-element.offset-2(style={'FsbInheritedPresets': '7003c7d5', 'fontSize': '18px', 'textAlign': 'center'}, internal-fsb-guid="36835b75")
                          | Repository Settings
                        .-fsb-preset-12bc19e4.col-12.internal-fsb-element(style={'FsbInheritedPresets': '12bc19e4'}, internal-fsb-guid="4b6deb72")
                          | GitHub Reference
                        .-fsb-self-baed14b5.col-12.internal-fsb-element(internal-fsb-guid="baed14b5")
                          | ⚠️ Please create a dedicate GitHub account to use with StackBlend: a separate developer account, instead of admin one, that has a writing permission of the project which will be developed on StackBlend platform.
                        Button.btn.btn-primary.btn-sm.col-6.internal-fsb-allow-cursor.internal-fsb-element.offset-3(style={'marginBottom': '5px'}, type="button", internal-fsb-guid="68840b17")
                          .internal-fsb-element(internal-fsb-guid="68840b17-text")
                            | Link your GitHub account
                        label.-fsb-preset-24bc9bae.col-12.internal-fsb-element(style={'FsbInheritedPresets': '24bc9bae'}, internal-fsb-guid="7148868c")
                          .container-fluid
                            .internal-fsb-allow-cursor.internal-fsb-strict-layout.row
                              .-fsb-preset-c8d71ae6.col-4.internal-fsb-element(style={'FsbInheritedPresets': 'c8d71ae6'}, internal-fsb-guid="d72eb9ad")
                                | Organization or user alias:
                              .col-7.internal-fsb-element(style={'display': 'block', 'width': '100%', padding: '0px'}, internal-fsb-guid="d3e700b6")
                                input.form-control.form-control-sm(style={'display': 'block', 'width': '100%'}, type="text", type="text")
                        label.-fsb-preset-24bc9bae.col-12.internal-fsb-element(style={'FsbInheritedPresets': '24bc9bae'}, internal-fsb-guid="2b6d3336")
                          .container-fluid
                            .internal-fsb-allow-cursor.internal-fsb-strict-layout.row
                              .-fsb-preset-c8d71ae6.col-4.internal-fsb-element(style={'FsbInheritedPresets': 'c8d71ae6'}, internal-fsb-guid="4654b0a7")
                                | Project name:
                              .col-7.internal-fsb-element.offset-0(style={'display': 'block', 'width': '100%', padding: '0px'}, internal-fsb-guid="0762b97d")
                                input.form-control.form-control-sm(style={'display': 'block', 'width': '100%'}, type="text", type="text")
                        .-fsb-preset-12bc19e4.col-12.internal-fsb-element(style={'FsbInheritedPresets': '12bc19e4'}, internal-fsb-guid="c7437d56")
                          | Branching and Saving
                        label.-fsb-preset-24bc9bae.col-12.internal-fsb-element(style={'FsbInheritedPresets': '24bc9bae'}, internal-fsb-guid="b47dda0b")
                          .container-fluid
                            .internal-fsb-allow-cursor.internal-fsb-strict-layout.row
                              .-fsb-preset-c8d71ae6.col-4.internal-fsb-element(style={'FsbInheritedPresets': 'c8d71ae6'}, internal-fsb-guid="16ce21b0")
                                | Feature branch (isolate):
                              .col-7.internal-fsb-element(style={'display': 'block', 'width': '100%', padding: '0px'}, internal-fsb-guid="098c6ea6")
                                input.form-control.form-control-sm(style={'display': 'block', 'width': '100%'}, type="text", type="text")
                        label.-fsb-preset-24bc9bae.col-12.internal-fsb-element(style={'FsbInheritedPresets': '24bc9bae'}, internal-fsb-guid="234685a2")
                          .container-fluid
                            .internal-fsb-allow-cursor.internal-fsb-strict-layout.row
                              .-fsb-preset-c8d71ae6.col-4.internal-fsb-element(style={'FsbInheritedPresets': 'c8d71ae6'}, internal-fsb-guid="1a8d1591")
                                | Develop branch (merge):
                              .col-7.internal-fsb-element(style={'display': 'block', 'width': '100%', padding: '0px'}, internal-fsb-guid="25254217")
                                input.form-control.form-control-sm(style={'display': 'block', 'width': '100%'}, type="text", type="text")
                        label.-fsb-preset-24bc9bae.col-12.internal-fsb-element(style={'FsbInheritedPresets': '24bc9bae'}, internal-fsb-guid="682d4659")
                          .container-fluid
                            .internal-fsb-allow-cursor.internal-fsb-strict-layout.row
                              .-fsb-preset-c8d71ae6.col-4.internal-fsb-element(style={'FsbInheritedPresets': 'c8d71ae6'}, internal-fsb-guid="c5b93d69")
                                | Staging branch (deploy):
                              .col-7.internal-fsb-element(style={'display': 'block', 'width': '100%', padding: '0px'}, internal-fsb-guid="1da99335")
                                input.form-control.form-control-sm(style={'display': 'block', 'width': '100%'}, type="text", type="text")
                        .-fsb-preset-12bc19e4.col-12.internal-fsb-element(style={'FsbInheritedPresets': '12bc19e4'}, internal-fsb-guid="41645776")
                          | Testing
                        label.-fsb-preset-24bc9bae.col-12.internal-fsb-element(style={'FsbInheritedPresets': '24bc9bae'}, internal-fsb-guid="e0ec7192")
                          .container-fluid
                            .internal-fsb-allow-cursor.internal-fsb-strict-layout.row
                              .-fsb-preset-c8d71ae6.col-4.internal-fsb-element(style={'FsbInheritedPresets': 'c8d71ae6'}, internal-fsb-guid="eaad3e05")
                                | Endpoint Root URL:
                              .col-7.internal-fsb-element(style={'display': 'block', 'width': '100%', padding: '0px'}, internal-fsb-guid="74d68ec6")
                                input.form-control.form-control-sm(style={'display': 'block', 'width': '100%'}, type="text", type="text")
                  .col-12.internal-fsb-element(style={'paddingLeft': '0px', 'paddingRight': '0px', display: (()=>{return (this.state.currentTab == 2) ? 'block' : 'none';})()}, internal-fsb-guid="d7b6b2c3")
                    .container-fluid
                      .internal-fsb-allow-cursor.internal-fsb-strict-layout.row
                        .-fsb-preset-7003c7d5.col-8.internal-fsb-element.offset-2(style={'FsbInheritedPresets': '7003c7d5', 'fontSize': '18px', 'textAlign': 'center'}, internal-fsb-guid="4e0342bd")
                          | Account Settings
                        .-fsb-preset-12bc19e4.col-12.internal-fsb-element(style={'FsbInheritedPresets': '12bc19e4'}, internal-fsb-guid="a379e3b8")
                          | Change Password
                        label.-fsb-preset-24bc9bae.col-12.internal-fsb-element(style={'FsbInheritedPresets': '24bc9bae'}, internal-fsb-guid="06cb46e5")
                          .container-fluid
                            .internal-fsb-allow-cursor.internal-fsb-strict-layout.row
                              .-fsb-preset-c8d71ae6.col-4.internal-fsb-element(style={'FsbInheritedPresets': 'c8d71ae6'}, internal-fsb-guid="0bd07ebe")
                                | New password:
                              .col-7.internal-fsb-element(style={'display': 'block', 'width': '100%', padding: '0px'}, internal-fsb-guid="3478b9ac")
                                input.form-control.form-control-sm(style={'display': 'block', 'width': '100%'}, type="text", type="text")
                        label.-fsb-preset-24bc9bae.col-12.internal-fsb-element(style={'FsbInheritedPresets': '24bc9bae'}, internal-fsb-guid="76574a2d")
                          .container-fluid
                            .internal-fsb-allow-cursor.internal-fsb-strict-layout.row
                              .-fsb-preset-c8d71ae6.col-4.internal-fsb-element(style={'FsbInheritedPresets': 'c8d71ae6'}, internal-fsb-guid="b4d97ce1")
                                | Confirm password:
                              .col-7.internal-fsb-element(style={'display': 'block', 'width': '100%', padding: '0px'}, internal-fsb-guid="33832ba7")
                                input.form-control.form-control-sm(style={'display': 'block', 'width': '100%'}, type="text", type="text")
                        .-fsb-preset-12bc19e4.col-12.internal-fsb-element(style={'FsbInheritedPresets': '12bc19e4'}, internal-fsb-guid="d577da61")
                          | Delete Account
                        .-fsb-preset-baed14b5.col-12.internal-fsb-element(style={'FsbInheritedPresets': 'baed14b5'}, internal-fsb-guid="1bdb6469")
                          | ⚠️ You can delete your account, but keep in mind this action is irreversible.
                        Button.btn.btn-danger.btn-sm.col-6.internal-fsb-allow-cursor.internal-fsb-element.offset-3(type="button", internal-fsb-guid="b391283e")
                          .internal-fsb-element(internal-fsb-guid="b391283e-text")
                            | Delete my account
                        .-fsb-preset-12bc19e4.col-12.internal-fsb-element(style={'FsbInheritedPresets': '12bc19e4'}, internal-fsb-guid="be0488a7")
                          | Linked Accounts
                        Button.btn.btn-primary.btn-sm.col-6.internal-fsb-allow-cursor.internal-fsb-element.offset-3(style={'marginBottom': '5px'}, type="button", internal-fsb-guid="187c250b")
                          .internal-fsb-element(internal-fsb-guid="187c250b-text")
                            | Link your Facebook account
                        Button.btn.btn-primary.btn-sm.col-6.internal-fsb-allow-cursor.internal-fsb-element.offset-3(style={'marginBottom': '5px'}, type="button", internal-fsb-guid="551c67a8")
                          .internal-fsb-element(internal-fsb-guid="551c67a8-text")
                            | Link your GitHub account
                        Button.btn.btn-danger.btn-sm.col-6.internal-fsb-allow-cursor.internal-fsb-element.offset-3(style={'marginBottom': '5px'}, type="button", internal-fsb-guid="82975b43")
                          .internal-fsb-element(internal-fsb-guid="82975b43-text")
                            | Unlink your Facebook account
                        Button.btn.btn-danger.btn-sm.col-6.internal-fsb-allow-cursor.internal-fsb-element.offset-3(style={'marginBottom': '5px'}, type="button", internal-fsb-guid="4e677128")
                          .internal-fsb-element(internal-fsb-guid="4e677128-text")
                            | Unlink your GitHub account
    `
  }
}
DeclarationHelper.declare('Site', 'Controls.Settings', Settings);
// <---Auto[ClassEnd]

// Export variables here:
//
export {IProps, IState, DefaultProps, DefaultState};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.