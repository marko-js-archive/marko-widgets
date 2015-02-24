// Export a render(input, callback) method that can be used
// to render this UI component on the client or server
require('raptor-renderer').renderable(exports, require('./renderer'));