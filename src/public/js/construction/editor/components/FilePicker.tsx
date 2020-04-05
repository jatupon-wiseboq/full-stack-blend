import {EventHelper} from '../../helpers/EventHelper.js';
import {TextHelper} from '../../helpers/TextHelper.js';
import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import '../controls/FileBrowser.js';
import '../controls/DropDownControl.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
    inline: boolean,
    manual: boolean
}

interface State extends IState {
    value: any
}

let imageURLCache: any = {};

class FilePicker extends Base<Props, State> {
    state: IState = {classNameStatuses: {}, styleValues: {}, value: null}
    static defaultProps: Props = {
        watchingClassNames: [],
        watchingStyleNames: [],
        inline: false,
        manual: false
    }
    
    constructor(props) {
        super(props);
    }
    
    protected recentGuid: string = null;
    
    public update(properties: any) {
        if (!super.update(properties)) return;
        
        if (this.recentGuid != properties.elementGuid) {
            this.recentGuid = properties.elementGuid;
            
            let value = imageURLCache[this.recentGuid] || this.state.styleValues[this.props.watchingStyleNames[0]];
            this.setState({
                value: value
            });
        }
    }
    
    protected fileOnUpdate(value: any) {
        let composedValue = 'url(' + URL.createObjectURL(value) + ')';
        
        this.setState({
            value: composedValue
        });
        imageURLCache[this.recentGuid] = composedValue;
        
        if (this.props.watchingStyleNames[0] && !this.props.manual) {
            perform('update', {
                aStyle: [{
                    name: this.props.watchingStyleNames[0].split('[')[0],
                    value: composedValue
                }],
                replace: this.props.watchingStyleNames[0]
            });
        }
    }
    
    public getValue() {
        return this.state.value;
    }
    
    public hide() {
    }
    
    render() {
        if (this.props.inline) {
            return (
                <div className="input-group inline" internal-fsb-event-no-propagate="click">
                    <FullStackBlend.Controls.FileBrowser onUpdate={this.fileOnUpdate.bind(this)}></FullStackBlend.Controls.FileBrowser>
                    <div className="input-group-append">
                        <div className="btn btn-sm btn-secondary" internal-fsb-event-always-propagate="click">
                            <i className="fa fa-check-circle m-0" internal-fsb-event-always-propagate="click" />
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className={"file-picker " + this.props.additionalClassName}>
                    <FullStackBlend.Controls.DropDownControl representing={(this.state.value != null) ? 'selected' : ''}>
                        <div className="input-group">
                            <FullStackBlend.Controls.FileBrowser onUpdate={this.fileOnUpdate.bind(this)}></FullStackBlend.Controls.FileBrowser>
                        </div>
                    </FullStackBlend.Controls.DropDownControl>
                </div>
            )
        }
    }
}

DeclarationHelper.declare('Components.FilePicker', FilePicker);

export {Props, State, FilePicker};