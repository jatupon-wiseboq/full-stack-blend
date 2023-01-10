import { TextHelper } from '../../../helpers/TextHelper';
import { IProps, IState, Base } from '../Base';
import { FullStackBlend, DeclarationHelper } from '../../../helpers/DeclarationHelper';
import '../../controls/Tree';

declare let React : any;
declare let ReactDOM : any;

interface Props extends IProps {
}

interface State extends IState {
}

class CSSStyles extends Base<Props, State> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FullStackBlend.Controls.Tree />
    )
  }
}

DeclarationHelper.declare('Components.CSSStyles', CSSStyles);

export { Props, State, CSSStyles };