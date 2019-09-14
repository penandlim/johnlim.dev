'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getResolver;
function getResolver(resolver = 'module-to-cdn') {
    if (typeof resolver === 'function') {
        return resolver;
    }

    return require(resolver);
}