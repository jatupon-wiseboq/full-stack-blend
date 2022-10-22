import {CodeHelper} from '../../../helpers/CodeHelper';
import {EventHelper} from '../../../helpers/EventHelper';
import {HTMLHelper} from '../../../helpers/HTMLHelper';
import {RandomHelper} from '../../../helpers/RandomHelper';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import {ITreeNode} from '../../controls/TreeNode';
import '../../controls/Textbox';
import '../generic/ListManager';
import {FORWARED_ATTRIBUTES_FOR_CHILDREN} from '../../../Constants';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
  path: boolean;
  sortFieldName: string;
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
  path: false,
  sortFieldName: 'name'
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
    
    private onStartDragging(node: ITreeNode) {
    		let container = ReactDOM.findDOMNode(this.refs.listManager);
    		let deleteElement = HTMLHelper.getElementByClassName('delete', container);
    		
    		deleteElement.style.top = (container.firstElementChild.scrollTop + 3) + 'px';
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
                description: null,
                keywords: null,
                image: null,
                path: null,
                sitemap: null
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
                description: node.tag.description,
                keywords: node.tag.keywords,
                image: node.tag.image,
                path: node.tag.path,
                sitemap: node.tag.sitemap
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
    
    protected descriptionOnUpdate(value: any) {
        this.state.description = value;
    }
    
    protected keywordsOnUpdate(value: any) {
        this.state.keywords = value;
    }
    
    protected imageOnUpdate(value: any) {
        this.state.image = value;
    }
    
    protected pathOnUpdate(value: any) {
        this.state.path = value;
    }
    
    protected sitemapOnUpdate(value: any) {
        this.state.sitemap = value;
        this.forceUpdate();
    }
    
    private addOnClick(event) {
        if (this.state.name && (!this.props.path || this.state.path)) {
            let item = {
                id: this.state.id,
                name: this.state.name,
                description: this.state.description,
                keywords: this.state.keywords,
                image: this.state.image,
                path: this.state.path,
                sitemap: this.state.sitemap,
                state: 'update'
            };
            
            this.state.nodes.push({
                id: item.id,
                name: this.getDisplay(item),
                selectable: true,
                dropable: false,
								insertable: true,
								dragable: true,
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
            item.description = this.state.description;
            item.keywords = this.state.keywords;
            item.image = this.state.image;
            item.path = this.state.path;
            item.sitemap = this.state.sitemap;
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
        
    		if (this.state.extensionValues[this.props.watchingExtensionNames[0]]) {
    				this.state.extensionValues[this.props.watchingExtensionNames[0]].sort((a, b) => {
    					return (a[this.props.sortFieldName] < b[this.props.sortFieldName]) ? -1 : 1;
    				});
    		}
        
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
								insertable: true,
								dragable: true,
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
        return `<div className="name">${item.name}</div>`;
    }
    
    render() {
    		const currentMode = this.props && this.props.watchingExtensionNames && this.props.watchingExtensionNames[0];
        return (
            <FullStackBlend.Components.ListManager ref="listManager" customClassName="non-insertable html-manager" customDraggerClassName="draging-html-item" nodes={this.state.nodes} onStartDragging={this.onStartDragging.bind(this)} onUpdate={this.onUpdate.bind(this)} onDragged={this.onDragged.bind(this)} onInsertOptionVisibleChanged={this.onInsertOptionVisibleChanged.bind(this)} onUpdateOptionVisibleChanged={this.onUpdateOptionVisibleChanged.bind(this)}>
                <div className="section-container" style={{width: '225px'}}>
                    <div className="section-title">{(this.state.isAdding) ? `New ${this.getCategoryName()}` : `Update ${this.getCategoryName()}`}</div>
                    <div className="section-subtitle">Title</div>
                    <div className="section-body">
                        <FullStackBlend.Controls.Textbox ref="name" value={this.state.name} preRegExp='.*' postRegExp='.*' onUpdate={this.nameOnUpdate.bind(this)} maxLength={50}></FullStackBlend.Controls.Textbox>
                    </div>
                    <div className="section-subtitle" style={{display: (this.state.id == 'index' || this.props.path == false) ? 'none' : 'block'}}>Path</div>
                    <div className="section-body" style={{display: (this.state.id == 'index' || this.props.path == false) ? 'none' : 'block'}}>
                        <FullStackBlend.Controls.Textbox ref="value" value={this.state.path} placeholder="/path/name/:a/:b" preRegExp="(/|/([:a-zA-Z]|[:a-zA-Z][a-zA-Z0-9_]+|[:a-zA-Z][a-zA-Z0-9_]+/)+)?" postRegExp="[/:a-zA-Z0-9_]*" onUpdate={this.pathOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
                    </div>
                    <div className="section-subtitle">Description</div>
                    <div className="section-body">
                        <FullStackBlend.Controls.Textbox ref="description" value={this.state.description} preRegExp='.*' postRegExp='.*' onUpdate={this.descriptionOnUpdate.bind(this)} maxLength={165} multiline={true} resizable={false}></FullStackBlend.Controls.Textbox>
                    </div>
                    {['components', 'popups'].indexOf(currentMode) == -1 && (
                    	<div>
		                    <div className="section-subtitle">Keywords</div>
		                    <div className="section-body">
		                        <FullStackBlend.Controls.Textbox ref="keywords" value={this.state.keywords} placeholder="keyword, abc, ..." preRegExp='.*' postRegExp='.*' onUpdate={this.keywordsOnUpdate.bind(this)} rows={2} maxLength={1000} multiline={true} resizable={false}></FullStackBlend.Controls.Textbox>
		                    </div>
		                    <div className="section-subtitle">Image</div>
		                    <div className="section-body">
		                        <FullStackBlend.Controls.Textbox ref="image" value={this.state.image} placeholder="URL" preRegExp='.*' postRegExp='.*' onUpdate={this.imageOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
		                    </div>
		                    <div className="section-subtitle">Sitemap Option</div>
		                    <div className="section-body">
		                    		<FullStackBlend.Components.RadioButtonPicker value={{sitemap: this.state.sitemap}} onValueChange={this.sitemapOnUpdate.bind(this)} options={[[['sitemap'], 'true', ["fa-power-off", "add"]]]}/>
		                    </div>
		                  </div>
                    )}
                    <div className="section-body" style={{display: (this.state.isAdding) ? '' : 'none'}}>
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