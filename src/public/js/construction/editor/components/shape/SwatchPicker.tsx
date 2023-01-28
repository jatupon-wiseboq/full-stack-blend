import {TextHelper} from '../../../helpers/TextHelper';
import {CodeHelper} from '../../../helpers/CodeHelper';
import {IProps, IState, DefaultProps, DefaultState, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import '../../controls/Tree';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
  onColorPicked(color: String);
}

interface State extends IState {
  index: number
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
  index: -1
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
  watchingExtensionNames: ['colorSwatches']
});

class SwatchPicker extends Base<Props, State> {
  static state: State = {};
  protected static defaultProps: Props = ExtendedDefaultProps;

  constructor(props) {
    super(props);
    Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
  }

  public update(properties: any) {
    if (!super.update(properties)) return;
  }

  protected swatchOnClick(index: number) {
    if (this.state.index == index) {
      this.state.index = -1;
      this.forceUpdate();
    } else {
      this.state.index = index;
      this.forceUpdate();

      if (this.props.onColorPicked) {
        let color = this.state.extensionValues[this.props.watchingExtensionNames[0]][this.state.index] || 'rgba(255, 255, 255, 1.0)';
  
        this.props.onColorPicked(color);
      }
    }
  }

  public setCurrentSwatchColor(color: string) {
    if (!this.state.extensionValues[this.props.watchingExtensionNames[0]]) return;
    if (this.state.index == -1) return;

    this.state.extensionValues[this.props.watchingExtensionNames[0]][this.state.index] = color;

    perform('update', {
      extensions: [{
        name: this.props.watchingExtensionNames[0],
        value: this.state.extensionValues[this.props.watchingExtensionNames[0]]
      }]
    });
  }

  public deselect() {
    this.state.index = -1
    this.forceUpdate();
  }

  render() {
    return (
      pug`
          .swatch-container
            if this.state.extensionValues[this.props.watchingExtensionNames[0]]
              each color, index in this.state.extensionValues[this.props.watchingExtensionNames[0]]
                .swatch(className=((this.state.index == index) ? 'active' : ''), key='item-' + index, onClick=this.swatchOnClick.bind(this, index))
                  .swatch-inside-box(style={backgroundColor: ((color) ? color : 'transparent')})
        `
    )
  }
}

DeclarationHelper.declare('Components.SwatchPicker', SwatchPicker);

export {Props, State, SwatchPicker};
