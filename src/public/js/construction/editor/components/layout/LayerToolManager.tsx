import {CodeHelper} from '../../../helpers/CodeHelper';
import {HTMLHelper} from '../../../helpers/HTMLHelper';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import {ITreeNode, InsertDirection} from '../../controls/TreeNode';
import '../../controls/Tree';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
  height: any;
  filter: string;
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
  height: 'auto',
  designLocked: false,
  codeLocked: false
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
  watchingAttributeNames: ['internal-fsb-guid'],
  watchingExtensionNames: ['currentActiveLayerToolAvailable', 'currentActiveLayerHidden', 'currentActiveLayerRemovable', 'workspaceMode'],
  watchingStyleNames: ['-fsb-code-lock', '-fsb-design-lock']
});

class LayerToolManager extends Base<Props, State> {
  protected state: State = {};
  protected static defaultProps: Props = ExtendedDefaultProps;

  constructor(props) {
    super(props);
    Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
  }

  public update(properties: any) {
    if (!super.update(properties)) return;

    this.state.designLocked = !!this.state.styleValues['-fsb-design-lock'];
    this.state.codeLocked = !!this.state.styleValues['-fsb-code-lock'];

    this.forceUpdate();
  }

  private onLayerVisibleToggled() {
    if (!this.state.extensionValues['currentActiveLayerToolAvailable']) return;

    perform('update', {
      extensions: [{
        name: 'currentActiveLayerHidden',
        value: !this.state.extensionValues['currentActiveLayerHidden']
      }]
    });
  }
  private onLayerRemoved() {
    if (!this.state.extensionValues['currentActiveLayerToolAvailable']) return;

    perform('delete', this.state.attributeValues['internal-fsb-guid']);
  }
  private onLayerDesignLock() {
    if (!this.state.extensionValues['currentActiveLayerToolAvailable']) return;

    perform('update', {
      styles: [{
        name: '-fsb-design-lock',
        value: this.state.designLocked ? null : '1'
      }]
    });
  }
  private onLayerCodeLock() {
    if (!this.state.extensionValues['currentActiveLayerToolAvailable']) return;

    perform('update', {
      styles: [{
        name: '-fsb-code-lock',
        value: this.state.codeLocked ? null : '1'
      }]
    });
  }

  render() {
    return (
      <div style={{fontSize: '12.4px', opacity: (this.state.extensionValues['currentActiveLayerToolAvailable'] ? undefined : '0.5'), pointerEvents: (this.state.extensionValues['currentActiveLayerToolAvailable'] ? undefined : 'none')}}>
        {(() => {
          return (
            <i className={(!this.state.extensionValues['currentActiveLayerHidden']) ? "fa fa-eye" : "fa fa-eye-slash"} style={{position: "absolute", left: "6px", top: "6px", color: "rgba(0, 0, 0, 0.35)", cursor: "pointer"}} onClick={this.onLayerVisibleToggled.bind(this)} />
          );
        })()}
        {(() => {
          if (['business'].indexOf(this.state.extensionValues['workspaceMode']) == -1 && this.state.extensionValues['currentActiveLayerRemovable'])
            return (
              <i className="fa fa-remove" style={{position: "absolute", left: "25px", top: "6px", color: "rgba(0, 0, 0, 0.35)", cursor: "pointer"}} onClick={this.onLayerRemoved.bind(this)} />
            );
        })()}
        {(() => {
          if (['designer', 'business'].indexOf(this.state.extensionValues['workspaceMode']) == -1 && this.state.extensionValues['currentActiveLayerRemovable'])
            return (
              <span style={{position: "absolute", left: "61px", top: "2px", color: this.state.codeLocked ? "rgba(255, 0, 0, 1.0)" : "rgba(0, 0, 0, 0.35)", cursor: "pointer"}}>
                c <i className={this.state.codeLocked ? "fa fa-lock" : "fa fa-unlock"} onClick={this.onLayerCodeLock.bind(this)} />
              </span>
            );
        })()}
        {(() => {
          if (['coder', 'business'].indexOf(this.state.extensionValues['workspaceMode']) == -1 && this.state.extensionValues['currentActiveLayerRemovable'])
            return (
              <span style={{position: "absolute", left: "37px", top: "2px", color: this.state.designLocked ? "rgba(255, 0, 0, 1.0)" : "rgba(0, 0, 0, 0.35)", cursor: "pointer"}}>
                d <i className={this.state.designLocked ? "fa fa-lock" : "fa fa-unlock"} onClick={this.onLayerDesignLock.bind(this)} />
              </span>
            );
        })()}
      </div>
    );
  }
}

DeclarationHelper.declare('Components.LayerToolManager', LayerToolManager);

export {Props, State, LayerToolManager};