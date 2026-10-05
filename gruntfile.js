/// <binding />
module.exports = function (grunt) {
    // Load required plugins
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-version-assets");

    grunt.initConfig({
        // Clean build folders
        clean: ["app/BuildScripts/*"],

        // Copy JS and CSS files (recursively)
        copy: {
            js: {
                expand: true,
                cwd: "app/js/controllers/",
                src: ["**/*.js"],
                dest: "app/BuildScripts/"
            },
        },

        // Versioning for cache busting
        versioning: {
            options: {
                grepFiles: ["app/index.html"],
                keepOriginal: false
            },
            assets: {
                src: [
                    "app/BuildScripts/**/*.js",
                ]
            }
        }
    });

    // Register both "build" and "minify" tasks (same behavior for now)
    grunt.registerTask("build", ["clean", "copy", "versioning"]);
    grunt.registerTask("minify", ["clean", "copy", "versioning"]);
};
