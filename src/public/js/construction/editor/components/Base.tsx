import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;
declare let controls: any;

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
    }
    
    protected static defaultProps: Props = {
        watchingClassNames: [],
        watchingStyleNames: []
    }
    
    protected recentElementClassName: string = null;
    protected recentElementStyle: string = null;
    private recentProperties: string = null;
    
    public update(properties: any) {
        let changed = false;
        
        if (this.recentElementClassName != properties.elementClassName) {
            this.recentElementClassName = properties.elementClassName;
            
            this.props.watchingClassNames.forEach((nameOrRegularExpression: any) => {
                if (!!nameOrRegularExpression) {
                    if (typeof nameOrRegularExpression === 'object') { // Regular Expression
                        let value = this.recentElementClassName.match(nameOrRegularExpression);
                        if (this.state.classNameStatuses[nameOrRegularExpression] != value) {
                            this.state.classNameStatuses[nameOrRegularExpression] = value;
                            changed = true;
                        }
                    } else { // String
                        let value = HTMLHelper.hasClass(this.recentElementClassName, nameOrRegularExpression);
                        if (this.state.classNameStatuses[nameOrRegularExpression] != value) {
                            this.state.classNameStatuses[nameOrRegularExpression] = value;
                            changed = true;
                        }
                    }
                }
            });
        }
        if (this.recentElementStyle != properties.elementStyle) {
            this.recentElementStyle = properties.elementStyle;
            
            this.props.watchingStyleNames.forEach((name: string) => {
                if (!!name) {
                    let value = HTMLHelper.getInlineStyle(this.recentElementStyle, name);
                    if (this.state.styleValues[name] != value) {
                        this.state.styleValues[name] = value;
                        changed = true;
                    }
                }
            });
        }
        
        let jsonString = JSON.stringify(properties);
        if (this.recentProperties != jsonString) {
            this.recentProperties = jsonString;
            changed = true;
        }
        
        if (changed) {
            this.state.properties = properties;
            this.forceUpdate();
        }
        
        return changed;
    }
    
    protected render() { }
}

DeclarationHelper.declare('Components.Base', Base);

export {IProps, IState, Base};