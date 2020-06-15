import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {CodeHelper} from '../../helpers/CodeHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;
declare let controls: any;

let recentElementClassName: string = null;
let recentElementStyle: string = null;
let recentElementAttributes: any = null;
let recentElementExtensions: any = null;
let classNameStatuses: any = {};
let styleValues: any = {};
let attributeValues: any = {};
let extensionValues: any = {};
let keysMapping: any = {};

interface IProps {
    watchingClassNames: [any];
    watchingStyleNames: string[];
    watchingAttributeNames: string[];
    watchingExtentionNames: string[];
}

interface IState {
    classNameStatuses: any;
    styleValues: any;
    attributeValues: any;
    extensionValues: any;
}

let DefaultState: any = {
    classNameStatuses: {},
    styleValues: {},
    attributeValues: {},
    extensionValues: {}
};
let DefaultProps: any = {
    watchingClassNames: [],
    watchingStyleNames: [],
    watchingAttributeNames: [],
    watchingExtensionNames: []
};

class Base extends React.Component {
    protected state: IState = {};
    protected static defaultProps: IProps = DefaultProps;
    
    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(DefaultState));
        
        controls.push(this);
        
        this.props.watchingClassNames.forEach((nameOrRegularExpression: any) => {
        		keysMapping[nameOrRegularExpression] = nameOrRegularExpression;
            classNameStatuses[nameOrRegularExpression] = null;
        });
        this.props.watchingStyleNames.forEach((nameOrRegularExpression: string) => {
        		keysMapping[nameOrRegularExpression] = nameOrRegularExpression;
            styleValues[nameOrRegularExpression] = null;
        });
        this.props.watchingAttributeNames.forEach((nameOrRegularExpression: string) => {
        		keysMapping[nameOrRegularExpression] = nameOrRegularExpression;
            attributeValues[nameOrRegularExpression] = null;
        });
        this.props.watchingExtensionNames.forEach((nameOrRegularExpression: string) => {
        		keysMapping[nameOrRegularExpression] = nameOrRegularExpression;
            extensionValues[nameOrRegularExpression] = null;
        });
    }
    
    public update(properties: any) {
        let changed = false;
        
        if (recentElementClassName != (properties.attributes && properties.attributes['class'] || '')) {
            recentElementClassName = properties.attributes && properties.attributes['class'] || '';
            
            for (let nameOrRegularExpression in classNameStatuses) {
                if (classNameStatuses.hasOwnProperty(nameOrRegularExpression)) {
                		nameOrRegularExpression = keysMapping[nameOrRegularExpression];
                		
                    if (!!nameOrRegularExpression) {
                        if (typeof nameOrRegularExpression === 'object') { // Regular Expression
                            let value = recentElementClassName.match(nameOrRegularExpression);
                            classNameStatuses[nameOrRegularExpression] = value;
                        } else { // String
                            let value = HTMLHelper.hasClass(recentElementClassName, nameOrRegularExpression);
                            classNameStatuses[nameOrRegularExpression] = value;
                        }
                    }
                }
            }
        }
        let style = (properties.attributes && properties.attributes['style'] || '').replace(/;$/, '');
        if (recentElementStyle != style) {
            recentElementStyle = style;
            let hashMap = HTMLHelper.getHashMapFromInlineStyle(recentElementStyle);
            
            for (let nameOrRegularExpression in styleValues) {
                if (styleValues.hasOwnProperty(nameOrRegularExpression)) {
                		nameOrRegularExpression = keysMapping[nameOrRegularExpression];
                		
                    if (!!nameOrRegularExpression) {
                    		if (typeof nameOrRegularExpression === 'object') { // Regular Expression
                    				let value = recentElementStyle.match(nameOrRegularExpression);
                            styleValues[nameOrRegularExpression] = value;
                    		} else {
		                        let splited = nameOrRegularExpression.split('[');
		                        let value = hashMap[splited[0]] || null;
		                        
		                        if (value != null && splited[1]) {
		                            let tokens = splited[1].split(',');
		                            let index = parseInt(tokens[0]);
		                            
		                            value = value.split(' ')[index];
		                        }
		                        styleValues[nameOrRegularExpression] = value;
		                    }
                    }
                }
            }
        }
        if (properties.attributes && recentElementAttributes != properties.attributes) {
            recentElementAttributes = properties.attributes;
            
            let assigned = {};
            
            for (let nameOrRegularExpression in attributeValues) {
                if (attributeValues.hasOwnProperty(nameOrRegularExpression)) {
                		nameOrRegularExpression = keysMapping[nameOrRegularExpression];
                		
                    if (!!nameOrRegularExpression) {
                    		if (typeof nameOrRegularExpression === 'object') { // Regular Expression
                    				if (!assigned[nameOrRegularExpression]) {
                    						assigned[nameOrRegularExpression] = true;
                    						attributeValues[nameOrRegularExpression] = {};
                    				}
                    				for (let name in recentElementAttributes) {
                    						if (recentElementAttributes.hasOwnProperty(name) && name.match(nameOrRegularExpression)) {
                    								attributeValues[nameOrRegularExpression][name] = recentElementAttributes[name];
                    						}
                    				}
                    		} else {
		                        let value = recentElementAttributes[nameOrRegularExpression];
		                        if (value !== undefined) {
		                            attributeValues[nameOrRegularExpression] = value;
		                        } else {
		                            attributeValues[nameOrRegularExpression] = null;
		                        }
		                    }
                    }
                }
            }
        }
        if (properties.extensions && recentElementExtensions != properties.extensions) {
            recentElementExtensions = properties.extensions;
            
            let assigned = {};
            
            for (let nameOrRegularExpression in extensionValues) {
                if (extensionValues.hasOwnProperty(nameOrRegularExpression)) {
                		nameOrRegularExpression = keysMapping[nameOrRegularExpression];
                		
                    if (!!nameOrRegularExpression) {
                    		if (typeof nameOrRegularExpression === 'object') { // Regular Expression
                    				if (!assigned[nameOrRegularExpression]) {
                    						assigned[nameOrRegularExpression] = true;
                    						extensionValues[nameOrRegularExpression] = {};
                    				}
                    				for (let name in recentElementExtensions) {
                    						if (recentElementExtensions.hasOwnProperty(name) && name.match(nameOrRegularExpression)) {
                    								extensionValues[nameOrRegularExpression][name] = recentElementExtensions[name];
                    						}
                    				}
                    		} else {
		                        let value = recentElementExtensions[nameOrRegularExpression];
		                        if (value !== undefined) {
		                            extensionValues[nameOrRegularExpression] = value;
		                        } else {
		                            extensionValues[nameOrRegularExpression] = null;
		                        }
		                    }
                    }
                }
            }
        }
        
        this.props.watchingClassNames.forEach((nameOrRegularExpression: any) => {
            if (!CodeHelper.equals(this.state.classNameStatuses[nameOrRegularExpression], classNameStatuses[nameOrRegularExpression])) {
                this.state.classNameStatuses[nameOrRegularExpression] = classNameStatuses[nameOrRegularExpression];
                changed = true;
            }
        });
        this.props.watchingStyleNames.forEach((name: string) => {
            if (!CodeHelper.equals(this.state.styleValues[name], styleValues[name])) {
                this.state.styleValues[name] = styleValues[name];
                changed = true;
            }
        });
        this.props.watchingAttributeNames.forEach((name: string) => {
            if (!CodeHelper.equals(this.state.attributeValues[name], attributeValues[name])) {
                this.state.attributeValues[name] = attributeValues[name];
                changed = true;
            }
        });
        this.props.watchingExtensionNames.forEach((name: string) => {
            if (!CodeHelper.equals(this.state.extensionValues[name], extensionValues[name])) {
                this.state.extensionValues[name] = extensionValues[name];
                changed = true;
            }
        });
        
        if (changed) {
            this.forceUpdate();
        }
        
        return changed;
    }
    
    protected render() { }
}

DeclarationHelper.declare('Components.Base', Base);

export {IProps, IState, DefaultState, DefaultProps, Base};