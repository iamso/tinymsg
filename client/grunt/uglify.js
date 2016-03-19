module.exports = {
  options: {
    mangle: {
      except: ['u', 'µ']
    },
    compress: {
      drop_console: true
    },
    preserveComments: false,
    sourceMap: false
  },
  dist: {
    options: {
      banner: '<%= banner %>'
    },
    src: ['client.js'],
    dest: 'client.js'
  }
};
