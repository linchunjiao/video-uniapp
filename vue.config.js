const path = require('path');
 
function resolve (dir) {
  return path.join(__dirname, dir)
}
 
module.exports = {
  chainWebpack: (config) => {   
    config.resolve.alias
    .set('$common',resolve('/common'))
    .set('$components',resolve('/components'))
    .set('$pages',resolve('/pages'))
    .set('$static',resolve('/static'));
  }
};