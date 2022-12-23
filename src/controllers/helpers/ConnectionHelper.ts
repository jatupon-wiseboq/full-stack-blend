// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import url from "url";
import redis from "redis";
import {Pool} from "node-postgres";
import {MongoClient} from "mongodb";
import sidekiq from "sidekiq";
import {Sequelize, Transaction} from "sequelize";
import dotenv from "dotenv";

let VolatileMemoryClient = null;
let RelationalDatabaseClient = null;
let RelationalDatabaseORMClient = null;
let DocumentDatabaseClient = null;
let PrioritizedWorkerVolatileMemoryClient = null;
let PrioritizedWorkerClient = null;

if (["staging", "production"].indexOf(process.env.NODE_ENV) == -1) {
  dotenv.config();
}

if (process.env.VOLATILE_MEMORY_KEY) {
	const connectionURL = new URL(process.env[process.env.VOLATILE_MEMORY_KEY]);
	const _default = redis.createClient({
		host     : connectionURL.host.split(':')[0],
	  user     : connectionURL.username,
	  password : connectionURL.password,
	  port     : connectionURL.port
	});
	
	VolatileMemoryClient = {
		default: _default,
		get: (key: any): Promise<any> => {
			return new Promise(async (resolve, reject) => {
				_default.get(key, (error, reply) => {
					if (error) reject(error);
					else resolve(reply);
				});
			});
		},
		set: (key: any, value: any): Promise<any> => {
			return new Promise(async (resolve, reject) => {
				_default.set(key, value, (error, reply) => {
					if (error) reject(error);
					else resolve(reply);
				});
			});
		},
		del: (key: any): Promise<any> => {
			return new Promise(async (resolve, reject) => {
				_default.del(key, (error, reply) => {
					if (error) reject(error);
					else resolve(reply);
				});
			});
		},
		quit: () => {
		  _default.quit();
		}
	};
}
if (process.env.RELATIONAL_DATABASE_KEY) {
	RelationalDatabaseORMClient = new Sequelize(process.env[process.env.RELATIONAL_DATABASE_KEY], {
    dialectOptions: {}
  });
	RelationalDatabaseClient = RelationalDatabaseORMClient.getQueryInterface().sequelize;
}
if (process.env.DOCUMENT_DATABASE_KEY) {
	const connectionURL = process.env[process.env.DOCUMENT_DATABASE_KEY];
	DocumentDatabaseClient = new MongoClient(connectionURL, {
		useUnifiedTopology: true
	});
	
	DocumentDatabaseClient._connect = DocumentDatabaseClient.connect;
	DocumentDatabaseClient._connection = null;
	DocumentDatabaseClient.connect = async (share: boolean=true) => {
		if (share) {
			if (DocumentDatabaseClient._connection == null || !DocumentDatabaseClient._connection.isConnected()) {
				DocumentDatabaseClient._connection = await DocumentDatabaseClient._connect();
				
				DocumentDatabaseClient._connection._close = DocumentDatabaseClient._connection.close;
				DocumentDatabaseClient._connection.close = () => {};
			}
			return DocumentDatabaseClient._connection;
		} else {
			return await DocumentDatabaseClient._connect();
		}
	};
}
if (process.env.PRIORITIZED_WORKER_KEY) {
	if (process.env.PRIORITIZED_WORKER_KEY == process.env.VOLATILE_MEMORY_KEY) {
		PrioritizedWorkerVolatileMemoryClient = VolatileMemoryClient.default;
	} else {
		const connectionURL = new URL(process.env[process.env.PRIORITIZED_WORKER_KEY]);
		PrioritizedWorkerVolatileMemoryClient = redis.createClient({
			host     : connectionURL.host.split(':')[0],
		  user     : connectionURL.username,
		  password : connectionURL.password,
		  port     : connectionURL.port
		});
	}
	PrioritizedWorkerClient = new sidekiq(PrioritizedWorkerVolatileMemoryClient, process.env.NODE_ENV);
}

const CreateTransaction = async (options) => {
	let relationalDatabaseTransaction = null;
	let documentDatabaseConnection = null;
	let documentDatabaseSession = null;
	
	if (RelationalDatabaseORMClient && !options.manual) {
		relationalDatabaseTransaction = await RelationalDatabaseORMClient.transaction();
	}
	if (DocumentDatabaseClient) {
		documentDatabaseConnection = await DocumentDatabaseClient.connect(options.share || options.share === undefined);
		if (!options.manual) {
			documentDatabaseSession = await DocumentDatabaseClient.startSession({
				retryWrites: true,
				causalConsistency: true
			});
			await documentDatabaseSession.startTransaction({
				readPreference: 'primary',
				readConcern: {
					level: 'local'
				},
				writeConcern: {
					w: 'majority'
				}
	    });
	 	}
	}
	
	return {
		commit: async () => {
			try {
				if (relationalDatabaseTransaction) await relationalDatabaseTransaction.commit();
				if (documentDatabaseSession) await documentDatabaseSession.commitTransaction();
			} finally {
				if (documentDatabaseSession) await documentDatabaseSession.endSession();
				if (documentDatabaseConnection) await documentDatabaseConnection.close();
			}
		},
		rollback: async () => {
			try {
				if (relationalDatabaseTransaction) await relationalDatabaseTransaction.rollback();
				if (documentDatabaseSession) await documentDatabaseSession.abortTransaction();
			} finally {
				if (documentDatabaseSession) await documentDatabaseSession.endSession();
				if (documentDatabaseConnection) await documentDatabaseConnection.close();
			}
		},
		get relationalDatabaseTransaction(): any { return relationalDatabaseTransaction; },
		get documentDatabaseConnection(): any { return documentDatabaseConnection; },
		get documentDatabaseSession(): any { return documentDatabaseSession; },
		setup: (_relationalDatabaseTransaction: any, _documentDatabaseSession: any) => {
			relationalDatabaseTransaction = _relationalDatabaseTransaction;
			documentDatabaseSession = _documentDatabaseSession;
		}
	};
};

let terminate = () => {
	if (VolatileMemoryClient) VolatileMemoryClient.quit();
	if (RelationalDatabaseClient) RelationalDatabaseClient.end();
	if (RelationalDatabaseORMClient) RelationalDatabaseORMClient.close();
	if (DocumentDatabaseClient) DocumentDatabaseClient.close();
	if (PrioritizedWorkerVolatileMemoryClient) PrioritizedWorkerVolatileMemoryClient.quit();
	if (PrioritizedWorkerClient) void(0);
};

process.on('SIGINT', terminate);
process.on('SIGTERM', terminate);

export {VolatileMemoryClient, RelationalDatabaseClient, RelationalDatabaseORMClient, DocumentDatabaseClient, PrioritizedWorkerVolatileMemoryClient, PrioritizedWorkerClient, CreateTransaction};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.
