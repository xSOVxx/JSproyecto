// app/controllers/libros.controller.js
angular.module("proyectoApp").controller("LibrosController", [
    "$scope",
    "librosService",
    function ($scope, librosService) {
        $scope.libros = [];
        $scope.terminoBusqueda = "";

        // Cargar libros al inicio
        librosService.getLibros().then(function (data) {
            $scope.libros = data;
        });

        // Buscar libros
        $scope.buscar = function () {
            librosService.buscarLibros($scope.terminoBusqueda).then(function (resultados) {
                $scope.libros = resultados;
            });
        };

        // Eliminar libro
        $scope.eliminar = function (id) {
            if (confirm("¿Estás seguro de que deseas eliminar este libro?")) {
                librosService.eliminarLibro(id).then(function () {
                    // Refrescar lista
                    librosService.getLibros().then(function (data) {
                        $scope.libros = data;
                    });
                });
            }
        };
    }
]);
