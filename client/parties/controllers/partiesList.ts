/// <reference path="../../tsd.d.ts" />

module socially {
 
class PartiesListCtrl {
    public parties: angular.meteor.AngularMeteorCollection<IParty>;
    public greetnames: angular.meteor.AngularMeteorCollection<IGreetname>;
        
    constructor(private $meteor: angular.meteor.IMeteorService) {
        this.parties = $meteor.collection(Parties);
        this.greetnames = $meteor.collection(Greetnames);
    }
    
    public removeParty(party: IParty){
        this.parties.remove(party);
    }
    
    public removeAll(){
        this.parties.remove();
    }
} 
       
angular.module("socially")
    .controller("PartiesListCtrl", ['$meteor', PartiesListCtrl]);
    
}