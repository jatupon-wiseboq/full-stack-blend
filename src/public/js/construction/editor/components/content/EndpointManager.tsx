import {CodeHelper} from '../../../helpers/CodeHelper';
import {HTMLHelper} from '../../../helpers/HTMLHelper';
import {TextHelper} from '../../../helpers/TextHelper';
import {RequestHelper} from '../../../helpers/RequestHelper';
import {IProps, IState, DefaultProps, DefaultState, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import {LIBRARIES, DEBUG_GITHUB_UPLOADER} from '../../../Constants';

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
    
		private incrementalUpdatingFrontEndCodeInfoDict: any = {};
		private incrementalUpdatingBackEndControllerInfoDict: any = {};

    constructor(props) {
      super(props);
      Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    componentDidMount() {
    }
    
    public update(properties: any) {
      if (!super.update(properties)) return;
    }
    
    replaceShortcuts(textContent: any) {
      textContent = textContent.replace(/(\@)(\{[^}]+\})([ ]*,[ ]*['"][A-Za-z0-9_]+['"])?/g, (match, hash, content, table) => {
        try {
          const createInputs = `RequestHelper.createInputs(${content})`;
          if (!table) return createInputs;
          else return `${createInputs}, ProjectConfigurationHelper.getDataSchema().tables[${table.split(',')[1].trim()}]`;
        } catch(error) {
          return match;
        }
      });
      
      return textContent;
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
    getRootDirectory(key: string) {
      return this.getFeatureDirectoryPrefix(key).replace(/[^\/]+\//g, '../');
    }
    
    files: any = [];
    private create(path: string, content: string) {
    	if (content === false) {
    		return new Promise((resolve) => {
	        resolve();
	      });
    	} else {
	      return new Promise((resolve) => {
	        this.files.push({
	          path: path,
	          content: content
	        });
	        resolve();
	      });
	    }
    }
    private commit(incremental: boolean=false) {
      let _files = this.files;
      this.files = [];
      
      let endpoint = window.ENDPOINT;
     	if (endpoint.indexOf('https://localhost') == 0) {
     		endpoint = 'https://localhost.stackblend.org';
     	}
      
      return RequestHelper.post(`${endpoint}/endpoint/update/content`, {
        files: _files
      })
    }
    
    public save(cb: any, incremental: boolean=false) {
      if (!window.ENDPOINT) return cb();
      
      const $this = this;
      
      let construction = document.getElementById('area');
      let constructionWindow = construction.contentWindow || construction.contentDocument.document || construction.contentDocument;
      
      let constructionAreaHTMLData = constructionWindow.generateWorkspaceData() || {};
      let constructionEditorData = this.generateWorkspaceData() || {};
      let frontEndCodeInfoDict = Object.assign({}, constructionWindow.generateFrontEndCodeForAllPages(true));
      let backEndControllerInfoDict = Object.assign({}, constructionWindow.generateBackEndCodeForAllPages(true));
      let nextProjectData = {};
      
      if (incremental) {
      	const _incrementalUpdatingFrontEndCodeInfoDict = this.incrementalUpdatingFrontEndCodeInfoDict;
      	const _incrementalUpdatingBackEndControllerInfoDict = this.incrementalUpdatingBackEndControllerInfoDict;
      	
      	for (const key of Object.keys(frontEndCodeInfoDict)) {
      		if (frontEndCodeInfoDict.hasOwnProperty(key)) {
      			if (JSON.stringify(_incrementalUpdatingFrontEndCodeInfoDict[key]) == JSON.stringify(frontEndCodeInfoDict[key])) {
      				delete frontEndCodeInfoDict[key];
      			}
      		}
      	}
      	
      	for (const key of Object.keys(backEndControllerInfoDict)) {
      		if (backEndControllerInfoDict.hasOwnProperty(key)) {
      			if (JSON.stringify(_incrementalUpdatingBackEndControllerInfoDict[key]) == JSON.stringify(backEndControllerInfoDict[key])) {
      				delete backEndControllerInfoDict[key];
      			}
      		}
      	}
      }
      
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
      let globalCombinedStylesheet = false;
      let globalCombinedStylesheetExtension = false;
      let arrayOfCombinedExpandingFeatureScripts = [];
      for (let key in frontEndCodeInfoDict) {
        if (frontEndCodeInfoDict.hasOwnProperty(key)) {
          let combinedHTMLTags, combinedMinimalFeatureScripts, combinedExpandingFeatureScripts, combinedFontTags, combinedInlineBodyStyle, combinedStylesheet, combinedStylesheetExtension;
          [combinedHTMLTags, combinedMinimalFeatureScripts, combinedExpandingFeatureScripts, combinedFontTags, combinedInlineBodyStyle, combinedStylesheet, combinedStylesheetExtension] = frontEndCodeInfoDict[key];
          
          let REGEX = /https:[\/a-zA-Z0-9_\-]+\/images\/uploaded/g;
          
          if (combinedHTMLTags) combinedHTMLTags = combinedHTMLTags.replace(REGEX, '/uploaded');
          if (combinedMinimalFeatureScripts) combinedMinimalFeatureScripts = combinedMinimalFeatureScripts.replace(REGEX, '/uploaded');
          if (combinedExpandingFeatureScripts) combinedExpandingFeatureScripts = combinedExpandingFeatureScripts.replace(REGEX, '/uploaded');
          if (combinedFontTags) combinedFontTags = combinedFontTags.map((tag) => {
            return tag.replace(REGEX, '/uploaded');
          });
          if (combinedInlineBodyStyle) combinedInlineBodyStyle = combinedInlineBodyStyle.replace(REGEX, '/uploaded');
          if (combinedStylesheet) combinedStylesheet = combinedStylesheet.replace(REGEX, '/uploaded');
          if (combinedStylesheet) globalCombinedStylesheet = combinedStylesheet;
          if (combinedStylesheetExtension) globalCombinedStylesheetExtension = combinedStylesheetExtension;
          
          if (combinedInlineBodyStyle) combinedInlineBodyStyle = `(style="${combinedInlineBodyStyle.replace(/"/g, "'")}")`;
          else combinedInlineBodyStyle = '';
          
          let compiledCombinedMinimalFeatureScripts = '';
          if (combinedMinimalFeatureScripts) {
            compiledCombinedMinimalFeatureScripts = ts.transpileModule(combinedMinimalFeatureScripts, {compilerOptions: {module: ts.ModuleKind.COMMONJS}}).outputText;
            compiledCombinedMinimalFeatureScripts = compiledCombinedMinimalFeatureScripts.split('\n').join('\n      ');
          }
          
          let pages = this.state.extensionValues['pages'];
          let editingPageID = key;
          pages = pages.filter(page => page.id == editingPageID);
          
          let title = (pages && pages[0] && pages[0].name || '').replace(/"/g, '\\x22').replace(/'/g, '\\x27');
          let description = (pages && pages[0] && pages[0].description || '').replace(/"/g, '\\x22').replace(/'/g, '\\x27');
          let keywords = (pages && pages[0] && pages[0].keywords || '').replace(/"/g, '\\x22').replace(/'/g, '\\x27');
          let image = (pages && pages[0] && pages[0].image || '').replace(/"/g, '\\x22').replace(/'/g, '\\x27');
          let path = (pages && pages[0] && pages[0].path || '').replace(/"/g, '\\x22').replace(/'/g, '\\x27');
          
          if (combinedHTMLTags) combinedHTMLTags = TextHelper.removeBlankLines(combinedHTMLTags);
          
          if (pages && pages[0]) {
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
    include ${this.getRootDirectory(key)}_header.pug
  body${combinedInlineBodyStyle}
    ${combinedHTMLTags}
    script(type="text/javascript" src="/js/libraries/polyfills/polyfill.io.js")
    script(type="text/javascript" src="/js/Embed.bundle.js")
    script(type="text/javascript").
      ${compiledCombinedMinimalFeatureScripts}
    ${combinedFontTags.join('\n    ')}
    script(type="text/javascript").
      window.data = !{JSON.stringify(data)};
    include ${this.getRootDirectory(key)}_footer.pug
`
            combinedHTMLPageDict[key] = combinedHTMLPage;
          }
          
          if (combinedExpandingFeatureScripts) arrayOfCombinedExpandingFeatureScripts.push(combinedExpandingFeatureScripts);
        }
      }
      
      let combinedHeaderScripts = (globalCombinedStylesheet !== false && globalCombinedStylesheetExtension !== false) ? `
link(rel="stylesheet" href="/css/embed.css")
${externalStylesheets.join('\n')}
${customHeaderExternalStylesheets.join('\n')}
${customHeaderExternalScripts.join('\n')}
style(type="text/css").
  ${globalCombinedStylesheet}
script(type="text/javascript").
  var __animationHelperDelayedRegisterings = [], __animationHelperDelayedAddings = [];
  var AnimationHelper = {
    extensions: {},
    register: function(animationId, extensionInfo) {
      __animationHelperDelayedRegisterings.push(arguments);
      AnimationHelper.extensions[animationId] = extensionInfo;
    },
    add: function(activeAnimationGroups) {
      __animationHelperDelayedAddings.push(arguments);
      
      for (let animation of activeAnimationGroups) {
        var extensionInfo = AnimationHelper.extensions[animation];
        if (extensionInfo) {
          for (let i=0; i<extensionInfo.tracks.length; i++) {
            AnimationHelper.addPrestartStyles(animation, '0', extensionInfo.tracks[i].selectors || [], extensionInfo.tracks[i].properties || []);
          }
        }
      }
    },
    addPrestartStyles: (animationId, guid, selectors, properties) => {
      var prestartId = \`prestart-\${animationId}\`;
      if (document.getElementById(prestartId)) return;
      
      var combinedStyleHashmap = {};
      
      for (var property of properties) {
        for (var selector of selectors) {
          var style = AnimationHelper.getPrestartStyle(guid, selector, property);
        
          if (style) {
            combinedStyleHashmap[property] = style;
            break;
          }
        }
      }
      
      if (Object.keys(combinedStyleHashmap).length != 0) {
        var element = document.createElement('style');
        element.setAttribute('type', 'text/css');
        element.setAttribute('id', prestartId);
        
        var lines = [];
        for (var selector of selectors) {
          lines.push(\`[internal-fsb-animation*="animation-group-\${animationId}"]\${selector}, [internal-fsb-animation*="animation-group-\${animationId}"] \${selector} { \${AnimationHelper.getInlineStyleFromHashMap(combinedStyleHashmap)} }\`);
        }
        
        element.innerHTML = lines.join(' ');
        
        var firstStyleElement = document.head.getElementsByTagName('STYLE')[0] || null;
        document.head.insertBefore(element, firstStyleElement);
      }
    },
    getPrestartStyle: (guid, selector, property) => {
      var elements = Array.from(document.querySelectorAll(\`[internal-fsb-guid="\${guid}"]\${selector}, [internal-fsb-guid="\${guid}"] \${selector}\`));
      
      if (elements.length != 0) {
        var computedStyle = window.getComputedStyle(elements[0], null);
        return computedStyle[property] || null;
      }
      
      return null;
    },
    getInlineStyleFromHashMap: (hash) => {
      var results = [];
      for (var key in hash) {
        if (hash.hasOwnProperty(key) && hash[key] != null) {
          results.push(key + ': ' + hash[key]);
        }
      }
      return results.sort().join('; ');
    }
  };
  ${globalCombinedStylesheetExtension}
` : false;
  let combinedFooterScripts = `
${externalScripts.join('\n')}
${customFooterExternalStylesheets.join('\n')}
${customFooterExternalScripts.join('\n')}
script(type="text/javascript" src="/js/Site.bundle.js")
`;
      
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
                this.create('../../views/home/_header.pug', combinedHeaderScripts).then(() => {
                  this.create('../../views/home/_footer.pug', combinedFooterScripts).then(() => {
                    let nextFrontEndComponentsBlobSHADict = Object.assign({}, nextProjectData.frontEndComponentsBlobSHADict || {});
                    Object.assign(nextFrontEndComponentsBlobSHADict, frontEndComponentsBlobSHADict);
                
                    this.createSiteBundle(nextProjectData.globalSettings.pages, nextFrontEndComponentsBlobSHADict, () => {
                      this.create('../../project.stackblend', CodeHelper.label(JSON.stringify(CodeHelper.recursiveSortHashtable(nextProjectData), null, 2))).then(() => {
                        this.commit(incremental).then(() => {
                          if (incremental) {
	                          $this.incrementalUpdatingFrontEndCodeInfoDict = CodeHelper.clone(frontEndCodeInfoDict);
	      										$this.incrementalUpdatingBackEndControllerInfoDict = CodeHelper.clone(backEndControllerInfoDict);
                          }
                          
                          cb(true);
                        }).catch(() => {
                          cb(incremental);
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
    }
    createRoute(routes: string[], cb: any) {
      this.create('../route.ts', `// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

import * as homeController from './controllers/Home';

const route = (app: any) => {
${routes.map(route => ` app.get("${route.path}", homeController.${this.getRepresentativeName(route.id)});
 app.post("${route.path}", homeController.${this.getRepresentativeName(route.id)});
 app.put("${route.path}", homeController.${this.getRepresentativeName(route.id)});
 app.delete("${route.path}", homeController.${this.getRepresentativeName(route.id)});`).join('\n')
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
${routes.map(route => `import Component${route.id} from "./components/${this.getFeatureDirectoryPrefix(route.id)}${this.getRepresentativeName(route.id)}";`).join('\n')}

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
      if (keys.length > 0) process(0);
      else cb(nextViewDataSHADict);
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
      if (arrayOfContent.length != 0) mainprocess(0);
      else cb(nextFrontEndComponentsDataSHADict);
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

${this.replaceShortcuts(tokens[1])}

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
      if (arrayOfContent.length != 0) mainprocess(0);
      else cb();
    }
    createSiteBundle(routes: string[], frontEndComponentsBlobSHADict: any, cb: any) {
      this.create(`../public/js/Site.tsx`, `// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

import {Project, DeclarationHelper} from './helpers/DeclarationHelper';
import {HTMLHelper} from './helpers/HTMLHelper';
import {EventHelper} from './helpers/EventHelper';
${Object.keys(frontEndComponentsBlobSHADict).map(key => `import './components/${key}';`).join('\n')}

declare let React: any;
declare let ReactDOM: any;
declare let window: any;
declare let DataManipulationHelper: any;

let expandingPlaceholders = Array.from(document.querySelectorAll('[internal-fsb-init-class]'));
for (let expandingPlaceholder of expandingPlaceholders) {
  let forward = JSON.parse((expandingPlaceholder.getAttribute('internal-fsb-init-forward') || '{}').replace(/'/g, '"'));
  ReactDOM.render(React.createElement(DeclarationHelper.get(expandingPlaceholder.getAttribute('internal-fsb-init-class')), {forward: forward, data: window.data || null}, null), expandingPlaceholder);
  expandingPlaceholder.parentNode.insertBefore(expandingPlaceholder.firstElementChild, expandingPlaceholder);
  expandingPlaceholder.parentNode.removeChild(expandingPlaceholder);
}

window.internalFsbSubmit = (guid: string, notation: string, event, callback: any) => {
  DataManipulationHelper.request(guid, notation, event, callback);
}

window.internalFsbOpen = (initClass: string, data: any) => {
	let container = document.createElement('div');
  ReactDOM.render(React.createElement(DeclarationHelper.get(initClass), {data: data || window.data}, null), container);
  document.getElementsByClassName('internal-fsb-begin')[0].appendChild(container.firstElementChild);
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