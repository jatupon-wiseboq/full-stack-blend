import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {EventHelper} from '../../../helpers/EventHelper.js';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {ITreeNode} from '../../controls/TreeNode.js';
import '../../controls/TextBox.js';
import '../generic/ListManager.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
  nodes: [ITreeNode];
  isAdding: boolean;
  name: string;
  value: string;
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
  nodes: [],
  isAdding: false,
  name: '',
  value: ''
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
  watchingAttributeNames: [/^((?!^class$|^style$|^contenteditable|^internal-fsb-[a-zA-Z0-9\-]+$).)*$/]
});

class AttributeManager extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;

    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        this.state.nodes = [{
            id: 'delete',
            name: 'Delete',
            selectable: false,
            dropable: true,
            disabled: false,
            selected: false,
            customClassName: 'delete',
            nodes: []
        }];
        
        let hash = this.state.attributeValues[this.props.watchingAttributeNames[0]];
        for (let name in hash) {
            if (hash.hasOwnProperty(name)) {
                let value = hash[name];
                this.state.nodes.push({
                    id: JSON.stringify({name: name, value: value}),
                    name: name + '=' + ((value[0] == '{') ? value : '"' + value.replace('"', '\\"') + '"'),
                    selectable: true,
                    dropable: false,
                    disabled: false,
                    selected: false,
                    nodes: []
                });
            }
        }
        
        this.forceUpdate();
    }
    
    private onUpdate(node: ITreeNode) {
        
    }
    
    private onDragged(element: ITreeNode, reference: ITreeNode, direction: InsertDirection) {
    		if (reference.id == 'delete') {
    		    let info = JSON.parse(element.id);
    		    
    		    delete this.state.attributeValues[info.name];
    		    
    		    perform('update', {
    		        attributes: [{
    		            name: info.name,
    		            value: null
    		        }]
    		    });
    		}
    }
    
    private onInsertOptionVisibleChanged(value: boolean) {
        this.setState({
            isAdding: value
        });
        
        if (value) {
            this.setState({
                name: '',
                value: ''
            });
        }
    }
    
    private onUpdateOptionVisibleChanged(value: boolean, node: ITreeNode) {
        if (value) {
            let info = JSON.parse(node.id);
            
            this.setState({
                name: info.name,
                value: info.value
            });
        }
    }
    
    protected nameOnUpdate(value: any) {
        this.state.name = value;
    }
    
    protected valueOnUpdate(value: any) {
        this.state.value = value;
    }
    
    private addOnClick(event) {
        if (this.state.name && this.state.value) {
            if (this.state.name.match(this.props.watchingAttributeNames[0]) == null) {
                return EventHelper.cancel(event);
            }
          
            perform('update', {
    		        attributes: [{
    		            name: this.state.name,
    		            value: this.state.value
    		        }]
    		    });
            
            window.document.body.click();
        }
    }
    
    private updateOnClick(event) {
        if (this.state.name && this.state.value) {
            perform('update', {
    		        attributes: [{
    		            name: this.state.name,
    		            value: this.state.value
    		        }]
    		    });
            
            window.document.body.click();
        }
    }
    
    render() {
        return (
            <FullStackBlend.Components.ListManager customClassName="non-selectable" nodes={this.state.nodes} onUpdate={this.onUpdate.bind(this)} onDragged={this.onDragged.bind(this)} onInsertOptionVisibleChanged={this.onInsertOptionVisibleChanged.bind(this)} onUpdateOptionVisibleChanged={this.onUpdateOptionVisibleChanged.bind(this)}>
                <div className="section-container" style={{width: '175px'}}>
                    <div className="section-title">{(this.state.isAdding) ? "New Attribute" : "Update Attribute"}</div>
                    <div className="section-subtitle" style={{display: (this.state.isAdding) ? 'inline-block' : 'none'}}>Name</div>
                    <div className="section-body" style={{display: (this.state.isAdding) ? 'inline-block' : 'none'}}>
                        <FullStackBlend.Controls.Textbox ref="name" value={this.state.name} preRegExp='[^"]*' postRegExp='[^"]*' onUpdate={this.nameOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
                    </div>
                    <div className="section-subtitle">Value</div>
                    <div className="section-body">
                        <FullStackBlend.Controls.Textbox ref="value" value={this.state.value} preRegExp='.*' postRegExp='.*' onUpdate={this.valueOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
                    </div>
                    <div className="section-body" style={{display: (this.state.isAdding) ? 'inline-block' : 'none'}}>
                        <button className="btn btn-sm btn-primary" onClick={this.addOnClick.bind(this)} style={{padding: '3px 20px', borderRadius: '4px'}}>Create</button>
                    </div>
                    <div className="section-body" style={{display: (this.state.isAdding) ? 'none' : 'inline-block'}}>
                        <button className="btn btn-sm btn-primary" onClick={this.updateOnClick.bind(this)} style={{padding: '3px 20px', borderRadius: '4px'}}>Update</button>
                    </div>
                </div>
            </FullStackBlend.Components.ListManager>
        )
    }
}

DeclarationHelper.declare('Components.AttributeManager', AttributeManager);

export {AttributeManager};