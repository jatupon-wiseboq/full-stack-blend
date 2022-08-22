import {CodeHelper} from '../../../helpers/CodeHelper';
import {HTMLHelper} from '../../../helpers/HTMLHelper';
import {EventHelper} from '../../../helpers/EventHelper';
import {RequestHelper} from '../../../helpers/RequestHelper';
import {IProps, IState, DefaultProps, DefaultState, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import {LIBRARIES, DEBUG_SITE_PREVIEW} from '../../../Constants';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
}

interface State extends IState {
   loading: boolean;
   location: string;
}

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
});

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
    loading: false,
    location: null
});

class SVGEditor extends Base<Props, State> {
		protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;
    protected static container: any = null;
    protected static external: any = null;

    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    public update(properties: any) {
        if (!super.update(properties)) return;
    }
    
    private buttonOnClick() {
    		this.open();
    		this.start();
    }
    
    public open() {
        this.setState({loading: true, location: 'about:blank'});
        HTMLHelper.addClass(document.body, 'internal-fsb-external-on');
    }
    
    public start(display: boolean=true) {
    		this.setState({loading: true});
        HTMLHelper.addClass(document.body, 'internal-fsb-external-on');
    		
    		const svgText = this.state.attributeValues[this.props.watchingAttributeNames[0]] || `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" fill="currentColor" class="bi bi-box-fill" viewBox="0 0 256 256"></svg>`;
    		const svgTextAsBase64 = Base64.encode(svgText);
    		
        this.setState({location: `/editor/svg-editor.html?source=${encodeURIComponent('data:image/svg+xml;base64,' + svgTextAsBase64)}`});
        this.forceUpdate();
        
        this.container = ReactDOM.findDOMNode(this.refs.container);
        this.external = ReactDOM.findDOMNode(this.refs.external);
        this.external.style.visibility = 'hidden';
        
        document.body.appendChild(this.container);
    }
    
    public load() {
    		if (this.state.location == 'about:blank' || this.state.location == null) return;
        this.setState({loading: false});
        
        if (this.external) {
	      	const externalWindow = this.external.contentWindow || this.external.contentDocument.document || this.external.contentDocument;
	      	if (externalWindow && externalWindow.svgEditor) {
		      	externalWindow.svgEditor.setCustomHandlers({
						  save: ((window, data) => {
						  	perform('update', {
		              attributes: [{
		                  name: this.props.watchingAttributeNames[0],
		                  value: data
		              }]
		          	});
		          	externalWindow.svgEditor.canvas.undoMgr.resetUndoStack();
		          	this.close();
						  }).bind(this)
						});
						externalWindow.svgEditor.setIconSize('m');
						externalWindow.document.body.style.backgroundColor = 'rgba(255, 255, 255, 0.0)';
						externalWindow.focus();
						
        		this.external.style.visibility = '';
					}
				}
    }
    
    private close(error) {
        if (error && error.message) console.error(error.message);
      	
        this.setState({loading: false, location: 'about:blank'});
    		HTMLHelper.removeClass(document.body, 'internal-fsb-external-on');
    		
    		if (this.container) {
    			this.container.parentNode.removeChild(this.container);
    			this.container = null;
    		}
    }
    
    public isOpening() {
    		return this.state.loading;
    }
    
    render() {
      return pug `
        div
          button.btn.btn-sm(type="button", className="btn-light", onClick=this.buttonOnClick.bind(this)) Open Editor
          .external-preview(ref="container")
            .close-button.btn.btn-sm.btn-light.px-3(onClick=this.close.bind(this))
              i.fa.fa-close.m-0
            .iframe-container
              .iframe-navigation-bar
              .iframe-body
                iframe(ref="external", onLoad=this.load.bind(this), src=this.state.location)
            .loading-container(style={display: this.state.loading ? 'block' : 'none'})
              .linear-background
                .inter-left
                .inter-right--top
                .inter-right--bottom
              .linear-background
                .inter-left
                .inter-right--top
                .inter-right--bottom
              .linear-background
                .inter-left
                .inter-right--top
                .inter-right--bottom
        `
    }
}

DeclarationHelper.declare('Components.SVGEditor', SVGEditor);

export {Props, State, SVGEditor};