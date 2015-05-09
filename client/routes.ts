/// <reference path="tsd.d.ts" />

module socially {

    angular.module("socially")
        .config(['$urlRouterProvider', '$stateProvider', '$locationProvider', 
            ($urlRouterProvider: angular.ui.IUrlRouterProvider, $stateProvider: angular.ui.IStateProvider, $locationProvider: angular.ILocationProvider) =>{
        
                $locationProvider.html5Mode(true);
            
                $stateProvider
                  .state('parties', {
                    url: '/parties',
                    templateUrl: 'client/parties/views/parties-list.ng.html',
                    controller: 'PartiesListCtrl',
                    controllerAs: 'ctrl'
                  })
                  .state('partyDetails', {
                    url: '/parties/:partyId',
                    templateUrl: 'client/parties/views/party-details.ng.html',
                    controller: 'PartyDetailsCtrl',
                    controllerAs: 'ctrl'
                  });
            
                  $urlRouterProvider.otherwise("/parties");
    }]);
    
}