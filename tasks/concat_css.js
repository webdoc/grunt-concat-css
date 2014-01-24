/*
 * grunt-concat-css
 * https://github.com/urturn/grunt-concat-css
 *
 * Copyright (c) 2013 Olivier Amblet
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('concat_css', 'Your task description goes here.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      assetBaseUrl: false,
      debugMode: false
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      var importStatements = [];
      var sources = [];

      var extractImportStatements = function (data){
        var rex = /@import\s.+\;/gim;
        var replaceRex = /[\s]*@import\s.+\;/gim;
        var matches = data.css.match(rex);
        if(matches && matches.length > 0){
          grunt.log.write("Found " + matches.join(", "));
          data.imports = matches;
          data.css = data.css.replace(replaceRex, '');
        }
      };

      var rebaseUrls = function (data) {
        function dirname(csspath){
          var splits = csspath.split('/');
          splits.pop();
          return splits.join('/');
        }

        // Rebase any url('someUrl') variation
        function dataTransformUrlFunc(basedir) {
          return function(a, b) {
            return "url('"+[basedir, b].join('/')+"')";
          };
        }

        // Rebase @import 'someUrl' exception
        function dataTransformImportAlternateFunc(basedir) {
          return function(a, b) {
            return "@import url('"+[basedir, b].join('/')+"')";
          };
        }

        var baseUrl = options.assetBaseUrl.replace(/\/$/, '');
        data.css = data.css.replace(/url\(['\"]?([^'\"\:]+)['\"]?\)/gm, dataTransformUrlFunc(baseUrl));
        data.css = data.css.replace(/@import\s+['\"]([^'\"\:]+)['\"]/gm, dataTransformImportAlternateFunc(baseUrl));
      };

      var imports = "";
      var cssFragments = [];

      options.debugMode && console.log(f.src, f.dest);
      // Concat specified files.
      var results = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        var data = {
          path: filepath,
          css: grunt.file.read(filepath)
        };
        options.debugMode && console.log(data);
        if ([false, undefined].indexOf(options.assetBaseUrl) === -1) {
          rebaseUrls(data);
        }
        extractImportStatements(data);
        if (data.imports) {
          imports += data.imports.join("\n") + "\n";
        }
        cssFragments.push(data.css.replace(/(^\s+|\s+$)/g,''));
        return data;
      });

      // Write the destination file.
      grunt.file.write(f.dest, imports + cssFragments.join('\n') + '\n');

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
