/// <reference path="../typings/tsd.d.ts" />

module socially {
	
//Security rules
	Parties.allow({
		insert:(userId, party) => {
			return userId && party.owner === userId;
		},
		update:(userId, party, fields, modifier) => {
			if (userId !== party.owner)
				return false;
				
			return true;
		},
		remove:(userId, party) => {
			if(userId !== party.owner)
				return false;
			return true;
		}
	});

//Interfaces	
	export interface IParty {
	    name: string;
	    description: string;
	    _id: string;
	}

	export interface IGreetname {
	    name: string;
	}
		
	export var Parties = new Mongo.Collection<IParty>("parties");
	export var Greetnames = new Mongo.Collection<IGreetname>("greetnames");

}