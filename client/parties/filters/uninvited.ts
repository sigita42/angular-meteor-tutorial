/// <reference path="../../tsd.d.ts" />

module socially{
	
	angular.module("socially").filter('uninvited', () => {
		return (users: Meteor.User[], party: IParty) => {
			if (!party)
				return null;
				
			return _.filter(users, (user) => {
				if (user._id == party.owner || _.contains(party.invited, user._id))
					return false
				else
					return true;
			});
		}
	});	
}