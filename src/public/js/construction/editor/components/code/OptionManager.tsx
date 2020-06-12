import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {EventHelper} from '../../../helpers/EventHelper.js';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {InsertDirection, ITreeNode} from '../../controls/TreeNode.js';
import '../../controls/Textbox.js';
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
  current: ITreeNode;
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
  watchingExtensionNames: ['elementTreeNodes']
});

class OptionManager extends Base<Props, State> {
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
        
        let options = this.state.extensionValues[this.props.watchingExtensionNames[0]];
        if (options != null) {
            let nodes = this.recursiveWalkExtractingNodes(options);
            let selected = nodes.filter(node => node.selected)[0];
            
            if (selected) {
                let count = 0;
                for (let info of selected.tag.options) {
                    this.state.nodes.push({
                        id: 'option' + count,
                        name: info.name + ' (' + info.value + ')',
                        selectable: true,
                        dropable: false,
                        disabled: false,
                        selected: info.selected,
                        nodes: [],
                        tag: info
                    });
                    count += 1;
                }
            }
        }
        
        this.forceUpdate();
    }
    
    private onUpdate(node: ITreeNode) {
        node.tag.selected = node.selected;
        
        this.performUpdate();
        
        window.document.body.click();
    }
    
    private onDragged(element: ITreeNode, reference: ITreeNode, direction: InsertDirection) {
    		let index = this.state.nodes.indexOf(element);
    		this.state.nodes.splice(index, 1);
    		let refIndex = this.state.nodes.indexOf(reference);
    		
    		switch (direction) {
    				case InsertDirection.TOP:
    					this.state.nodes.splice(refIndex, 0, element);
    					break;
    				case InsertDirection.INSIDE:
    					break;
    				case InsertDirection.BOTTOM:
    					this.state.nodes.splice(refIndex + 1, 0, element);
    					break;
    				default:
    					return;
    		}
    		
    		this.performUpdate();
    		
    		window.document.body.click();
    }
    
    private onInsertOptionVisibleChanged(value: boolean) {
        this.setState({
            isAdding: value,
            current: null
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
            this.setState({
                name: node.tag.name,
                value: node.tag.value,
                current: node
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
            this.state.nodes.push({
                name: this.state.name + ' (' + this.state.value + ')',
                selectable: true,
                dropable: false,
                disabled: false,
                selected: false,
                nodes: [],
                tag: {
                  name: this.state.name,
                  value: this.state.value,
                  selected: false
                }
            });
            
            this.performUpdate();
            
            window.document.body.click();
        }
    }
    
    private updateOnClick(event) {
        if (this.state.name && this.state.value) {
            this.state.current.tag.name = this.state.name;
            this.state.current.tag.value = this.state.value;
            this.state.current.name = this.state.name;
            this.state.current.value = this.state.value;
            
            this.performUpdate();
            
            window.document.body.click();
        }
    }
    
    private performUpdate() {
        perform('update', {
            options: this.state.nodes.filter(node => node.id != 'delete').map(node => node.tag)
        });
    }
    
    private recursiveWalkExtractingNodes(nodes: [ITreeNode], output: [ITreeNode]=[]) {
        for (let node of nodes) {
            if (['Select'].indexOf(node.tag.class) != -1) {
                output.push(node);
            }
            this.recursiveWalkExtractingNodes(node.nodes, output);
        }
        return output;
    }
    
    render() {
        return (
            <FullStackBlend.Components.ListManager nodes={this.state.nodes} onUpdate={this.onUpdate.bind(this)} onDragged={this.onDragged.bind(this)} onInsertOptionVisibleChanged={this.onInsertOptionVisibleChanged.bind(this)} onUpdateOptionVisibleChanged={this.onUpdateOptionVisibleChanged.bind(this)}>
                <div className="section-container" style={{width: '175px'}}>
                    <div className="section-title">{(this.state.isAdding) ? "New Option" : "Update Option"}</div>
                    <div className="section-subtitle">Name</div>
                    <div className="section-body">
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

DeclarationHelper.declare('Components.OptionManager', OptionManager);

export {OptionManager};