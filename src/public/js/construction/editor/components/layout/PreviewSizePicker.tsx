import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import {SCREEN_SIZE} from '../../../Constants';

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
      	width = SCREEN_SIZE[content[0]];
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
            each index in [1, 2, 3, 4]
              - const middle = Math.floor((SCREEN_SIZE[index] - SCREEN_SIZE[index-1]) / 2)
              .btn-group(key="group-left-" + index, onClick=this.choose.bind(this, index-1, 1))
                label.btn.btn-light.btn-sm(className=((this.state.extensionValues['preview'] && this.state.extensionValues['preview'][0] == index-1 && this.state.extensionValues['preview'][1] == 1) ? 'active' : 'inactive'))
                  span
                    i(className="fa fa-long-arrow-left")
              .btn-group(key="group-center-" + index, onClick=this.choose.bind(this, index, -middle))
                label.btn.btn-light.btn-sm(className=((this.state.extensionValues['preview'] && this.state.extensionValues['preview'][0] == index && this.state.extensionValues['preview'][1] == -middle) ? 'active' : 'inactive'))
                  span
                    i(className=["", "fa fa-mobile", "fa fa-tablet", "fa fa-tablet fa-rotate-90", "fa fa-laptop", "fa fa-desktop", ""][index])
              .btn-group(key="group-right-" + index, onClick=this.choose.bind(this, index, -1))
                label.btn.btn-light.btn-sm(className=((this.state.extensionValues['preview'] && this.state.extensionValues['preview'][0] == index && this.state.extensionValues['preview'][1] == -1) ? 'active' : 'inactive'))
                  span
                    i(className="fa fa-long-arrow-right")
        `
      )
    }
}

DeclarationHelper.declare('Components.PreviewSizePicker', PreviewSizePicker);

export {Props, State, ExtendedDefaultState, ExtendedDefaultProps, PreviewSizePicker};