import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {EventHelper} from '../../../helpers/EventHelper.js';
import {RandomHelper} from '../../../helpers/RandomHelper.js';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {ITreeNode} from '../../controls/TreeNode.js';
import '../../controls/Textbox.js';
import '../generic/ListManager.js';
import {FORWARED_ATTRIBUTES_FOR_CHILDREN} from '../../../Constants.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
  nodes: [ITreeNode];
  isAdding: boolean;
  id: string;
  name: string;
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
  nodes: [],
  isAdding: false,
  id: null,
  name: null
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
  watchingExtensionNames: ['components', 'editingComponent']
});

class ComponentManager extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;

    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        this.refresh();
    }
    
    private onUpdate(node: ITreeNode) {
      
    }
    
    private onDragged(element: ITreeNode, reference: ITreeNode, direction: InsertDirection) {
    		if (reference.id == 'delete') {
    		    element.tag.state = 'delete';
    		    
    		    perform('update', {
    		        extensions: [{
    		            name: this.props.watchingExtensionNames[0],
    		            value: this.state.nodes.filter(node => node.id !== 'delete').map(node => node.tag)
    		        },{
    		            name: this.props.watchingExtensionNames[1],
    		            value: null
    		        }]
    		    });
    		    
    		    this.refresh();
    		}
    		
    		window.document.body.click();
    }
    
    private onInsertOptionVisibleChanged(value: boolean) {
        this.setState({
            isAdding: value
        });
        
        if (value) {
            this.setState({
                id: RandomHelper.generateGUID(),
                name: null
            });
        }
    }
    
    private onUpdateOptionVisibleChanged(value: boolean, node: ITreeNode) {
        this.setState({
            isAdding: false
        });
        
        if (value) {
            this.setState({
                id: node.tag.id,
                name: node.tag.name
            });
        
            perform('update', {
    		        extensions: [{
    		            name: this.props.watchingExtensionNames[1],
    		            value: node.id
    		        }]
    		    });
        }
    }
    
    protected nameOnUpdate(value: any) {
        this.state.name = value;
    }
    
    private addOnClick(event) {
        if (this.state.name) {
            let component = {
                id: this.state.id,
                name: this.state.name,
                state: 'update'
            };
            
            this.state.nodes.push({
                id: component.id,
                name: `<div class="name">${component.name}</div>`,
                selectable: true,
                dropable: false,
                disabled: false,
                selected: false,
                customClassName: 'component',
                nodes: [],
                tag: component
            });
          
            perform('update', {
    		        extensions: [{
    		            name: this.props.watchingExtensionNames[0],
    		            value: this.state.nodes.filter(node => node.id !== 'delete').map(node => node.tag)
    		        }]
    		    });
            
            this.refresh();
            
            window.document.body.click();
        }
    }
    
    private updateOnClick(event) {
        if (this.state.name) {
            let component = this.state.extensionValues[this.props.watchingExtensionNames[0]].filter(p => p.id == this.state.id)[0];
            component.name = this.state.name;
            component.state = 'update';
          
            perform('update', {
    		        extensions: [{
    		            name: this.props.watchingExtensionNames[0],
    		            value: this.state.nodes.filter(node => node.id !== 'delete').map(node => node.tag)
    		        }]
    		    });
    		    
    		    this.refresh();
            
            window.document.body.click();
        }
    }
    
    private refresh() {
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
        
        let components = this.state.extensionValues[this.props.watchingExtensionNames[0]] || [];
        let editingComponent = this.state.extensionValues[this.props.watchingExtensionNames[1]];
        components = components.filter(component => component.state != 'delete');
        
        for (let component of components) {
            this.state.nodes.push({
                id: component.id,
                name: `<div class="name">${component.name}</div>`,
                selectable: true,
                dropable: false,
                disabled: false,
                selected: (component.id == editingComponent),
                customClassName: 'component',
                nodes: [],
                tag: component
            });
        }
        
        this.forceUpdate();
    }
    
    render() {
        return (
            <FullStackBlend.Components.ListManager customClassName="non-insertable component-manager" customDraggerClassName="draging-component-item" nodes={this.state.nodes} onUpdate={this.onUpdate.bind(this)} onDragged={this.onDragged.bind(this)} onInsertOptionVisibleChanged={this.onInsertOptionVisibleChanged.bind(this)} onUpdateOptionVisibleChanged={this.onUpdateOptionVisibleChanged.bind(this)}>
                <div className="section-container" style={{width: '175px'}}>
                    <div className="section-title">{(this.state.isAdding) ? "New Component" : "Update Component"}</div>
                    <div className="section-subtitle">Title</div>
                    <div className="section-body">
                        <FullStackBlend.Controls.Textbox ref="name" value={this.state.name} preRegExp='.*' postRegExp='.*' onUpdate={this.nameOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
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

DeclarationHelper.declare('Components.ComponentManager', ComponentManager);

export {ComponentManager};