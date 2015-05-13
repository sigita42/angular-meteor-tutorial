/// <reference path="tsd.d.ts" />

module socially{
	
	//searchString - argument that will hold the requested search string
	Meteor.publish("parties", function(options, searchString) {
		var me = <Subscription>this;
		
		if (searchString == null)
			searchString = '';
		Counts.publish(this, 'numberOfParties', Parties.find({
			//Filter results using mongo's regex, where we used find
			'name' : {'$regex' : '.*' + searchString || '' + '.*', '$options' : 'i'},
			$or:[
				{$and:[
					{"public": true},
					{"public": {$exists: true}}
				]},
				{$and: [
					{owner: me.userId},
					{owner: {$exists: true}}
				]}
		]}), { noReady: true});

		return Parties.find({
			//Filter results
			'name' : {'$regex' : '.*' + searchString || '' + '.*', '$options' : 'i'},
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