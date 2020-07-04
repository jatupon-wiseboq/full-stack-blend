import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {HTMLHelper} from '../../../helpers/HTMLHelper.js';
import {TextHelper} from '../../../helpers/TextHelper.js';
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
  watchingExtensionNames: ["externalLibraries"]
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
    public save() {
      repo.getSingleCommit('heads/' + GITHUB_FEATURE_BRANCH, (error, result, request) => {
        if (error) {
          alert(`There was an error while retrieving the last commit, please try again.`);
          return;
        }
        
        let baseCommitSHA = result && result.sha;
        let baseTreeSHA = result && result.commit && result.commit.tree.sha;
        if (DEBUG_GITHUB_UPLOADER) console.log('baseCommitSHA', baseCommitSHA);
        if (DEBUG_GITHUB_UPLOADER) console.log('baseTreeSHA', baseTreeSHA);
        
        repo.getTree(baseTreeSHA, (error, result, request) => {
          if (error) {
            alert(`There was an error while retrieving project tree:\n${this.extractErrorMessage(error)}`);
            return;
          }
          
          let previousProjectDataSHA = result.tree.filter(node => node.path == 'project.stackblend')[0] || null;
          if (previousProjectDataSHA) previousProjectDataSHA = previousProjectDataSHA.sha;
          if (DEBUG_GITHUB_UPLOADER) console.log('previousProjectDataSHA', previousProjectDataSHA);
          
          let continueFn = ((previousProjectData) => {
        		let constructionAreaHTMLData = constructionWindow.generateWorkspaceData() || {};
        		let constructionEditorData = this.generateWorkspaceData() || {};
        		let frontEndCodeInfoDict = constructionWindow.generateFrontEndCodeForAllPages();
        		let backEndControllerInfoDict = constructionWindow.generateBackEndCodeForAllPages();
            let nextProjectData = {};
            
            Object.assign(nextProjectData, previousProjectData);
            Object.assign(nextProjectData, constructionAreaHTMLData);
            Object.assign(nextProjectData, constructionAreaHTMLData);
            Object.assign(nextProjectData, constructionEditorData);
            
            let externalStylesheets = [];
        		let externalScripts = [];
        		let selectedLibraries: string[] = (this.state.extensionValues[this.props.watchingExtensionNames[0]] || '').split(' ');
            for (let library of LIBRARIES) {
                if (selectedLibraries.indexOf(library.id) != -1) {
                    if (library.production.stylesheets) {
                        for (let stylesheet of library.production.stylesheets) {
                            externalStylesheets.push('<link rel="stylesheet" type="text/css" href="' + stylesheet + '" />');
                        }
                    }
                    if (library.production.scripts) {
                        for (let script of library.production.scripts) {
                            externalScripts.push('<script type="text/javascript" src="' + script + '"></script>');
                        }
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
      		      
      		      if (combinedInlineBodyStyle) combinedInlineBodyStyle = ` style="${combinedInlineBodyStyle}"`;
      		      else combinedInlineBodyStyle = '';
    		        
    		        let compiledCombinedMinimalFeatureScripts = ts.transpileModule(combinedMinimalFeatureScripts, {compilerOptions: {module: ts.ModuleKind.COMMONJS}}).outputText;
    		        compiledCombinedMinimalFeatureScripts = compiledCombinedMinimalFeatureScripts.split('\n').join('\n      ');
    		        
                let combinedHTMLPage = `.
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>#{title}</title>
      <meta name="description" content="" />
      <link rel="stylesheet" href="//staging.stackblend.com/css/embed.css">
      <style type="text/css">${combinedStylesheet}</style>
    </head>
    <body${combinedInlineBodyStyle}>
      ${combinedHTMLTags}
      <script type="text/javascript" src="//staging.stackblend.com/js/Embed.bundle.js"></script>
      <script type="text/javascript">
      ${compiledCombinedMinimalFeatureScripts}
      </script>
      ${externalStylesheets.join('\n      ')}
      ${combinedFontTags.join('\n      ')}
      <script type="text/javascript">
      window.data = !{data} || null;
      </script>
      ${externalScripts.join('\n      ')}
      <script type="text/javascript" src="/js/Site.bundle.js"></script>
    </body>
  </html>`
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
            
            this.createRouteBlob(repo, nextProjectData.globalSettings.pages, (routeBlobSHA: string) => {
              this.createControllerBlob(repo, nextProjectData.globalSettings.pages, (controllerBlobSHA: string) => {
                this.createViewBlob(repo, combinedHTMLPageDict, nextProjectData.globalSettings.pages, (viewBlobSHADict: string) => {
                	this.createBackEndControllerBlob(repo, arrayOfControllerScripts, (backEndControllerBlobSHAInfos: [[string, string]]) => {
	                  this.createFrontEndComponentsBlob(repo, arrayOfCombinedExpandingFeatureScripts, (frontEndComponentsBlobSHAInfos: [[string, string]]) => {
	                    
	                    nextProjectData.frontEndComponentsBlobSHAInfos = nextProjectData.frontEndComponentsBlobSHAInfos || [];
	                    
	                    let frontEndComponentsBlobDict = {};
	                    for (let frontEndComponentsBlobSHAInfo of nextProjectData.frontEndComponentsBlobSHAInfos) {
	                      frontEndComponentsBlobDict[frontEndComponentsBlobSHAInfo[0]] = frontEndComponentsBlobSHAInfo[1];
	                    }
	                    for (let frontEndComponentsBlobSHAInfo of frontEndComponentsBlobSHAInfos) {
	                      frontEndComponentsBlobDict[frontEndComponentsBlobSHAInfo[0]] = frontEndComponentsBlobSHAInfo[1];
	                    }
	                    
	                    frontEndComponentsBlobSHAInfos = [];
	                    for (let key in frontEndComponentsBlobDict) {
	                      if (frontEndComponentsBlobDict.hasOwnProperty(key)) {
	                        frontEndComponentsBlobSHAInfos.push([key, frontEndComponentsBlobDict[key]]);
	                      }
	                    }
	                    nextProjectData.frontEndComponentsBlobSHAInfos = frontEndComponentsBlobSHAInfos;
	                    
	                    this.createSiteBundleBlob(repo, nextProjectData.globalSettings.pages, frontEndComponentsBlobSHAInfos, (siteBundleBlobSHA: string) => {
	                      repo.createBlob(JSON.stringify(nextProjectData, null, 2), (error, result, request) => {
	                        if (error) {
	                          alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
	                          return;
	                        }
	                        
	                        let nextProjectDataSHA = result.sha;
	                        if (DEBUG_GITHUB_UPLOADER) console.log('nextProjectDataSHA', nextProjectDataSHA);
	                        
	                        let tree = [{
	                          path: 'project.stackblend',
	                          mode: "100644",
	                          type: "blob",
	                          sha: nextProjectDataSHA
	                        },{
	                          path: 'src/route.ts',
	                          mode: "100644",
	                          type: "blob",
	                          sha: routeBlobSHA
	                        },{
	                          path: 'src/controllers/Home.ts',
	                          mode: "100644",
	                          type: "blob",
	                          sha: controllerBlobSHA
	                        },{
	                          path: `src/public/js/Site.tsx`,
	                          mode: "100644",
	                          type: "blob",
	                          sha: siteBundleBlobSHA
	                        }];
	                        
	                        for (let backEndControllerBlobSHAInfo of backEndControllerBlobSHAInfos) {
	                          tree.push({
	                            path: `src/controllers/components/${this.getRepresentativeName(backEndControllerBlobSHAInfo[0])}.ts`,
	                            mode: "100644",
	                            type: "blob",
	                            sha: backEndControllerBlobSHAInfo[1]
	                          });
	                        }
	                        for (let frontEndComponentsBlobSHAInfo of frontEndComponentsBlobSHAInfos) {
	                          tree.push({
	                            path: `src/public/js/components/${frontEndComponentsBlobSHAInfo[0]}.tsx`,
	                            mode: "100644",
	                            type: "blob",
	                            sha: frontEndComponentsBlobSHAInfo[1]
	                          });
	                        }
	                        for (let key in viewBlobSHADict) {
	                          if (viewBlobSHADict.hasOwnProperty(key)) {
	                            tree.push({
	                              path: `views/home/${this.getRepresentativeName(key)}.pug`,
	                              mode: "100644",
	                              type: "blob",
	                              sha: viewBlobSHADict[key]
	                            });
	                          }
	                        }
	                        
	                        repo.createTree(tree, baseTreeSHA, (error, result, request) => {
	                          if (error) {
	                            alert(`There was an error while creating a new tree:\n${this.extractErrorMessage(error)}`);
	                            return;
	                          }
	                          
	                          let updatedTreeSHA = result.sha;
	                          if (DEBUG_GITHUB_UPLOADER) console.log('updatedTreeSHA', updatedTreeSHA);
	                          
	                          let message = prompt('Please describe your recent changes:');
	                          if (message !== null && message.trim() !== "") {
  	                          repo.commit(baseCommitSHA, updatedTreeSHA, message, (error, result, request) => {
  	                            if (error) {
  	                              alert(`There was an error while committing a new change:\n${this.extractErrorMessage(error)}`);
  	                              return;
  	                            }
  	                            
  	                            let recentCommitSHA = result.sha;
  	                            if (DEBUG_GITHUB_UPLOADER) console.log('recentCommitSHA', recentCommitSHA);
  	                            
  	                            repo.updateHead('heads/' + GITHUB_FEATURE_BRANCH, recentCommitSHA, true, (error, result, request) => {
  	                              if (error) {
  	                                alert(`There was an error while updating head for the current branch:\n${this.extractErrorMessage(error)}`);
  	                                return;
  	                              }
  	                              
  	                              alert('Your changes have been saved successfully.');
  	                            });
  	                          });
  	                        }
	                        });
	                      });
	                    });
	                  });
                  });
                });
              });
            });
          });
          
          if (previousProjectDataSHA) {
            repo.getBlob(previousProjectDataSHA, (error, result, request) => {
             if (error) {
                alert(`There was an error while retrieving data:\n${this.extractErrorMessage(error)}`);
                return;
              }
              
              if (typeof result !== 'object') {
                alert(`The project data is malformed. Please reverse any changes you have done manually using git rebase tool.`);
                return;
              }
              
              continueFn(result);
            });
          } else {
            continueFn({version: 1.0});
          }
        });
      });
    }
   	createRouteBlob(repo: any, routes: string[], cb: any) {
   	  repo.createBlob(`// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

import * as homeController from './controllers/Home.js';

const route = (app: any) => {
${routes.map(route => ` app.get("${route.path}", homeController.${this.getRepresentativeName(route.id)});
 app.post("${route.path}", homeController.${this.getRepresentativeName(route.id)});`).join('\n')
}
}

export default route;

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.`, (error, result, request) => {
        if (error) {
          alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
          return;
        }
        
        let nextRouteDataSHA = result.sha;
        if (DEBUG_GITHUB_UPLOADER) console.log('nextRouteDataSHA', nextRouteDataSHA);
        
        cb(nextRouteDataSHA);
      });
   	}
   	createControllerBlob(repo: any, routes: string[], cb: any) {
   	  repo.createBlob(`// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

import {Request, Response} from "express";
${routes.map(route => `import Component${route.id} from "./components/${this.getRepresentativeName(route.id)}.js";`).join('\n')}

${routes.map(route => `export const ${this.getRepresentativeName(route.id)} = (req: Request, res: Response) => {
	new Component${route.id}(req, res, "home/${this.getRepresentativeName(route.id)}");
}`).join('\n')}

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.`, (error, result, request) => {
        if (error) {
          alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
          return;
        }
        
        let nextControllerDataSHA = result.sha;
        if (DEBUG_GITHUB_UPLOADER) console.log('nextControllerDataSHA', nextControllerDataSHA);
        
        cb(nextControllerDataSHA);
      });
   	}
   	createViewBlob(repo: any, inputDict: any, pages: any, cb: any) {
   	  let keys = Object.keys(inputDict);
   	  let nextViewDataSHADict = {};
   	  
   	  let process = (index: number) => {
   	    let page = pages.filter(page => page.id == keys[index]);
   	    
   	    repo.createBlob(`//- Auto[Generating:V1]--->
//- PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

${inputDict[keys[index]].split('#{title}').join(page && page[0] && page[0].name || 'Untitled')}

//- <--- Auto[Generating:V1]
//- PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.`, (error, result, request) => {
          if (error) {
            alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
            return;
          }
          
          nextViewDataSHADict[keys[index]] = result.sha;
          if (DEBUG_GITHUB_UPLOADER) console.log('nextViewDataSHADict', nextViewDataSHADict);
          
          if (index + 1 < keys.length) {
            process(index + 1);
          } else {
            cb(nextViewDataSHADict);
          }
        });
   	  }
   	  process(0);
 	  }
   	createFrontEndComponentsBlob(repo: any, arrayOfContent: string[], cb: any) {
   	  let nextFrontEndComponentsDataSHAInfos = [];
   	  let mainprocess = (mainIndex: number) => {
     	  let results = arrayOfContent[mainIndex].split("// Auto[File]--->\n");
     	  if (results.length < 2) {
     	    if (mainIndex + 1 < arrayOfContent.length) {
     	      mainprocess(mainIndex + 1);
     	    } else {
     	      cb(nextFrontEndComponentsDataSHAInfos);
     	    }
     	  } else {
       	  let subprocess = (subIndex: number) => {
       	    let tokens = results[subIndex].split("\n// <---Auto[File]");
       	    
       	    repo.createBlob(`// Auto[Generating:V1]--->
    // PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.
    
    ${tokens[1]}
    
    // <--- Auto[Generating:V1]
    // PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.`, (error, result, request) => {
              if (error) {
                alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
                return;
              }
              
              nextFrontEndComponentsDataSHAInfos.push([tokens[0], result.sha]);
              if (DEBUG_GITHUB_UPLOADER) console.log('nextFrontEndComponentsDataSHAInfos', nextFrontEndComponentsDataSHAInfos);
              
              if (subIndex + 1 < results.length) {
                subprocess(subIndex + 1);
              } else if (mainIndex + 1 < arrayOfContent.length) {
                mainprocess(mainIndex + 1);
              } else {
                cb(nextFrontEndComponentsDataSHAInfos);
              }
            });
       	  }
       	  subprocess(1);
       	}
      }
      mainprocess(0);
   	}
   	createBackEndControllerBlob(repo: any, arrayOfContent: string[], cb: any) {
   	  let nextBackEndControllersDataSHAInfos = [];
   	  let mainprocess = (mainIndex: number) => {
     	  let results = arrayOfContent[mainIndex].split("// Auto[File]--->\n");
     	  if (results.length < 2) {
     	    if (mainIndex + 1 < arrayOfContent.length) {
     	      mainprocess(mainIndex + 1);
     	    } else {
     	      cb(nextBackEndControllersDataSHAInfos);
     	    }
     	  } else {
       	  let subprocess = (subIndex: number) => {
       	    let tokens = results[subIndex].split("\n// <---Auto[File]");
       	    
       	    repo.createBlob(`// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

${tokens[1]}

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.`, (error, result, request) => {
              if (error) {
                alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
                return;
              }
              
              nextBackEndControllersDataSHAInfos.push([tokens[0], result.sha]);
              if (DEBUG_GITHUB_UPLOADER) console.log('nextBackEndControllersDataSHAInfos', nextBackEndControllersDataSHAInfos);
              
              if (subIndex + 1 < results.length) {
                subprocess(subIndex + 1);
              } else if (mainIndex + 1 < arrayOfContent.length) {
                mainprocess(mainIndex + 1);
              } else {
                cb(nextBackEndControllersDataSHAInfos);
              }
            });
       	  }
       	  subprocess(1);
       	}
      }
      mainprocess(0);
   	}
   	createSiteBundleBlob(repo: any, routes: string[], frontEndComponentsBlobSHAInfos: [[string, string]], cb: any) {
 	    repo.createBlob(`// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

import {Project, DeclarationHelper} from './helpers/DeclarationHelper.js';
import {DataManipulationHelper} from './helpers/DataManipulationHelper.js';
import {HTMLHelper} from './helpers/HTMLHelper.js';
import {EventHelper} from './helpers/EventHelper.js';
${frontEndComponentsBlobSHAInfos.map(info => `import './components/${info[0]}.js';`).join('\n')}

declare let React: any;
declare let ReactDOM: any;
declare let window: any;

let expandingPlaceholders = [...document.querySelectorAll('[internal-fsb-init-class]')];
for (let expandingPlaceholder of expandingPlaceholders) {
	let forward = JSON.parse((expandingPlaceholder.getAttribute('internal-fsb-init-forward') || '{}').replace(/'/g, '"'));
	ReactDOM.render(React.createElement(DeclarationHelper.get(expandingPlaceholder.getAttribute('internal-fsb-init-class')), {forward: forward, data: window.data || null}, null), expandingPlaceholder);
	expandingPlaceholder.parentNode.insertBefore(expandingPlaceholder.firstChild, expandingPlaceholder);
	expandingPlaceholder.parentNode.removeChild(expandingPlaceholder);
}

window.internalFsbSubmit = (guid: string, notation: string, event, callback: any) => {
	DataManipulationHelper.request(guid, notation, event, callback);
}

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.`, (error, result, request) => {
        if (error) {
          alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
          return;
        }
        
        let nextSiteBundleDataSHA = result.sha;
        if (DEBUG_GITHUB_UPLOADER) console.log('nextSiteBundleDataSHA', nextSiteBundleDataSHA);
        
        cb(nextSiteBundleDataSHA);
      });
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