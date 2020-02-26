import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface IProps {
    watchingClassNames: [string];
    watchingStyleNames: [string];
    elementClassName: string;
    elementStyle: string;
    updateElement(className: string, elementStyle: string);
}

interface IState {
    styleValues: [string];
    classNameStatuses: [boolean];
}

class Base extends React.Component {
    static defaultProps: Props = {
    }
    
    private recentElementClassName: string = null;
    private recentElementStyle: string = null;
    
    componentWillReceiveProps(nextProps) {
        let changed = false;
    
        if (this.recentElementClassName != nextProps.recentElementClassName) {
            this.recentElementClassName = nextProps.recentElementClassName;
            
            this.props.watchingClassNames.forEach((name: string) => {
                let value = HTMLHelper.hasClass(this.recentElementClassName, name);
                if (this.state.classNameStatuses[name] != value) {
                    this.state.classNameStatuses[name] = value;
                    changed = true;
                }
            });
        }
        if (this.recentElementStyle != nextProps.recentElementStyle) {
            this.recentElementStyle = nextProps.recentElementStyle;
            
            this.props.watchingStyleNames.forEach((name: string) => {
                let value = HTMLHelper.getInlineStyle(this.recentElementStyle, name);
                if (this.state.styleValues[name] != value) {
                    this.state.styleValues[name] = value;
                    changed = true;
                }
            });
        }
        
        if (changed) {
            this.forceUpdate();
        }
    }
    
    protected render() { }
}

DeclarationHelper.declare('Controls.Base', Base);

export {IProps, IState, Base};