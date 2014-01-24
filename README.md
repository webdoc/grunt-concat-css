# grunt-concat-css

> Concat CSS with @import statements at top and relative url preserved.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-concat-css --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-concat-css');
```

## The "concat_css" task

### Overview
In your project's Gruntfile, add a section named `concat_css` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  concat_css: {
    options: {
      // Task-specific options go here.
    },
    all: {
      src: ["/**/*.css"],
      dest: "styles.css"
    },
  },
})
```

### Usage Examples

#### Default Options
By default, all css are concatenated. The only things that happens is that every @import statement are placed at the begininning of the resulting file (as @import statement).

```js
grunt.initConfig({
  concat_css: {
    options: {},
    files: {
      'dest/compiled.css': ['src/styles/componentA.css', 'src/styles/componentB.css'],
    },
  },
})
```

#### Rebase URLs
by specifying rebaseUrls: true, all the assets will be rebased relative to this project root.

```js
grunt.initConfig({
  concat_css: {
    options: {
      assetBaseUrl: 'static/assets'
    },
    files: {
      'static/styles.css': ['src/styles/**/*.css', 'src/assets/**/*.css']
    }
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
