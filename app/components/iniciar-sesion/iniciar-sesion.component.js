angular.module("proyectoApp").controller("LoginController", [
  "$scope",
  "$rootScope",
  "$location",
  function ($scope, $rootScope, $location) {
    $scope.usuario = { correo: "", contrasena: "" };

    const usuarios = [
      { correo: "admin@libro.com", contrasena: "admin123", rol: "admin" },
      { correo: "usuario@libro.com", contrasena: "usuario123", rol: "usuario" }
    ];

    $scope.iniciarSesion = function () {
      const user = usuarios.find(
        u => u.correo === $scope.usuario.correo && u.contrasena === $scope.usuario.contrasena
      );

      if (user) {
        $rootScope.usuarioActual = user;
        alert("Sesión iniciada como " + user.rol);
        $location.path("/catalogo");
      } else {
        alert("Credenciales inválidas");
      }
    };
  }
]);



