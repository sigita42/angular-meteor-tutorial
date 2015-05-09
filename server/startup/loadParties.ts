/// <reference path="../tsd.d.ts" />

module socially {

	Meteor.startup( () => {
		if ((Parties.find().count() === 0) || (Greetnames.find().count() === 0)) {
		
		    var parties = [
		        {name: 'Dubstep-Free Zone',
		         description: 'Can we please just for an evening not listen to dubstep.'},
		        {name: 'All dubstep all the time',
		         description: 'Get it on!'},
		        {name: 'Savage lounging',
		         description: 'Leisure suit required. And only fiercest manners.'}
		    ];
		    var greetnames = [
		        {name: 'World'}
		    ];
		
		  for (var i = 0; i < parties.length; i++)
		    Parties.insert(parties[i]);
		  for (var i = 0; i< greetnames.length; i++)
		    Greetnames.insert(greetnames[i]);
		
		}
	});

}
