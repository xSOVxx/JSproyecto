angular.module("proyectoApp").service("librosService", [
    "$http",
    "apiService",
    function ($http, apiService) {
        var service = this;
        
        // Datos locales de respaldo (se usan cuando la API está desconectada)
        // IMPORTANT: Ensure local IDs are strings to match JSON Server behavior
        var librosLocales = [
            {
                id: "1", // Changed to string
                titulo: "Matemáticas Avanzadas para Ingenieros",
                autor: "Erwin Kreyszig",
                descripcion: "Un libro fundamental para estudiantes de ingeniería, cubriendo cálculo vectorial, ecuaciones diferenciales, análisis complejo y álgebra lineal.",
                imagen: "assets/images/matematicas.jpg", 
                temas: ["Cálculo", "Álgebra", "Ecuaciones Diferenciales"],
                edicion: "10ma Edición",
                precio: 85,
            },
            {
                id: "2", // Changed to string
                titulo: "Física para Ciencias e Ingeniería",
                autor: "Raymond A. Serway",
                descripcion: "Una introducción exhaustiva a la física, con énfasis en aplicaciones prácticas y problemas resueltas.",
                imagen: "assets/images/fisica.jpg",
                temas: ["Mecánica", "Termodinámica", "Electromagnetismo"],
                edicion: "9na Edición",
                precio: 70,
            },
            {
                id: "3", // Changed to string
                titulo: "Programación en C++",
                autor: "Bjarne Stroustrup",
                descripcion: "El libro definitivo para aprender C++ del creador del lenguaje. Ideal para principiantes y programadores experimentados.",
                imagen: "assets/images/cpp.jpg",
                temas: ["Programación Orientada a Objetos", "Algoritmos", "Estructuras de Datos"],
                edicion: "4ta Edición",
                precio: 60,
            },
        ];
        
        // ID para el próximo libro en modo local
        // Find the highest current ID in librosLocales (as a number) and increment
        var maxId = 0;
        librosLocales.forEach(function(libro) {
            maxId = Math.max(maxId, parseInt(libro.id));
        });
        var nextId = maxId + 1; // Will be a number, converted to string when assigned

        // Añadir caché de resultados
        var cachedLibros = null;
        var lastCacheTime = 0;
        var CACHE_DURATION = 30000; // 30 segundos
        
        // Añadir método para invalidar caché (usado cuando se modifica un libro)
        service.invalidateCache = function() {
            console.log("Caché de libros invalidada.");
            cachedLibros = null;
            lastCacheTime = 0;
        };

        // Método para obtener todos los libros
        service.getLibros = function () {
            // Usar caché si está disponible y es reciente
            var now = Date.now();
            if (cachedLibros && (now - lastCacheTime < CACHE_DURATION)) {
                console.log("Usando caché de libros");
                return Promise.resolve(cachedLibros);
            }
            
            if (apiService.isConnected) {
                var apiUrl = apiService.getApiUrl();
                return $http.get(apiUrl + "/libros")
                    .then(function(response) {
                        console.log("API: Libros obtenidos correctamente", response.data);
                        // Actualizar caché
                        cachedLibros = response.data;
                        lastCacheTime = Date.now();
                        return response.data;
                    })
                    .catch(function(error) {
                        console.error("API: Error al obtener libros", error);
                        // Usar datos locales si falla la API
                        console.log("Usando datos locales como respaldo");
                        return librosLocales;
                    });
            } else {
                // Usar datos locales
                console.log("API desconectada: Usando datos locales");
                return Promise.resolve(librosLocales);
            }
        };
        
        // Método para obtener un libro por su ID
        service.getLibroPorId = function (id) {
            // Ensure the ID passed to find is treated as a string for comparison
            var idToFind = String(id); 
            
            if (apiService.isConnected) {
                var apiUrl = apiService.getApiUrl();
                return $http.get(apiUrl + "/libros/" + idToFind) // Send string ID to API
                    .then(function(response) {
                        console.log("API: Libro obtenido por ID", response.data);
                        return response.data;
                    })
                    .catch(function(error) {
                        console.error("API: Error al obtener libro por ID", error);
                        // Buscar en datos locales como respaldo
                        var libro = librosLocales.find(function (libro) {
                            return String(libro.id) === idToFind; // Compare as strings
                        });
                        return libro;
                    });
            } else {
                // Buscar en datos locales
                var libro = librosLocales.find(function (libro) {
                    return String(libro.id) === idToFind; // Compare as strings
                });
                console.log("API desconectada: Buscando libro local por ID", idToFind, libro);
                return Promise.resolve(libro);
            }
        };
        
        // Método para agregar un nuevo libro
        service.agregarLibro = function (nuevoLibro) {
            if (apiService.isConnected) {
                var apiUrl = apiService.getApiUrl();
                return $http.post(apiUrl + "/libros", nuevoLibro)
                    .then(function(response) {
                        console.log("API: Libro agregado correctamente", response.data);
                        // IMPORTANT: Add the API-assigned object (which has a string ID) to local data
                        librosLocales.push(response.data);
                        service.invalidateCache(); // Invalidate cache to ensure UI reflects changes
                        return response.data;
                    })
                    .catch(function(error) {
                        console.error("API: Error al agregar libro", error);
                        // Respaldo: guardar localmente con ID autogenerado
                        nuevoLibro.id = String(nextId++); // IMPORTANT: Convert to string
                        librosLocales.push(nuevoLibro);
                        service.invalidateCache(); // Invalidate cache even for local adds
                        return nuevoLibro;
                    });
            } else {
                // Guardar en datos locales con ID autogenerado
                nuevoLibro.id = String(nextId++); // IMPORTANT: Convert to string
                librosLocales.push(nuevoLibro);
                console.log("API desconectada: Libro guardado localmente", nuevoLibro);
                service.invalidateCache(); // Invalidate cache for local adds
                return Promise.resolve(nuevoLibro);
            }
        };
        
        // Método para actualizar un libro existente
        service.actualizarLibro = function (libro) {
            var libroId = String(libro.id); // Ensure ID is string for API call and local lookup
            if (apiService.isConnected) {
                var apiUrl = apiService.getApiUrl();
                return $http.put(apiUrl + "/libros/" + libroId, libro)
                    .then(function(response) {
                        console.log("API: Libro actualizado correctamente", response.data);
                        // Update the local data for consistency
                        var index = librosLocales.findIndex(function(item) {
                            return String(item.id) === libroId;
                        });
                        if (index !== -1) {
                            librosLocales[index] = response.data; // Use updated data from API response
                        }
                        service.invalidateCache(); // Invalidate cache
                        return response.data;
                    })
                    .catch(function(error) {
                        console.error("API: Error actualizando libro", error);
                        // Respaldo: actualizar localmente
                        var index = librosLocales.findIndex(function(item) {
                            return String(item.id) === libroId; // Compare as strings
                        });
                        if (index !== -1) {
                            librosLocales[index] = libro;
                        }
                        service.invalidateCache(); // Invalidate cache
                        return libro;
                    });
            } else {
                // Actualizar en datos locales
                var index = librosLocales.findIndex(function(item) {
                    return String(item.id) === libroId; // Compare as strings
                });
                if (index !== -1) {
                    librosLocales[index] = libro;
                    console.log("API desconectada: Libro actualizado localmente", libro);
                }
                service.invalidateCache(); // Invalidate cache
                return Promise.resolve(libro);
            }
        };
        
        // Método para eliminar un libro
        service.eliminarLibro = function (id) {
            var idToDelete = String(id); // Ensure ID is string for API call and local lookup
            
            if (apiService.isConnected) {
                var apiUrl = apiService.getApiUrl();
                return $http.delete(apiUrl + "/libros/" + idToDelete)
                    .then(function(response) {
                        console.log("API: Libro eliminado correctamente", response.data);
                        // Remove from local data for consistency
                        var index = librosLocales.findIndex(function(item) {
                            return String(item.id) === idToDelete;
                        });
                        if (index !== -1) {
                            librosLocales.splice(index, 1);
                        }
                        service.invalidateCache(); // Invalidate cache
                        return true;
                    })
                    .catch(function(error) {
                        console.error("API: Error eliminando libro", error);
                        // Respaldo: eliminar localmente
                        var index = librosLocales.findIndex(function(item) {
                            return String(item.id) === idToDelete; // Compare as strings
                        });
                        if (index !== -1) {
                            librosLocales.splice(index, 1);
                        }
                        service.invalidateCache(); // Invalidate cache
                        return true;
                    });
            } else {
                // Eliminar de datos locales
                var index = librosLocales.findIndex(function(item) {
                    return String(item.id) === idToDelete; // Compare as strings
                });
                if (index !== -1) {
                    librosLocales.splice(index, 1);
                    console.log("API desconectada: Libro eliminado localmente, ID:", idToDelete);
                }
                service.invalidateCache(); // Invalidate cache
                return Promise.resolve(true);
            }
        };
        
        // Método para buscar libros por término
        service.buscarLibros = function(termino) {
            if (!termino) {
                return service.getLibros();
            }
            
            if (apiService.isConnected) {
                var apiUrl = apiService.getApiUrl();
                return $http.get(apiUrl + "/libros?q=" + termino)
                    .then(function(response) {
                        console.log("API: Búsqueda realizada", response.data);
                        return response.data;
                    })
                    .catch(function(error) {
                        console.error("API: Error en búsqueda", error);
                        // Respaldo: buscar localmente
                        return librosLocales.filter(function(libro) {
                            return libro.titulo.toLowerCase().includes(termino.toLowerCase()) ||
                                libro.autor.toLowerCase().includes(termino.toLowerCase());
                        });
                    });
            } else {
                // Buscar en datos locales
                var resultados = librosLocales.filter(function(libro) {
                    return libro.titulo.toLowerCase().includes(termino.toLowerCase()) ||
                        libro.autor.toLowerCase().includes(termino.toLowerCase());
                });
                console.log("API desconectada: Búsqueda local por término:", termino, resultados);
                return Promise.resolve(resultados);
            }
        };
        
        // Método para subir una imagen
        service.subirImagen = function (file) {
            if (!apiService.isConnected) {
                console.warn("API desconectada: No se puede subir la imagen");
                return Promise.resolve({ url: 'assets/images/placeholder.jpg' }); // Imagen de placeholder local
            }
            
            var formData = new FormData();
            formData.append('imagen', file);
            
            var apiUrl = apiService.getApiUrl();
            return $http.post(apiUrl + "/upload", formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(
                function(response) {
                    console.log("API: Imagen subida con éxito", response.data);
                    return response.data;
                },
                function(error) {
                    console.error("API: Error subiendo imagen", error);
                    // Return a placeholder URL if API upload fails
                    return { url: 'assets/images/placeholder.jpg' }; 
                }
            );
        };
        
        return service;
    }
]);