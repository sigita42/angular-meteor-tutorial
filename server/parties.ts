/// <reference path="tsd.d.ts" />

module socially{
	
	Meteor.publish("parties", function(options) {
		var me = <Subscription>this;
		
		return Parties.find({
			$or:[
				{$and:[
					{"public": true},
					{"public": {$exists: true}}
				]},
				{$and: [
					{owner: me.userId},
					{owner: {$exists: true}}
				]}
			]}, options);
	});
	
}