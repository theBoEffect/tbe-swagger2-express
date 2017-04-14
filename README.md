# tbe-swagger2-express
=========

[Swagger](https://swagger.io) is a specification and complete framework
implementation for describing, producing, consuming, and visualizing RESTful web services.
View [demo](http://petstore.swagger.io/).

__{tbe-swagger2-express}__ is an update to the simple and clean {swagger-express} by [Fliptoo](mailto://fliptoo.studio@gmail.com) implementation upgrading it to swagger 2.0

## Installation

    $ npm install tbe-swagger2-express

## Access

This package configures the express middleware required to serve up swagger UI and the swagger json spec. When you initialize the middleware as in the example below, you point the "swaggerUI" property to where ever you've hosted it as static content. This can be a bower install of the default swagger UI or your own implementation of the UI.
 
The swagger UI can be found here: [Swagger UI](https://github.com/swagger-api/swagger-ui)

Once configured, the path to your swagger UI from your node server is defined by the path provided in the swaggerURL property of the init definition. The path to the JSON spec is then provided by the swaggerJSON property.

So if you are hosting your service at example.com, and you configured as below, you would find your swagger URL at http://example.com/docs and you fould find your json at both http://example.com/api-docs and http://example.com/docs/api-docs

## Pointing the UI

Whether you did a bower install to use the default swagger UI or created your own version, you can point it to the correct JSON spec by adding the path as a url query parameter. For example: http://example.com/docs?url=http://example.com/api-docs

Of course you can simply modify the UI to point there by default if you implement your own version.

## Quick Start

Configure {tbe-swagger2-express} as express middleware.

```
var swagger = require('tbe-swagger2-express');

app.use(swagger.init(app, {
    swaggerVersion: '2.0',
    host: baseUrl, 'localhost:3000',
    basePath: '/',
    swaggerURL: '/docs',
    swaggerJSON: '/api-docs',
    swaggerUI: './public/swagger',
    schemes: ['http', 'https'],
    info: {
        version: '1.0.0',
        title: 'tbe-swagger2-express example,
        description: 'This is an example of the upgraded swagger-express library'
    },
    tags: [
        {
            name: "First",
            description: "Endpoint category - leave empty for default"
        },
        {
            name: "Second",
            description: "Endpoint category - leave empty for default"
        }
    ],
    securityDefinitions: {
        "api_key": {
            "type": "apiKey",
            "name": "api_key",
            "in": "header"
        }
    },
    paths: ['./api/paths1.yml', './api/paths2.yml']
}));
```
## JS and YAML
Use standard swagger 2.0 specs. Found [here](http://swagger.io/specification/)

A handy editor can be found here: [Swagger Editor](http://editor.swagger.io)

Each path.yml file should have "paths" as its root

```
paths:
    /examplepath1:
        get:
            tags:
                - First
            ...
    /examplepath2:
        get:
            tags:
                - First
            ...
        post:
            tags:
                - Second
            ...

```

For additional information please reference the original swagger-express implementation:
https://github.com/fliptoo/swagger-express

NOTE: Coffee support removed for this version

## Credit

Based on [Swagger-Express](https://github.com/fliptoo/swagger-express)

Original Author [Fliptoo &lt;fliptoo.studio@gmail.com&gt;](fliptoo.studio@gmail.com)

## MIT License

(The MIT License)

Copyright (c) 2015 theBoEffect &lt;borzou@theboeffect.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
