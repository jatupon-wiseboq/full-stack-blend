import {IProps, IState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

class GridPicker extends Base<IProps, IState> {
    render() {
      return (
        pug `
            .div
              | ABC
        `
      )
    }
}

DeclarationHelper.declare('Controls.GridPicker', GridPicker);