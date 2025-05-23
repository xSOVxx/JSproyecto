// app/services/libros.service.js
angular.module("proyectoApp").service("librosService", [
    "$http",
    "apiService",
    function ($http, apiService) {
        var service = this;
        
        // Datos locales de respaldo (se usan cuando la API está desconectada)
        var librosLocales = [
            {
                id: 1,
                titulo: "Matemáticas Avanzadas para Ingenieros",
                autor: "Erwin Kreyszig",
                descripcion: "Un libro fundamental para estudiantes de ingeniería, cubriendo cálculo vectorial, ecuaciones diferenciales, análisis complejo y álgebra lineal.",
                imagen: "assets/images/matematicas.jpg", 
                temas: ["Cálculo", "Álgebra", "Ecuaciones Diferenciales"],
                edicion: "10ma Edición",
                precio: 85,
            },
            {
                id: 2,
                titulo: "Física para Ciencias e Ingeniería",
                autor: "Raymond A. Serway",
                descripcion: "Una introducción exhaustiva a la física, con énfasis en aplicaciones prácticas y problemas resueltos.",
                imagen: "assets/images/fisica.jpg",
                temas: ["Mecánica", "Termodinámica", "Electromagnetismo"],
                edicion: "9na Edición",
                precio: 70,
            },
            {
                id: 3,
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
        var nextId = librosLocales.length + 1;
        
        // Método para obtener todos los libros
        service.getLibros = function () {
            if (apiService.isConnected) {
                var apiUrl = apiService.getApiUrl();
                return $http.get(apiUrl + "/libros")
                    .then(function(response) {
                        console.log("API: Libros obtenidos correctamente", response.data);
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
            id = parseInt(id, 10);
            
            if (apiService.isConnected) {
                var apiUrl = apiService.getApiUrl();
                return $http.get(apiUrl + "/libros/" + id)
                    .then(function(response) {
                        console.log("API: Libro obtenido por ID", response.data);
                        return response.data;
                    })
                    .catch(function(error) {
                        console.error("API: Error al obtener libro por ID", error);
                        // Buscar en datos locales como respaldo
                        var libro = librosLocales.find(function (libro) {
                            return libro.id === id;
                        });
                        return libro;
                    });
            } else {
                // Buscar en datos locales
                var libro = librosLocales.find(function (libro) {
                    return libro.id === id;
                });
                console.log("API desconectada: Buscando libro local por ID", id, libro);
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
                        return response.data;
                    })
                    .catch(function(error) {
                        console.error("API: Error al agregar libro", error);
                        // Respaldo: guardar localmente con ID autogenerado
                        nuevoLibro.id = nextId++;
                        librosLocales.push(nuevoLibro);
                        return nuevoLibro;
                    });
            } else {
                // Guardar en datos locales con ID autogenerado
                nuevoLibro.id = nextId++;
                librosLocales.push(nuevoLibro);
                console.log("API desconectada: Libro guardado localmente", nuevoLibro);
                return Promise.resolve(nuevoLibro);
            }
        };
        
        // Método para actualizar un libro existente
        service.actualizarLibro = function (libro) {
            if (apiService.isConnected) {
                var apiUrl = apiService.getApiUrl();
                return $http.put(apiUrl + "/libros/" + libro.id, libro)
                    .then(function(response) {
                        console.log("API: Libro actualizado correctamente", response.data);
                        return response.data;
                    })
                    .catch(function(error) {
                        console.error("API: Error actualizando libro", error);
                        // Respaldo: actualizar localmente
                        var index = librosLocales.findIndex(function(item) {
                            return item.id === libro.id;
                        });
                        if (index !== -1) {
                            librosLocales[index] = libro;
                        }
                        return libro;
                    });
            } else {
                // Actualizar en datos locales
                var index = librosLocales.findIndex(function(item) {
                    return item.id === libro.id;
                });
                if (index !== -1) {
                    librosLocales[index] = libro;
                    console.log("API desconectada: Libro actualizado localmente", libro);
                }
                return Promise.resolve(libro);
            }
        };
        
        // Método para eliminar un libro
        service.eliminarLibro = function (id) {
            id = parseInt(id, 10);
            
            if (apiService.isConnected) {
                var apiUrl = apiService.getApiUrl();
                return $http.delete(apiUrl + "/libros/" + id)
                    .then(function(response) {
                        console.log("API: Libro eliminado correctamente", response.data);
                        return true;
                    })
                    .catch(function(error) {
                        console.error("API: Error eliminando libro", error);
                        // Respaldo: eliminar localmente
                        var index = librosLocales.findIndex(function(item) {
                            return item.id === id;
                        });
                        if (index !== -1) {
                            librosLocales.splice(index, 1);
                        }
                        return true;
                    });
            } else {
                // Eliminar de datos locales
                var index = librosLocales.findIndex(function(item) {
                    return item.id === id;
                });
                if (index !== -1) {
                    librosLocales.splice(index, 1);
                    console.log("API desconectada: Libro eliminado localmente, ID:", id);
                }
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
                    return { url: 'assets/images/placeholder.jpg' }; // Imagen de placeholder si falla la subida
                }
            );
        };
        
        return service;
    }
]);