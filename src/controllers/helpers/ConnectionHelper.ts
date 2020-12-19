// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import url from "url";
import redis from "redis";
import mysql from "mysql2";
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
	VolatileMemoryClient = redis.createClient({
		host     : connectionURL.host,
	  user     : connectionURL.username,
	  password : connectionURL.password,
	  port     : connectionURL.port
	});
}
if (process.env.RELATIONAL_DATABASE_KEY) {
	const connectionURL = new URL(process.env[process.env.RELATIONAL_DATABASE_KEY]);
	const dbconfig = {
	  connectionLimit : 10,
	  host     : connectionURL.host,
	  user     : connectionURL.username,
	  password : connectionURL.password,
	  database : connectionURL.pathname.split("/")[1]
	};
	RelationalDatabaseClient = mysql.createPool(dbconfig);
	RelationalDatabaseORMClient = new Sequelize(connectionURL.pathname.split("/")[1],
	  connectionURL.username,
	  connectionURL.password, {
      host: connectionURL.host,
      dialect: "mysql"
    }
  );
}
if (process.env.DOCUMENT_DATABASE_KEY) {
	const connectionURL = process.env[process.env.DOCUMENT_DATABASE_KEY];
	DocumentDatabaseClient = new MongoClient(connectionURL);
}
if (process.env.PRIORITIZED_WORKER_KEY) {
	if (process.env.PRIORITIZED_WORKER_KEY == process.env.VOLATILE_MEMORY_KEY) {
		PrioritizedWorkerVolatileMemoryClient = VolatileMemoryClient;
	} else {
		const connectionURL = new URL(process.env[process.env.PRIORITIZED_WORKER_KEY]);
		PrioritizedWorkerVolatileMemoryClient = redis.createClient({
			host     : connectionURL.host,
		  user     : connectionURL.username,
		  password : connectionURL.password,
		  port     : connectionURL.port
		});
	}
	PrioritizedWorkerClient = new sidekiq(PrioritizedWorkerVolatileMemoryClient, process.env.NODE_ENV);
}

const CreateTransaction = (options) => {
	let relationalDatabaseTransaction = null;
	let documentDatabaseSession = null;
	
	if (RelationalDatabaseORMClient) {
		relationalDatabaseTransaction = RelationalDatabaseORMClient.transaction({});
	}
	if (DocumentDatabaseClient) {
		documentDatabaseSession = DocumentDatabaseClient.startSession({
			retryWrites: true,
			causalConsistency: true
		});
		documentDatabaseSession.startTransaction({
			readPreference: 'primary',
			readConcern: {
				level: 'local'
			},
			writeConcern: {
				w: 'majority'
			}
    });
	}
	
	return {
		commit: () => {
			try {
				if (relationalDatabaseTransaction) relationalDatabaseTransaction.commit();
				if (documentDatabaseSession) documentDatabaseSession.commitTransaction();
			} finally {
				if (documentDatabaseSession) documentDatabaseSession.endSession();
			}
		},
		rollback: () => {
			try {
				if (relationalDatabaseTransaction) relationalDatabaseTransaction.rollback();
				if (documentDatabaseSession) documentDatabaseSession.abortTransaction();
			} finally {
				if (documentDatabaseSession) documentDatabaseSession.endSession();
			}
		},
		relationalDatabaseTransaction: relationalDatabaseTransaction,
		documentDatabaseSession: documentDatabaseSession
	};
};

export {VolatileMemoryClient, RelationalDatabaseClient, RelationalDatabaseORMClient, DocumentDatabaseClient, PrioritizedWorkerVolatileMemoryClient, PrioritizedWorkerClient, CreateTransaction};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.
