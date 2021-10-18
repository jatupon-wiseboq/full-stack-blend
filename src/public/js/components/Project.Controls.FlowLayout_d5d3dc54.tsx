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
}

let DefaultProps = Object.assign({}, DefaultBaseProps, {
  
});
let DefaultState = Object.assign({}, DefaultBaseState, {
  
});

// Auto[ClassBegin]--->
class FlowLayout_d5d3dc54 extends Base {
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
        
    DataManipulationHelper.register("1db8c022", "navigate", ["017cb292","1614a4e0","3029b7d2","6686dea2"], {initClass: null, submitCrossType: null, enabledRealTimeUpdate: false, manipulateInto: () => { return null; }});
  }
  // <---Auto[ClassBegin]
  
  // Declare class variables and functions here:
  //
  protected initialize(): void {
    // This is an example of creating a static collection and use in data binding:
    // 
    /* this.state.data = this.state.data || this.props.data || window.data || {};
    const staticCollection: HierarchicalDataTable = {
      source: SourceType.Collection,
      group: 'collection',
      rows: [{
        keys: {...}
        columns: {...}
        relations: {...}
      },
      ...]
    };
    this.state.data['collection'] = staticCollection; */
    //
    // Don't forget to create the mockup's schemata in Explore / Data.
    // 
  }
  
  protected componentDidMount(): void {
  	this.register();
  }
  
  protected componentWillUnmount(): void {
  }
  
  protected componentWillReceiveProps(nextProps: any): void {
    // This is an example of creating a dynamic collection and use in data binding:
    // 
    /* this.state.data = this.state.data || this.props.data || window.data || {};
    const dynamicCollection: HierarchicalDataTable = {
      source: SourceType.Collection,
      group: 'collection',
      rows: nextProps.items.map((item) => {
        return {
          keys: {...}
          columns: {...}
          relations: {...}
        };
      })
    };
    this.state.data['collection'] = dynamicCollection; */
    //
    // Don't forget to create the mockup's schemata in Explore / Data.
    // 
  }
  
  // Providing data array base on dot notation:
  // 
  protected getDataFromNotation(notation: string, inArray: boolean=false, always: boolean=false): any {
    // Redirect the target by overriding the notation value, for example:
    // 
    // notation = `collection[${notation.split(',')[1]}].collection`;
    //
    
    return super.getDataFromNotation(notation, inArray, always);
  }
  
  
  // Auto[Merging]--->
  // <---Auto[Merging]
  
  // Auto[ClassEnd]--->
  protected render(): any {
    TestHelper.identify();
    return pug `
      div(style=Object.assign({'WebkitBorderRadius': '5px 5px 5px 5px', 'WebkitBoxShadow': '0px 0px 5px rgba(0, 0, 0, 0.5)', 'background': 'rgba(224, 224, 224, 1)', 'borderRadius': '5px 5px 5px 5px', 'boxShadow': '0px 0px 5px rgba(0, 0, 0, 0.5)', 'color': 'rgba(92, 92, 92, 1)', 'paddingBottom': '20px', 'paddingLeft': '15px', 'paddingRight': '15px', 'paddingTop': '20px'}, this.props.forward && this.props.forward.styles || {}), className="col-10 col-md-8 col-xl-6 internal-fsb-element offset-1 offset-md-2 offset-xl-3 " + (this.props.forward && this.props.forward.classes || ''), internal-fsb-guid="d5d3dc54")
        .container-fluid
          .internal-fsb-strict-layout.row
            .col-12.internal-fsb-element(style={'fontSize': '18px', 'marginBottom': '15px', 'paddingLeft': '0px', 'paddingRight': '0px', 'textAlign': 'center'}, internal-fsb-guid="cea8a052")
              | กรุณาเข้าสู่ระบบ
            if this.getDataFromNotation("Collection.value")
              label.col-12.internal-fsb-element(internal-fsb-guid="29ba5223")
                .container-fluid
                  .internal-fsb-strict-layout.row
                    .-fsb-preset-aea82b31.-fsb-self-aea82b31.col-3.internal-fsb-element.offset-0(internal-fsb-guid="665de6ca")
                      | ชื่อ
                    .col-6.internal-fsb-element.offset-0(style={padding: '0px'}, internal-fsb-forward="1", internal-fsb-guid="017cb292")
                      input.form-control.form-control-sm(style={'display': 'block', 'width': '100%'}, placeholder="ชื่อ", required=true, type="text")
            label.col-12.internal-fsb-element(internal-fsb-guid="18d53a99")
              .container-fluid
                .internal-fsb-strict-layout.row
                  .-fsb-self-aea82b31.col-3.internal-fsb-element.offset-0(internal-fsb-guid="aea82b31")
                    | อีเมล์
                  .col-6.internal-fsb-element.offset-0(style={padding: '0px'}, internal-fsb-forward="1", internal-fsb-guid="3029b7d2")
                    input.form-control.form-control-sm(style={'display': 'block', 'width': '100%'}, placeholder="อีเมล์", required=true, type="text")
            label.col-12.internal-fsb-element(internal-fsb-guid="875bc087")
              .container-fluid
                .internal-fsb-strict-layout.row
                  .-fsb-preset-aea82b31.col-3.internal-fsb-element.offset-0(style={'FsbInheritedPresets': 'aea82b31', 'textAlign': 'right'}, internal-fsb-guid="b11c0720")
                    | รหัสผ่าน
                  .col-6.internal-fsb-element.offset-0(style={padding: '0px'}, internal-fsb-forward="1", internal-fsb-guid="1614a4e0")
                    input.form-control.form-control-sm(style={'display': 'block', 'width': '100%'}, placeholder="รหัสผ่าน", required=true, type="password")
            if this.getDataFromNotation("Collection.value")
              .col-9.internal-fsb-element.offset-3(style={'fontSize': '12px', 'paddingBottom': '15px'}, internal-fsb-guid="2c4256c4")
                | รหัสผ่านควรมีความยาวอย่างน้อย 8 ตัวอักษรหรือมากกว่านั้น
                div
                  | ประกอบด้วยอักขระดังต่อไปนี้อย่างน้อย 2 ใน 3
                div
                  | – ตัวอักษร (a-z, A-Z)
                div
                  | – ตัวเลข (0-9)
                div
                  | – เครื่องหมายหรืออักขระพิเศษ (!@#$%^&*()_+|~-=\`{}[]:”;'<>?,./)
            if this.getDataFromNotation("Collection.value")
              label.col-12.internal-fsb-element(internal-fsb-guid="33853938")
                .container-fluid
                  .internal-fsb-strict-layout.row
                    .-fsb-preset-aea82b31.col-3.internal-fsb-element.offset-0(style={'FsbInheritedPresets': 'aea82b31', 'textAlign': 'right'}, internal-fsb-guid="512177a7")
                      | ยืนยันรหัสผ่าน
                    .col-6.internal-fsb-element.offset-0(style={padding: '0px'}, internal-fsb-forward="1", internal-fsb-guid="6686dea2")
                      input.form-control.form-control-sm(style={'display': 'block', 'width': '100%'}, placeholder="รหัสผ่าน", type="password")
            Button.btn.btn-md.btn-primary.col-4.internal-fsb-element.offset-4(style={'marginTop': '5px'}, onClick=((event) => { window.internalFsbSubmit('1db8c022', 'User', event, ((results) => { this.manipulate('1db8c022', 'User', results); }).bind(this)); }).bind(this), type="button", internal-fsb-guid="1db8c022")
              .internal-fsb-element(internal-fsb-guid="1db8c022-text")
                | เข้าสู่ระบบ
    `
  }
}
DeclarationHelper.declare('Document', 'Controls.FlowLayout_d5d3dc54', FlowLayout_d5d3dc54);
// <---Auto[ClassEnd]

// Export variables here:
//
export {IProps, IState, DefaultProps, DefaultState};


// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.