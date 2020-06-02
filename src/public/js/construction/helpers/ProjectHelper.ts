var ProjectHelper = {
  extractErrorMessage: (error) => {
 	  if (error && error.response && error.response.data && error.response.data.errors) {
 	    return error.response.data.errors.map(error => error.message).join('; ')
 	  } else {
 	    return 'It seemed that your internet connection is unavailable.'
 	  }
 	},
 	initGitHubInstance: () => {
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
 	},
 	load: () => {
 	  let construction = document.getElementById('html');
    let constructionWindow = construction.contentWindow || construction.contentDocument.document || construction.contentDocument;
    
    if (!constructionWindow.initializeWorkspaceData) {
      window.setTimeout(ProjectHelper.load, 500);
      return; 
    }
 	  
    let gh = ProjectHelper.initGitHubInstance();
    if (gh == null) return;
      
    gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT).getSingleCommit('heads/' + GITHUB_DEVELOP_BRANCH, (error, result, request) => {
      if (error) {
        alert(`There was an error while retrieving the last commit, please try again.`);
        return;
      }
      
      console.log(result);
      let baseCommitSHA = result && result.sha;
      let baseTreeSHA = result && result.commit && result.commit.tree.sha;
      
      console.log('baseCommitSHA', baseCommitSHA);
      console.log('baseTreeSHA', baseTreeSHA);
      
      gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT).getTree(baseTreeSHA, (error, result, request) => {
        if (error) {
          alert(`There was an error while retrieving project tree:\n${ProjectHelper.extractErrorMessage(error)}`);
          return;
        }
        
        console.log(result);
        let previousProjectDataSHA = result.tree.filter(node => node.path == 'project.stackblend')[0] || null;
        if (previousProjectDataSHA) previousProjectDataSHA = previousProjectDataSHA.sha;
        
        console.log('previousProjectDataSHA', previousProjectDataSHA);
        
        let continueFn = ((previousProjectData) => {
          constructionWindow.initializeWorkspaceData(previousProjectData);
          ProjectHelper.initializeWorkspaceData(previousProjectData);
        });
        
        if (previousProjectDataSHA) {
          gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT).getBlob(previousProjectDataSHA, (error, result, request) => {
           if (error) {
              alert(`There was an error while retrieving data:\n${ProjectHelper.extractErrorMessage(error)}`);
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
 	},
  save: () => {
    let gh = ProjectHelper.initGitHubInstance();
    if (gh == null) return;
      
    gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT).getSingleCommit('heads/' + GITHUB_DEVELOP_BRANCH, (error, result, request) => {
      if (error) {
        alert(`There was an error while retrieving the last commit, please try again.`);
        return;
      }
      
      console.log(result);
      let baseCommitSHA = result && result.sha;
      let baseTreeSHA = result && result.commit && result.commit.tree.sha;
      
      console.log('baseCommitSHA', baseCommitSHA);
      console.log('baseTreeSHA', baseTreeSHA);
      
      gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT).getTree(baseTreeSHA, (error, result, request) => {
        if (error) {
          alert(`There was an error while retrieving project tree:\n${ProjectHelper.extractErrorMessage(error)}`);
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
      		let constructionEditorData = ProjectHelper.generateWorkspaceData() || {};
          
          Object.assign(previousProjectData, constructionAreaHTMLData);
          Object.assign(previousProjectData, constructionEditorData);
          
          gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT).createBlob(JSON.stringify(previousProjectData), (error, result, request) => {
            if (error) {
              alert(`There was an error while creating blob:\n${ProjectHelper.extractErrorMessage(error)}`);
              return;
            }
            
            console.log(result);
            let nextProjectDataSHA = result.sha;
            
            console.log('nextProjectDataSHA', nextProjectDataSHA);
            
            gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT).createTree([{
              path: 'project.stackblend',
              mode: "100644",
              type: "blob",
              sha: nextProjectDataSHA
            }], baseTreeSHA, (error, result, request) => {
              if (error) {
                alert(`There was an error while creating a new tree:\n${ProjectHelper.extractErrorMessage(error)}`);
                return;
              }
              
              console.log(result);
              let updatedTreeSHA = result.sha;
            
              console.log('updatedTreeSHA', updatedTreeSHA);
              
              gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT).commit(baseCommitSHA, updatedTreeSHA, "Updated project.stackblend", (error, result, request) => {
                if (error) {
                  alert(`There was an error while committing a new change:\n${ProjectHelper.extractErrorMessage(error)}`);
                  return;
                }
                
                console.log(result);
                let recentCommitSHA = result.sha;
                
                console.log('recentCommitSHA', recentCommitSHA);
                
                gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT).updateHead('heads/' + GITHUB_DEVELOP_BRANCH, recentCommitSHA, true, (error, result, request) => {
                  if (error) {
                    alert(`There was an error while updating head for the current branch:\n${ProjectHelper.extractErrorMessage(error)}`);
                    return;
                  }
                  
                  console.log(result);
                  
                  alert('Your changes have been saved successfully.');
                });
              });
            });
          });
        });
        
        if (previousProjectDataSHA) {
          gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT).getBlob(previousProjectDataSHA, (error, result, request) => {
           if (error) {
              alert(`There was an error while retrieving data:\n${ProjectHelper.extractErrorMessage(error)}`);
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
  },
  deploy: () => {
    let gh = ProjectHelper.initGitHubInstance();
    if (gh == null) return;
		
    gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT).createPullRequest({
      title: `Merging ${GITHUB_DEVELOP_BRANCH} into ${GITHUB_STAGING_BRANCH}`,
      head: GITHUB_DEVELOP_BRANCH,
      base: GITHUB_STAGING_BRANCH
    }, (error, result, request) => {
      if (error) {
        alert(`There was an error while creating a pull request:\n${ProjectHelper.extractErrorMessage(error)}`);
        return;
      }
      
      console.log(result);
      let pullRequestNumber = result.number;
      
      console.log('pullRequestNumber', pullRequestNumber);
      
      gh.getRepo(GITHUB_ALIAS, GITHUB_PROJECT).mergePullRequest(pullRequestNumber, {
      }, (error, result, request) => {
        if (error) {
          alert(`There was an error while merging a pull request, please go to your GitHub.com and perform it.\n\n${ProjectHelper.extractErrorMessage(error)}`);
          return;
        }
        
        alert(`Your changes have been deployed on ${GITHUB_STAGING_BRANCH} and is ready for automatic deployment.`);
      });
    });
 	},
 	generateWorkspaceData: () => {
  	return {};
  },
 	initializeWorkspaceData: (data) => {
  	
  }
};

export {ProjectHelper};