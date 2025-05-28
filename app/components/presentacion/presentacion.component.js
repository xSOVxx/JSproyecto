// Componente de presentación para mostrar introducción basada en el temario de Angular
angular.module('proyectoApp').component('presentacion', {
    templateUrl: 'app/components/presentacion/presentacion.component.html',
    controller: function PresentacionController() {
        this.temarioAngular = [
            'Acceso rápido y sencillo al catálogo de libros disponibles.',
            'Registro de nuevos libros para mantener la colección actualizada.',
            'Búsqueda eficiente por título, autor o tema.',
            'Visualización de detalles completos de cada libro.',
            'Gestión de usuarios y control de acceso para administradores.',
            'Interfaz moderna y responsiva gracias a Bootstrap.',
            'Consumo de servicios REST para datos en tiempo real.'
        ];
    },
    controllerAs: 'vm'
});