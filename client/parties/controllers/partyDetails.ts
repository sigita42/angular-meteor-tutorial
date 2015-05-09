/// <reference path="../../tsd.d.ts" />

module socially {
   
interface IPartyAngularMeteorObject extends IParty, angular.meteor.AngularMeteorObject<IParty> {}

interface IPartyDetailsStateParams extends angular.ui.IStateParamsService {
    partyId: string;
}

class PartyDetailsCtrl {
    public party: IPartyAngularMeteorObject;
    public partyId: string;
    
    //Meteor object binds a specific party
    constructor(private $stateParams: IPartyDetailsStateParams, private $meteor: angular.meteor.IMeteorService){
        this.partyId = $stateParams.partyId;
        this.party = <IPartyAngularMeteorObject>$meteor.object(Parties, this.partyId, false);
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
    .controller("PartyDetailsCtrl", ['$stateParams', '$meteor', PartyDetailsCtrl]);
    
}