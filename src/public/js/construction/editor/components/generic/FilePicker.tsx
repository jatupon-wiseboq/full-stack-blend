import {EventHelper} from '../../../helpers/EventHelper';
import {TextHelper} from '../../../helpers/TextHelper';
import {CodeHelper} from '../../../helpers/CodeHelper';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import '../../controls/FileBrowser';
import '../../controls/DropDownControl';

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

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
  value: null
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
  inline: false,
  manual: false
});

class FilePicker extends Base<Props, State> {
  protected state: State = {};
  protected static defaultProps: Props = ExtendedDefaultProps;

  constructor(props) {
    super(props);
    Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
  }

  protected recentGuid: string = null;

  public update(properties: any) {
    super.update(properties);

    if (this.recentGuid != properties.elementGuid) {
      this.recentGuid = properties.elementGuid;

      let value = imageURLCache[this.recentGuid] ||
        this.state.styleValues[this.props.watchingStyleNames[0]] ||
        this.state.attributeValues[this.props.watchingAttributeNames[0]];
      this.setState({
        value: value
      });
    }
  }

  protected fileOnUpdate(value: any) {
    let composedValue = this.composeValue(value);
    this.setState({
      value: composedValue
    });
    imageURLCache[this.recentGuid] = composedValue;

    if (this.props.watchingStyleNames[0] && !this.props.manual) {
      perform('update', {
        styles: [{
          name: this.props.watchingStyleNames[0].split('[')[0],
          value: composedValue
        }],
        replace: this.props.watchingStyleNames[0]
      });
    }
    if (this.props.watchingAttributeNames[0] && !this.props.manual) {
      perform('update', {
        attributes: [{
          name: this.props.watchingAttributeNames[0].split('[')[0],
          value: composedValue
        }],
        replace: this.props.watchingAttributeNames[0]
      });
    }
  }

  protected composeValue(value: any) {
    if (this.props.watchingStyleNames[0]) {
      return 'url(' + value + ')';
    }
    if (this.props.watchingAttributeNames[0]) {
      return value;
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