/**
@toc
2. load grunt plugins
3. init
4. setup variables
5. grunt.initConfig
6. register grunt tasks

*/


'use strict';

module.exports = function(grunt) {

  /**
	Load grunt plugins
	@toc 2.
	*/
grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks("grunt-jscs");

  /**
	Function that wraps everything to allow dynamically setting/changing grunt options and config later by grunt task. This init function is called once immediately (for using the default grunt options, config, and setup) and then may be called again AFTER updating grunt (command line) options.
	@toc 3.
	@method init
	*/
  function init(params) {
    /**
		Project configuration.
		@toc 5.
		*/
    grunt.initConfig({
      jscs: {
        src: 'src/*.js',
        options: {
          config: '.jscsrc',
          preset: 'airbnb',
          requireCurlyBraces: ["if"]
        }
      },
      changelog: {
        options: {
          from: 'f2f61ee2618153f955ebce0b33624c9a5206e8bc',
          to: 'HEAD'
        }
      },
      bump: {
        options: {
          files: ['package.json', 'bower.json'],
          updateConfigs: [],
          commit: true,
          commitMessage: 'Release %VERSION%',
          commitFiles: ['package.json', 'bower.json', /*'CHANGELOG.md',*/
            'angular-harmonized.js', 'angular-harmonized.min.js'
          ],
          createTag: true,
          tagName: '%VERSION%',
          tagMessage: 'Version %VERSION%',
          push: true,
          pushTo: 'origin',
          prereleaseName: 'alpha',
        }
      },
      concat: {
        build: {
          src: ['src/*.js'],
          dest: 'angular-harmonized.js'
        }
      },
      jshint: {
        options: {
          //force:          true,
          globalstrict: true,
          //sub:            true,
          node: true,
          loopfunc: true,
          browser: true,
          devel: true,
          globals: {
            angular: false,
            $: false,
            moment: false,
            Pikaday: false,
            _: false,
            module: false,
            forge: false,
            IDBKeyRange: false,
            harmonized: false,
          }
        },
        beforeconcat: {
          options: {
            force: false,
            ignores: ['**.min.js']
          },
          files: {
            src: []
          }
        },
        //quick version - will not fail entire grunt process if there are lint errors
        beforeconcatQ: {
          options: {
            force: true,
            ignores: ['**.min.js']
          },
          files: {
            src: ['src/*.js']
          }
        }
      },
      uglify: {
        options: {
          mangle: false
        },
        build: {
          files: {},
          src: 'angular-harmonized.js',
          dest: 'angular-harmonized.min.js'
        }
      }
      /*,
      			karma: {
      				unit: {
      					configFile: publicPathRelativeRoot+'config/karma.conf.js',
      					singleRun: true,
      					browsers: ['PhantomJS']
      				}
      			}*/
    });


    /**
		register/define grunt tasks
		@toc 6.
		*/
    // Default task(s).
    grunt.registerTask('default', ['jshint:beforeconcatQ', 'concat:build',
      'uglify:build'
    ]);

    grunt.registerTask('release', 'bump and changelog', function(type) {
      grunt.task.run([
        'default',
        'bump:' + (type || 'patch') + ':bump-only',
        //'changelog',
        'bump-commit'
      ]);
    });
  }
  init({}); //initialize here for defaults (init may be called again later within a task)

};
