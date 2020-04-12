import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;
declare let controls: any;

let recentElementClassName: string = null;
let recentElementStyle: string = null;
let recentElementAttributes: any = null;
let classNameStatuses: any = {};
let styleValues: any = {};
let attributeValues: any = {};

interface IProps {
    watchingClassNames: [any];
    watchingStyleNames: [string];
    watchingAttributeNames: [string];
}

interface IState {
    classNameStatuses: any;
    styleValues: any;
    attributeValues: any;
}

let DefaultState: any = {
    classNameStatuses: {},
    styleValues: {},
    attributeValues: {}
};
let DefaultProps: any = {
    watchingClassNames: [],
    watchingStyleNames: [],
    watchingAttributeNames: []
};

class Base extends React.Component {
    protected state: IState = Object.assign({}, DefaultState);
    protected static defaultProps: IProps = DefaultProps;
    
    constructor(props) {
        super(props);
        controls.push(this);
        
        this.props.watchingClassNames.forEach((nameOrRegularExpression: any) => {
            classNameStatuses[nameOrRegularExpression] = null;
        });
        this.props.watchingStyleNames.forEach((name: string) => {
            styleValues[name] = null;
        });
        this.props.watchingAttributeNames.forEach((name: string) => {
            attributeValues[name] = null;
        });
    }
    
    public update(properties: any) {
        let changed = false;
        
        if (recentElementClassName != properties.elementClassName) {
            recentElementClassName = properties.elementClassName;
            
            for (var nameOrRegularExpression in classNameStatuses) {
                if (classNameStatuses.hasOwnProperty(nameOrRegularExpression)) {
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
        if (recentElementStyle != properties.elementStyle) {
            recentElementStyle = properties.elementStyle;
            let hashMap = HTMLHelper.getHashMapFromInlineStyle(recentElementStyle);
            
            for (var name in styleValues) {
                if (styleValues.hasOwnProperty(name)) {
                    if (!!name) {
                        let splited = name.split('[');
                        let value = hashMap[splited[0]] || null;
                        
                        if (value != null && splited[1]) {
                            let tokens = splited[1].split(',');
                            let index = parseInt(tokens[0]);
                            
                            value = value.split(' ')[index];
                        }
                        styleValues[name] = value;
                    }
                }
            }
        }
        if (recentElementAttributes != properties.elementAttributes) {
            recentElementAttributes = properties.elementAttributes;
            
            for (var name in attributeValues) {
                if (attributeValues.hasOwnProperty(name)) {
                    if (!!name) {
                        let value = recentElementAttributes[name];
                        if (value !== undefined) {
                            attributeValues[name] = value;
                        } else {
                            attributeValues[name] = null;
                        }
                    }
                }
            }
        }
        
        this.props.watchingClassNames.forEach((nameOrRegularExpression: any) => {
            if (this.state.classNameStatuses[nameOrRegularExpression] != classNameStatuses[nameOrRegularExpression]) {
                this.state.classNameStatuses[nameOrRegularExpression] = classNameStatuses[nameOrRegularExpression];
                changed = true;
            }
        });
        this.props.watchingStyleNames.forEach((name: string) => {
            if (this.state.styleValues[name] != styleValues[name]) {
                this.state.styleValues[name] = styleValues[name];
                changed = true;
            }
        });
        this.props.watchingAttributeNames.forEach((name: string) => {
            if (this.state.attributeValues[name] != attributeValues[name]) {
                this.state.attributeValues[name] = attributeValues[name];
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