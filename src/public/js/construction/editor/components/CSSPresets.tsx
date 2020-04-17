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
    watchingAttributeNames: ['internal-fsb-inherited-presets', 'internal-fsb-reusable-preset-name', 'internal-fsb-guid'],
    watchingExtensionNames: ['stylesheetDefinitionRevision']
});

class CSSPresets extends Base<Props, State> {
    protected static defaultProps: Props = ExtendedDefaultProps;

    constructor(props) {
        super(props);
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        let nodes: [ITreeNode] = [];
        
        if (properties.extensions && properties.extensions.stylesheetDefinitionKeys) {
        		let allInheritanceHash = {};
        		let prioritizedKeys = [];
        		for (let _key of properties.extensions.stylesheetDefinitionKeys) {
        			let splited = _key.split(':');
        			prioritizedKeys.push(splited[0]);
        		}
        		for (let _key of properties.extensions.stylesheetDefinitionKeys) {
        			let splited = _key.split(':');
        			allInheritanceHash[splited[0]] = splited[1].split('+').filter(token => token != '').sort((a, b) => {
        				let pa = prioritizedKeys.indexOf(a);
					    	let pb = prioritizedKeys.indexOf(b);
					    	
					    	if (pa == -1) pa = Number.MAX_SAFE_INTEGER;
					    	if (pb == -1) pa = Number.MAX_SAFE_INTEGER;
					    	
					    	return pa > pb;
        			});
        		}
        		
		        for (let _key of properties.extensions.stylesheetDefinitionKeys) {
		        		let key = _key.split(':')[0];
		        		
		            let isItself = (key == this.state.attributeValues['internal-fsb-reusable-preset-name']);
		        		let chosen = (isItself) ? false : (this.state.attributeValues['internal-fsb-inherited-presets'] &&
		                         this.state.attributeValues['internal-fsb-inherited-presets'].indexOf('+' + key + '+') != -1);
		        		
		        		let childNodes = [];
		        		if (allInheritanceHash[key]) {
		        			for (let childKey of allInheritanceHash[key]) {
		        				childNodes.push({
		        					name: childKey + ((allInheritanceHash[childKey] && allInheritanceHash[childKey].length != 0) ? ' ...' : ''),
		                	disabled: true,
		                	selected: chosen,
		                	nodes: []
		        				});
		        			}
		        		}
		        		
		            nodes.push({
		                name: key,
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
        console.log('onUpdate', node);
    
        let presets = [];
        for (let node of this.state.nodes) {
            if (node.selected) {
                presets.push(node.name);
            }
        }
        
        if (this.state.attributeValues['internal-fsb-reusable-preset-name']) {
        		presets.push(this.state.attributeValues['internal-fsb-reusable-preset-name']);
        }
    
        perform('update', {
            attributes: [{
                name: 'internal-fsb-inherited-presets',
                value: '+' + presets.join('+') + '+'
            }],
            styles: [{
                name: '-fsb-inherited-presets',
                value: '+' + presets.join('+') + '+'
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