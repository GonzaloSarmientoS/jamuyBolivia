angular.module('starter.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.getNumber = function(num) {
      return new Array(num);   
  };
})
/*
.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Cochabamba', id: 1 },
    { title: 'Donde Comer', id: 2 },
    { title: 'Donde Dormir', id: 3 },
    { title: 'Ocio', id: 4 },
    { title: 'Vida Nocturna', id: 5 },
    { title: 'Compras', id: 6 }
  ];
})*/

.controller('PlaylistsCtrl', function($scope, $http) {
  /*$scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];*/

    $http.get('http://sms.obairlines.bo/JamuyBolivia/Api/Actividad/1').then(function(resp) {
        console.log(resp.data);
        $scope.playlists = resp.data;
      }, function(err) {
        console.error('ERR', err);
        // err.status will contain the status code
      });

})

.controller('PlaylistCtrl', function($scope, $stateParams, $http) {


    console.log($stateParams);
    $scope.nombre = $stateParams.Nombre;
    $scope.getTimes = function(n){
             return new Array(n);
        };
   $http.get('http://sms.obairlines.bo/JamuyBolivia/Api/Lugar/'+ $stateParams.playlistId).then(function(resp) {
        //$scope.conditions = resp.data.conditions;
        //$scope.lugar = resp.data;
        console.log(resp.data);
        $scope.playlists = resp.data;

      }, function(err) {
        console.error('ERR', err);
        // err.status will contain the status code
      });
})

.controller('MapaCtrl', function($scope, $stateParams,$cordovaGeolocation,$http) {
  console.log("Entrooooooo");
  //console.log($scope);
  $http.get('http://sms.obairlines.bo/JamuyBolivia/Api/Ubicacion'+ '/' + $stateParams.mapaId).then(function(resp) {
        console.log(resp.data);
        $scope.ubicacion = resp.data;

      var myLatlng = new google.maps.LatLng($scope.ubicacion.Latitud, $scope.ubicacion.Longitud);

      var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById("map"), mapOptions);

      var marker = new google.maps.Marker({
              position: new google.maps.LatLng($scope.ubicacion.Latitud, $scope.ubicacion.Longitud),
              map: map,
              title: "Mi locacion",
              options: { draggable: true }
      });

      var posOptions = {timeout: 10000, enableHighAccuracy: false};

    $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      //console.log(position);
      $scope.product.lat  = position.coords.latitude
      $scope.product.long = position.coords.longitude

      map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
          
      marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

    }, function(err) {
        console.log(err);
    });


    var watchOptions = {
      frequency : 1000,
      timeout : 3000,
      enableHighAccuracy: false // may cause errors if true
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(
      null,
      function(err) {
        console.log(err);
      },
      function(position) {
        console.log(position);
        $scope.product.lat  = position.coords.latitude;
        $scope.product.long = position.coords.longitude;

        marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

    });

    google.maps.event.addListener(marker, 'dragend', function() {
        $scope.$apply(function(){
          //Stop listening changes
          watch.clearWatch();
          var pos = marker.getPosition();
          console.log(pos);
          $scope.product.lat  = pos.A;
          $scope.product.long = pos.F;
        });
    });
      }, function(err) {
        console.error('ERR', err);
        // err.status will contain the status code
      });
      
});

/*
.controller('MapaCtrl', function($scope, $stateParams, $cordovaGeolocation,$http) {
      //console.log($stateParams.playlistId);
      
      $http.get('http://sms.obairlines.bo/JamuyBolivia/Api/Lugar'+ '/' + $stateParams.playlistId).then(function(resp) {
        console.log(resp.data);
        $scope.lugar = resp.data;
      }, function(err) {
        console.error('ERR', err);
        // err.status will contain the status code
      });

      //console.log($scope.get_lugar($stateParams.playlistId));
      console.log($scope.lugar);
      var myLatlng = new google.maps.LatLng($scope.lugar.Latitud, $scope.lugar.Longitud);

      var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById("map"), mapOptions);

      var marker = new google.maps.Marker({
              position: new google.maps.LatLng(-17.37, -66.15),
              map: map,
              title: "Mi locacion",
              options: { draggable: true }
      });

      var posOptions = {timeout: 10000, enableHighAccuracy: false};

    $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      console.log(position);
      $scope.product.lat  = position.coords.latitude
      $scope.product.long = position.coords.longitude

      map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
          
      marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

    }, function(err) {
        console.log(err);
    });


    var watchOptions = {
      frequency : 1000,
      timeout : 3000,
      enableHighAccuracy: false // may cause errors if true
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(
      null,
      function(err) {
        console.log(err);
      },
      function(position) {
        console.log(position);
        $scope.product.lat  = position.coords.latitude;
        $scope.product.long = position.coords.longitude;

        marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

    });

    google.maps.event.addListener(marker, 'dragend', function() {
        $scope.$apply(function(){
          //Stop listening changes
          watch.clearWatch();
          var pos = marker.getPosition();
          console.log(pos);
          $scope.product.lat  = pos.A;
          $scope.product.long = pos.F;
        });
    });
});*/
