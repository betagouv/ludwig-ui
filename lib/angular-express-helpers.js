/** Make the given options available to Angular's dependency management system.
*
*@param {Object} options    The config to make available in the frontend as a constant.
*@param {String} [moduleName = 'serverConstants']   The name of the module on which the Angular app should depend to access the config.
*@param {String} [constantName = 'config'] The name of the dependency that should be injected in dependent modules to access the config.
*@returns {Function} An Express middleware to be mounted on a route that the client will execute as JavaScript.
*/
module.exports.sendConfig = function sendConfig(options, moduleName, constantName) {
    moduleName = moduleName || 'serverConstants';
    constantName = constantName || 'config';

    var payload = 'angular.module("' +
        moduleName +
        '",[]).constant("' +
        constantName +
        '",' +
        JSON.stringify(options) +
        ');';

    return function sendConfigToAngular(req, res) {
        res.type('application/javascript')
           .send(payload);
    }
}
