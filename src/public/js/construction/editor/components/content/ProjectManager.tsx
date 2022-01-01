import {CodeHelper} from '../../../helpers/CodeHelper';
import {HTMLHelper} from '../../../helpers/HTMLHelper';
import {TextHelper} from '../../../helpers/TextHelper';
import {StorageHelper} from '../../../helpers/StorageHelper';
import {RequestHelper} from '../../../helpers/RequestHelper';
import {IProps, IState, DefaultProps, DefaultState, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import {LIBRARIES, DEBUG_GITHUB_UPLOADER} from '../../../Constants';

declare let React: any;
declare let ReactDOM: any;
declare let ts: any;

let recentCommitMessage = StorageHelper.getCookie('recentCommitMessage');

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
    extractErrorMessage(error) {
      if (error && error.response && error.response.data && error.response.data.errors) {
        return error.response.data.errors.map(error => error.message).join('; ')
      } else {
        return 'It seemed that your internet connection is unavailable.'
      }
    }
    getGitHubInstance() {
      let GITHUB_TOKEN = window.TOKENS.filter(token => token.kind == 'github');
      if (GITHUB_TOKEN.length == 0) {
      	HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
      	HTMLHelper.removeClass(HTMLHelper.getElementByClassName('merge-button'), 'in-progress');
      	HTMLHelper.removeClass(HTMLHelper.getElementByClassName('deploy-button'), 'in-progress');
      	
        alert('You cannot save until you have connected to a GitHub account.');
        return null;
      }
      
      GITHUB_TOKEN = GITHUB_TOKEN[0].accessToken;
      
      var gh = new GitHub({
        token: GITHUB_TOKEN
      });
      return gh;
    }
    getGitHubInstance() {
      let GITHUB_TOKEN = window.TOKENS.filter(token => token.kind == 'github');
      if (GITHUB_TOKEN.length == 0) {
      	HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
      	HTMLHelper.removeClass(HTMLHelper.getElementByClassName('merge-button'), 'in-progress');
      	HTMLHelper.removeClass(HTMLHelper.getElementByClassName('deploy-button'), 'in-progress');
      	
        alert('You cannot save until you have connected to a GitHub account.');
        return null;
      }
      
      GITHUB_TOKEN = GITHUB_TOKEN[0].accessToken;
      
      var gh = new GitHub({
        token: GITHUB_TOKEN
      });
      return gh;
    }
    getGitHubRepo() {
      let gh = this.getGitHubInstance();
      if (gh == null) return;
      
      let repo = gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT);
      
      repo.getSingleCommit = (ref, cb) => {
	      ref = ref || '';
	      return repo._request('GET', `/repos/${repo.__fullname}/commits/${ref}?cache=${Math.random()}`, null, cb);
      };
      repo.createBlob = (content, previousSHA, cb) => {
        if (content) {
          content = TextHelper.removeMultipleBlankLines(content);
        }
        
        const hashCode = (value) => {
          let hash = 0, i, chr;
          for (i = 0; i < value.length; i++) {
            chr   = value.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
          }
          return hash;
        }
        const current = hashCode(content).toString();
        
        if (previousSHA && previousSHA.split('#')[1] === current) {
          cb(false, {sha: previousSHA}, null);
        } else {
          let utf8Bytes = encodeURIComponent(content).replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode('0x' + p1);
          });
          
          let postBody = {
            content: btoa(utf8Bytes),
            encoding: 'base64'
          };
          
          return repo._request('POST', `/repos/${repo.__fullname}/git/blobs`, postBody, (error, result, request) => {
            if (!error && result.sha) {
              result.sha = result.sha + '#' + current;
            }
            cb(error, result, request);
          });
        }
      };
      repo.deleteFile = (path, cb) => {
        repo._request('GET', `/repos/${repo.__fullname}/contents/${path}?ref=${'heads/' + GITHUB_FEATURE_BRANCH}&cache=${Math.random()}`, null, (error, result, request) => {
          if (error) {
            cb();
          } else {
            const deleteBody = {
              message: `Delete the file at ${path}`,
              sha: result.sha,
              branch: GITHUB_FEATURE_BRANCH
            }
            repo._request('DELETE', `/repos/${repo.__fullname}/contents/${path}`, deleteBody, cb);
          }
        });
      };
      
      return repo;
    }
    public load(callback: any = null) {
      window.GITHUB_FEATURE_BRANCH = window.location.hash.replace('#', '') || window.GITHUB_FEATURE_BRANCH;
			if (window.GITHUB_FEATURE_BRANCH) window.location.hash = '#' + window.GITHUB_FEATURE_BRANCH;
			
			window.addEventListener('hashchange', () => {
				const branch = window.location.hash.replace('#', '');
				if (branch) {
					if (branch != window.GITHUB_FEATURE_BRANCH) {
						window.location.reload(true);
					}
				} else {
					window.location.hash = '#' + window.GITHUB_FEATURE_BRANCH;
				}
			});
      
      let construction = document.getElementById('area');
      let constructionWindow = construction.contentWindow || construction.contentDocument.document || construction.contentDocument;
      
      if (!constructionWindow.initializeWorkspaceData) {
        window.setTimeout(this.load.bind(this), 500);
        return; 
      }
      
      let repo = this.getGitHubRepo();
      
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
            constructionWindow.initializeWorkspaceData(previousProjectData);
            this.initializeWorkspaceData(previousProjectData);
            
            if (callback) callback();
          });
          
          if (previousProjectDataSHA) {
            repo.getBlob(previousProjectDataSHA, (error, result, response) => {
             if (error) {
                alert(`There was an error while retrieving data:\n${this.extractErrorMessage(error)}`);
                return;
              }
              
              try {
                if (typeof result === 'string') {
                  result = JSON.parse(CodeHelper.unlabel(result));
                }
              } catch(ex) { /* void */ }
              
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
      let construction = document.getElementById('area');
      let constructionWindow = construction.contentWindow || construction.contentDocument.document || construction.contentDocument;
      
      let repo = this.getGitHubRepo();
      
      HTMLHelper.addClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
        
      repo.getSingleCommit('heads/' + GITHUB_FEATURE_BRANCH, (error, result, request) => {
        if (error) {
      		HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
      		
          alert(`There was an error while retrieving the last commit, please try again.`);
          return;
        }
        
        let baseCommitSHA = result && result.sha;
        let baseTreeSHA = result && result.commit && result.commit.tree.sha;
        if (DEBUG_GITHUB_UPLOADER) console.log('baseCommitSHA', baseCommitSHA);
        if (DEBUG_GITHUB_UPLOADER) console.log('baseTreeSHA', baseTreeSHA);
        
        repo.getTree(baseTreeSHA, (error, result, request) => {
          if (error) {
      			HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
      			
            alert(`There was an error while retrieving project tree:\n${this.extractErrorMessage(error)}`);
            return;
          }
          
          let previousProjectDataSHA = result.tree.filter(node => node.path == 'project.stackblend')[0] || null;
          if (previousProjectDataSHA) previousProjectDataSHA = previousProjectDataSHA.sha;
          if (DEBUG_GITHUB_UPLOADER) console.log('previousProjectDataSHA', previousProjectDataSHA);
          
          let continueFn = ((previousProjectData) => {
            previousProjectData = CodeHelper.clone(previousProjectData);
            
            let constructionPageData = CodeHelper.clone(constructionWindow.generateWorkspaceData() || {});
            let frontEndCodeInfoDict = CodeHelper.clone(constructionWindow.generateFrontEndCodeForAllPages(true));
            let backEndControllerInfoDict = CodeHelper.clone(constructionWindow.generateBackEndCodeForAllPages(true));
            let connectorControllerInfoDict = CodeHelper.clone(constructionWindow.generateConnectorCode());
            let workerControllerInfoDict = CodeHelper.clone(constructionWindow.generateWorkerCode());
            let schedulerControllerInfoDict = CodeHelper.clone(constructionWindow.generateSchedulerCode());
            let nextProjectData = {};
            
            Object.assign(nextProjectData, previousProjectData);
            Object.assign(nextProjectData, constructionPageData);
            
            let originalProjectData = JSON.stringify(nextProjectData);
            
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
            let globalCombinedStylesheet = '';
            let globalCombinedStylesheetExtension = '';
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
            
            let combinedHeaderScripts = `
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
`;
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
            for (let key in connectorControllerInfoDict) {
              if (connectorControllerInfoDict.hasOwnProperty(key)) {
                arrayOfControllerScripts.push(connectorControllerInfoDict[key][0]);
              }
            }
            for (let key in workerControllerInfoDict) {
              if (workerControllerInfoDict.hasOwnProperty(key)) {
                arrayOfControllerScripts.push(workerControllerInfoDict[key][0]);
              }
            }
            for (let key in schedulerControllerInfoDict) {
              if (schedulerControllerInfoDict.hasOwnProperty(key)) {
                arrayOfControllerScripts.push(schedulerControllerInfoDict[key][0]);
              }
            }
            
            let persistingContent = document.createElement('div');
            let persistingGUIDs = {index: true};
            for (let page of nextProjectData.globalSettings.pages.filter(page => page.state != 'delete')) {
              persistingGUIDs[page.id] = true;
              let element = document.createElement('div');
              element.innerHTML = nextProjectData.sites[page.id] && nextProjectData.sites[page.id].body.join('\n') || '';
              persistingContent.appendChild(element);
            }
            for (let component of nextProjectData.globalSettings.components.filter(component => component.state != 'delete')) {
              persistingGUIDs[component.id] = true;
              let element = document.createElement('div');
              element.innerHTML = nextProjectData.components[component.id] && nextProjectData.components[component.id].html.join('\n') || '';
              persistingContent.appendChild(element);
            }
            for (let popup of nextProjectData.globalSettings.popups.filter(popup => popup.state != 'delete')) {
              persistingGUIDs[popup.id] = true;
              let element = document.createElement('div');
              element.innerHTML = nextProjectData.popups[popup.id] && nextProjectData.popups[popup.id].html.join('\n') || '';
              persistingContent.appendChild(element);
            }
            for (let key in connectorControllerInfoDict) {
              if (connectorControllerInfoDict.hasOwnProperty(key)) {
                persistingGUIDs[key] = true;
              }
            }
            for (let key in workerControllerInfoDict) {
              if (workerControllerInfoDict.hasOwnProperty(key)) {
                persistingGUIDs[key] = true;
              }
            }
            for (let key in schedulerControllerInfoDict) {
              if (schedulerControllerInfoDict.hasOwnProperty(key)) {
                persistingGUIDs[key] = true;
              }
            }
            
            let elements = HTMLHelper.getElementsByClassName('internal-fsb-element', persistingContent);
            for (let element of elements) {
              let reactMode = HTMLHelper.getAttribute(element, 'internal-fsb-react-mode');
              let reactNamespace = HTMLHelper.getAttribute(element, 'internal-fsb-react-namespace') || 'Project.Controls';
              let reactClass = HTMLHelper.getAttribute(element, 'internal-fsb-react-class');
              let reactClassComposingInfoClassName = HTMLHelper.getAttribute(element, 'internal-fsb-class');
              let reactClassComposingInfoGUID = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
              
              if (!reactClass && reactMode && reactClassComposingInfoClassName && reactClassComposingInfoGUID) {
                reactClass = reactClassComposingInfoClassName + '_' + reactClassComposingInfoGUID;
              }
              
              if (reactClass) persistingGUIDs[reactNamespace + '.' + reactClass] = true;
              else persistingGUIDs[reactClassComposingInfoGUID] = true;
            }
            
            for (let page of nextProjectData.globalSettings.pages.filter(page => page.state == 'delete')) {
              delete nextProjectData.sites[page.id];
            }
            for (let component of nextProjectData.globalSettings.components.filter(component => component.state == 'delete')) {
              delete nextProjectData.components[component.id];
            }
            for (let popup of nextProjectData.globalSettings.popups.filter(popup => popup.state == 'delete')) {
              delete nextProjectData.popups[popup.id];
            }
            
            nextProjectData.globalSettings.pages = nextProjectData.globalSettings.pages.filter(page => page.state != 'delete');
            nextProjectData.globalSettings.components = nextProjectData.globalSettings.components.filter(component => component.state != 'delete');
            nextProjectData.globalSettings.popups = nextProjectData.globalSettings.popups.filter(popup => popup.state != 'delete');
            
            this.createRouteBlob(repo, nextProjectData.globalSettings.pages, nextProjectData.routeBlobSHA, (routeBlobSHA: string) => {
              this.createControllerBlob(repo, nextProjectData.globalSettings.pages, Object.keys(connectorControllerInfoDict), Object.keys(workerControllerInfoDict), Object.keys(schedulerControllerInfoDict), nextProjectData.controllerBlobSHA, (controllerBlobSHA: string) => {
                this.createViewBlob(repo, combinedHTMLPageDict, nextProjectData.globalSettings.pages, nextProjectData.viewBlobSHADict, (viewBlobSHADict: any) => {
                  this.createBackEndControllerBlob(repo, arrayOfControllerScripts, nextProjectData.backEndControllerBlobSHADict, (backEndControllerBlobSHADict: any) => {
                    const process = () => {
                      if (headerBlobError) {
							      		HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
							      		
                        alert(`There was an error while creating blob:\n${this.extractErrorMessage(headerBlobError)}`);
                        return;
                      }
                      if (footerBlobError) {
							      		HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
							      		
                        alert(`There was an error while creating blob:\n${this.extractErrorMessage(footerBlobError)}`);
                        return;
                      }
                      const headerBlobSHA = headerBlobResult && headerBlobResult.sha || nextProjectData.headerBlobSHA;
                      const footerBlobSHA = footerBlobResult && footerBlobResult.sha || nextProjectData.footerBlobSHA;
                    	
                      this.createFrontEndComponentsBlob(repo, arrayOfCombinedExpandingFeatureScripts, nextProjectData.frontEndComponentsBlobSHADict, (frontEndComponentsBlobSHADict: any) => {
                        
                        nextProjectData.routeBlobSHA = routeBlobSHA;
                        nextProjectData.controllerBlobSHA = controllerBlobSHA;
                        nextProjectData.headerBlobSHA = headerBlobSHA;
                        nextProjectData.footerBlobSHA = footerBlobSHA;
                        
                        nextProjectData.backEndControllerBlobSHADict = nextProjectData.backEndControllerBlobSHADict || {};
                        Object.assign(nextProjectData.backEndControllerBlobSHADict, backEndControllerBlobSHADict);
                        
                        nextProjectData.frontEndComponentsBlobSHADict = nextProjectData.frontEndComponentsBlobSHADict || {};
                        Object.assign(nextProjectData.frontEndComponentsBlobSHADict, frontEndComponentsBlobSHADict);
                        
                        nextProjectData.viewBlobSHADict = nextProjectData.viewBlobSHADict || {};
                        Object.assign(nextProjectData.viewBlobSHADict, viewBlobSHADict);
                        
                        for (let key in nextProjectData.backEndControllerBlobSHADict) {
                          if (nextProjectData.backEndControllerBlobSHADict.hasOwnProperty(key) && !persistingGUIDs[key]) {
                            delete nextProjectData.backEndControllerBlobSHADict[key];
                          }
                        }
                        for (let key in nextProjectData.frontEndComponentsBlobSHADict) {
                          if (nextProjectData.frontEndComponentsBlobSHADict.hasOwnProperty(key) && !persistingGUIDs[key]) {
                            delete nextProjectData.frontEndComponentsBlobSHADict[key];
                          }
                        }
                        for (let key in nextProjectData.viewBlobSHADict) {
                          if (nextProjectData.viewBlobSHADict.hasOwnProperty(key) && !persistingGUIDs[key]) {
                            delete nextProjectData.viewBlobSHADict[key];
                          }
                        }
                    
                        this.createSiteBundleBlob(repo, nextProjectData.globalSettings.pages, nextProjectData.frontEndComponentsBlobSHADict, nextProjectData.siteBundleBlobSHA, (siteBundleBlobSHA: string) => {
                        
                          nextProjectData.siteBundleBlobSHA = siteBundleBlobSHA;
                        
                          let previousPersistingFiles = nextProjectData.currentPersistingFiles || [];
                          let nextPersistingFiles = [];
                          
                          for (let key in nextProjectData.backEndControllerBlobSHADict) {
                            if (nextProjectData.backEndControllerBlobSHADict.hasOwnProperty(key)) {
                            	if (connectorControllerInfoDict.hasOwnProperty(key)) {
                            		nextPersistingFiles.push(`src/controllers/connectors/${this.getRepresentativeName(key)}.ts`);
                            	} else if (workerControllerInfoDict.hasOwnProperty(key)) {
                            		nextPersistingFiles.push(`src/controllers/workers/${this.getRepresentativeName(key)}.ts`);
                            	} else if (schedulerControllerInfoDict.hasOwnProperty(key)) {
                            		nextPersistingFiles.push(`src/controllers/schedulers/${this.getRepresentativeName(key)}.ts`);
                            	} else {
                              	nextPersistingFiles.push(`src/controllers/components/${this.getFeatureDirectoryPrefix(key)}${this.getRepresentativeName(key)}.ts`);
                              }
                            }
                          }
                          for (let key in nextProjectData.frontEndComponentsBlobSHADict) {
                            if (nextProjectData.frontEndComponentsBlobSHADict.hasOwnProperty(key)) {
                              nextPersistingFiles.push(`src/public/js/components/${key}.tsx`);
                            }
                          }
                          for (let key in nextProjectData.viewBlobSHADict) {
                            if (nextProjectData.viewBlobSHADict.hasOwnProperty(key)) {
                              nextPersistingFiles.push(`views/home/${this.getFeatureDirectoryPrefix(key)}${this.getRepresentativeName(key)}.pug`);
                            }
                          }
                          
                          let deletingPersistingFiles = previousPersistingFiles.filter(file => nextPersistingFiles.indexOf(file) == -1);
                          nextProjectData.currentPersistingFiles = nextPersistingFiles;
                          
                          const createTree = (error, result, request) => {
                            if (error) {
							      					HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
							      					
                              alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
                              return;
                            }
                            
                            let nextProjectDataSHA = result.sha;
                            if (DEBUG_GITHUB_UPLOADER) console.log('nextProjectDataSHA', nextProjectDataSHA);
                            
                            let tree = [{
                              path: 'project.stackblend',
                              mode: "100644",
                              type: "blob",
                              sha: nextProjectDataSHA.split('#')[0]
                            },{
                              path: 'src/route.ts',
                              mode: "100644",
                              type: "blob",
                              sha: routeBlobSHA.split('#')[0]
                            },{
                              path: 'src/controllers/Home.ts',
                              mode: "100644",
                              type: "blob",
                              sha: controllerBlobSHA.split('#')[0]
                            },{
                              path: `src/public/js/Site.tsx`,
                              mode: "100644",
                              type: "blob",
                              sha: siteBundleBlobSHA.split('#')[0]
                            },{
                              path: `views/home/_header.pug`,
                              mode: "100644",
                              type: "blob",
                              sha: headerBlobSHA.split('#')[0]
                            },{
                              path: `views/home/_footer.pug`,
                              mode: "100644",
                              type: "blob",
                              sha: footerBlobSHA.split('#')[0]
                            }];
                            
                            for (let key in nextProjectData.backEndControllerBlobSHADict) {
                              if (nextProjectData.backEndControllerBlobSHADict.hasOwnProperty(key)) {
                              	if (connectorControllerInfoDict.hasOwnProperty(key)) {
                              		tree.push({
                                    path: `src/controllers/connectors/${this.getRepresentativeName(key)}.ts`,
                                    mode: "100644",
                                    type: "blob",
                                    sha: nextProjectData.backEndControllerBlobSHADict[key].split('#')[0]
                                  });
                              	} else if (workerControllerInfoDict.hasOwnProperty(key)) {
                              		tree.push({
                                    path: `src/controllers/workers/${this.getRepresentativeName(key)}.ts`,
                                    mode: "100644",
                                    type: "blob",
                                    sha: nextProjectData.backEndControllerBlobSHADict[key].split('#')[0]
                                  });
                              	} else if (schedulerControllerInfoDict.hasOwnProperty(key)) {
                              		tree.push({
                                    path: `src/controllers/schedulers/${this.getRepresentativeName(key)}.ts`,
                                    mode: "100644",
                                    type: "blob",
                                    sha: nextProjectData.backEndControllerBlobSHADict[key].split('#')[0]
                                  });
                              	} else {
                              		tree.push({
                                    path: `src/controllers/components/${this.getFeatureDirectoryPrefix(key)}${this.getRepresentativeName(key)}.ts`,
                                    mode: "100644",
                                    type: "blob",
                                    sha: nextProjectData.backEndControllerBlobSHADict[key].split('#')[0]
                                  });
                              	}
                              }
                            }
                            for (let key in nextProjectData.frontEndComponentsBlobSHADict) {
                              if (nextProjectData.frontEndComponentsBlobSHADict.hasOwnProperty(key)) {
                                tree.push({
                                  path: `src/public/js/components/${key}.tsx`,
                                  mode: "100644",
                                  type: "blob",
                                  sha: nextProjectData.frontEndComponentsBlobSHADict[key].split('#')[0]
                                });
                              }
                            }
                            for (let key in nextProjectData.viewBlobSHADict) {
                              if (nextProjectData.viewBlobSHADict.hasOwnProperty(key)) {
                                tree.push({
                                  path: `views/home/${this.getFeatureDirectoryPrefix(key)}${this.getRepresentativeName(key)}.pug`,
                                  mode: "100644",
                                  type: "blob",
                                  sha: nextProjectData.viewBlobSHADict[key].split('#')[0]
                                });
                              }
                            }
                            
                            repo.createTree(tree, baseTreeSHA, (error, result, request) => {
                              if (error) {
								      					HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
								      					
                                alert(`There was an error while creating a new tree:\n${this.extractErrorMessage(error)}`);
                                return;
                              }
                              
                              let updatedTreeSHA = result.sha;
                              if (DEBUG_GITHUB_UPLOADER) console.log('updatedTreeSHA', updatedTreeSHA);
                              
                              let message = prompt('Please describe your recent changes:', recentCommitMessage || '');
                              
                              if (message !== null && message.trim() !== "") {
                                repo.commit(baseCommitSHA, updatedTreeSHA, message, (error, result, request) => {
                                  if (error) {
										      					HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
										      					
                                    alert(`There was an error while committing a new change:\n${this.extractErrorMessage(error)}`);
                                    return;
                                  }
                                  
                                  let recentCommitSHA = result.sha;
                                  if (DEBUG_GITHUB_UPLOADER) console.log('recentCommitSHA', recentCommitSHA);
                                  
                                  repo.updateHead('heads/' + GITHUB_FEATURE_BRANCH, recentCommitSHA, true, (error, result, request) => {
                                    if (error) {
											      					HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
											      					
                                      alert(`There was an error while updating head for the current branch:\n${this.extractErrorMessage(error)}`);
                                      return;
                                    }
              
                                    constructionWindow.clearFullStackCodeForAllPages(nextProjectData);
                                    
                                    if (message.indexOf('[continue]') != 0) {
                                      recentCommitMessage = '[continue] ' + message;
                                    } else {
                                      recentCommitMessage = message;
                                    }
                                    
                                    StorageHelper.setCookie('recentCommitMessage', recentCommitMessage);
                                    
                                    this.deleteFiles(repo, deletingPersistingFiles, () => {
																      let endpoint = window.ENDPOINT;
																     	if (endpoint.indexOf('https://localhost') == 0) {
																     		endpoint = 'https://localhost.stackblend.org';
																     	}
                                    
                                      RequestHelper.post(`${endpoint}/endpoint/reset/content`, {}).then(() => {
                                        RequestHelper.post(`${endpoint}/endpoint/pull/content`, {}).then(() => {
													      					HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
													      					
                                          alert('Your changes have been saved successfully.');
                                        }).catch(() => {
													      					HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
													      					
                                          alert('Your changes have been saved successfully.');
                                        });
                                      }).catch(() => {
												      					HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
												      					
                                        alert('Your changes have been saved successfully.');
                                      });
                                    });
                                  });
                                });
                              } else {
                              	HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
                              }
                            });
                          };
                          
                          repo.createBlob(CodeHelper.label(JSON.stringify(CodeHelper.recursiveSortHashtable(nextProjectData), null, 2)), null, createTree);
                        });
                      });
                    };
                    
                    if (Object.keys(frontEndCodeInfoDict).length != 0) {
	                    repo.createBlob(combinedHeaderScripts, nextProjectData.headerBlobSHA, (headerBlobError, headerBlobResult, request) => {
	                      repo.createBlob(combinedFooterScripts, nextProjectData.footerBlobSHA, (footerBlobError, footerBlobResult, request) => {
	                      	process(headerBlobError, headerBlobResult, footerBlobError, footerBlobResult);
	                    	});
	                    });
	                  } else {
	                  	process(null, null, null, null);
	                  }
                  });
                });
              });
            });
          });
          
          if (previousProjectDataSHA) {
            repo.getBlob(previousProjectDataSHA, (error, result, response) => {
             if (error) {
      					HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
      					
                alert(`There was an error while retrieving data:\n${this.extractErrorMessage(error)}`);
                return;
              }
              
              try {
                if (typeof result === 'string') {
                  result = JSON.parse(CodeHelper.unlabel(result));
                }
              } catch(ex) { /* void */ }
              
              if (typeof result !== 'object') {
      					HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
      					
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
    public merge() {
      let repo = this.getGitHubRepo();
			
			HTMLHelper.addClass(HTMLHelper.getElementByClassName('merge-button'), 'in-progress');
      
      repo.createPullRequest({
        title: `Merging ${GITHUB_FEATURE_BRANCH} into ${GITHUB_DEVELOP_BRANCH}`,
        head: GITHUB_FEATURE_BRANCH,
        base: GITHUB_DEVELOP_BRANCH
      }, (error, result, request) => {
        if (error) {
        	const message = this.extractErrorMessage(error);
      		const isNoCommitsBetween = (message.indexOf('No commits between') != -1);
      		
        	if (!isNoCommitsBetween) {
        		HTMLHelper.removeClass(HTMLHelper.getElementByClassName('merge-button'), 'in-progress');
        	
          	alert(`There was an error while creating a pull request:\n${message}`);
          } else {
	          this.afterMerge(repo);
          }
        } else {
        	let pullRequestNumber = result.number;
        	if (DEBUG_GITHUB_UPLOADER) console.log('pullRequestNumber', pullRequestNumber);
        
	        repo.mergePullRequest(pullRequestNumber, {
	        }, (error, result, request) => {
	          if (error) {
		        	HTMLHelper.removeClass(HTMLHelper.getElementByClassName('merge-button'), 'in-progress');
		        	
	            alert(`There was an error while merging a pull request into a develop branch. However, your changes didn't lose and you can go to your GitHub.com and perform it later.'`);
	          } else {
	          	this.afterMerge(repo);
	          }
	        });
        }
      });
    }
    private afterMerge(repo: any) {
    	if (!confirm(`Your changes have been merged for other colleagues. Do you want to merge their changes and reload the project?`)) {
        HTMLHelper.removeClass(HTMLHelper.getElementByClassName('merge-button'), 'in-progress');
      } else {
	      repo.createPullRequest({
	        title: `Merging ${GITHUB_DEVELOP_BRANCH} into ${GITHUB_FEATURE_BRANCH}`,
	        head: GITHUB_DEVELOP_BRANCH,
	        base: GITHUB_FEATURE_BRANCH
	      }, (error, result, request) => {
	        if (error) {
	        	HTMLHelper.removeClass(HTMLHelper.getElementByClassName('merge-button'), 'in-progress');
	        	
	          alert(`There was an error while creating a pull request:\n${this.extractErrorMessage(error)}`);
	        } else {
						let pullRequestNumber = result.number;
		        if (DEBUG_GITHUB_UPLOADER) console.log('pullRequestNumber', pullRequestNumber);
		        
		        repo.mergePullRequest(pullRequestNumber, {
		        }, (error, result, request) => {
		          if (error) {
			        	HTMLHelper.removeClass(HTMLHelper.getElementByClassName('merge-button'), 'in-progress');
			        	
		            alert(`There was an error while merging a pull request into your feature branch, please go to your GitHub.com and perform it.\n\n${this.extractErrorMessage(error)}'`);
		            return;
		          }
		          
		          window.setTimeout(() => {
		          	window.overrideBeforeUnload = true;
		          	
		            alert(`Your feature branch has been updated and required reloading.`)
		            window.location.reload(true);
		            
		            HTMLHelper.removeClass(HTMLHelper.getElementByClassName('merge-button'), 'in-progress');
		          }, 10000);
		        });
	        }
	      });
	    }
    }
    public deploy() {
      let repo = this.getGitHubRepo();
      
      HTMLHelper.addClass(HTMLHelper.getElementByClassName('deploy-button'), 'in-progress');
      
      repo.createPullRequest({
        title: `Merging ${GITHUB_DEVELOP_BRANCH} into ${GITHUB_STAGING_BRANCH}`,
        head: GITHUB_DEVELOP_BRANCH,
        base: GITHUB_STAGING_BRANCH
      }, (error, result, request) => {
        if (error) {
        	HTMLHelper.removeClass(HTMLHelper.getElementByClassName('deploy-button'), 'in-progress');
        	
          alert(`There was an error while creating a pull request:\n${this.extractErrorMessage(error)}`);
          return;
        }
        
        let pullRequestNumber = result.number;
        if (DEBUG_GITHUB_UPLOADER) console.log('pullRequestNumber', pullRequestNumber);
        
        repo.mergePullRequest(pullRequestNumber, {
        }, (error, result, request) => {
          if (error) {
	        	HTMLHelper.removeClass(HTMLHelper.getElementByClassName('deploy-button'), 'in-progress');
	        	
            alert(`There was an error while merging a pull request into a staging branch, please go to your GitHub.com and perform it.\n\n${this.extractErrorMessage(error)}`);
            return;
          }
          
        	HTMLHelper.removeClass(HTMLHelper.getElementByClassName('deploy-button'), 'in-progress');
        	
          alert(`Your changes have been deployed on ${GITHUB_STAGING_BRANCH} and is ready for automatic deployment.`);
        });
      });
    }
    createRouteBlob(repo: any, routes: string[], previousSHA: string, cb: any) {
      repo.createBlob(`// Auto[Generating:V1]--->
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
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.`, previousSHA, (error, result, request) => {
        if (error) {
        	HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
        	
          alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
          return;
        }
        
        let nextRouteDataSHA = result.sha;
        
        cb(nextRouteDataSHA);
      });
    }
    createControllerBlob(repo: any, routes: string[], connectors: string[], workers: string[], schedulers: string[], previousSHA: string, cb: any) {
      repo.createBlob(`// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

import {Request, Response} from "express";
import {ActionHelper} from "./helpers/ActionHelper";
import {WorkerHelper} from "./helpers/WorkerHelper";
import {SchedulerHelper} from "./helpers/SchedulerHelper";

${routes.map(route => `import Component${route.id} from "./components/${this.getFeatureDirectoryPrefix(route.id)}${this.getRepresentativeName(route.id)}";`).join('\n')}
${connectors.map(key => `import Connector${key} from "./connectors/${this.getRepresentativeName(key)}";`).join('\n')}
${workers.map(key => `import Worker${key} from "./workers/${this.getRepresentativeName(key)}";`).join('\n')}
${schedulers.map(key => `import Scheduler${key} from "./schedulers/${this.getRepresentativeName(key)}";`).join('\n')}

${routes.map(route => `export const ${this.getRepresentativeName(route.id)} = (req: Request, res: Response) => {
  new Component${route.id}(req, res, "home/${this.getFeatureDirectoryPrefix(route.id)}${this.getRepresentativeName(route.id)}");
}`).join('\n')}
${connectors.map(key => `ActionHelper.register(Connector${key});`).join('\n')}
${workers.map(key => `WorkerHelper.register(Worker${key});`).join('\n')}
${schedulers.map(key => `SchedulerHelper.register(Scheduler${key});`).join('\n')}

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.`, previousSHA, (error, result, request) => {
        if (error) {
        	HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
        	
          alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
          return;
        }
        
        let nextControllerDataSHA = result.sha;
        
        cb(nextControllerDataSHA);
      });
    }
    createViewBlob(repo: any, inputDict: any, pages: any, previousSHADict: any, cb: any) {
      let keys = Object.keys(inputDict);
      let nextViewDataSHADict = {};
      
      let process = (index: number) => {
        let page = pages.filter(page => page.id == keys[index]);
        
        repo.createBlob(`//- Auto[Generating:V1]--->
//- PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

${inputDict[keys[index]].split('#{title}').join(page && page[0] && page[0].name || 'Untitled')}

//- <--- Auto[Generating:V1]
//- PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.`, previousSHADict && previousSHADict[keys[index]] || null, (error, result, request) => {
          if (error) {
	        	HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
	        	
            alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
            return;
          }
          
          nextViewDataSHADict[keys[index]] = result.sha;
          
          if (index + 1 < keys.length) {
            process(index + 1);
          } else {
            cb(nextViewDataSHADict);
          }
        });
      }
      if (keys.length > 0) process(0);
      else cb(nextViewDataSHADict);
    }
    createFrontEndComponentsBlob(repo: any, arrayOfContent: string[], previousSHADict: any, cb: any) {
      let nextFrontEndComponentsDataSHADict = {};
      let mainprocess = (mainIndex: number) => {
        let results = arrayOfContent[mainIndex].split("// Auto[File]--->\n");
        if (results.length < 2) {
          if (mainIndex + 1 < arrayOfContent.length) {
            mainprocess(mainIndex + 1);
          } else {
            cb(nextFrontEndComponentsDataSHADict);
          }
        } else {
          let subprocess = (subIndex: number) => {
            let tokens = results[subIndex].split("\n// <---Auto[File]");
            
            repo.createBlob(`// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

${tokens[1]}

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.`, previousSHADict && previousSHADict[tokens[0]] || null, (error, result, request) => {
              if (error) {
			        	HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
			        	
                alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
                return;
              }
              
              nextFrontEndComponentsDataSHADict[tokens[0]] = result.sha;
              
              if (subIndex + 1 < results.length) {
                subprocess(subIndex + 1);
              } else if (mainIndex + 1 < arrayOfContent.length) {
                mainprocess(mainIndex + 1);
              } else {
                cb(nextFrontEndComponentsDataSHADict);
              }
            });
          }
          subprocess(1);
        }
      }
      if (arrayOfContent.length != 0) mainprocess(0);
      else cb(nextFrontEndComponentsDataSHADict);
    }
    createBackEndControllerBlob(repo: any, arrayOfContent: string[], previousSHADict: any, cb: any) {
      let nextBackEndControllersDataSHADict = {};
      let mainprocess = (mainIndex: number) => {
        let results = arrayOfContent[mainIndex].split("// Auto[File]--->\n");
        if (results.length < 2) {
          if (mainIndex + 1 < arrayOfContent.length) {
            mainprocess(mainIndex + 1);
          } else {
            cb(nextBackEndControllersDataSHADict);
          }
        } else {
          let subprocess = (subIndex: number) => {
            let tokens = results[subIndex].split("\n// <---Auto[File]");
            
            repo.createBlob(`// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

${this.replaceShortcuts(tokens[1])}

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.`, previousSHADict && previousSHADict[tokens[0]] || null, (error, result, request) => {
              if (error) {
			        	HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
			        	
                alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
                return;
              }
              
              nextBackEndControllersDataSHADict[tokens[0]] = result.sha;
              
              if (subIndex + 1 < results.length) {
                subprocess(subIndex + 1);
              } else if (mainIndex + 1 < arrayOfContent.length) {
                mainprocess(mainIndex + 1);
              } else {
                cb(nextBackEndControllersDataSHADict);
              }
            });
          }
          subprocess(1);
        }
      }
      if (arrayOfContent.length != 0) mainprocess(0);
      else cb(nextBackEndControllersDataSHADict);
    }
    createSiteBundleBlob(repo: any, routes: string[], frontEndComponentsBlobSHADict: any, previousSHA: string, cb: any) {
      repo.createBlob(`// Auto[Generating:V1]--->
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
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.`, previousSHA, (error, result, request) => {
        if (error) {
        	HTMLHelper.removeClass(HTMLHelper.getElementByClassName('save-button'), 'in-progress');
        	
          alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
          return;
        }
        
        let nextSiteBundleDataSHA = result.sha;
        if (DEBUG_GITHUB_UPLOADER) console.log('nextSiteBundleDataSHA', nextSiteBundleDataSHA);
        
        cb(nextSiteBundleDataSHA);
      });
    }
    deleteFiles(repo: any, files: any, cb: any) {
      if (files.length == 0) cb();
      else {
        let process = (index: number) => {
          let file = files[index];
          
          repo.deleteFile(file, (error, result, request) => {
            if (index + 1 < files.length) {
              process(index + 1);
            } else {
              cb();
            }
          });
        }
        process(0);
      }
    }
    generateWorkspaceData(removeSHADict: boolean=false) {
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