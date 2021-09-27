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
import passport from "passport";
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
  	
  	if ((!!password && !!confirmPassword) && password !== confirmPassword) throw new Error("Password confirmation doesn't match password."); 
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
          this.response.redirect('/account/settings');
          resolve({});
        } else {
          resolve(await super.get(data));
        }
      } catch(error) {
        reject(error);
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
        resolve(await DatabaseHelper.update(data, schema, options.crossRelationUpsert, this.request.session));
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
      	
      	if (!!password && !!confirmPassword) {
      	  const user = new User({
            email: email,
            password: password
          });

          User.findOne({email: email}, (err, existingUser) => {
            if (err) {
              reject(new Error('There was an internal server error, please try again. (1001)'));
              return;
            }
            if (existingUser) {
              reject(new Error('Account with that email address already exists.'));
              return;
            }
            
            user.save((err) => {
              if (err) {
                reject(new Error('There was an internal server error, please try again. (1002)'));
                return;
              }
              
              this.request.logIn(user, (err) => {
                if (err) {
                  reject(new Error('There was an internal server error, please try again. (1003)'));
                  return;
                }
                resolve('/editor');
              });
            });
          });
      	} else {
      	  User.findOne({email: email}, (err, existingUser) => {
            if (err) {
              reject(new Error('There was an internal server error, please try again. (1101)'));
              return;
            }
            if (!existingUser) {
              reject(new Error('An account with the email address doesn\'t exist.'));
              return;
            }
            
            this.request.logIn(existingUser, (err) => {
              if (err) {
                reject(new Error('There was an internal server error, please try again. (1103)'));
                return;
              }
              resolve('/editor');
            });
          });
      	}
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
    RequestHelper.registerSubmit("9e885d49", "954a291a", "navigate", ["1b650e66","22d343bd"], {initClass: null, crossRelationUpsert: false, enabledRealTimeUpdate: false, name: "Button 3"});
    RequestHelper.registerSubmit("9e885d49", "b2b66792", "navigate", ["1b650e66","22d343bd","d3de6c93"], {initClass: null, crossRelationUpsert: false, enabledRealTimeUpdate: false, name: "Button 1"});
		RequestHelper.registerInput('1b650e66', "document", "User", "email");
		ValidationHelper.registerInput('1b650e66', "Textbox 1", true, "Please enter your email", undefined, null);
    for (let input of RequestHelper.getInputs(this.pageId, request, '1b650e66')) {
    
      // Override data parsing and manipulation of Textbox 1 here:
      // 
      
      if (input != null) data.push(input);
    }
		RequestHelper.registerInput('22d343bd', "document", "User", "password");
		ValidationHelper.registerInput('22d343bd', "Textbox 2", true, "Please enter your password", undefined, null);
    for (let input of RequestHelper.getInputs(this.pageId, request, '22d343bd')) {
    
      // Override data parsing and manipulation of Textbox 2 here:
      // 
      
      if (input != null) data.push(input);
    }
		RequestHelper.registerInput('d3de6c93', "document", "User", "confirmPassword");
		ValidationHelper.registerInput('d3de6c93', "Textbox 3", true, "Please confirm your password", undefined, null);
    for (let input of RequestHelper.getInputs(this.pageId, request, 'd3de6c93')) {
    
      // Override data parsing and manipulation of Textbox 3 here:
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