// Definir el módulo principal con ngRoute como dependencia
angular.module("proyectoApp", ["ngRoute"]) 
    .config([
        "$routeProvider",
        "$locationProvider",
        "$httpProvider",
        function ($routeProvider, $locationProvider, $httpProvider) {
            // Configuración de rutas
            $routeProvider
                .when("/", {
                    templateUrl: "app/components/lista-libros/lista-libros.component.html", 
                    controller: "ListaLibrosController", 
                    controllerAs: "vm",
                })
                .when("/detalle/:id", {
                    templateUrl: "app/components/detalle-libro/detalle-libro.component.html", 
                    controller: "DetalleLibroController", 
                    controllerAs: "vm",
                })
                .when("/nuevo", {
                    templateUrl: "app/components/nuevo-libro/nuevo-libro.component.html", 
                    controller: "NuevoLibroController", 
                    controllerAs: "vm",
                })
                .otherwise({
                    redirectTo: "/",
                });

            // Usar modo hash para navegación (crucial para entorno portable)
            $locationProvider.hashPrefix("");
            $locationProvider.html5Mode(false);

            // Configurar cabeceras para CORS
            $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
            
            console.log("Rutas configuradas");
        },
    ])
    .run(["$rootScope", "apiService", function($rootScope, apiService) {
        // Verificar la conexión con la API al inicio
        setTimeout(function() {
            apiService.checkConnection();
        }, 1000);

        // Manejar transiciones entre rutas
        $rootScope.loading = false;
        
        $rootScope.$on('$routeChangeStart', function() {
            $rootScope.loading = true;
        });

        $rootScope.$on('$routeChangeSuccess', function() {
            $rootScope.loading = false;
        });

        $rootScope.$on('$routeChangeError', function() {
            $rootScope.loading = false;
        });
    }]);