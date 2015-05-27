/// <reference path="../../tsd.d.ts" />

//Controller is simply a constructor function
//Controller estabishes a binding between the model and the view

module socially {
 
    interface ICountsAngularMeteorObject extends CountsContent, angular.meteor.AngularMeteorObject<CountsContent> {}
    
    interface ILeafletData {
        getMap(mapId: string): ng.IPromise<L.Map>;
    }
    
    class PartiesListCtrl {
        
        public leaflet = {
            defaults: {
                tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                maxZoom: 14,
                path: {
                    weight: 10,
                    color: '#800000',
                    opacity: 1
                },
            },
            center: {
                lat: 51.505,
                lng: -0.09,
                zoom: 8
            },
            controls: {
                draw: {}    
            }
        }
        
        public parties: angular.meteor.AngularMeteorCollection<IParty>;
        public greetnames: angular.meteor.AngularMeteorCollection<IGreetname>;
        public page = 1;
        public perPage = 3;
        public sort = { name: 1 };
        public orderProperty = 1;
        public partiesCount: ICountsAngularMeteorObject;
        public users: angular.meteor.AngularMeteorCollection<Meteor.User>;
    //    public map: any;
        
        private leafletMap: L.Map;
            
        constructor($scope: ng.meteor.IScope, private $meteor: ng.meteor.IMeteorService, private $rootScope: ng.meteor.IRootScopeService, $state: ng.ui.IStateService, leafletData: ILeafletData) {
            
            this.parties = $meteor.collection(() => {
                return Parties.find({}, {
                    sort: $scope.getReactively('ctrl.sort')
                });
            });
            this.greetnames = $meteor.collection(Greetnames);
            
            $meteor.autorun($scope, () => {
                var page: any = $scope.getReactively('ctrl.page');
                var perPage: any = $scope.getReactively('ctrl.perPage');
                var sort: any = $scope.getReactively('ctrl.sort');
                var search: any = $scope.getReactively('ctrl.search');
                
                $meteor.subscribe('parties', { 
                    limit: Math.floor(perPage),
                    skip: Math.floor((page - 1) * perPage),
                    sort: sort 
                    }, search).then(() => {
                        this.partiesCount = <ICountsAngularMeteorObject>$meteor.object(Counts, 'numberOfParties', false);
                        
                        this.parties.forEach( (party) => {
                            party.onClicked = () => {
                                $state.go( 'partyDetails', { partyId: party._id});
                            };
                        });
                        //Google Maps
    //                    this.map = {
    //                        center: {
    //                            latitude: 45,
    //                            longitude: -73
    //                        },
    //                        zoom: 8
    //                    };
                });
            });
            $scope.$watch('ctrl.orderProperty', this.updateSorting.bind(this));
            this.users = $meteor.collection(Meteor.users, false).subscribe('users');
            
            //Leaflet map
            leafletData.getMap('testMap').then(map => {  
                this.leafletMap = map;
                this.leafletMap.setView([51.0333, 13.7333], 15);
//                var circle = L.circle([51.0333, 13.7333], 10, {color: 'blue', fill: true});
//                var infos = L.layerGroup([circle]);
//                this.leafletMap.addLayer(infos);
                
                // Initialise the FeatureGroup to store editable layers
                var editableLayers = new L.FeatureGroup();
                this.leafletMap.addLayer(editableLayers);
                
                //Marker options
                var MyCustomMarker = L.Icon.extend({
                    options: {
                        shadowUrl: null,
                        iconAnchor: new L.Point(12, 12),
                        iconSize: new L.Point(36, 36),
                        iconUrl: 'https://cdn3.iconfinder.com/data/icons/shopping-and-market/512/pin_marker_location_mark_navigation_flat_icon-256.png'
                    }
                });
                
                //Draw options
                var options = {
                    position: 'topright',
                    draw: {
                        polyline: {
                            shapeOptions: {
                                color: '#f357a1',
                                weight: 10
                            }
                        },
                        polygon: {
                            allowIntersection: false, // Restricts shapes to simple polygons
                            drawError: {
                                color: '#e1e100', // Color the shape will turn when intersects
                                message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                            },
                            shapeOptions: {
                                color: '#bada55'
                            }
                        },
                        circle: false, // Turns off this drawing tool
                        rectangle: {
                            shapeOptions: {
                                clickable: false
                            }
                        },
                        marker: {
                            icon: new MyCustomMarker()
                        }
                    },
                    edit: {
                        featureGroup: editableLayers, //REQUIRED!!
                        remove: false
                    }
                };

                // Initialise the draw control and pass it the FeatureGroup of editable layers
                var drawControl = new L.Control.Draw(options);
                this.leafletMap.addControl(drawControl);

                this.leafletMap.on('draw:created', (e: L.DrawEvents.Created) => {
                    if (e.layerType === 'marker') {
                        var marker = <L.Marker>e.layer;
                        // Do marker specific actions
                        marker.bindPopup('A popup!');
                    }
                   // Do whatever else you need to. (save to db, add to map etc)
                    editableLayers.addLayer(e.layer);
                });
                
                this.leafletMap.on('draw:edited', (e: L.DrawEvents.Edited) => {
                        e.layers.eachLayer(function (layer) {
                            //do whatever you want, most likely save back to db
                        });
                });
            });            
        }
        
        public getUserById (userId: string){
            return Meteor.users.findOne(userId);
        }
        
        public removeParty(party: IParty){
            this.parties.remove(party);
        }
        
        public removeAll(){
            this.parties.remove();
        }
        
        public pageChanged(newPage: number) {
            this.page = newPage;
        }
        
        public updateSorting() {
            if (this.orderProperty) {
                this.sort = {name: +this.orderProperty};
            }
        }
        
        public creator(party: IParty): string|Meteor.User{
            if(!party)
                return null;
            var owner = this.getUserById(party.owner);
            if(!owner)
                return "nobody";
                
            if ( this.$rootScope.currentUser )
               if( this.$rootScope.currentUser._id )
                   if (owner._id === this.$rootScope.currentUser._id)
                        return "me";
            // else
            return owner;
        }
        
        public rsvp(partyId: string, rsvp: string){
            this.$meteor.call('rsvp', partyId, rsvp).then(
               (data) => {
                   console.log('success responding', data);
               },
               (err) => {
                   console.log('failed', err);
               }
            );
        }
        
        public outstandingInvitations(party: IParty) {
            return _.filter ( this.users, (user) => {
                return ( _.contains ( party.invited, user._id ) && !_.findWhere( party.rsvps, { user: user._id }));
            });
        }
        
    
    } 
            
    angular.module("socially")
        .controller("PartiesListCtrl", ['$scope', '$meteor', '$rootScope', '$state', 'leafletData', PartiesListCtrl]);
    
}