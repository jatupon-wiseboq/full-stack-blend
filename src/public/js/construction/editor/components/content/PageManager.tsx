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
  watchingExtensionNames: ['pages', 'editingSiteName']
});

class PageManager extends Base<Props, State> {
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
        if (this.state.name && this.state.path) {
            let page = {
                id: this.state.id,
                name: this.state.name,
                path: this.state.path,
                state: 'update'
            };
            
            this.state.nodes.push({
                id: page.id,
                name: `<div class="name">${page.name}</div><div class="path">${page.path}</div>`,
                selectable: true,
                dropable: false,
                disabled: false,
                selected: false,
                customClassName: 'page',
                nodes: [],
                tag: page
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
        if (this.state.name && this.state.path) {
            let page = this.state.extensionValues[this.props.watchingExtensionNames[0]].filter(p => p.id == this.state.id)[0];
            page.name = this.state.name;
            page.path = this.state.path;
            page.state = 'update';
          
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
        
        let pages = this.state.extensionValues[this.props.watchingExtensionNames[0]];
        let editingSiteName = this.state.extensionValues[this.props.watchingExtensionNames[1]];
        pages = pages.filter(page => page.state != 'delete');
        
        for (let page of pages) {
            this.state.nodes.push({
                id: page.id,
                name: `<div class="name">${page.name}</div><div class="path">${page.path}</div>`,
                selectable: true,
                dropable: false,
                disabled: false,
                selected: (page.id == editingSiteName),
                customClassName: 'page',
                nodes: [],
                tag: page
            });
        }
        
        this.forceUpdate();
    }
    
    render() {
        return (
            <FullStackBlend.Components.ListManager customClassName="non-insertable page-manager" customDraggerClassName="draging-page-item" nodes={this.state.nodes} onUpdate={this.onUpdate.bind(this)} onDragged={this.onDragged.bind(this)} onInsertOptionVisibleChanged={this.onInsertOptionVisibleChanged.bind(this)} onUpdateOptionVisibleChanged={this.onUpdateOptionVisibleChanged.bind(this)}>
                <div className="section-container" style={{width: '175px'}}>
                    <div className="section-title">{(this.state.isAdding) ? "New Page" : "Update Page"}</div>
                    <div className="section-subtitle">Name</div>
                    <div className="section-body">
                        <FullStackBlend.Controls.Textbox ref="name" value={this.state.name} preRegExp='.*' postRegExp='.*' onUpdate={this.nameOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
                    </div>
                    <div className="section-subtitle">Path</div>
                    <div className="section-body">
                        <FullStackBlend.Controls.Textbox ref="value" value={this.state.path} preRegExp="(/|/([a-zA-Z]|[a-zA-Z][a-zA-Z0-9_]+|[a-zA-Z][a-zA-Z0-9_]+/)+)?" postRegExp="[/a-zA-Z0-9_]*" onUpdate={this.pathOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
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

DeclarationHelper.declare('Components.PageManager', PageManager);

export {PageManager};