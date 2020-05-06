import {CodeHelper} from '../../helpers/CodeHelper.js';
import {HTMLHelper} from '../../helpers/HTMLHelper.js';
import {IProps, IState, DefaultProps, DefaultState, Base} from './Base.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;
declare let ts: any;
declare let zip: any;

interface Props extends IProps {
}

interface State extends IState {
   value: string,
   loading: boolean,
   requiredFilesLoaded: boolean
}

zip.workerScriptsPath = "/js/lib/";

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
});

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
    value: '',
    loading: false,
    requiredFilesLoaded: false
});

class SitePreview extends Base<Props, State> {
		protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;

    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    componentDidMount() {
    		window.addEventListener("message", (event) => {
			    let data = JSON.parse(event.data);
			  	if (data.target == 'site-preview') {
			  		switch (data.name) {
			  			case 'load':
			  				this.setState({
				    			loading: data.content	
				    		});
				    		break;
			  		}
			    }
			  });
    }
    
   	requiredFiles: any = {
    		"src/public/js/helpers/CodeHelper.ts": false,
    		"src/public/js/helpers/DeclarationHelper.ts": false,
    		"src/public/js/helpers/EventHelper.ts": false,
    		"src/public/js/components/Base.tsx": false
    };
    requiredFilesRemainingCount: number = 4;
    zipReader: any = null;
    reader: any = null;
    currentKey: string = null;
    
    public update(properties: any) {
        if (!super.update(properties)) return;
    }
    
    public clear() {
    		let count = 0;
    		for (let key in this.requiredFiles) {
    				if (this.requiredFiles.hasOwnProperty(key)) {
    							this.requiredFiles[key] = false;
    							count += 1;
    				}
    		}
    		this.requiredFilesRemainingCount = count;
    		if (this.zipReader) this.zipReader.close();
    		this.zipReader = null;
    		this.reader = null;
    		this.currentKey = null;
    }
    
    public start() {
    		this.setState({
    			loading: true	
    		});
    		
    		if (!this.state.requiredFilesLoaded) {
		    		this.clear();
		    		
		    		HTMLHelper.addClass(document.body, 'internal-fsb-preview-on');
		    		
		    		var request = new XMLHttpRequest();
						request.addEventListener("load", this.unzip.bind(this, request));
						request.addEventListener("error", this.close.bind(this));
						request.responseType = 'blob';
						request.open("GET", "/boilerplate.zip");
						request.send();
				} else {
						HTMLHelper.addClass(document.body, 'internal-fsb-preview-on');
						
						this.display();
				}
    }
    
    private unzip(request) {
    		this.currentKey = null;
			  zip.createReader(new zip.BlobReader(request.response), ((zipReader) => {
			    zipReader.getEntries(((entries) => {
			    	for (let entry of entries) {
			    		if (typeof this.requiredFiles[entry.filename] === 'boolean') {
			    			this.requiredFiles[entry.filename] = entry;
			    		}
				    }
				    this.read();
			    }).bind(this));
			    this.zipReader = zipReader;
			  }).bind(this), this.close.bind(this));
    }
    
    private read() {
    		if (this.reader == null) {
    				this.reader = new FileReader();
    				this.reader.addEventListener('loadend', ((event) => {
    						if (typeof this.requiredFiles[this.currentKey] === 'object') {
				    				this.requiredFiles[this.currentKey] = event.srcElement.result;
				    				this.requiredFilesRemainingCount -= 1;
				    		}
				    		if (this.requiredFilesRemainingCount > 0) this.read();
				    		else {
				    			if (this.zipReader) this.zipReader.close();
				    			this.zipReader = null;
				    			
				    			this.state.requiredFilesLoaded = true;
				    			
				    			this.compile();
				    		}
						}).bind(this));
						this.reader.addEventListener('error', this.close.bind(this));
    		}
    		for (let key in this.requiredFiles) {
    				if (this.requiredFiles.hasOwnProperty(key)) {
    						if (typeof this.requiredFiles[key] === 'object') {
	    							this.currentKey = key;
    								let entry = this.requiredFiles[key];
	    							entry.getData(new zip.BlobWriter("text/plain", this.close.bind(this)), ((data) => {
								        this.reader.readAsText(data);
							      }).bind(this));
	    							return;
    						}
    				}
    		}
    }
    
    private compile() {
    		for (let key in this.requiredFiles) {
		        if (this.requiredFiles.hasOwnProperty(key)) {
		        		if (typeof this.requiredFiles[key] === 'string') {
										this.requiredFiles[key] = ts.transpileModule(this.requiredFiles[key], {compilerOptions: {module: ts.ModuleKind.AMD, jsx: "react"}}).outputText;
										this.requiredFiles[key] = URL.createObjectURL(new Blob([this.requiredFiles[key]]));
								}
		    		}
		    }
		    
		    this.display();
    }
    
    private display() {
    		let combinedHTMLTags, combinedMinimalFeatureScripts, combinedExpandingFeatureScripts;
    		
    		let construction = document.getElementById('construction');
    		let constructionWindow = construction.contentWindow || construction.contentDocument.document || construction.contentDocument;
    		[combinedHTMLTags, combinedMinimalFeatureScripts, combinedExpandingFeatureScripts] = constructionWindow.generateHTMLCodeForPage();
    		
    		console.log(combinedHTMLTags);
    		console.log(combinedMinimalFeatureScripts);
    		console.log(combinedExpandingFeatureScripts);
        
        combinedMinimalFeatureScripts = ts.transpileModule(combinedMinimalFeatureScripts, {compilerOptions: {module: ts.ModuleKind.COMMONJS}}).outputText;
        let combinedMinimalFeatureScriptsURI = window.URL.createObjectURL(new Blob([combinedMinimalFeatureScripts]));
        
        combinedExpandingFeatureScripts = ts.transpileModule(combinedExpandingFeatureScripts, {compilerOptions: {module: ts.ModuleKind.AMD, jsx: "react"}}).outputText;
        let combinedExpandingFeatureScriptsURI = window.URL.createObjectURL(new Blob([combinedExpandingFeatureScripts]));
    		
        let preview = ReactDOM.findDOMNode(this.refs.preview);
        let previewWindow = preview.contentWindow || preview.contentDocument.document || preview.contentDocument;
        
				previewWindow.document.open();
				previewWindow.document.write(
`<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Untitled - Construction Area</title>
		<meta name="description" content="" />
		<link rel="stylesheet" href="/css/embed.css">
	</head>
	<body>
		${combinedHTMLTags}
		<script type="text/javascript" src="${combinedMinimalFeatureScriptsURI}"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js"></script>
		<script type="text/typescript">
			// Load AMD modules.
			// 
			let requiredFiles = ${JSON.stringify(this.requiredFiles)};
			
			require(["https://unpkg.com/react@16/umd/react.development.js"], (React) => {
				define('react', React);
				
				require(["https://unpkg.com/react-dom@16/umd/react-dom.development.js"], (ReactDOM) => {
					window.React = React;
					window.ReactDOM = ReactDOM;
					
					require([
						requiredFiles["src/public/js/helpers/CodeHelper.ts"],
						requiredFiles["src/public/js/helpers/DeclarationHelper.ts"],
						requiredFiles["src/public/js/helpers/EventHelper.ts"]
					], (CodeHelper, DeclarationHelper, EventHelper) => {
						define('CodeHelper', CodeHelper);
						define('DeclarationHelper', DeclarationHelper);
						define('EventHelper', EventHelper);
						
						require([
							requiredFiles["src/public/js/components/Base.tsx"]
						], (Base) => {
							define('Base', Base);
							
							require(["${combinedExpandingFeatureScriptsURI}"], (Component) => {
								if (Component.Main) {
									let container = document.createElement('div');
									ReactDOM.render(React.createElement(Component.Main, {}, null), container);
									document.body.appendChild(container);
								}
								
								window.top.postMessage(JSON.stringify({
						    	target: 'site-preview',
						      name: 'load',
						      content: false
						    }), '*');
							});
						});
					});
				});
			});
		</script>
		<script src="https://rawgit.com/Microsoft/TypeScript/master/lib/typescriptServices.js"></script>
		<script src="https://rawgit.com/basarat/typescript-script/master/transpiler.js"></script>
		<script src="/js/Embed.bundle.js"></script>
	</body>
</html>
`);
				previewWindow.document.close();
    }
    
    private close(error) {
    		if (error instanceof Error) {
    			console.log(error.message);
    			this.clear();
    		}
    	
    		HTMLHelper.removeClass(document.body, 'internal-fsb-preview-on');
    		
    		let preview = ReactDOM.findDOMNode(this.refs.preview);
        let previewWindow = preview.contentWindow || preview.contentDocument.document || preview.contentDocument;
    		
    		previewWindow.location = 'about:blank';
    }
    
    render() {
      return pug `
      	.site-preview
      		.close-button.btn.btn-sm.btn-light.px-3(onClick=this.close.bind(this))
      			i.fa.fa-close.m-0
      		.iframe-container
      			.iframe-navigation-bar
      			.iframe-body
      				iframe(ref="preview")
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

DeclarationHelper.declare('Components.SitePreview', SitePreview);

export {Props, State, SitePreview};