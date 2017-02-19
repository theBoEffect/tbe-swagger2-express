var _ = require('underscore');
var async = require('async');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
//var coffee = require('coffee-script'); not supported here
var url = require('url');

var doctrine = require('doctrine');
var express = require('express');
var descriptor = {};
var resources = {};

/**
 * Read from yml file
 * @api    private
 * @param  {String}   file
 * @param  {Function} fn
 */
function readYml(file, fn) {
    var resource = require(path.resolve(process.cwd(), file));
    var api = {};
    api.paths = resource.paths;
    api.definitions = resource.definitions;

    for (var key in api.paths){
        descriptor.paths[key] = api.paths[key];
        resources[resource.paths[key]] = resource.paths[key];
    }

    for (var keyd in api.definitions){
        descriptor.definitions[keyd] = api.definitions[keyd];
        resources[resource.definitions[keyd]] = resource.definitions[keyd];
    }

    fn();
}

/**
 * Parse jsDoc from a js file
 * @api    private
 * @param  {String}   file
 * @param  {Function} fn
 */
function parseJsDocs(file, fn) {
    fs.readFile(file, function (err, data) {
        if (err) {
            fn(err);
        }

        var js = data.toString();
        var regex = /\/\*\*([\s\S]*?)\*\//gm;
        var fragments = js.match(regex);
        var docs = [];

        if (!fragments) {
            fn(null, docs);
            return;
        }

        for (var i = 0; i < fragments.length; i++) {
            var fragment = fragments[i];
            var doc = doctrine.parse(fragment, { unwrap: true });
            docs.push(doc);

            if (i === fragments.length - 1) {
                fn(null, docs);
            }
        }
    });
}

 /**
 * Get jsDoc tag with title '@swagger'
 * @api    private
 * @param  {Object} fragment
 * @param  {Function} fn
 */
function getSwagger(fragment, fn) {
    for (var i = 0; i < fragment.tags.length; i++) {
        var tag = fragment.tags[i];
        if ('swagger' === tag.title) {
            return yaml.safeLoadAll(tag.description, fn);
        }
    }

    return fn(false);
}

/**
 * Read from jsDoc
 * @api    private
 * @param  {String}  file
 * @param  {Function} fn
 */
function readJsDoc(file, fn) {
    parseJsDocs(file, function (err, docs) {

        if (err) {
            fn(err);
        }

        var resource = { paths: {} };

        async.eachSeries(docs, function (doc, cb) {
            getSwagger(doc, function (api) {

                if (!api) {
                    return cb();
                }

                if (api.paths) {
                    descriptor.paths.push(api.paths);
                    resource.paths = api.paths;
                } else if (api.definitions) {
                    resource.definitions = api.definitions;
                } else {
                    resource.paths.push(api);
                }

                cb();
            });
        }, function (err) {
            resources[resource.paths] = resource;
            fn();
        });
    });
}

/**
 * Read API from file
 * @api    private
 * @param  {String}   file
 * @param  {Function} fn
 */
function readApi(file, fn) {
    var ext = path.extname(file);
    if ('.js' === ext) {
        readJsDoc(file, fn);
    } else if ('.yml' === ext) {
        readYml(file, fn);
    } else if ('.coffee' === ext) {
        //readCoffee(file, fn);
        console.log('not supporting coffee for now');
    } else {
        throw new Error('Unsupported extension \'' + ext + '\'');
    }
}

/**
 * Generate Swagger documents
 * @api    private
 * @param  {Object} opt
 */
function generate(opt) {
    if (!opt) {
        throw new Error('\'option\' is required.');
    }

    if (!opt.swaggerUI) {
        throw new Error('\'swaggerUI\' is required.');
    }

    if (!opt.basePath) {
        throw new Error('\'basePath\' is required.');
    }

    descriptor.swagger = (opt.swaggerVersion) ? opt.swaggerVersion : '2.0';
    descriptor.info = opt.info;
    descriptor.host = opt.host;
    descriptor.basePath = opt.basePath;
    descriptor.tags = (opt.tags) ? opt.tags : [];
    descriptor.schemes = (opt.schemes) ? opt.schemes : [];
    descriptor.securityDefinitions = (opt.securityDefinitions) ? opt.securityDefinitions : [];
    descriptor.paths = {};
    descriptor.definitions = {};

    var swaggerURL = (opt.swaggerURL) ? opt.swaggerURL : '/swagger';
    var swaggerJSON = (opt.swaggerJSON) ? opt.swaggerJSON : '/api-docs.json';

    opt.apiVersion = descriptor.info.version;
    opt.swaggerVersion = descriptor.swagger;
    opt.swaggerURL = swaggerURL;
    opt.swaggerJSON = swaggerJSON;
    opt.schemes = descriptor.schemes;
    opt.tags = descriptor.tags;
    opt.securityDefinitions = descriptor.securityDefinitions;
    opt.fullSwaggerJSONPath = url.parse(opt.host + opt.swaggerJSON).path;

    if (opt.paths) {
        opt.paths.forEach(function (api) {
            readApi(api, function (err) {
                if (err) {
                    throw err;
                }
            });
        });
    }

}

/**
 * Express middleware
 * @api    public
 * @param  {Object} app
 * @param  {Object} opt
 * @return {Function}
 */
exports.init = function (app, opt) {

    // generate resources
    generate(opt);

    // Serve up swagger ui static assets
    var swHandler = express['static'](opt.swaggerUI);

    // Serve up swagger ui interface.
    var swaggerURL = new RegExp('^'+ opt.swaggerURL +'(\/.*)?$');

    app.get(swaggerURL, function (req, res, next) {
        if (req.url === opt.swaggerURL) { // express static barfs on root url w/o trailing slash
            res.writeHead(302, { 'Location' : req.url + '/' });
            res.end();
            return;
        }

        // take off leading /swagger so that connect locates file correctly
        req.url = req.url.substr(opt.swaggerURL.length);
        return swHandler(req, res, next);
    });

    return function (req, res, next) {
        var match, resource, result;
        var regex = new RegExp('^'+ opt.swaggerJSON +'(\/.*)?$');

        match = regex.exec(req.path);

        if (match) {
            result = _.clone(descriptor);

            if (match[1]) {
                resource = resources[match[1]];

                if (!resource) {
                    return res.send(404);
                }

                result.paths = resource.paths;
                result.definitions = resource.definitions;
            }

            if(typeof(opt.middleware) === 'function'){
                opt.middleware(req, res);
            }

            return res.json(result);
        }
        return next();
    };
};