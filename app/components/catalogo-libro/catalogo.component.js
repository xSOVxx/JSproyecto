angular.module("proyectoApp").controller("catalogoController", [
    "$scope",
    "librosService",
    "apiService",
    "$timeout",
    function ($scope, librosService, apiService, $timeout) {
        var vm = this;
        vm.libros = [];
        vm.cargando = true;
        vm.busqueda = "";
        
        // Verificar estado de imagen
        $scope.checkImage = function(event) {
            var img = event.target;
            if (!img.complete || img.naturalHeight === 0) {
                img.src = 'assets/images/placeholder.jpg';
            }
        };
        
        // Cargar todos los libros
        vm.cargarLibros = function() {
            vm.cargando = true;
            librosService.getLibros()
                .then(function(data) {
                    vm.libros = data;
                    vm.cargando = false;
                })
                .catch(function(error) {
                    console.error("Error al cargar libros:", error);
                    vm.libros = [];
                    vm.cargando = false;
                });
        };
        
        // Buscar libros con debounce
        var timeoutPromise;
        vm.buscarConDebounce = function() {
            if (timeoutPromise) {
                $timeout.cancel(timeoutPromise);
            }
            timeoutPromise = $timeout(function() {
                vm.buscarLibros();
            }, 300); // Esperar 300ms después de la última pulsación
        };
        
        // Buscar libros
        vm.buscarLibros = function() {
            vm.cargando = true;
            librosService.buscarLibros(vm.busqueda)
                .then(function(data) {
                    vm.libros = data;
                    vm.cargando = false;
                })
                .catch(function(error) {
                    console.error("Error al buscar libros:", error);
                    vm.libros = [];
                    vm.cargando = false;
                });
        };
        
        // Observar cambios en la conexión API
        $scope.$watch(function() {
            return apiService.isConnected;
        }, function(newValue, oldValue) {
            if (newValue !== oldValue) {
                console.log("Estado de API cambió, recargando libros...");
                vm.cargarLibros();
            }
        });
        
        // Inicializar
        vm.cargarLibros();
    }
]);