import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {IProps, IState, DefaultProps, DefaultState, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {BackEndScriptHelper, DEFAULTS} from '../../../helpers/BackEndScriptHelper.js';
import {CAMEL_OF_EVENTS_DICTIONARY, FORM_CONTROL_CLASS_LIST} from '../../../Constants.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;
declare let ace: any;

interface Props extends IProps {
}

interface State extends IState {
   value: string
}

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
let watchingAttributeNames = [];
watchingAttributeNames.push('internal-fsb-data-source-type');
watchingAttributeNames.push('internal-fsb-data-source-name');
watchingAttributeNames.push('internal-fsb-data-source-column');
watchingAttributeNames.push('internal-fsb-data-validation-message');
watchingAttributeNames.push('internal-fsb-name');
watchingAttributeNames.push('internal-fsb-class');
watchingAttributeNames.push('internal-fsb-guid');
watchingAttributeNames.push('required');
watchingAttributeNames.push('internal-fsb-data-code');

let watchingExtensionNames = [];
watchingExtensionNames.push('autoGeneratedCodeForMergingBackEndScript');
watchingExtensionNames.push('editingPageID');
watchingExtensionNames.push('internal-fsb-data-code-import');
watchingExtensionNames.push('internal-fsb-data-code-declare');
watchingExtensionNames.push('internal-fsb-data-code-interface');
watchingExtensionNames.push('internal-fsb-data-code-body');
watchingExtensionNames.push('internal-fsb-data-code-footer');

Object.assign(ExtendedDefaultProps, {
  watchingAttributeNames: watchingAttributeNames,
  watchingExtensionNames: watchingExtensionNames
});

class BackEndScriptEditor extends Base<Props, State> {
    protected static defaultProps: Props = ExtendedDefaultProps;

    constructor(props) {
        super(props);
        
        this.state = CodeHelper.clone(Object.assign({}, DefaultState, {
            value: ''
        }));
        
        window.define = ace.define;
        window.require = ace.require;
        
        ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.6/');
    }
    
    functionNameMapping: any = {}
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        if (properties.tag == 'user-action') return;
        
        let code, mapping;
        if (FORM_CONTROL_CLASS_LIST.indexOf(this.state.attributeValues['internal-fsb-class']) == -1) {
            let info = this.state.extensionValues;
            info['internal-fsb-data-code'] = this.state.attributeValues['internal-fsb-data-code'];
            
            [code, mapping] = BackEndScriptHelper.generateScriptCode(info);
        } else {
            let info = this.state.attributeValues;
            
        		[code, mapping] = BackEndScriptHelper.generateMergingCode(info);
        }
        this.functionNameMapping = mapping;
        
        if (this.state.value !== code) {
            this.state.value = code;
          
            let editor = ace.edit("backEndEditor");
            editor.setValue(code);
            editor.clearSelection();
            
            this.forceUpdate();
        }
    }
    
    private onLoad() {
        let editor = ace.edit("backEndEditor");
        
        let beginRegEx = /Auto\[[0-9a-zA-Z\:_]+\]--->/;
        let endRegEx = /<---Auto\[[0-9a-zA-Z\:_]+\]/;
        
        editor.commands.on("exec", (function(e) {
            let lines = this.state.value.split('\n');
        
            if (e.command && (e.command.name == 'backspace' || e.command.name == 'insertstring' || e.command.name == 'indent' || e.command.name == 'outdent')) {
                function checkAndPreventedFromEditing(rowCol) {
                    let isPreventedFromEditing = false;
                    
                    for (let i = rowCol.row; i >= 0; i--) {
                      if (lines[i].match(endRegEx) != null) break;
                      if (lines[i].match(beginRegEx) != null) {
                        isPreventedFromEditing = true;
                        break;
                      }
                    }
                    for (let i = rowCol.row; i < editor.session.getLength(); i++) {
                      if (lines[i].match(beginRegEx) != null) break;
                      if (lines[i].match(endRegEx) != null) {
                        isPreventedFromEditing = true;
                        break;
                      }
                    }
                    
                    if (rowCol.column == 0 && rowCol.row-1 >= 0 && e.command.name == 'backspace') {
                      if (lines[rowCol.row-1].match(endRegEx) != null) {
                         isPreventedFromEditing = true;
                      }
                    }
                    
                    if (isPreventedFromEditing) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
                
                let getRange = editor.selection.getRange();
                checkAndPreventedFromEditing(getRange.start);
                checkAndPreventedFromEditing(getRange.end);
            }
        }).bind(this));
        
        editor.renderer.on('afterRender', (function() {
            let lines = this.state.value.split('\n');
            let aceLines = [...document.getElementById('backEndEditor').getElementsByClassName('ace_line_group')];
            let offset = editor.getFirstVisibleRow();
            
            for (let j=0; j<aceLines.length; j++) {
                let readonly = false;
              
                for (let i = offset + j; i >= 0; i--) {
                    if (lines[i].match(endRegEx) != null) break;
                    if (lines[i].match(beginRegEx) != null) {
                        readonly = true;
                        break;
                    }
                }
                for (let i = offset + j; i < offset + aceLines.length; i++) {
                    if (lines[i].match(beginRegEx) != null) break;
                    if (lines[i].match(endRegEx) != null) {
                        readonly = true;
                        break;
                    }
                }
                
                if (aceLines[j]) {
                    aceLines[j].style.opacity = (readonly) ? 0.25 : 1.0;
                }
            }
        }).bind(this));
        
        editor.session.setUseWrapMode(true);
    }
    private onChange(value) {
        let editor = ace.edit("backEndEditor");
        if (!editor.curOp || !editor.curOp.command.name) return;
      
        this.state.value = value;
      
        if (value) {
            let extractedInfo = BackEndScriptHelper.extractCode(value);
            let defaultDict = {
            		Import: "internal-fsb-data-code-import",
            		Declare: "internal-fsb-data-code-declare",
            		Interface: "internal-fsb-data-code-interface",
            		ClassBegin: "internal-fsb-data-code-body",
            		ClassEnd: "internal-fsb-data-code-footer"
            };
            
            let willUpdateExtensions = [];
            let willUpdateAttributes = [];
            
            for (let key in extractedInfo) {
            		if (extractedInfo.hasOwnProperty(key)) {
            				if (defaultDict[key]) {
            						if (extractedInfo[key] != DEFAULTS[key] && this.state.extensionValues[defaultDict[key]] != extractedInfo[key]) {
            								willUpdateExtensions.push({
            										name: defaultDict[key],
            										value: extractedInfo[key]
            								});
            						}
            				} else if (this.functionNameMapping[key]) {
            						if (this.state.attributeValues[this.functionNameMapping[key]] != extractedInfo[key]) {
            								willUpdateAttributes.push({
            										name: this.functionNameMapping[key],
            										value: extractedInfo[key]
            								});
            						}
            				}
            		}
            }
            
            if (willUpdateExtensions.length != 0 || willUpdateAttributes.length != 0) {
		            perform('update', {
		            		attributes: willUpdateAttributes,
		            		extensions: willUpdateExtensions,
		                replace: (willUpdateExtensions.length != 1) ? null : willUpdateExtensions[0].name + '+text',
		                tag: 'user-action'
		            });
		        }
        }
    }
    
    render() {
      return (
      	<div>
      		<div style={{display: (this.state.value == '') ? 'none' : 'block'}}>
			  		<ReactAce.default style={{position: 'absolute', width: '100%', height: '100%'}}
			          name="backEndEditor"
			          mode="typescript"
			          theme="tomorrow"
			          onLoad={this.onLoad.bind(this)}
			          onChange={this.onChange.bind(this)}
			          value={this.state.value}
			          fontSize={12}
			          showPrintMargin={false}
			          showGutter={true}
			          highlightActiveLine={true}
			          setOptions={{
			            useWorker: true,
			            showLineNumbers: true,
			            tabSize: 2
			         }}
			  		/>
			  	</div>
			  	<div className="text-center" style={{display: (this.state.value == '') ? 'block' : 'none'}}>
			  		<i className="fa fa-object-group" style={{fontSize: '50px', color: '#f0f0f0', paddingTop: '85px'}} />
			  	</div>
	      </div>
      )
    }
}

DeclarationHelper.declare('Components.BackEndScriptEditor', BackEndScriptEditor);

export {Props, State, BackEndScriptEditor};