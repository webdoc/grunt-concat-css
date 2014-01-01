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
      base: "",
      rebaseUrls: true,
      debugMode: false
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      var importStatements = [];
      var sources = [];

      var extractImportStatements = function (data){
        var rex = /@import.*\;/gim;
        var matches = data.css.match(rex);
        if(matches && matches.length > 0){
          grunt.log.write("Found " + matches.join(", "));
          data.imports = matches;
          data.css = data.css.replace(rex, '');
        }
      };

      var rebaseUrls = function (data) {
        function dirname(csspath){
          var splits = csspath.split('/');
          splits.pop();
          return splits.join('/');
        }

        function dataTransformFunc(basedir){
          return function(a, b) {
            return "url('"+path.join(basedir, b)+"')";
          };
        }
        var basedir = dirname(data.path);
        if(basedir){
          data.css = data.css.replace(/url\(['\"]?([^'\"\:]+)['\"]?\)/gm, dataTransformFunc(basedir));
        }
      };

      var imports = "";
      var cssSource = "";

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
        extractImportStatements(data);
        options.rebaseUrls && rebaseUrls(data);
        if (data.imports) {
          imports += data.imports.join("\n") + "\n";
        }
        cssSource += data.css;
        return data;
      });

      // Write the destination file.
      grunt.file.write(f.dest, imports + cssSource);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
