import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;

interface Props extends IProps {
}

interface State extends IState {
}

let ExtendedDefaultState = Object.assign({}, DefaultState);

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
    watchingExtensionNames: ['preview']
});

class PreviewSizePicker extends Base<Props, State> {
    protected static defaultProps: Props = ExtendedDefaultProps;
    
    constructor(props) {
      super(props);
    }
    
    public update(properties: any) {
      if (!super.update(properties)) return;
      
      let areaContainer = document.getElementById('area-container');
    	let width = null;
    	let content = this.state.extensionValues['preview'] || null;
    	if (content != null) {
      	width = [576, 768, 992, 1200][content[0]];
    	}
    	areaContainer.style.width = (width == null) ? '100%' : (width + content[1]) + 'px';
    }
    
    choose(size: number, direction: number) {
    	if (this.state.extensionValues['preview'] && this.state.extensionValues['preview'][0] == size && this.state.extensionValues['preview'][1] == direction) {
    		perform('update', {
	          extensions: [{
	              name: 'preview',
	              value: null
	          }]
	      });
    	} else {
	    	perform('update', {
	          extensions: [{
	              name: 'preview',
	              value: [size, direction]
	          }]
	      });
	    }
    }
    
    render() {
      return (
        pug `
          .preview-size-picker.btn-group
            each index in [0, 1, 2, 3]
              .btn-group(key="group-1-" + index, onClick=this.choose.bind(this, index, -1))
                label.btn.btn-light.btn-sm(className=((this.state.extensionValues['preview'] && this.state.extensionValues['preview'][0] == index && this.state.extensionValues['preview'][1] == -1) ? 'active' : 'inactive'))
                  span
                    i(className="fa fa-long-arrow-left")
                    i(className=["fa fa-mobile", "fa fa-tablet", "fa fa-tablet fa-rotate-90", "fa fa-laptop", "fa fa-desktop"][index])
              .btn-group(key="group-2-" + index, onClick=this.choose.bind(this, index, 1))
                label.btn.btn-light.btn-sm(className=((this.state.extensionValues['preview'] && this.state.extensionValues['preview'][0] == index && this.state.extensionValues['preview'][1] == 1) ? 'active' : 'inactive'))
                  span
                    i(className=["fa fa-mobile", "fa fa-tablet", "fa fa-tablet fa-rotate-90", "fa fa-laptop", "fa fa-desktop"][index])
                    i(className="fa fa-long-arrow-right")
        `
      )
    }
}

DeclarationHelper.declare('Components.PreviewSizePicker', PreviewSizePicker);

export {Props, State, ExtendedDefaultState, ExtendedDefaultProps, PreviewSizePicker};