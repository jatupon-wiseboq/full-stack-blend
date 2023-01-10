import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper';
import {HTMLHelper} from '../../helpers/HTMLHelper';
import {StyleHelper} from '../helpers/StyleHelper';

declare let React: any;
declare let ReactDOM: any;

interface Props {
}

interface State {
  paddingLeft: number,
  paddingRight: number
}

class Guide extends React.Component<Props, State> {
  state: State = {paddingLeft: 0, paddingRight: 0};
  static defaultProps: Props = {
  }

  private domElement: HTMLElement = null;

  constructor() {
    super();
  }

  public getDOMNode() {
    return this.domElement;
  }
  public setDOMNode(element: HTMLElement) {
    this.domElement = element;
  }

  public invalidate() {
    if (!this.domElement) return;

    const container = this.domElement;
    let parent = container.parentNode;
    let computedStyle;

    const getSize = (computedStyle, key1, key2) => {
      const value = parseFloat(computedStyle[key1] || computedStyle[key2]);
      return (isNaN(value)) ? 0 : value;
    };

    let paddingLeft = 0;
    let paddingRight = 0;

    while (parent) {
      computedStyle = StyleHelper.getComputedStyle(parent);

      if (['relative', 'absolute', 'fixed'].indexOf(computedStyle['position']) != -1) break;
      else parent = parent.parentNode;
    }

    if (parent) {
      paddingLeft += getSize(computedStyle, 'paddingLeft', 'padding-left');
      paddingRight += getSize(computedStyle, 'paddingRight', 'padding-right');
    }

    this.setState({
      paddingLeft: paddingLeft,
      paddingRight: paddingRight
    });
  }

  render() {
    return (
      pug`
              .internal-fsb-guide.internal-fsb-accessory(id='internal-fsb-guide', style={paddingLeft: this.state.paddingLeft + 'px', paddingRight: this.state.paddingRight + 'px'})
                .col-1.p-0
                .col-1.p-0
                .col-1.p-0
                .col-1.p-0
                .col-1.p-0
                .col-1.p-0
                .col-1.p-0
                .col-1.p-0
                .col-1.p-0
                .col-1.p-0
                .col-1.p-0
                .col-1.p-0
            `
    )
  }
}

DeclarationHelper.declare('Controls.Guide', Guide);

export {Props, State, Guide};