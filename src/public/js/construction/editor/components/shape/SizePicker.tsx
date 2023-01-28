import {EventHelper} from '../../../helpers/EventHelper';
import {TextHelper} from '../../../helpers/TextHelper';
import {CodeHelper} from '../../../helpers/CodeHelper';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import '../../controls/Textbox';
import '../../controls/DropDownList';
import '../../controls/DropDownControl';
import '../code/SettingPicker';
import '../code/PropertyPicker';
import '../code/StatePicker';
import '../code/CustomCodePicker';
import {SIZES_IN_DESCRIPTION, SIZES_IN_UNIT} from '../../../Constants';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
  inline: boolean,
  manual: boolean
}

interface State extends IState {
  index: number,
  value: any
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
  index: 0,
  value: null
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
  inline: false,
  manual: false
});

let iconDict = {
  "SETTING": "ICON:fa fa-wrench m-0",
  "PROPERTY": "ICON:fa fa-plug m-0",
  "STATE": "ICON:fa fa-database m-0",
  "CODE": "ICON:fa fa-code m-0"
}

class SizePicker extends Base<Props, State> {
  protected state: State = {};
  protected static defaultProps: Props = ExtendedDefaultProps;

  constructor(props) {
    super(props);
    Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
  }

  private getRepresentedValue() {
    let status = this.state.styleValues[this.props.watchingStyleNames[0]];
    if (status && status.indexOf('auto') != -1) {
      return 'ICON:fa fa-asterisk m-0';
    } else if (status && status.indexOf('coding') != -1) {
      return 'ICON:fa fa-code m-0';
    } else if (status) {
      return parseFloat(status);
    } else {
      return null;
    }
  }

  public update(properties: any) {
    if (!super.update(properties)) return;

    let original = this.state.styleValues[this.props.watchingStyleNames[0]];
    let isString = typeof original === 'string';
    let value = (isString) ? parseFloat(original) : null;
    let matched = (isString) ? original.match(/[a-z%]+/) || null : null;
    let unit = (matched !== null) ? matched[0] : null;

    let index = SIZES_IN_UNIT.indexOf(unit);
    if (index == -1) {
      index = 0;
    }
    if (index == 7) {
      value = null;
    }

    this.setState({
      value: value,
      index: index
    });
  }

  protected dropdownOnUpdate(identity: any, value: any, index: any) {
    this.setState({
      index: index
    });
    if (this.props.watchingStyleNames[0] && !this.props.manual) {
      perform('update', {
        styles: [{
          name: this.props.watchingStyleNames[0].split('[')[0],
          value: (index == 7) ? 'auto' : ((index == 8) ? ((this.props.watchingStyleNames[0].split('[')[0] == 'border-radius') ? 'coding coding coding coding' : 'coding') : this.composeValue(this.state.value, index))
        }],
        replace: this.props.watchingStyleNames[0]
      });
    }
  }

  protected textboxOnUpdate(value: any) {
    this.state.value = value;
    if (this.props.watchingStyleNames[0] && !this.props.manual) {
      perform('update', {
        styles: [{
          name: this.props.watchingStyleNames[0].split('[')[0],
          value: (this.state.index == 7) ? 'auto' : ((index == 8) ? ((this.props.watchingStyleNames[0].split('[')[0] == 'border-radius') ? 'coding coding coding coding' : 'coding') : this.composeValue(value, this.state.index))
        }],
        replace: this.props.watchingStyleNames[0]
      });
    }
  }

  private composeValue(value: any, index: number) {
    let composedValue = (value != null) ? (value.toString() + SIZES_IN_UNIT[index]).trim() : null;

    return TextHelper.composeIntoMultipleValue(this.props.watchingStyleNames[0], composedValue, this.state.styleValues[this.props.watchingStyleNames[1]], '0px');
  }

  public getValue() {
    return this.composeValue(this.state.value, this.state.index);
  }

  public hide() {
    this.refs.dropdown.hide();
  }

  render() {
    if (this.props.inline) {
      return (
        <div className="input-group inline" internal-fsb-event-no-propagate="click">
          <FullStackBlend.Controls.Textbox value={isNaN(this.state.value) ? '' : this.state.value} preRegExp="([\-])?(([0-9])|([0-9][\.])|([0-9][\.][0-9]*)|([1-9][0-9]*)|([1-9][0-9]*[\.])|([1-9][0-9]*[\.][0-9]*)|([1-9][0-9]*)|([0]))?" postRegExp="([\-])?(([0][\.][0-9]+)|([1-9][0-9]*[\.][0-9]+)|([1-9][0-9]*)|([0]))" onUpdate={this.textboxOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
          <div className="input-group-append">
            <FullStackBlend.Controls.DropDownList ref="dropdown" value={SIZES_IN_UNIT[this.state.index]} customClassName="btn-secondary" options={SIZES_IN_DESCRIPTION} autohide={false} onUpdate={this.dropdownOnUpdate.bind(this)}>
              {(() => {
                if (SIZES_IN_UNIT[this.state.index] !== 'coding') {
                  return (
                    <span>{SIZES_IN_UNIT[this.state.index]}</span>
                  );
                } else {
                  return (
                    <i className="fa fa-code m-0" />
                  );
                }
              })()}
            </FullStackBlend.Controls.DropDownList>
            <div className="btn btn-sm btn-secondary" internal-fsb-event-always-propagate="click">
              <i className="fa fa-check-circle m-0" internal-fsb-event-always-propagate="click" />
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <span>
          {(() => {
            if (this.props.watchingStyleNames.length != 0) {
              return (
                <div className={"size-picker " + this.props.additionalClassName} internal-fsb-not-for="editorCurrentMode:coding">
                  <FullStackBlend.Controls.DropDownControl representing={this.getRepresentedValue()}>
                    <div className="input-group">
                      <FullStackBlend.Controls.Textbox value={isNaN(this.state.value) ? '' : this.state.value} preRegExp="([\-])?(([0-9])|([0-9][\.])|([0-9][\.][0-9]*)|([1-9][0-9]*)|([1-9][0-9]*[\.])|([1-9][0-9]*[\.][0-9]*)|([1-9][0-9]*)|([0]))?" postRegExp="([\-])?(([0][\.][0-9]+)|([1-9][0-9]*[\.][0-9]+)|([1-9][0-9]*)|([0]))" onUpdate={this.textboxOnUpdate.bind(this)}></FullStackBlend.Controls.Textbox>
                      <div className="input-group-append">
                        <FullStackBlend.Controls.DropDownList ref="dropdown" value={SIZES_IN_UNIT[this.state.index]} customClassName="btn-secondary" options={SIZES_IN_DESCRIPTION} autohide={false} onUpdate={this.dropdownOnUpdate.bind(this)}>
                          {(() => {
                            if (SIZES_IN_UNIT[this.state.index] !== 'coding') {
                              return (
                                <span>{SIZES_IN_UNIT[this.state.index]}</span>
                              );
                            } else {
                              return (
                                <i className="fa fa-code m-0" />
                              );
                            }
                          })()}
                        </FullStackBlend.Controls.DropDownList>
                      </div>
                    </div>
                  </FullStackBlend.Controls.DropDownControl>
                </div>
              )
            }
          })()}
          {(() => {
            if (this.props.watchingAttributeNames.length != 0) {
              return (
                <div className={"size-picker " + this.props.additionalClassName} internal-fsb-for="editorCurrentMode:coding">
                  <FullStackBlend.Controls.DropDownControl representing={this.state.attributeValues[this.props.watchingAttributeNames[0]] && iconDict[this.state.attributeValues[this.props.watchingAttributeNames[0]].split('[')[0]]} width={500}>
                    <div>
                      <FullStackBlend.Components.SettingPicker ref="setting" watchingAttributeNames={this.props.watchingAttributeNames} />
                      <FullStackBlend.Components.PropertyPicker ref="property" watchingAttributeNames={this.props.watchingAttributeNames} />
                      <FullStackBlend.Components.StatePicker ref="state" watchingAttributeNames={this.props.watchingAttributeNames} />
                      <FullStackBlend.Components.CustomCodePicker ref="code" watchingAttributeNames={this.props.watchingAttributeNames} />
                    </div>
                  </FullStackBlend.Controls.DropDownControl>
                </div>
              )
            }
          })()}
        </span>
      )
    }
  }
}

DeclarationHelper.declare('Components.SizePicker', SizePicker);

export {Props, State, SizePicker};