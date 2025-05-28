angular.module("proyectoApp").controller("NavbarController", [
  "$scope", "$rootScope",
  function ($scope, $rootScope) {
    $scope.usuarioActual = $rootScope.usuarioActual;

    $rootScope.$watch("usuarioActual", function (nuevoValor) {
      $scope.usuarioActual = nuevoValor;
    });
  }
]);


