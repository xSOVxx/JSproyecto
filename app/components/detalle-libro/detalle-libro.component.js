angular.module("proyectoApp").controller("DetalleLibroController", [
    "$scope",
    "$routeParams",
    "librosService",
    "$location",
    function ($scope, $routeParams, librosService, $location) {
        var vm = this;
        
        // Inicializar propiedades
        vm.libro = null;
        vm.cargando = true;
        vm.error = null;
        vm.libroId = $routeParams.id;
        
        // Cargar detalles del libro
        vm.cargarDetalles = function() {
            vm.cargando = true;
            
            librosService.getLibroPorId(vm.libroId)
                .then(function(libro) {
                    vm.libro = libro;
                    vm.cargando = false;
                    
                    if (!libro) {
                        vm.error = "No se encontró el libro con ID: " + vm.libroId;
                    }
                })
                .catch(function(error) {
                    console.error("Error al cargar detalles del libro:", error);
                    vm.error = "Error al cargar los detalles del libro.";
                    vm.cargando = false;
                });
        };
        
        // Método para agregar al carrito (implementación básica)
        vm.agregarACarrito = function(libro) {
            // Aquí podrías implementar la lógica de carrito si lo deseas
            alert("Libro '" + libro.titulo + "' agregado al carrito.");
            // También podrías usar un servicio de carrito o localStorage
        };
        
        // Inicializar el controlador
        vm.cargarDetalles();
    }
]);