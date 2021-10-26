// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.

// Auto[Import]--->
import {Request, Response} from "express";
import {SourceType, ActionType, HierarchicalDataTable, HierarchicalDataRow, Input, DatabaseHelper} from '../../../helpers/DatabaseHelper';
import {ProjectConfigurationHelper} from '../../../helpers/ProjectConfigurationHelper';
import {ValidationInfo, ValidationHelper} from '../../../helpers/ValidationHelper';
import {RequestHelper} from '../../../helpers/RequestHelper';
import {RenderHelper} from '../../../helpers/RenderHelper';
import {SchemaHelper, DataTableSchema} from '../../../helpers/SchemaHelper';
import {Base as $Base} from '../../Base';

// Assign to an another one to override the base class.
// 
let Base: any = $Base;

// <---Auto[Import]

// Import additional modules here:
//
import {UserDocument, User} from "../../../../models/User";

// Auto[Declare]--->
/*enum SourceType {
  Relational,
  PrioritizedWorker,
  Document,
  VolatileMemory,
  RESTful,
  Dictionary,
  Collection
}
enum ActionType {
  Insert,
  Update,
  Upsert,
  Delete,
  Retrieve,
  Popup,
  Navigate,
  Test
}*/
// <---Auto[Declare]

// Declare private static variables here:
//

// Auto[Interface]--->
/*interface HierarchicalDataTable {
	source: SourceType;
	group: string;
  rows: HierarchicalDataRow[];
  notification?: string;
}
interface HierarchicalDataRow {
  keys: {[Identifier: string]: any};
  columns: {[Identifier: string]: any};
  relations: {[Identifier: string]: HierarchicalDataTable};
  division?: number[];
}
interface Input {
  target: SourceType;
  group: string;
  name: string;
  value: any;
  guid: string;
  premise: string;
  validation: ValidationInfo;
  division?: number[];
}
interface ValidationInfo {
  name: string;
  required: boolean;
  customMessage: string;
  format?: string;
  regex?: string;
}*/
// <---Auto[Interface]

// Declare or extend interfaces here:
//

// Auto[ClassBegin]--->
class Controller extends Base {
  constructor(request: Request, response: Response, template: string) {
  	super(request, response, template);
  	try {
	    let [action, schema, data] = this.initialize(request);
	    this.perform(action, schema, data);
   	} catch(error) {
	  	RenderHelper.error(response, error);
	  }
  }
  // <---Auto[ClassBegin]
  // Declare class variables and functions here:
  //
  protected validate(data: Input[]): void {
  	// The message of thrown error will be the validation message.
  	//
 		ValidationHelper.validate(data);
        
    let email, password, confirmPassword;
  	
  	for (let input of data) {
    	switch (input.name) {
    	  case 'email':
    	    email = input.value;
    	    break;
    	  case 'password':
    	    password = input.value;
    	    break;
    	  case 'confirmPassword':
    	    confirmPassword = input.value;
    	    break;
    	}
  	}
  	
  	if (email && !email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
  	  throw new Error("You have entered a wrong email."); 
  	}
  	
  	if ((!!password || !!confirmPassword) && password !== confirmPassword) throw new Error("Password confirmation doesn't match password."); 
  }
  
  protected async accessories(data: Input[]): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve({
          title: null,
          description: null,
          keywords: null,
          language: null,
          contentType: null,
          revisitAfter: null,
          robots: null,
          linkUrl: null,
          imageUrl: null,
          itemType: null,
          contentLocale: null
        });
      } catch(error) {
        reject(error);
      }
    });
  }
  
  protected async get(data: Input[]): Promise<{[Identifier: string]: HierarchicalDataTable}> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = this.request.user as UserDocument;
        if (user) {
          User.findById(user.id, (err, user: UserDocument) => {
            if (err) {
              this.response.redirect('/logout');
              resolve({});
            } else {
              resolve({
                User: {
                  source: SourceType.Document,
                	group: 'User',
                  rows: [
                    {
                      keys: {},
                      columns: {
                        email: user.email,
                        name: user.profile.name,
                        alias: user.alias,
                        project: user.project,
                        feature: user.feature,
                        develop: user.develop,
                        staging: user.staging,
                        endpoint: user.endpoint,
                        facebook: !!user.facebook,
                        github: !!user.github,
                        progressivelyUpdate: user.progressivelyUpdate === true
                      },
                      relations: {}
                    }
                  ]
                }
              });
            }
          });
        } else {
          this.response.redirect('/account/authenticate');
          resolve({});
        }
      } catch(error) {
        this.response.redirect('/account/authenticate');
      }
    });
  }
  
  protected async post(data: Input[]): Promise<{[Identifier: string]: HierarchicalDataTable}> {
    return new Promise(async (resolve, reject) => {
      /* try {
        resolve(await super.post(data));
      } catch(error) {
        reject(error);
      } */
      reject(new Error("Not Implemented Error"));
    });
  }
  
  protected async put(data: Input[]): Promise<{[Identifier: string]: HierarchicalDataTable}> {
    return new Promise(async (resolve, reject) => {
      /* try {
        resolve(await super.put(data));
      } catch(error) {
        reject(error);
      } */
      reject(new Error("Not Implemented Error"));
    });
  }
  
  protected async delete(data: Input[]): Promise<{[Identifier: string]: HierarchicalDataTable}> {
    return new Promise(async (resolve, reject) => {
      /* try {
        resolve(await super.delete(data));
      } catch(error) {
        reject(error);
      } */
      reject(new Error("Not Implemented Error"));
    });
  }
  
  protected async insert(data: Input[], schema: DataTableSchema): Promise<HierarchicalDataRow[]> {
    return new Promise(async (resolve, reject) => {
      try {
      	let options = RequestHelper.getOptions(this.pageId, this.request);
        resolve(await DatabaseHelper.insert(data, schema, options.crossRelationUpsert, this.request.session));
      } catch(error) {
        reject(error);
      }
    });
  }
  
  protected async update(data: Input[], schema: DataTableSchema): Promise<HierarchicalDataRow[]> {
    return new Promise(async (resolve, reject) => {
    	try {
      	let options = RequestHelper.getOptions(this.pageId, this.request);
      	let email, name, alias, project, feature, develop, staging, endpoint, password, confirmPassword, progressivelyUpdate;
      	
      	for (let input of data) {
        	switch (input.name) {
        	  case 'email':
        	    email = input.value;
        	    break;
        	  case 'name':
        	    name = input.value;
        	    break;
        	  case 'alias':
        	    alias = input.value;
        	    break;
        	  case 'project':
        	    project = input.value;
        	    break;
        	  case 'feature':
        	    feature = input.value;
        	    break;
        	  case 'develop':
        	    develop = input.value;
        	    break;
        	  case 'staging':
        	    staging = input.value;
        	    break;
        	  case 'endpoint':
        	    endpoint = input.value;
        	    break;
        	  case 'password':
        	    password = input.value;
        	    break;
        	  case 'progressivelyUpdate':
        	    progressivelyUpdate = input.value;
        	    break;
        	}
      	}
      	
      	const user = this.request.user as UserDocument;
        if (user) {
          User.findById(user.id, (err, user: UserDocument) => {
            if (err) {
              reject(new Error('Please login before continuing.'));
              return;
            } else {
              user.email = email || "";
              user.profile.name = name || "";
              user.alias = alias || "";
              user.project = project || "";
              user.feature = feature || "";
              user.develop = develop || "";
              user.staging = staging || "";
              user.endpoint = endpoint || "";
              user.progressivelyUpdate = progressivelyUpdate !== 'false'
              
              if (!!password) {
                user.password = password;
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
              }
              
              user.save((err: WriteError) => {
                if (err) {
                  reject(new Error('Please login before continuing.'));
                  return;
                } else {
                  resolve([]);
                }
              });
            }
          });
        } else {
          reject(new Error('Please login before continuing.'));
          return;
        }
        
        // resolve(await DatabaseHelper.update(data, schema, options.crossRelationUpsert, this.request.session));
      } catch(error) {
        reject(error);
      }
    });
  }
  
  protected async upsert(data: Input[], schema: DataTableSchema): Promise<HierarchicalDataRow[]> {
    return new Promise(async (resolve, reject) => {
    	try {
        resolve(await DatabaseHelper.upsert(data, schema, this.request.session));
      } catch(error) {
        reject(error);
      }
    });
  }
  
  protected async remove(data: Input[], schema: DataTableSchema): Promise<HierarchicalDataRow[]> {
    return new Promise(async (resolve, reject) => {
    	try {
        resolve(await DatabaseHelper.delete(data, schema, this.request.session));
      } catch(error) {
        reject(error);
      }
    });
  }
  
  protected async retrieve(data: Input[], schema: DataTableSchema): Promise<{[Identifier: string]: HierarchicalDataTable}> {
    return new Promise(async (resolve, reject) => {
    	try {
      	let options = RequestHelper.getOptions(this.pageId, this.request);
        resolve(await DatabaseHelper.retrieve(data, schema, this.request.session, options.enabledRealTimeUpdate));
      } catch(error) {
        reject(error);
      }
    });
  }
  
  protected async navigate(data: Input[], schema: DataTableSchema): Promise<string> {
    return new Promise(async (resolve, reject) => {
    	try {
      	throw new Error("Not Implemented Error");
        // resolve('/');
      } catch(error) {
        reject(error);
      }
    });
  }
 	
  // Auto[MergingBegin]--->  
  private initialize(request: Request): [ActionType, DataTableSchema, Input[]] {
  	let schema: DataTableSchema = RequestHelper.getSchema(this.pageId, request);
  	let data: Input[] = [];
  	let input: Input = null;
  	
	  // <---Auto[MergingBegin]
	  
	  // Auto[Merging]--->
    RequestHelper.registerSubmit("3cb10a6e", "ea9268d1", "update", ["0762b97d","098c6ea6","1da99335","25254217","27d35136","33832ba7","3478b9ac","49da134d","74d68ec6","d3e700b6","ece2d619"], {initClass: null, crossRelationUpsert: false, enabledRealTimeUpdate: false, name: "Button 2"});
		RequestHelper.registerInput('27d35136', "document", "User", "email");
		ValidationHelper.registerInput('27d35136', "Textbox 1", false, undefined, undefined, null);
    for (let input of RequestHelper.getInputs(this.pageId, request, '27d35136')) {
    
      // Override data parsing and manipulation of Textbox 1 here:
      // 
      
      if (input != null) data.push(input);
    }
		RequestHelper.registerInput('ece2d619', "document", "User", "name");
		ValidationHelper.registerInput('ece2d619', "Textbox 2", false, undefined, undefined, null);
    for (let input of RequestHelper.getInputs(this.pageId, request, 'ece2d619')) {
    
      // Override data parsing and manipulation of Textbox 2 here:
      // 
      
      if (input != null) data.push(input);
    }
		RequestHelper.registerInput('d3e700b6', "document", "User", "alias");
		ValidationHelper.registerInput('d3e700b6', "Textbox 3", false, undefined, undefined, null);
    for (let input of RequestHelper.getInputs(this.pageId, request, 'd3e700b6')) {
    
      // Override data parsing and manipulation of Textbox 3 here:
      // 
      
      if (input != null) data.push(input);
    }
		RequestHelper.registerInput('0762b97d', "document", "User", "project");
		ValidationHelper.registerInput('0762b97d', "Textbox 4", false, undefined, undefined, null);
    for (let input of RequestHelper.getInputs(this.pageId, request, '0762b97d')) {
    
      // Override data parsing and manipulation of Textbox 4 here:
      // 
      
      if (input != null) data.push(input);
    }
		RequestHelper.registerInput('098c6ea6', "document", "User", "feature");
		ValidationHelper.registerInput('098c6ea6', "Textbox 2", false, undefined, undefined, null);
    for (let input of RequestHelper.getInputs(this.pageId, request, '098c6ea6')) {
    
      // Override data parsing and manipulation of Textbox 2 here:
      // 
      
      if (input != null) data.push(input);
    }
		RequestHelper.registerInput('25254217', "document", "User", "develop");
		ValidationHelper.registerInput('25254217', "Textbox 3", false, undefined, undefined, null);
    for (let input of RequestHelper.getInputs(this.pageId, request, '25254217')) {
    
      // Override data parsing and manipulation of Textbox 3 here:
      // 
      
      if (input != null) data.push(input);
    }
		RequestHelper.registerInput('1da99335', "document", "User", "staging");
		ValidationHelper.registerInput('1da99335', "Textbox 4", false, undefined, undefined, null);
    for (let input of RequestHelper.getInputs(this.pageId, request, '1da99335')) {
    
      // Override data parsing and manipulation of Textbox 4 here:
      // 
      
      if (input != null) data.push(input);
    }
		RequestHelper.registerInput('74d68ec6', "document", "User", "endpoint");
		ValidationHelper.registerInput('74d68ec6', "Textbox 5", false, undefined, undefined, null);
    for (let input of RequestHelper.getInputs(this.pageId, request, '74d68ec6')) {
    
      // Override data parsing and manipulation of Textbox 5 here:
      // 
      
      if (input != null) data.push(input);
    }
		RequestHelper.registerInput('49da134d', "document", "User", "progressivelyUpdate");
		ValidationHelper.registerInput('49da134d', "Checkbox 1", false, undefined, undefined, null);
    for (let input of RequestHelper.getInputs(this.pageId, request, '49da134d')) {
    
      // Override data parsing and manipulation of Checkbox 1 here:
      // 
      
      if (input != null) data.push(input);
    }
		RequestHelper.registerInput('3478b9ac', "document", "User", "password");
		ValidationHelper.registerInput('3478b9ac', "Textbox 1", false, undefined, undefined, null);
    for (let input of RequestHelper.getInputs(this.pageId, request, '3478b9ac')) {
    
      // Override data parsing and manipulation of Textbox 1 here:
      // 
      
      if (input != null) data.push(input);
    }
		RequestHelper.registerInput('33832ba7', "document", "User", "confirmPassword");
		ValidationHelper.registerInput('33832ba7', "Textbox 1", false, undefined, undefined, null);
    for (let input of RequestHelper.getInputs(this.pageId, request, '33832ba7')) {
    
      // Override data parsing and manipulation of Textbox 1 here:
      // 
      
      if (input != null) data.push(input);
    }

	  // <---Auto[Merging]
	  
	  // Auto[MergingEnd]--->
	  
  	let action: ActionType = RequestHelper.getAction(this.pageId, request);
	  return [action, schema, data];
	}
  // <---Auto[MergingEnd]
  
  // Auto[ClassEnd]--->
}
// <---Auto[ClassEnd]

// Export variables here:
//
export default Controller;

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECAUSE YOUR CHANGES MAY BE LOST.