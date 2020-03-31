import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;
declare let controls: any;

let recentElementClassName: string = null;
let recentElementStyle: string = null;
let classNameStatuses: any = {};
let styleValues: any = {};

interface IProps {
    watchingClassNames: [any];
    watchingStyleNames: [string];
}

interface IState {
    classNameStatuses: any;
    styleValues: any;
    properties: any;
}

class Base extends React.Component {
    state: IState = {classNameStatuses: {}, styleValues: {}, properties: {}}
    
    constructor(props) {
        super(props);
        controls.push(this);
        
        this.props.watchingClassNames.forEach((nameOrRegularExpression: any) => {
            classNameStatuses[nameOrRegularExpression] = null;
        });
        this.props.watchingStyleNames.forEach((name: string) => {
            styleValues[name] = null;
        });
    }
    
    protected static defaultProps: Props = {
        watchingClassNames: [],
        watchingStyleNames: []
    }
    
    private recentProperties: string = null;
    
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
            
            for (var name in styleValues) {
                if (styleValues.hasOwnProperty(name)) {
                    if (!!name) {
                        let splited = name.split('[');
                        let value = HTMLHelper.getInlineStyle(recentElementStyle, splited[0]);
                        
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
        
        this.props.watchingClassNames.forEach((nameOrRegularExpression: any) => {
            if (this.state.classNameStatuses[nameOrRegularExpression] != classNameStatuses[nameOrRegularExpression]) {
                this.state.classNameStatuses[nameOrRegularExpression] = classNameStatuses[nameOrRegularExpression];
            }
        });
        this.props.watchingStyleNames.forEach((name: string) => {
            if (this.state.styleValues[name] != styleValues[name]) {
                this.state.styleValues[name] = styleValues[name];
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

export {IProps, IState, Base};