import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {HTMLHelper} from '../../../helpers/HTMLHelper.js';
import {TextHelper} from '../../../helpers/TextHelper.js';
import {RequestHelper} from '../../../helpers/RequestHelper.js';
import {IProps, IState, DefaultProps, DefaultState, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {LIBRARIES, DEBUG_GITHUB_UPLOADER} from '../../../Constants.js';

declare let React: any;
declare let ReactDOM: any;
declare let ts: any;

interface Props extends IProps {
}

interface State extends IState {
}

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
  watchingExtensionNames: ["externalLibraries", "customExternalLibraries", "pages"]
});

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
});

class EndpointManager extends Base<Props, State> {
		protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;

    constructor(props) {
      super(props);
      Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    componentDidMount() {
    }
    
    public update(properties: any) {
      if (!super.update(properties)) return;
    }
    
    getRepresentativeName(key: string) {
    	if (key == 'index') return key;
    	else return `_${key}`;
    }
    getFeatureDirectoryPrefix(key: string) {
    	let pages = this.state.extensionValues['pages'];
      let editingPageID = key;
      pages = pages.filter(page => page.id == editingPageID);
      
      let path = pages && pages[0] && pages[0].path || '';
      path = path.split(':')[0].replace(/(^\/|\/$)/g, '');
      
      return (path) ? path + '/' : '';
    }
    
    files: any = [];
    private create(path: string, content: string) {
      return new Promise((resolve) => {
        this.files.push({
          path: path,
    			content: content
        });
        resolve();
      });
    }
    private commit() {
      let _files = this.files;
  		this.files = [];
  		return RequestHelper.post(`${window.ENDPOINT}/endpoint/update/content`, {
  			files: _files
  		})
    }
    
    public save(cb) {
      if (!window.ENDPOINT) return cb();
      
      let construction = document.getElementById('area');
      let constructionWindow = construction.contentWindow || construction.contentDocument.document || construction.contentDocument;
      
  		let constructionAreaHTMLData = constructionWindow.generateWorkspaceData() || {};
  		let constructionEditorData = this.generateWorkspaceData() || {};
  		let frontEndCodeInfoDict = constructionWindow.generateFrontEndCodeForAllPages();
  		let backEndControllerInfoDict = constructionWindow.generateBackEndCodeForAllPages();
      let nextProjectData = {};
      
      Object.assign(nextProjectData, {});
      Object.assign(nextProjectData, constructionAreaHTMLData);
      Object.assign(nextProjectData, constructionEditorData);
      
      let externalStylesheets = [];
  		let externalScripts = [];
  		let selectedLibraries: string[] = (this.state.extensionValues[this.props.watchingExtensionNames[0]] || '').split(' ');
      for (let library of LIBRARIES) {
          if (selectedLibraries.indexOf(library.id) != -1) {
              if (library.production.stylesheets) {
                  for (let stylesheet of library.production.stylesheets) {
                      externalStylesheets.push('link(rel="stylesheet" type="text/css" href="' + stylesheet + '")');
                  }
              }
              if (library.production.scripts) {
                  for (let script of library.production.scripts) {
                      externalScripts.push('script(type="text/javascript" src="' + script + '")');
                  }
              }
          }
      }
      
      let customHeaderExternalStylesheets = [];
      let customHeaderExternalScripts = [];
      let customFooterExternalStylesheets = [];
      let customFooterExternalScripts = [];
      
      let externalLibraries: string[] = (this.state.extensionValues['customExternalLibraries'] || '').split(' ');
      for (let externalLibrary of externalLibraries) {
			  if (!externalLibrary) continue;
			  
      	let splited = externalLibrary.split('#');
      	if (splited[1] != 'footer') {
      		if (splited[0].toLowerCase().indexOf('.css') != -1) {
      			customHeaderExternalStylesheets.push('link(rel="stylesheet" type="text/css" href="' + splited[0] + '")');
      		} else {
      			customHeaderExternalScripts.push('script(type="text/javascript" src="' + splited[0] + '")');
      		}
      	} else {
      		if (splited[0].toLowerCase().indexOf('.css') != -1) {
      			customFooterExternalStylesheets.push('link(rel="stylesheet" type="text/css" href="' + splited[0] + '")');
      		} else {
      			customFooterExternalScripts.push('script(type="text/javascript" src="' + splited[0] + '")');
      		}
      	}
      }
      
      let combinedHTMLPageDict = {};
      let arrayOfCombinedExpandingFeatureScripts = [];
      for (let key in frontEndCodeInfoDict) {
        if (frontEndCodeInfoDict.hasOwnProperty(key)) {
          let combinedHTMLTags, combinedMinimalFeatureScripts, combinedExpandingFeatureScripts, combinedFontTags, combinedInlineBodyStyle, combinedStylesheet;
      		[combinedHTMLTags, combinedMinimalFeatureScripts, combinedExpandingFeatureScripts, combinedFontTags, combinedInlineBodyStyle, combinedStylesheet] = frontEndCodeInfoDict[key];
		      
		      let REGEX = /https:[\/a-zA-Z0-9_\-]+\/images\/uploaded/g;
		      
		      if (combinedHTMLTags) combinedHTMLTags = combinedHTMLTags.replace(REGEX, '/uploaded');
		      if (combinedMinimalFeatureScripts) combinedMinimalFeatureScripts = combinedMinimalFeatureScripts.replace(REGEX, '/uploaded');
		      if (combinedExpandingFeatureScripts) combinedExpandingFeatureScripts = combinedExpandingFeatureScripts.replace(REGEX, '/uploaded');
		      if (combinedFontTags) combinedFontTags = combinedFontTags.map((tag) => {
		        return tag.replace(REGEX, '/uploaded');
		      });
		      if (combinedInlineBodyStyle) combinedInlineBodyStyle = combinedInlineBodyStyle.replace(REGEX, '/uploaded');
		      if (combinedStylesheet) combinedStylesheet = combinedStylesheet.replace(REGEX, '/uploaded');
		      
		      if (combinedInlineBodyStyle) combinedInlineBodyStyle = `(style="${combinedInlineBodyStyle.replace(/"/g, "'")}")`;
		      else combinedInlineBodyStyle = '';
	        
	        let compiledCombinedMinimalFeatureScripts = ts.transpileModule(combinedMinimalFeatureScripts, {compilerOptions: {module: ts.ModuleKind.COMMONJS}}).outputText;
	        compiledCombinedMinimalFeatureScripts = compiledCombinedMinimalFeatureScripts.split('\n').join('\n      ');
	        
	        let pages = this.state.extensionValues['pages'];
	        let editingPageID = key;
	        pages = pages.filter(page => page.id == editingPageID);
	        
	        let title = (pages && pages[0] && pages[0].name || '').replace(/"/g, '\\x22').replace(/'/g, '\\x27');
	        let description = (pages && pages[0] && pages[0].description || '').replace(/"/g, '\\x22').replace(/'/g, '\\x27');
	        let keywords = (pages && pages[0] && pages[0].keywords || '').replace(/"/g, '\\x22').replace(/'/g, '\\x27');
	        let image = (pages && pages[0] && pages[0].image || '').replace(/"/g, '\\x22').replace(/'/g, '\\x27');
	        let path = (pages && pages[0] && pages[0].path || '').replace(/"/g, '\\x22').replace(/'/g, '\\x27');
	        
	        combinedHTMLTags = TextHelper.removeBlankLines(combinedHTMLTags);
	        
          let combinedHTMLPage = `.
  <!DOCTYPE html>
html
  head
    meta(name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0")
    title.
      \#{headers && headers.title || '${title}'}
    meta(name="description" content=headers && headers.description || '${description}')
    meta(name="keywords" content=headers && headers.keywords || '${keywords}')
    meta(http-equiv="content-language" content=headers && headers.language || 'en')
    meta(http-equiv="content-type" content=headers && headers.contentType || 'UTF-8')
    meta(name="revisit-after" content=headers && headers.revisitAfter || '7 days')
    meta(name="robots" content=headers && headers.robots || 'index, follow')
    meta(property="og:title" content=headers && headers.title || '${title}')
    meta(property="og:url" content=headers && headers.linkUrl || '${path}')
    meta(property="og:image" content=headers && headers.imageUrl || '${image}')
    meta(property="og:type" content=headers && headers.itemType || 'website')
    meta(property="og:description" content=headers && headers.description || '${description}')
    meta(property="og:locale" content=headers && headers.contentLocale || 'en_US')
    link(rel="stylesheet" href="/css/embed.css")
    ${externalStylesheets.join('\n    ')}
    ${customHeaderExternalStylesheets.join('\n    ')}
    ${customHeaderExternalScripts.join('\n    ')}
    style(type="text/css").
      ${combinedStylesheet}
  body${combinedInlineBodyStyle}
    ${combinedHTMLTags}
    script(type="text/javascript" src="/js/Embed.bundle.js")
    script(type="text/javascript").
      ${compiledCombinedMinimalFeatureScripts}
    ${combinedFontTags.join('\n    ')}
    script(type="text/javascript").
      window.data = !{JSON.stringify(data)};
    ${externalScripts.join('\n    ')}
    ${customFooterExternalStylesheets.join('\n    ')}
    ${customFooterExternalScripts.join('\n    ')}
    script(type="text/javascript" src="/js/Site.bundle.js")
`
          combinedHTMLPageDict[key] = combinedHTMLPage;
          arrayOfCombinedExpandingFeatureScripts.push(combinedExpandingFeatureScripts);
        }
      }
      
      let arrayOfControllerScripts = [];
      for (let key in backEndControllerInfoDict) {
        if (backEndControllerInfoDict.hasOwnProperty(key)) {
        	arrayOfControllerScripts.push(backEndControllerInfoDict[key][0]);
       	}
      }
      
      this.createRoute(nextProjectData.globalSettings.pages, () => {
        this.createController(nextProjectData.globalSettings.pages, () => {
          this.createView(combinedHTMLPageDict, nextProjectData.globalSettings.pages, () => {
          	this.createBackEndController(arrayOfControllerScripts, () => {
              this.createFrontEndComponents(arrayOfCombinedExpandingFeatureScripts, (frontEndComponentsBlobSHADict) => {
              	
              	let nextFrontEndComponentsBlobSHADict = Object.assign({}, nextProjectData.frontEndComponentsBlobSHADict || {});
              	Object.assign(nextFrontEndComponentsBlobSHADict, frontEndComponentsBlobSHADict);
              	
                this.createSiteBundle(nextProjectData.globalSettings.pages, nextFrontEndComponentsBlobSHADict, () => {
                  this.create('../../project.stackblend', JSON.stringify(CodeHelper.recursiveSortHashtable(nextProjectData), null, 2)).then(() => {
                    this.commit().then(() => {
                      cb(true);
                    }).catch(() => {
                      cb(false);
                    });
                  });
                });
              });
            });
          });
        });
      });
    }
   	createRoute(routes: string[], cb: any) {
   	  this.create('../route.ts', `// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

import * as homeController from './controllers/Home.js';

const route = (app: any) => {
${routes.map(route => ` app.get("${route.path}", homeController.${this.getRepresentativeName(route.id)});
 app.post("${route.path}", homeController.${this.getRepresentativeName(route.id)});`).join('\n')
}
}

export default route;

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.`).then(cb);
   	}
   	createController(routes: string[], cb: any) {
   	  this.create('./Home.ts', `// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

import {Request, Response} from "express";
${routes.map(route => `import Component${route.id} from "./components/${this.getFeatureDirectoryPrefix(route.id)}${this.getRepresentativeName(route.id)}.js";`).join('\n')}

${routes.map(route => `export const ${this.getRepresentativeName(route.id)} = (req: Request, res: Response) => {
	new Component${route.id}(req, res, "home/${this.getFeatureDirectoryPrefix(route.id)}${this.getRepresentativeName(route.id)}");
}`).join('\n')}

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.`).then(cb);
   	}
   	createView(inputDict: any, pages: any, cb: any) {
   	  let keys = Object.keys(inputDict);
   	  let nextViewDataSHADict = {};
   	  
   	  let process = ((index: number) => {
   	    let page = pages.filter(page => page.id == keys[index]);
   	    
   	    this.create(`../../views/home/${this.getFeatureDirectoryPrefix(page[0].id)}${this.getRepresentativeName(page[0].id)}.pug`, `//- Auto[Generating:V1]--->
//- PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

${inputDict[keys[index]].split('#{title}').join(page && page[0] && page[0].name || 'Untitled')}

//- <--- Auto[Generating:V1]
//- PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.`).then(() => {
          if (index + 1 < keys.length) {
            process(index + 1);
          } else {
            cb();
          }
        });
   	  }).bind(this);
   	  process(0);
 	  }
   	createFrontEndComponents(arrayOfContent: string[], cb: any) {
   	  let nextFrontEndComponentsDataSHADict = {};
   	  let mainprocess = ((mainIndex: number) => {
     	  let results = arrayOfContent[mainIndex].split("// Auto[File]--->\n");
     	  if (results.length < 2) {
     	    if (mainIndex + 1 < arrayOfContent.length) {
     	      mainprocess(mainIndex + 1);
     	    } else {
     	      cb(nextFrontEndComponentsDataSHADict);
     	    }
     	  } else {
       	  let subprocess = ((subIndex: number) => {
       	    let tokens = results[subIndex].split("\n// <---Auto[File]");
       	    
       	    this.create(`../public/js/components/${tokens[0]}.tsx`, `// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

${tokens[1]}

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.`).then(() => {
							nextFrontEndComponentsDataSHADict[tokens[0]] = '';

              if (subIndex + 1 < results.length) {
                subprocess(subIndex + 1);
              } else if (mainIndex + 1 < arrayOfContent.length) {
                mainprocess(mainIndex + 1);
              } else {
                cb(nextFrontEndComponentsDataSHADict);
              }
            });
       	  }).bind(this);
       	  subprocess(1);
       	}
      }).bind(this);
      mainprocess(0);
   	}
   	createBackEndController(arrayOfContent: string[], cb: any) {
   	  let nextBackEndControllersDataSHAInfos = [];
   	  let mainprocess = ((mainIndex: number) => {
     	  let results = arrayOfContent[mainIndex].split("// Auto[File]--->\n");
     	  if (results.length < 2) {
     	    if (mainIndex + 1 < arrayOfContent.length) {
     	      mainprocess(mainIndex + 1);
     	    } else {
     	      cb();
     	    }
     	  } else {
       	  let subprocess = ((subIndex: number) => {
       	    let tokens = results[subIndex].split("\n// <---Auto[File]");
       	    
       	    this.create(`./components/${this.getFeatureDirectoryPrefix(tokens[0])}${this.getRepresentativeName(tokens[0])}.ts`, `// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

${tokens[1]}

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.`).then(() => {
              if (subIndex + 1 < results.length) {
                subprocess(subIndex + 1);
              } else if (mainIndex + 1 < arrayOfContent.length) {
                mainprocess(mainIndex + 1);
              } else {
                cb();
              }
            });
       	  }).bind(this);
       	  subprocess(1);
       	}
      }).bind(this);
      mainprocess(0);
   	}
   	createSiteBundle(routes: string[], frontEndComponentsBlobSHADict: any, cb: any) {
 	    this.create(`../public/js/Site.tsx`, `// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

import {Project, DeclarationHelper} from './helpers/DeclarationHelper.js';
import {HTMLHelper} from './helpers/HTMLHelper.js';
import {EventHelper} from './helpers/EventHelper.js';
${Object.keys(frontEndComponentsBlobSHADict).map(key => `import './components/${key}.js';`).join('\n')}

declare let React: any;
declare let ReactDOM: any;
declare let window: any;
declare let DataManipulationHelper: any;

let expandingPlaceholders = [...document.querySelectorAll('[internal-fsb-init-class]')];
for (let expandingPlaceholder of expandingPlaceholders) {
	let forward = JSON.parse((expandingPlaceholder.getAttribute('internal-fsb-init-forward') || '{}').replace(/'/g, '"'));
	ReactDOM.render(React.createElement(DeclarationHelper.get(expandingPlaceholder.getAttribute('internal-fsb-init-class')), {forward: forward, data: window.data || null}, null), expandingPlaceholder);
	expandingPlaceholder.parentNode.insertBefore(expandingPlaceholder.firstElementChild, expandingPlaceholder);
	expandingPlaceholder.parentNode.removeChild(expandingPlaceholder);
}

window.internalFsbSubmit = (guid: string, notation: string, event, callback: any) => {
	DataManipulationHelper.request(guid, notation, event, callback);
}

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.`).then(cb);
   	}
   	generateWorkspaceData() {
    	return {};
    }
   	initializeWorkspaceData(data) {
    	
    }
    
    render() {
      return pug `div`
    }
}

DeclarationHelper.declare('Components.EndpointManager', EndpointManager);

export {Props, State, EndpointManager};