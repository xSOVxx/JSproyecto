// NUEVO-LIBRO.COMPONENT.JS (actualizado con modal de edición)

angular.module("proyectoApp").controller("NuevoLibroController", [
  "librosService",
  "$location",
  function (librosService, $location) {
    var vm = this;

    // --- Formulario de nuevo libro ---
    vm.nuevoLibro = {
      titulo: "",
      autor: "",
      descripcion: "",
      imagen: "assets/images/placeholder.jpg",
      temas: [],
      edicion: "",
      precio: null,
    };

    vm.temasInput = "";
    vm.cargando = false;
    vm.successMessage = "";
    vm.errorMessage = "";

    // --- Listado de libros ---
    vm.libros = [];
    vm.cargandoLibros = false;

    // --- Variables para el modal de edición ---
    vm.libroEditar = {};
    vm.temasEditar = "";

    // Abrir modal y cargar datos del libro seleccionado para editar
    vm.editarLibro = function (libro) {
      vm.libroEditar = angular.copy(libro);
      vm.temasEditar = libro.temas ? libro.temas.join(", ") : "";
      var modal = new bootstrap.Modal(document.getElementById("editarModal"));
      modal.show();
    };

    // Guardar cambios desde el modal de edición
    vm.guardarEdicion = function () {
      vm.libroEditar.temas = vm.temasEditar.split(",").map(t => t.trim()).filter(t => t);

      librosService.actualizarLibro(vm.libroEditar)
        .then(function () {
          vm.successMessage = "Libro actualizado exitosamente.";
          vm.cargarLibros();

          var modal = bootstrap.Modal.getInstance(document.getElementById("editarModal"));
          modal.hide();

          setTimeout(() => {
            vm.successMessage = "";
            vm.$apply();
          }, 3000);
        })
        .catch(function () {
          vm.errorMessage = "Error al actualizar el libro.";
        });
    };

    // Manejo de archivos para el formulario de nuevo libro
    vm.onFileSelect = function (files) {
      if (files.length > 0) {
        var file = files[0];
        vm.selectedFile = file;
        var reader = new FileReader();
        reader.onload = function (e) {
          vm.nuevoLibro.imagen = e.target.result;
          vm.$apply();
        };
        reader.readAsDataURL(file);
      } else {
        vm.selectedFile = null;
        vm.nuevoLibro.imagen = "assets/images/placeholder.jpg";
        vm.$apply();
      }
    };

    // Enviar formulario de nuevo libro
    vm.submitForm = function () {
      vm.cargando = true;
      vm.successMessage = "";
      vm.errorMessage = "";

      if (vm.temasInput) {
        vm.nuevoLibro.temas = vm.temasInput.split(",").map(function (tema) {
          return tema.trim();
        }).filter(function (tema) {
          return tema !== "";
        });
      } else {
        vm.nuevoLibro.temas = [];
      }

      var uploadPromise;
      if (vm.selectedFile) {
        uploadPromise = librosService.subirImagen(vm.selectedFile);
      } else {
        uploadPromise = Promise.resolve({ url: vm.nuevoLibro.imagen });
      }

      uploadPromise
        .then(function (response) {
          vm.nuevoLibro.imagen = response.url || vm.nuevoLibro.imagen;
          return librosService.agregarLibro(vm.nuevoLibro);
        })
        .then(function (libroAgregado) {
          console.log("Libro agregado:", libroAgregado);
          vm.successMessage = "Libro '" + libroAgregado.titulo + "' agregado exitosamente!";
          vm.nuevoLibro = {
            titulo: "",
            autor: "",
            descripcion: "",
            imagen: "assets/images/placeholder.jpg",
            temas: [],
            edicion: "",
            precio: null,
          };
          vm.temasInput = "";
          vm.selectedFile = null;
          librosService.invalidateCache();
          vm.cargarLibros();
          setTimeout(function () { vm.successMessage = ""; vm.$apply(); }, 3000);
        })
        .catch(function (error) {
          console.error("Error al agregar libro:", error);
          vm.errorMessage = "Error al agregar el libro. Por favor, inténtalo de nuevo.";
          setTimeout(function () { vm.errorMessage = ""; vm.$apply(); }, 3000);
        })
        .finally(function () {
          vm.cargando = false;
        });
    };

    // Eliminar un libro de la lista
    vm.eliminarLibro = function (libro) {
      if (confirm("¿Estás seguro de que quieres eliminar el libro '" + libro.titulo + "'?")) {
        libro.isDeleting = true;
        librosService.eliminarLibro(libro.id)
          .then(function () {
            vm.successMessage = "Libro '" + libro.titulo + "' eliminado exitosamente.";
            vm.libros = vm.libros.filter(function (item) {
              return item.id !== libro.id;
            });
            libro.isDeleting = false;
            setTimeout(function () { vm.successMessage = ""; vm.$apply(); }, 3000);
          })
          .catch(function (error) {
            console.error("Error al eliminar libro:", error);
            vm.errorMessage = "Error al eliminar el libro '" + libro.titulo + "'.";
            libro.isDeleting = false;
            setTimeout(function () { vm.errorMessage = ""; vm.$apply(); }, 3000);
          });
      }
    };

    // Cancelar y volver al catálogo
    vm.cancelForm = function () {
      $location.path("/catalogo");
    };

    // Cargar todos los libros al iniciar
    vm.cargarLibros = function () {
      vm.cargandoLibros = true;
      librosService.getLibros()
        .then(function (data) {
          vm.libros = data;
          vm.cargandoLibros = false;
        })
        .catch(function (error) {
          console.error("Error al cargar los libros:", error);
          vm.errorMessage = "Error al cargar la lista de libros.";
          vm.cargandoLibros = false;
        });
    };

    vm.cargarLibros();
  }
]);
