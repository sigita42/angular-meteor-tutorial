/// <reference path="../../tsd.d.ts" />

//Controller is simply a constructor function
//Controller estabishes a binding between the model and the view

module socially {
 
class PartiesListCtrl {
    public parties: angular.meteor.AngularMeteorCollection<IParty>;
    public greetnames: angular.meteor.AngularMeteorCollection<IGreetname>;
    public page = 1;
    public perPage = 3;
    public sort: any = { name: 1 };
        
    constructor(private $meteor: angular.meteor.IMeteorService) {
        this.parties = $meteor.collection(() => {
            return Parties.find({}, {
                sort: this.sort
            });
        });
        this.greetnames = $meteor.collection(Greetnames);
        
        $meteor.subscribe('parties', {
            limit: Math.floor(this.perPage),
            skip: Math.floor((this.page - 1) * this.perPage),
            sort: this.sort 
        });
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