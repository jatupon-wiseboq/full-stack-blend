import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {HTMLHelper} from '../../../helpers/HTMLHelper.js';
import {IProps, IState, DefaultProps, DefaultState, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {LIBRARIES} from '../../../Constants.js';

declare let React: any;
declare let ReactDOM: any;
declare let ts: any;
declare let zip: any;

const STRIPPING_PATH_REGEX_GLOBAL = /from '([^']+)\/([a-zA-Z]+)\.js'/g
const STRIPPING_PATH_REGEX_LOCAL = /from '([^']+)\/([a-zA-Z]+)\.js'/

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
    watchingExtensionNames: ["externalLibraries"]
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
		        		    this.requiredFiles[key] = this.requiredFiles[key].replace(STRIPPING_PATH_REGEX_GLOBAL, (token) => {
                      return `from '${token.match(STRIPPING_PATH_REGEX_LOCAL)[2]}'`;
                    });
		        		  
										this.requiredFiles[key] = ts.transpileModule(this.requiredFiles[key], {compilerOptions: {module: ts.ModuleKind.AMD, jsx: "react"}}).outputText;
										this.requiredFiles[key] = URL.createObjectURL(new Blob([this.requiredFiles[key]]));
								}
		    		}
		    }
		    
		    this.display();
    }
    
    private display() {
    		let combinedHTMLTags, combinedMinimalFeatureScripts, combinedExpandingFeatureScripts, combinedFontTags, combinedInlineBodyStyle, combinedStylesheet;
    		
    		let construction = document.getElementById('html');
    		let constructionWindow = construction.contentWindow || construction.contentDocument.document || construction.contentDocument;
    		[combinedHTMLTags, combinedMinimalFeatureScripts, combinedExpandingFeatureScripts, combinedFontTags, combinedInlineBodyStyle, combinedStylesheet] = constructionWindow.generateHTMLCodeForCurrentPage();
    		
    		combinedExpandingFeatureScripts += '\n' + constructionWindow.getCommonExpandingFeatureScripts();
    		
    		if (combinedInlineBodyStyle) combinedInlineBodyStyle = ` style="${combinedInlineBodyStyle}"`;
    		else combinedInlineBodyStyle = '';
    		
    		let externalStylesheets = [];
    		let externalScripts = [];
    		let selectedLibraries: [string] = (this.state.extensionValues[this.props.watchingExtensionNames[0]] || '').split(' ');
        for (let library of LIBRARIES) {
            if (selectedLibraries.indexOf(library.id) != -1) {
                if (library.development.stylesheets) {
                    for (let stylesheet of library.development.stylesheets) {
                        externalStylesheets.push('<link rel="stylesheet" type="text/css" href="' + stylesheet + '" />');
                    }
                }
                if (library.development.scripts) {
                    for (let script of library.development.scripts) {
                        externalScripts.push('<script type="text/javascript" src="' + script + '"></script>');
                    }
                }
            }
        }
        
        combinedExpandingFeatureScripts = combinedExpandingFeatureScripts.replace(STRIPPING_PATH_REGEX_GLOBAL, (token) => {
          return `from '${token.match(STRIPPING_PATH_REGEX_LOCAL)[2]}'`;
        });
    		
    		console.log('externalStylesheets');
    		console.log(externalStylesheets);
    		console.log('externalScripts');
    		console.log(externalScripts);
    		console.log('combinedStylesheet');
    		console.log(combinedStylesheet);
    		console.log('combinedHTMLTags');
    		console.log(combinedHTMLTags);
    		console.log('combinedMinimalFeatureScripts');
    		console.log(combinedMinimalFeatureScripts);
    		console.log('combinedExpandingFeatureScripts');
    		console.log(combinedExpandingFeatureScripts);
        
        combinedMinimalFeatureScripts = ts.transpileModule(combinedMinimalFeatureScripts, {compilerOptions: {module: ts.ModuleKind.COMMONJS}}).outputText;
        let combinedMinimalFeatureScriptsURI = window.URL.createObjectURL(new Blob([combinedMinimalFeatureScripts]));
        
        combinedExpandingFeatureScripts = ts.transpileModule(combinedExpandingFeatureScripts, {compilerOptions: {module: ts.ModuleKind.AMD, jsx: "react"}}).outputText;
        let combinedExpandingFeatureScriptsURI = window.URL.createObjectURL(new Blob([combinedExpandingFeatureScripts]));
    		
        let preview = ReactDOM.findDOMNode(this.refs.preview);
        let previewWindow = preview.contentWindow || preview.contentDocument.document || preview.contentDocument;
        
				previewWindow.document.open();
				previewWindow.document.write(
`<!DOCTYPE html>
<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Untitled - Construction Area</title>
		<meta name="description" content="" />
		<link rel="stylesheet" href="/css/embed.css">
		${combinedFontTags.join('\n')}
		<style type="text/css">${combinedStylesheet}</style>
		${externalStylesheets.join('\n')}
	</head>
	<body${combinedInlineBodyStyle}>
		${combinedHTMLTags}
		<script src="/js/Embed.bundle.js"></script>
		<script type="text/javascript" src="${combinedMinimalFeatureScriptsURI}"></script>
		${externalScripts.join('\n')}
		<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js"></script>
		<script type="text/javascript">
			let requiredFiles = ${JSON.stringify(this.requiredFiles)};
			require.config({
        paths: {
          CodeHelper: requiredFiles["src/public/js/helpers/CodeHelper.ts"],
          DeclarationHelper: requiredFiles["src/public/js/helpers/DeclarationHelper.ts"],
          EventHelper: requiredFiles["src/public/js/helpers/EventHelper.ts"],
          Base: requiredFiles["src/public/js/components/Base.tsx"]
      	}
      });
			
			require(["DeclarationHelper", "${combinedExpandingFeatureScriptsURI}"], function(ExportedDeclarationHelper, ExportedFeatures) {
				let DeclarationHelper = ExportedDeclarationHelper.DeclarationHelper;
				let expandingPlaceholders = [...document.querySelectorAll('[internal-fsb-init-class]')];
				
				for (let expandingPlaceholder of expandingPlaceholders) {
				  console.log(DeclarationHelper.get(expandingPlaceholder.getAttribute('internal-fsb-init-class')));
				  let forward = JSON.parse((expandingPlaceholder.getAttribute('internal-fsb-init-forward') || '{}').replace(/'/g, '"'));
				
					ReactDOM.render(React.createElement(DeclarationHelper.get(expandingPlaceholder.getAttribute('internal-fsb-init-class')), {forward: forward}, null), expandingPlaceholder);
					expandingPlaceholder.parentNode.insertBefore(expandingPlaceholder.firstChild, expandingPlaceholder);
					expandingPlaceholder.parentNode.removeChild(expandingPlaceholder);
				}
				
				window.top.postMessage(JSON.stringify({
		    	target: 'site-preview',
		      name: 'load',
		      content: false
		    }), '*');
			});
		</script>
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