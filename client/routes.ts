/// <reference path="tsd.d.ts" />

module socially {

    angular.module("socially")
    //Chack with peter if the types are correct!!!!
        .run(["$rootScope", "$state", ($rootScope: angular.IRootScopeService, $state: angular.ui.IStateService) => {
              $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
                // We can catch the error thrown when the $requireUser promise is rejected
                // and redirect the user back to the main page
                if (error === "AUTH_REQUIRED") {
                  $state.go('parties');
                }
              });
            }])
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
                    controllerAs: 'ctrl',
                    //Checks if the user is logged in, otherwise he's not able to access party details
                    resolve: {
                        "currentUser": ["$meteor", ($meteor) => {
                            return $meteor.requireUser();
                        }]
                    }
                  });
            
                  $urlRouterProvider.otherwise("/parties");
    }]);
    
}