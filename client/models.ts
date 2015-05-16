/// <reference path="tsd.d.ts" />

module socially {
   
    export interface IPartyAngularMeteorObject extends IParty, angular.meteor.AngularMeteorObject<IParty> {}
    
    export interface IPartyDetailsStateParams extends angular.ui.IStateParamsService {
        partyId: string;
    }
}