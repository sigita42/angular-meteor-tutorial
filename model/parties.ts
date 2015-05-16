/// <reference path="../typings/tsd.d.ts" />

module socially {
	
//Interfaces	
	export interface IParty {
	    name: string;
	    description: string;
	    _id: string;
		owner: string;
		invited: string[];
		public: boolean;
		title: string;
		rsvps: string[];
	}

	export interface IGreetname {
	    name: string;
	}
	
	// first we need to create a new interface for the context `this`, in which the method will be executed
	interface IMethodThis {
		userId: string;
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
	
//Meteor methods
	Meteor.methods({
		// invite method
		invite: function (partyId: string, userId: string) {
			check(partyId, String);
			check(userId, String);
			
			var me = <IMethodThis>this;
			var party = Parties.findOne(partyId);
				if (!party){
					throw new Meteor.Error('404', "No such party");
				}
				if (party.owner !== me.userId){ // using `me` here
					throw new Meteor.Error('404', "No such party");
				}
				if (party.public){
					throw new Meteor.Error('400', "That party is public. No need to invite people.");
				}
					
			if (userId != party.owner && ! _.contains(party.invited, userId)) {
				Parties.update(partyId, { $addToSet: { invited: userId} });
				
				var from = contactEmail(Meteor.users.findOne(me.userId)); // using `me` here
				var to = contactEmail(Meteor.users.find(userId));
				
				if (Meteor.isServer && to) {
					//This code runs on the server
					Email.send({
						from: "noreplay@socially.com",
						to: to,
						replayTo: from || undefined,
						subject: "PARTY: " + party.title,
						text: "Hey, I just invited you to '" + party.title + "' on Socially." + "\n\nCome check it out: " + Meteor.absoluteUrl() + "\n"
					});
				}
			}
		},
		// RSVP method
		rsvp: function (partyId: string, rsvp: string) {
			check(partyId, String);
			check(rsvp, String);
			
			var me = <IMethodThis>this;
			var party = Parties.findOne(partyId);
			
			if (! me.userId) {
				throw new Meteor.Error('403', 'You must be logged in to RSVP');
			}
			if (! _.contains(['yes', 'no', 'maybe'], rsvp)){
				throw new Meteor.Error('400', 'Invalid RSVP');
			}
			if (! party){
				throw new Meteor.Error('404', 'No such party');
			}
			if(! party.public && party.owner !== me.userId && !_.contains(party.invited, me.userId)){
				// private, but let's not tell this to the user
				throw new Meteor.Error('403', 'No such party');
			}
			// return index at which value me.userID is found in the array 
			// return the list of elements from party.rsvps with property 'user'
			var rsvpIndex = _.indexOf( _.pluck(party.rsvps, 'user' ), me.userId);
			// if value me.userId is found in the array
			if (rsvpIndex !== -1){
			// update existing rsvp entry
			
				if (Meteor.isServer){
					// update the appropriate rsvp entry with $
					Parties.update(
						{_id: partyId, "rsvps.user": me.userId},
						{$set: {"rsvps.$.rsvp": rsvp}});
				} else {
					// minimongo doesn't yet support $ in modifier. As a temporary workaround, make a modifier
					// that uses an index. This is safe on the client since there's only one thread.
					var modifier = {$set: {}};
					modifier.$set['rsvps.' + rsvpIndex + ".rsvp"] = rsvp;
					Parties.update(partyId, modifier);
				}
				//Possible improvement: send email to the other people that are coming to the party
				} else {
					// Add new rsvp entry
					Parties.update(partyId,
						{$push: {rsvps: {user: me.userId, rsvp: rsvp}}});
				}
			}

	});
	
	var contactEmail = function (user) {
		if (user.emails && user.emails.length)
			return user.emails[0].address;
		if (user.services && user.services.facebook && user.services.facebook.email)
			return user.services.facebook.email;
		return null;
	};

}