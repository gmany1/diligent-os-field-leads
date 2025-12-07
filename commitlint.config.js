module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',     // Nueva funcionalidad
                'fix',      // Corrección de bugs
                'docs',     // Documentación
                'style',    // Formato, sin cambios de código
                'refactor', // Refactorización
                'perf',     // Mejoras de rendimiento
                'test',     // Tests
                'build',    // Sistema de build
                'ci',       // CI/CD
                'chore',    // Mantenimiento
                'revert',   // Revertir cambios
            ],
        ],
        'subject-case': [0], // Permite cualquier case en el subject
    },
};
