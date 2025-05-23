// app/services/api.service.js
angular.module("proyectoApp").service("apiService", [
    "$http",
    "$rootScope",
    function ($http, $rootScope) {
        var service = this;
        
        // URL de la API sin prefijo /api
        var apiUrl = "http://localhost:3000";
        
        service.isConnected = false;
        service.port = 3000;
        service.lastError = null;

        // Verificar la conexión a la API con diagnóstico detallado
        service.checkConnection = function () {
            console.log("Verificando conexión a la API:", apiUrl + "/libros"); 
            
            return $http({
                method: 'GET',
                url: apiUrl + "/libros", 
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(function (response) {
                console.log("✅ Conexión exitosa a la API:", response.data);
                service.isConnected = true;
                service.lastError = null;
                
                // Forzar actualización de la interfaz si es necesario
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
                
                return response.data;
            })
            .catch(function (error) {
                console.error("❌ Error de conexión con la API REST:", error);
                service.isConnected = false;
                service.lastError = error;
                
                // Forzar actualización de la interfaz si es necesario
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
                
                return false;
            });
        };

        // Exponer la URL de la API para uso en otros servicios
        service.getApiUrl = function() {
            return apiUrl;
        };

        // Verificar la conexión inmediatamente al cargar
        setTimeout(function() {
            service.checkConnection();
        }, 1000);

        return service;
    }
]);

// Controlador para mostrar el estado de la API
angular.module("proyectoApp").controller("ApiStatusController", [ 
    "apiService",
    function (apiService) {
        var vm = this;
        
        // Propiedades observadas
        Object.defineProperty(vm, 'isConnected', {
            get: function() { return apiService.isConnected; }
        });
        
        Object.defineProperty(vm, 'port', {
            get: function() { return apiService.port; }
        });
    }
]);