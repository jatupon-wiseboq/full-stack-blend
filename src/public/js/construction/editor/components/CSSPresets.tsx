import {TextHelper} from '../../helpers/TextHelper.js';
import {CodeHelper} from '../../helpers/CodeHelper.js';
import {IProps, IState, DefaultProps, DefaultState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {ITreeNode} from './TreeNode.js';
import '../controls/Tree.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
}

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
    watchingAttributeNames: ['internal-fsb-guid', 'class'],
    watchingStyleNames: ['-fsb-inherited-presets', '-fsb-reusable-name'],
    watchingExtensionNames: ['stylesheetDefinitionRevision']
});

class CSSPresets extends Base<Props, State> {
    protected static defaultProps: Props = ExtendedDefaultProps;

    constructor(props) {
        super(props);
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        console.log('properties.extensions.stylesheetDefinitionKeys', properties.extensions.stylesheetDefinitionKeys);
        
        let nodes: [ITreeNode] = [];
        
        if (properties.extensions && properties.extensions.stylesheetDefinitionKeys) {
        		let allInheritanceHash = {};
        		let prioritizedKeys = [];
        		for (let info of properties.extensions.stylesheetDefinitionKeys) {
        			prioritizedKeys.push(info.name);
        		}
        		for (let info of properties.extensions.stylesheetDefinitionKeys) {
        			allInheritanceHash[info.name] = info.inheritances.filter(token => token != '').sort((a, b) => {
        				let pa = prioritizedKeys.indexOf(a);
					    	let pb = prioritizedKeys.indexOf(b);
					    	
					    	if (pa == -1) pa = Number.MAX_SAFE_INTEGER;
					    	if (pb == -1) pa = Number.MAX_SAFE_INTEGER;
					    	
					    	return pa > pb;
        			});
        		}
        		
		        for (let info of properties.extensions.stylesheetDefinitionKeys) {
		            let isItself = (info.name == this.state.styleValues['-fsb-reusable-name']);
		        		let chosen = (isItself) ? false : (this.state.styleValues['-fsb-inherited-presets'] &&
		                         (', ' + this.state.styleValues['-fsb-inherited-presets']).indexOf(', ' + info.name) != -1);
		        		
		        		let childNodes = [];
		        		if (allInheritanceHash[info.name]) {
		        			for (let childKey of allInheritanceHash[info.name]) {
		        				childNodes.push({
		        					id: null,
		        					name: childKey + ((allInheritanceHash[childKey] && allInheritanceHash[childKey].length != 0) ? ' ...' : ''),
		        					selectable: true,
		                	disabled: true,
		                	selected: chosen,
		                	nodes: []
		        				});
		        			}
		        		}
		        		
		            nodes.push({
		                name: info.name,
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
        let klasses = [];
        for (let node of this.state.nodes) {
            if (node.selected) {
                presets.push(node.name);
            }
        }
        
        let className = this.state.attributeValues['class'] || '';
        
    
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