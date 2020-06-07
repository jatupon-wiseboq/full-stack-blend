import {EventHelper} from '../../helpers/EventHelper.js';
import {RandomHelper} from '../../helpers/RandomHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
    onUpdate(value: any);
}

interface State extends IState {
}

class FileBrowser extends React.Component<Props, State> {
    static defaultProps: Props = {
    }
    
    constructor() {
        super();
    }
    
    fileOnChange(event) {
        let original = EventHelper.getOriginalElement(event);
        let file = original.files[0];
        
        let gh = this.initGitHubInstance();
        let repo = gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT);
        
        original.value = null;
        
        let $this = this;
        let reader = new FileReader();
        reader.onload = (function(event) {
          let blob = new Blob([new Uint8Array(event.target.result)], {type: file.type});
          
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = (function() {
            var base64data = reader.result.split(';base64,')[1];
            
            repo._request('POST', `/repos/${repo.__fullname}/git/blobs`, {
              content: base64data,
              encoding: 'base64'
            }, (error, result, request) => {
              if (error) {
                  alert(`There was an error while creating blob:\n${this.extractErrorMessage(error)}`);
                  return;
              }
              
              console.log(result);
              
              let guid = RandomHelper.generateGUID();
              let splited = file.name.split('.');
              let extension = (splited[splited.length - 1] || '.png').toLowerCase();
              
              let fileDataInfo = {
                  path: `src/public/images/uploaded/${guid}.${extension}`,
                  sha: result.sha,
                  url: `https://raw.githubusercontent.com/${GITHUB_ALIAS}/${GITHUB_PROJECT}/${GITHUB_DEVELOP_BRANCH}/src/public/images/uploaded/${guid}.${extension}`
              }
              console.log('fileDataInfo', fileDataInfo);
              
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
            
              let tree = [{
                path: fileDataInfo.path,
                mode: "100644",
                type: "blob",
                sha: fileDataInfo.sha
              }];
              
              repo.createTree(tree, baseTreeSHA, (error, result, request) => {
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
                    
                    if ($this.props.onUpdate) {
                      $this.props.onUpdate(fileDataInfo.url);
                    }
                  });
                });
              });
            });
          });
        });
      });
      reader.readAsArrayBuffer(file);
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
    
    render() {
      return (
        pug `
          .custom-file
            label.custom-file-label
              input.custom-file-input(type="file", onChange=this.fileOnChange.bind(this), internal-fsb-event-no-propagate="click")
        `
      )
    }
}

DeclarationHelper.declare('Controls.FileBrowser', FileBrowser);

export {Props, State, FileBrowser};