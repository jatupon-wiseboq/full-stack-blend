import {TextHelper} from '../../../helpers/TextHelper.js';
import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {IProps, IState, DefaultProps, DefaultState, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {ITreeNode} from './../TreeNode.js';
import '../../controls/Tree.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
    nodes: [ITreeNode]
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
    nodes: []
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
    watchingAttributeNames: ['internal-fsb-guid', 'class'],
    watchingStyleNames: ['-fsb-inherited-presets', '-fsb-reusable-name', '-fsb-reusable-id'],
    watchingExtensionNames: ['stylesheetDefinitionRevision']
});

class CSSPresets extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;

    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        let nodes: [ITreeNode] = [];
        
        if (properties.extensions && properties.extensions.stylesheetDefinitionKeys) {
        		let allInheritanceHash = {};
        		let prioritizedKeys = [];
        		let stylesheetDefinitionHash = {};
        		for (let info of properties.extensions.stylesheetDefinitionKeys) {
        			prioritizedKeys.push(info.name);
        			stylesheetDefinitionHash[info.id] = info;
        		}
        		for (let info of properties.extensions.stylesheetDefinitionKeys) {
        			allInheritanceHash[info.id] = info.inheritances.filter(token => token != '').sort((a, b) => {
        				
        				let pa = prioritizedKeys.indexOf(stylesheetDefinitionHash[a] && stylesheetDefinitionHash[a].name || null);
					    	let pb = prioritizedKeys.indexOf(stylesheetDefinitionHash[b] && stylesheetDefinitionHash[b].name || null);
					    	
					    	if (pa == -1) pa = Number.MAX_SAFE_INTEGER;
					    	if (pb == -1) pa = Number.MAX_SAFE_INTEGER;
					    	
					    	return (pa > pb) ? 1 : -1;
        			});
        		}
        		
		        for (let info of properties.extensions.stylesheetDefinitionKeys) {
		            let isItself = (info.id == this.state.styleValues['-fsb-reusable-id']);
		        		let chosen = (isItself) ? false : (this.state.styleValues['-fsb-inherited-presets'] &&
		                         this.state.styleValues['-fsb-inherited-presets'].indexOf(info.id) != -1) || false;
		        		
		        		let childNodes = [];
		        		if (allInheritanceHash[info.id]) {
		        			for (let childKey of allInheritanceHash[info.id]) {
		        				let childInfo = stylesheetDefinitionHash[childKey];
		        				if (!childInfo) continue;
		        				
		        				childNodes.push({
		        					id: null,
		        					name: childInfo.name.replace(/_/g, ' ') + ((allInheritanceHash[childKey] && allInheritanceHash[childKey].length != 0) ? ' ...' : ''),
		        					selectable: true,
		                	disabled: true,
		                	selected: chosen,
		                	nodes: []
		        				});
		        			}
		        		}
		        		
		            nodes.push({
		            		id: info.id,
		                name: info.name.replace(/_/g, ' '),
		                selectable: true,
		                disabled: isItself,
		                selected: chosen,
		                nodes: childNodes
		            });
		        }
      	}
        
        this.state.nodes = nodes;
        
        this.forceUpdate();
    }
    
    protected onUpdate(node: ITreeNode) {
        let presets = [];
        for (let node of this.state.nodes) {
            if (node.selected) {
                presets.push(node.id);
            }
        }
        
        let className = this.state.attributeValues['class'] || '';
    
    		presets.sort();
    		
        perform('update', {
        		attributes: [{
        				name: 'class',
        				value: TextHelper.mergeClassNameWithPrefixedClasses(this.state.attributeValues['class'], '-fsb-preset-', presets)
        		}],
            styles: [{
                name: '-fsb-inherited-presets',
                value: presets.join(', ')
            }]
        });
    }
    
    render() {
      return (
        <FullStackBlend.Controls.Tree nodes={this.state.nodes} onUpdate={this.onUpdate.bind(this)} />
      )
    }
}

DeclarationHelper.declare('Components.CSSPresets', CSSPresets);

export {Props, State, CSSPresets};