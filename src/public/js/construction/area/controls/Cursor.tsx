import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper';

declare let React: any;
declare let ReactDOM: any;

interface Props {
}

interface State {
}

class Cursor extends React.Component<Props, State> {
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

  render() {
    return (
      pug`
              .internal-fsb-cursor.internal-fsb-accessory(id='internal-fsb-cursor', internal-cursor-mode='relative')
                .col-1
            `
    )
  }
}

DeclarationHelper.declare('Controls.Cursor', Cursor);

export {Props, State, Cursor};