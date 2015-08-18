angular.module('myApp').controller("homeCtrl", function($scope, harmonized){

  function makeItGangsta(word) {
    var newWord = word.replace(/[Aa]/g, '4');
    newWord = newWord.replace(/[Ss]/g, '$');
    newWord = newWord.replace(/[Jj]/g, '¥');
    newWord = newWord.replace(/[Ee]/g, '3');
    newWord = newWord + ', bitch!';
    return newWord;
  }

  harmonized.build();

  $scope.data = harmonized.createViewModel('people');

  $scope.gangstaData = harmonized.createViewModel('people', function(item) {
    var newItem = _.clone(item);
    newItem.firstname = makeItGangsta(item.firstname);
    newItem.lastname = makeItGangsta(item.lastname);
    return newItem;
  });

  $scope.activlyEdited = $scope.data.new();

  $scope.editEntry = function (entry) {
    if ($scope.activlyEdited !== undefined) {
      //$scope.activlyEdited.reset();
    }

    if (entry === undefined) {
      entry = $scope.data.new();
    }
    $scope.activlyEdited = entry;
  };

  $scope.entryIsActive = function (entry) {
    return $scope.activlyEdited === entry;
  }


  $scope.deleteEntry = function (entry) {
    if ($scope.activlyEdited === entry) {
      $scope.activlyEdited = $scope.data.new();
    }
    entry.delete();
  };


  $scope.saveCurrentEntry = function () {
    $scope.activlyEdited.save();
    $scope.activlyEdited = $scope.data.new();
  };

});
