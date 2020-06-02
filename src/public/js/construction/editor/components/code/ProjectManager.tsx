import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {HTMLHelper} from '../../../helpers/HTMLHelper.js';
import {IProps, IState, DefaultProps, DefaultState, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';
import {LIBRARIES} from '../../../Constants.js';

declare let React: any;
declare let ReactDOM: any;

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

class ProjectManager extends Base<Props, State> {
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
    
    extractErrorMessage(error) {
   	  if (error && error.response && error.response.data && error.response.data.errors) {
   	    return error.response.data.errors.map(error => error.message).join('; ')
   	  } else {
   	    return 'It seemed that your internet connection is unavailable.'
   	  }
   	}
   	initGitHubInstance() {
   	  let GITHUB_TOKEN = window.TOKENS.filter(token => token.kind == 'github');
      if (GITHUB_TOKEN.length == 0) {
        alert('You cannot save until you have connected to a GitHub account.');
        return null;
      }
      
      GITHUB_TOKEN = GITHUB_TOKEN[0].accessToken;
      
    	var gh = new GitHub({
  			token: GITHUB_TOKEN
  		});
  		return gh;
   	}
   	public load() {
   	  let construction = document.getElementById('html');
      let constructionWindow = construction.contentWindow || construction.contentDocument.document || construction.contentDocument;
      
      if (!constructionWindow.initializeWorkspaceData) {
        window.setTimeout(this.load.bind(this), 500);
        return; 
      }
   	  
      let gh = this.initGitHubInstance();
      if (gh == null) return;
      
      let repo = gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT);
        
      repo.getSingleCommit('heads/' + GITHUB_DEVELOP_BRANCH, (error, result, request) => {
        if (error) {
          alert(`There was an error while retrieving the last commit, please try again.`);
          return;
        }
        
        console.log(result);
        let baseCommitSHA = result && result.sha;
        let baseTreeSHA = result && result.commit && result.commit.tree.sha;
        
        console.log('baseCommitSHA', baseCommitSHA);
        console.log('baseTreeSHA', baseTreeSHA);
        
        repo.getTree(baseTreeSHA, (error, result, request) => {
          if (error) {
            alert(`There was an error while retrieving project tree:\n${this.extractErrorMessage(error)}`);
            return;
          }
          
          console.log(result);
          let previousProjectDataSHA = result.tree.filter(node => node.path == 'project.stackblend')[0] || null;
          if (previousProjectDataSHA) previousProjectDataSHA = previousProjectDataSHA.sha;
          
          console.log('previousProjectDataSHA', previousProjectDataSHA);
          
          let continueFn = ((previousProjectData) => {
            constructionWindow.initializeWorkspaceData(previousProjectData);
            this.initializeWorkspaceData(previousProjectData);
          });
          
          if (previousProjectDataSHA) {
            repo.getBlob(previousProjectDataSHA, (error, result, request) => {
             if (error) {
                alert(`There was an error while retrieving data:\n${this.extractErrorMessage(error)}`);
                return;
              }
              
              console.log(result);
              
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
    public save() {
      let gh = this.initGitHubInstance();
      if (gh == null) return;
      
      let repo = gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT);
        
      repo.getSingleCommit('heads/' + GITHUB_DEVELOP_BRANCH, (error, result, request) => {
        if (error) {
          alert(`There was an error while retrieving the last commit, please try again.`);
          return;
        }
        
        console.log(result);
        let baseCommitSHA = result && result.sha;
        let baseTreeSHA = result && result.commit && result.commit.tree.sha;
        
        console.log('baseCommitSHA', baseCommitSHA);
        console.log('baseTreeSHA', baseTreeSHA);
        
        repo.getTree(baseTreeSHA, (error, result, request) => {
          if (error) {
            alert(`There was an error while retrieving project tree:\n${this.extractErrorMessage(error)}`);
            return;
          }
          
          console.log(result);
          let previousProjectDataSHA = result.tree.filter(node => node.path == 'project.stackblend')[0] || null;
          if (previousProjectDataSHA) previousProjectDataSHA = previousProjectDataSHA.sha;
          
          console.log('previousProjectDataSHA', previousProjectDataSHA);
          
          let continueFn = ((previousProjectData) => {
            let construction = document.getElementById('html');
        		let constructionWindow = construction.contentWindow || construction.contentDocument.document || construction.contentDocument;
        		let constructionAreaHTMLData = constructionWindow.generateWorkspaceData() || {};
        		let constructionEditorData = this.generateWorkspaceData() || {};
            
            Object.assign(previousProjectData, constructionAreaHTMLData);
            Object.assign(previousProjectData, constructionEditorData);
            
            this.createRouteBlob(repo, Object.keys(previousProjectData.sites), (routeBlobSHA: string) => {
              this.createControllerBlob(repo, Object.keys(previousProjectData.sites), (controllerBlobSHA: string) => {
                
                let combinedHTMLTags, combinedMinimalFeatureScripts, combinedExpandingFeatureScripts, combinedFontTags, combinedInlineBodyStyle, combinedStylesheet;
                let construction = document.getElementById('html');
            		let constructionWindow = construction.contentWindow || construction.contentDocument.document || construction.contentDocument;
            		[combinedHTMLTags, combinedMinimalFeatureScripts, combinedExpandingFeatureScripts, combinedFontTags, combinedInlineBodyStyle, combinedStylesheet] = constructionWindow.generateHTMLCodeForPage();
      		      
      		      if (combinedInlineBodyStyle) combinedInlineBodyStyle = ` style="${combinedInlineBodyStyle}"`;
      		      else combinedInlineBodyStyle = '';
      		      
      		      let externalStylesheets = [];
            		let externalScripts = [];
            		let selectedLibraries: [string] = (this.state.extensionValues[this.props.watchingExtensionNames[0]] || '').split(' ');
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
    		      
                let combinedHTMLPage = `.
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title></title>
      <meta name="description" content="" />
      <link rel="stylesheet" href="http://staging.stackblend.com/css/embed.css">
      ${combinedFontTags}
      <style type="text/css">${combinedStylesheet}</style>
      ${externalStylesheets.join('\n')}
    </head>
    <body${combinedInlineBodyStyle}>
      ${combinedHTMLTags}
      <script type="text/javascript" src="http://staging.stackblend.com/js/Embed.bundle.js"></script>
      <script type="text/javascript" src="/Site.bundle.js"></script>
    </body>
  </html>`
                this.createViewBlob(repo, combinedHTMLPage, (viewBlobSHA: string) => {
                  this.createReactComponentsBlob(repo, combinedExpandingFeatureScripts, (reactComponentsBlobSHA: string) => {
                    this.createSiteBundleBlob(repo, Object.keys(previousProjectData.sites), combinedMinimalFeatureScripts, (siteBundleBlobSHA: string) => {
                      repo.createBlob(JSON.stringify(previousProjectData), (error, result, request) => {
                        if (error) {
                          alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
                          return;
                        }
                        
                        console.log(result);
                        let nextProjectDataSHA = result.sha;
                        
                        console.log('nextProjectDataSHA', nextProjectDataSHA);
                        
                        repo.createTree([{
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
                          path: 'src/controllers/home.ts',
                          mode: "100644",
                          type: "blob",
                          sha: controllerBlobSHA
                        },{
                          path: `views/home/index.pug`,
                          mode: "100644",
                          type: "blob",
                          sha: viewBlobSHA
                        },{
                          path: `src/public/js/components/index.tsx`,
                          mode: "100644",
                          type: "blob",
                          sha: reactComponentsBlobSHA
                        },{
                          path: `src/public/js/Site.tsx`,
                          mode: "100644",
                          type: "blob",
                          sha: siteBundleBlobSHA
                        }], baseTreeSHA, (error, result, request) => {
                          if (error) {
                            alert(`There was an error while creating a new tree:\n${this.extractErrorMessage(error)}`);
                            return;
                          }
                          
                          console.log(result);
                          let updatedTreeSHA = result.sha;
                        
                          console.log('updatedTreeSHA', updatedTreeSHA);
                          
                          repo.commit(baseCommitSHA, updatedTreeSHA, "Updated project.stackblend", (error, result, request) => {
                            if (error) {
                              alert(`There was an error while committing a new change:\n${this.extractErrorMessage(error)}`);
                              return;
                            }
                            
                            console.log(result);
                            let recentCommitSHA = result.sha;
                            
                            console.log('recentCommitSHA', recentCommitSHA);
                            
                            repo.updateHead('heads/' + GITHUB_DEVELOP_BRANCH, recentCommitSHA, true, (error, result, request) => {
                              if (error) {
                                alert(`There was an error while updating head for the current branch:\n${this.extractErrorMessage(error)}`);
                                return;
                              }
                              
                              console.log(result);
                              
                              alert('Your changes have been saved successfully.');
                            });
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
              
              console.log(result);
              
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
    public deploy() {
      let gh = this.initGitHubInstance();
      if (gh == null) return;
      
      let repo = gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT);
  		
      repo.createPullRequest({
        title: `Merging ${GITHUB_DEVELOP_BRANCH} into ${GITHUB_STAGING_BRANCH}`,
        head: GITHUB_DEVELOP_BRANCH,
        base: GITHUB_STAGING_BRANCH
      }, (error, result, request) => {
        if (error) {
          alert(`There was an error while creating a pull request:\n${this.extractErrorMessage(error)}`);
          return;
        }
        
        console.log(result);
        let pullRequestNumber = result.number;
        
        console.log('pullRequestNumber', pullRequestNumber);
        
        repo.mergePullRequest(pullRequestNumber, {
        }, (error, result, request) => {
          if (error) {
            alert(`There was an error while merging a pull request, please go to your GitHub.com and perform it.\n\n${this.extractErrorMessage(error)}`);
            return;
          }
          
          alert(`Your changes have been deployed on ${GITHUB_STAGING_BRANCH} and is ready for automatic deployment.`);
        });
      });
   	}
   	createRouteBlob(repo: any, routes: [string], cb: any) {
   	  repo.createBlob(`// Auto Generated Code--->
// Please do not modifiy this file because it may be rewrited anytime.

import * as homeController from './controllers/home.js';

const route = (app: any) => {
${routes.map(route => ` app.get("/${(route == 'index') ? '' : route}", homeController.${route});`).join('\n')}
};

export default route;

// <--- Auto Generated Code
// Please do not modifiy this file because it may be rewrited anytime.`, (error, result, request) => {
        if (error) {
          alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
          return;
        }
        
        console.log(result);
        let nextRouteDataSHA = result.sha;
        
        console.log('nextRouteDataSHA', nextRouteDataSHA);
        
        cb(nextRouteDataSHA);
      });
   	}
   	createControllerBlob(repo: any, routes: [string], cb: any) {
   	  repo.createBlob(`// Auto Generated Code--->
// Please do not modifiy this file because it may be rewrited anytime.

import {Request, Response} from "express";

${routes.map(route => `export const ${route} = (req: Request, res: Response) => {
  res.render("home/${route}", {
  });
}`).join('\n')}

// <--- Auto Generated Code
// Please do not modifiy this file because it may be rewrited anytime.`, (error, result, request) => {
        if (error) {
          alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
          return;
        }
        
        console.log(result);
        let nextControllerDataSHA = result.sha;
        
        console.log('nextControllerDataSHA', nextControllerDataSHA);
        
        cb(nextControllerDataSHA);
      });
   	}
   	createViewBlob(repo: any, content: string, cb: any) {
 	    repo.createBlob(`//- Auto Generated Code--->
//- Please do not modifiy this file because it may be rewrited anytime.

${content}

//- <--- Auto Generated Code
//- Please do not modifiy this file because it may be rewrited anytime.`, (error, result, request) => {
        if (error) {
          alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
          return;
        }
        
        console.log(result);
        let nextViewDataSHA = result.sha;
        
        console.log('nextViewDataSHA', nextViewDataSHA);
        
        cb(nextViewDataSHA);
      });
 	  }
   	createReactComponentsBlob(repo: any, content: string, cb: any) {
   	  repo.createBlob(`// Auto Generated Code--->
// Please do not modifiy this file because it may be rewrited anytime.

${content}

// <--- Auto Generated Code
// Please do not modifiy this file because it may be rewrited anytime.`, (error, result, request) => {
        if (error) {
          alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
          return;
        }
        
        console.log(result);
        let nextReactComponentsDataSHA = result.sha;
        
        console.log('nextReactComponentsDataSHA', nextReactComponentsDataSHA);
        
        cb(nextReactComponentsDataSHA);
      });
   	}
   	createSiteBundleBlob(repo: any, routes: [string], combinedMinimalFeatureScripts: string, cb: any) {
 	    repo.createBlob(`// Auto Generated Code--->
// Please do not modifiy this file because it may be rewrited anytime.

import {Project, DeclarationHelper} from './helpers/DeclarationHelper.js';
${routes.map(route => `import './components/${route}.js';`).join('\n')}

declare let window: any;
window.Project = Project;

${combinedMinimalFeatureScripts}

// <--- Auto Generated Code
// Please do not modifiy this file because it may be rewrited anytime.`, (error, result, request) => {
        if (error) {
          alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
          return;
        }
        
        console.log(result);
        let nextSiteBundleDataSHA = result.sha;
        
        console.log('nextSiteBundleDataSHA', nextSiteBundleDataSHA);
        
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

DeclarationHelper.declare('Components.ProjectManager', ProjectManager);

export {Props, State, ProjectManager};