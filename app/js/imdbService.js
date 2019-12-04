var myApp= angular.module('myApp')
  .factory('imdbService', ["$http", function($http) {

    var runUserRequest = function(paramObj) {
      return $http({
        method: 'GET',
        url: "https://www.omdbapi.com/?t=&tomatoes=true&plot=full&apikey=526345a6",
        params: paramObj
      });
    };

    return {
      events: function(paramObj) {
        return runUserRequest(paramObj);
      }
    };
  }]);

