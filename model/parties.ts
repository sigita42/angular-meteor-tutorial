/// <reference path="../typings/tsd.d.ts" />

module socially {
	
//Interfaces	
	export interface IParty {
	    name: string;
	    description: string;
	    _id: string;
		owner: string;
	}

	export interface IGreetname {
	    name: string;
	}
		
	export var Parties = new Mongo.Collection<IParty>("parties");
	export var Greetnames = new Mongo.Collection<IGreetname>("greetnames");
	
//Security rules
	Parties.allow({
		insert:(userId: string, party: IParty) => {
			return userId && party.owner === userId;
		},
		update:(userId: string, party: IParty, fields, modifier) => {
			if (userId !== party.owner)
				return false;
				
			return true;
		},
		remove:(userId: string, party: IParty) => {
			if(userId !== party.owner)
				return false;
				
			return true;
		}
	});

}