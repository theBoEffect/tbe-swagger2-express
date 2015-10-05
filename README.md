{swagger-express}
=========

[Swagger](https://developers.helloreverb.com/swagger/) is a specification and complete framework 
implementation for describing, producing, consuming, and visualizing RESTful web services.
View [demo](http://petstore.swagger.wordnik.com/).

__{tbe-swagger2-express}__ is an update to the simple and clean {swagger-express} implementation upgrading it to swagger 2.0

## Installation

    $ npm install -g tb2-swagger2-express

## Quick Start

Configure {swagger-express} as express middleware.

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
    paths: ['./api/paths1.yml', './api/paths2.yml', './api/api.js']
}));
```
## JS and YAML
Use standard swagger 2.0 specs.

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

## Credit

Based on [Swagger-Express](https://github.com/fliptoo/swagger-express)

Original Author [Fliptoo &lt;fliptoo.studio@gmail.com&gt;](fliptoo.studio@gmail.com)

## License

(The MIT License)

Copyright (c) 2015 theBoEffect &lt;bo.motlagh@gmail.com&gt;

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
