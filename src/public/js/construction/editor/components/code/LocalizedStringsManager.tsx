import {CodeHelper} from '../../../helpers/CodeHelper';
import {EventHelper} from '../../../helpers/EventHelper';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import {ITreeNode} from '../../controls/TreeNode';
import '../../controls/Textbox';
import '../generic/ListManager';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
	prev: string;
	key: string;
	guid: string;
  value: string;
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
});

class LocalizedStringsManager extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;

    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        let values: string[] = (this.state.extensionValues[this.props.watchingExtensionNames[0]] || '').split('`');
        values = values.filter(value => !!value);
        
        let nodes: [ITreeNode] = [{
            id: 'delete',
            name: 'Delete',
            selectable: false,
            dropable: true,
            disabled: false,
            selected: false,
            customClassName: 'delete',
            nodes: []
        }];
        
        for (let value of values) {
        		let splited = value.split('~');
            nodes.push({
            		id: JSON.stringify({key: splited[0], value: splited[1]}),
                name: `${splited[0].substring(0, 32).trim() + ((splited[0].length > 32) ? '...' : '')} = ${splited[1].substring(0, 32).trim() + ((splited[1].length > 32) ? '...' : '')}`,
                selectable: true,
                dropable: false,
								insertable: true,
								dragable: true,
                disabled: false,
                selected: false,
                nodes: []
            });
        }
        
        this.state.nodes = nodes;
        this.forceUpdate();
    }
    
    private onUpdate(node: ITreeNode) {
        
    }
    
    private onDragged(element: ITreeNode, reference: ITreeNode, direction: InsertDirection) {
    		if (reference.id == 'delete') {
    		    let info = JSON.parse(element.id);
    		    
    		    let values: string[] = (this.state.extensionValues[this.props.watchingExtensionNames[0]] || '').split('`');
    		    values = values.filter(value => value.indexOf(info.key + '~') == -1);
    		    
    		    perform('update', {
    		        extensions: [{
		        				name: this.props.watchingExtensionNames[0],
		        				value: values.join('`')
		        		}]
    		    });
    		}
    		
    		document.body.click();
    }
    
    private onInsertOptionVisibleChanged(value: boolean) {
        this.setState({
            isAdding: value
        });
        
        if (value) {
            this.setState({
                key: '',
                guid: '',
                value: ''
            });
        }
    }
    
    private onUpdateOptionVisibleChanged(value: boolean, node: ITreeNode) {
        this.setState({
            isAdding: false
        });
        
        if (value) {
            let info = JSON.parse(node.id);
            
            this.setState({
            		prev: info.key,
                key: info.key,
                guid: info.key.split('#')[1],
                value: info.value
            });
        }
    }
    
    protected keyOnUpdate(value: any) {
        this.state.key = value;
    }
    
    protected valueOnUpdate(value: any) {
        this.state.value = value;
    }
    
    private addOnClick(event) {
        if (this.state.key && this.state.value) {
            let values: string[] = (this.state.extensionValues[this.props.watchingExtensionNames[0]] || '').split('`');
    		    values = values.filter(value => value.indexOf(this.state.key + '~') == -1);
    		    
    		    values.push(this.state.key + (this.state.guid ? '#' + this.state.guid : '') + '~' + this.state.value);
    		    
    		    perform('update', {
    		        extensions: [{
		        				name: this.props.watchingExtensionNames[0],
		        				value: values.join('`')
		        		}]
    		    });
            
            document.body.click();
        }
    }
    
    private updateOnClick(event) {
        if (this.state.key && this.state.value) {
            let values: string[] = (this.state.extensionValues[this.props.watchingExtensionNames[0]] || '').split('`');
    		    values = values.filter(value => value.indexOf(this.state.prev + '~') == -1);
    		    
    		    values.push(this.state.key + (this.state.guid ? '#' + this.state.guid : '') + '~' + this.state.value);
    		    
    		    perform('update', {
    		        extensions: [{
		        				name: this.props.watchingExtensionNames[0],
		        				value: values.join('`')
		        		}]
    		    });
            
            document.body.click();
        }
    }
    
    render() {
        return (
            <FullStackBlend.Components.ListManager customClassName="non-selectable non-insertable" nodes={this.state.nodes} onUpdate={this.onUpdate.bind(this)} onDragged={this.onDragged.bind(this)} onInsertOptionVisibleChanged={this.onInsertOptionVisibleChanged.bind(this)} onUpdateOptionVisibleChanged={this.onUpdateOptionVisibleChanged.bind(this)}>
                <div className="section-container" style={{width: '75vw'}}>
                    <div className="section-title">{(this.state.isAdding) ? "New Translation" : "Update a Translation"}</div>
                    <div className="section-subtitle" style={{display: (this.state.isAdding) ? '' : 'none'}}>Original From Workspace</div>
                    <div className="section-body" style={{display: (this.state.isAdding) ? '' : 'none'}}>
                        <FullStackBlend.Controls.Textbox ref="key" multiline={true} value={this.state.key} placeholder="words, phrases, or sentences" preRegExp='[^~`]*' postRegExp='[^~`]*' onUpdate={this.keyOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
                    </div>
                    <div className="section-subtitle">Secondary Translation</div>
                    <div className="section-body">
                        <FullStackBlend.Controls.Textbox ref="value" multiline={true} value={this.state.value} placeholder="translation into a secondary language" preRegExp='[^~`]*' postRegExp='[^~`]*' onUpdate={this.valueOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
                    </div>
                    <div className="section-body" style={{display: (this.state.isAdding) ? '' : 'none'}}>
                        <button className="btn btn-sm btn-primary" onClick={this.addOnClick.bind(this)} style={{padding: '3px 20px', borderRadius: '4px'}}>Create</button>
                    </div>
                    <div className="section-body" style={{display: (this.state.isAdding) ? 'none' : 'inline-block'}}>
                        <button className="btn btn-sm btn-primary" onClick={this.updateOnClick.bind(this)} style={{padding: '3px 20px', borderRadius: '4px'}}>Update</button>
                    </div>
                    <div className="section-note" style={{display: (this.state.isAdding) ? 'none' : 'inline-block'}}>{this.state.key}</div>
                </div>
            </FullStackBlend.Components.ListManager>
        )
    }
}

DeclarationHelper.declare('Components.LocalizedStringsManager', LocalizedStringsManager);

export {LocalizedStringsManager};