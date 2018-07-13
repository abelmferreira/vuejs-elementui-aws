// https://forum.vuejs.org/t/editing-webpack-config-js-when-using-vue-cli-3/30251
// https://stackoverflow.com/questions/41040266/remove-console-logs-with-webpack-uglify

// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

// module.exports = {
//   configureWebpack: {
//     plugins: [
//       new UglifyJSPlugin({
//         uglifyOptions: {
//           output: {
//             // Eliminate comments
//             comments: false
//           },
//           compress:{
//             // remove warnings
//             warnings: false,
//             // Drop console and debug statements
//             drop_debugger: true,
//             drop_console: true
//           }
//         }
//       })
//     ]
//   }
// }
