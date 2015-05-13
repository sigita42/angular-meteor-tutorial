/// <reference path="../../tsd.d.ts" />

module socially {
   
interface IPartyAngularMeteorObject extends IParty, angular.meteor.AngularMeteorObject<IParty> {}

interface IPartyDetailsStateParams extends angular.ui.IStateParamsService {
    partyId: string;
}

class PartyDetailsCtrl {
    public party: IPartyAngularMeteorObject;
    public partyId: string;
    public users: Meteor.User;
    
    //Meteor object binds a specific party
    constructor($scope: angular.meteor.IScope, private $stateParams: IPartyDetailsStateParams, private $meteor: angular.meteor.IMeteorService){
        this.partyId = $stateParams.partyId;
        this.party = <IPartyAngularMeteorObject>$meteor.object(Parties, this.partyId);
        $scope.subscribe('parties');
        //Binding to the Meteor.users collection; false = we don't want to update that collection from the client; Subscribing to the publish method
        this.users = $meteor.collection(Meteor.users, false).subscribe('users');
    }
    
    public save(){
        this.party.save().then((numberOfDocs) => {
            console.log('save success doc affected', numberOfDocs);
        }, (error) => {
            console.log('save error', error);
        });
    }
    
    public reset(){
        this.party.reset();
    }
}

angular.module("socially")
    .controller("PartyDetailsCtrl", ['$scope', '$stateParams', '$meteor', PartyDetailsCtrl]);
}