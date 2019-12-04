var myApp = angular.module('myApp', ['ui.bootstrap'])

myApp.directive('starRating', function () {
  return {
    restrict: 'A',
    template: '<ul class="rating">' +
      '<li ng-repeat="star in stars" ng-class="star">' +
      '\u2605' +
      '</li>' +
      '</ul>',
    scope: {
      ratingValue: '=',
      max: '='
    },
    link: function (scope, elem, attrs) {
      scope.stars = [];
      for (var i = 0; i < scope.max; i++) {
        scope.stars.push({
          filled: i < scope.ratingValue
        });
      }
    }
  }
});

myApp.directive('starRatingDynamic', function () {
  return {
    restrict: 'A',
    template: '<ul class="rating">' +
      '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
      '\u2605' +
      '</li>' +
      '</ul>',
    scope: {
      ratingValue: '=',
      max: '=',
      onRatingSelected: '&'
    },
    link: function (scope, elem, attrs) {

      var updateStars = function () {
        scope.stars = [];
        for (var i = 0; i < scope.max; i++) {
          scope.stars.push({
            filled: i < scope.ratingValue
          });
        }
      };

      scope.toggle = function (index) {
        scope.ratingValue = index + 1;
        scope.onRatingSelected({
          rating: index + 1
        });
      };

      scope.$watch('ratingValue', function (oldVal, newVal) {
        if (newVal) {
          updateStars();
        }
      });
    }
  }
});

myApp.controller('MovieController', ["$scope", "imdbService", function ($scope, imdbService) {
  var paramObj = {};
  $scope.posters = [];
  $scope.submitted = false;
  $scope.putLoader = false;
  var pendingTask;
  $scope.onImageClick = function (poster) {
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    $scope.modalTitle = poster.Title;
    $scope.modalYear = poster.Year;

    $scope.modalPlot = poster.Plot;
    modal.style.display = "block";
    modalImg.src = poster.Poster;
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      modal.style.display = "none";
    }
    $scope.ratings = [];
    $scope.ratings[0] = {};
    $scope.ratingsDynamic = [];
    $scope.ratingsDynamic[0] = {};

    $scope.rating = 0;
    $scope.ratings = [{

      max: 10
    }];
    $scope.ratingsDynamic = [{
      max: 10
    }];

    $scope.ratings[0].current = parseInt(poster.imdbRating);
    $scope.ratingsDynamic[0].current = 1;
  }

  $scope.getMovieData = function (movieID) {
    $scope.putLoader = true;
    paramObj = {
      i: movieID

    };
    fetchSelectedMovieData(paramObj);
  };


  $scope.fetchDetails = function () {
    if ($scope.omdbSearch.$valid) {
      $scope.putLoader = true;
      $scope.details = null;
      $scope.posters = [];
      if ($scope.searchBy == 'Title') {
        paramObj = {
          s: $scope.search,
        };
        if ($scope.Year != undefined && $scope.Year != '') {
          paramObj.y = $scope.Year;
        }
        if ($scope.Type != undefined && $scope.Type != '') {
          paramObj.type = $scope.Type;
        }
      }
      else {
        paramObj = {
          i: $scope.search

        };
        if ($scope.Year != undefined && $scope.Year != '') {
          paramObj.y = $scope.Year;
        }
        if ($scope.Type != undefined && $scope.Type != '') {
          paramObj.type = $scope.Year;
        }
      }
      fetch(paramObj);
    } else {
      $scope.submitted = true;
    }

  }


  $scope.posters = [];
  function fetch(paramObj) {


    imdbService.events(paramObj).success(function (resp) {
    $scope.details = resp; console.log(resp);
      if (resp.Response == 'True') {
        for (var i = 0; i < resp.Search.length; i++) {
          if (resp.Search[i].Poster != 'N/A')
            $scope.posters.push(resp.Search[i]);

        }
      }
      console.log($scope.posters);
      $scope.putLoader = false;

    });

  }

  $scope.selectedMovieData = [];
  function fetchSelectedMovieData(paramObj) {
    imdbService.events(paramObj).success(function (resp) {
    $scope.details = resp; console.log(resp); $scope.onImageClick(resp);
      $scope.putLoader = false;
    });
  }

  
}]);
