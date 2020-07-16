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
  path: boolean;
}

interface State extends IState {
  nodes: [ITreeNode];
  isAdding: boolean;
  id: string;
  name: string;
  path: string;
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
  nodes: [],
  isAdding: false,
  id: null,
  name: null,
  path: null
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
  path: false
});

class HTMLManager extends Base<Props, State> {
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
    		    if (element.tag.id == 'index') {
    		    	alert('You cannot delete home page.');
    		    	return;
    		    }
    		    
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
    		
    		document.body.click();
    }
    
    private onInsertOptionVisibleChanged(value: boolean) {
        this.setState({
            isAdding: value
        });
        
        if (value) {
            this.setState({
                id: RandomHelper.generateGUID(),
                name: null,
                path: null
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
                name: node.tag.name,
                path: node.tag.path
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
    
    protected pathOnUpdate(value: any) {
        this.state.path = value;
    }
    
    private addOnClick(event) {
        if (this.state.name && (!this.props.path || this.state.path)) {
            let item = {
                id: this.state.id,
                name: this.state.name,
                path: this.state.path,
                state: 'update'
            };
            
            this.state.nodes.push({
                id: item.id,
                name: this.getDisplay(item),
                selectable: true,
                dropable: false,
                disabled: false,
                selected: false,
                customClassName: 'item',
                nodes: [],
                tag: item
            });
          
            perform('update', {
    		        extensions: [{
    		            name: this.props.watchingExtensionNames[0],
    		            value: this.state.nodes.filter(node => node.id !== 'delete').map(node => node.tag)
    		        }]
    		    });
            
            this.refresh();
            
            document.body.click();
        }
    }
    
    private updateOnClick(event) {
        if (this.state.name && (!this.props.path || this.state.path)) {
            let item = this.state.extensionValues[this.props.watchingExtensionNames[0]].filter(p => p.id == this.state.id)[0];
            item.name = this.state.name;
            item.path = this.state.path;
            item.state = 'update';
          
            perform('update', {
    		        extensions: [{
    		            name: this.props.watchingExtensionNames[0],
    		            value: this.state.nodes.filter(node => node.id !== 'delete').map(node => node.tag)
    		        }]
    		    });
    		    
    		    this.refresh();
            
            document.body.click();
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
        
        let items = this.state.extensionValues[this.props.watchingExtensionNames[0]];
        let editingID = this.state.extensionValues[this.props.watchingExtensionNames[1]];
        items = items.filter(item => item.state != 'delete');
        
        let hasSelectingItem = false;
        for (let item of items) {
            if (!hasSelectingItem) hasSelectingItem = (item.id == editingID);
            this.state.nodes.push({
                id: item.id,
                name: this.getDisplay(item),
                selectable: true,
                dropable: false,
                disabled: false,
                selected: (item.id == editingID),
                customClassName: 'html',
                nodes: [],
                tag: item
            });
        }
        
        if (!hasSelectingItem) {
            let nodes = this.state.nodes.filter(node => node.id != 'delete' && node.tag.state != 'delete');
            if (nodes.length != 0) {
                nodes[0].selected = true;
                this.state.extensionValues[this.props.watchingExtensionNames[1]] = nodes[0].id;
                
                perform('update', {
        		        extensions: [{
        		            name: this.props.watchingExtensionNames[1],
        		            value: nodes[0].id
        		        }]
        		    });
            }
        }
        
        this.forceUpdate();
    }
    
    protected getCategoryName() {
        return 'Item';
    }
    
    protected getDisplay(item: any) {
        return `<div class="name">${item.name}</div>`;
    }
    
    render() {
        return (
            <FullStackBlend.Components.ListManager customClassName="non-insertable html-manager" customDraggerClassName="draging-html-item" nodes={this.state.nodes} onUpdate={this.onUpdate.bind(this)} onDragged={this.onDragged.bind(this)} onInsertOptionVisibleChanged={this.onInsertOptionVisibleChanged.bind(this)} onUpdateOptionVisibleChanged={this.onUpdateOptionVisibleChanged.bind(this)}>
                <div className="section-container" style={{width: '175px'}}>
                    <div className="section-title">{(this.state.isAdding) ? `New ${this.getCategoryName()}` : `Update ${this.getCategoryName()}`}</div>
                    <div className="section-subtitle">Title</div>
                    <div className="section-body">
                        <FullStackBlend.Controls.Textbox ref="name" value={this.state.name} preRegExp='.*' postRegExp='.*' onUpdate={this.nameOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
                    </div>
                    <div className="section-subtitle" style={{display: (this.state.id == 'index' || this.props.path == false) ? 'none' : 'block'}}>Path</div>
                    <div className="section-body" style={{display: (this.state.id == 'index' || this.props.path == false) ? 'none' : 'block'}}>
                        <FullStackBlend.Controls.Textbox ref="value" value={this.state.path} preRegExp="(/|/([:a-zA-Z]|[:a-zA-Z][a-zA-Z0-9_]+|[:a-zA-Z][a-zA-Z0-9_]+/)+)?" postRegExp="[/:a-zA-Z0-9_]*" onUpdate={this.pathOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
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

DeclarationHelper.declare('Components.HTMLManager', HTMLManager);

export {Props, State, ExtendedDefaultState, ExtendedDefaultProps, HTMLManager};