# @muritavo/microfrontend-webpack-plugin

This plugin works by injecting a bootstrap function to the stratup chunk. This function registers the necessary import maps and the necessary tags.

# Usage

## Required dependencies
It's required to put the following dependencies in this specific order on the entry point of the application (usually index.js):

<sup> Install the dependencies as required</sup>

```javascript
import "import-map-overrides"; 
import "systemjs/dist/system";
import "systemjs/dist/extras/use-default";
import "systemjs/dist/extras/amd";
import "systemjs/dist/extras/named-register";
import "systemjs/dist/extras/named-exports";
```

This will setup the required dependencies for dynamically importing the dependencies

## Webpack configuration 

For pointing to a microfrontend chunk it's required to indicate the microfrontend definition on the webpack plugins configuration like the following:

```javascript
const MicrofrontendWebpackPlugin = require('@muritavo/microfrontend-webpack-plugin')
{
    //...all the rest of the configuration
    plugins: [
        new MicrofrontendWebpackPlugin([ //As an argument it receives an array with the definition of all the referenced microfrontends
            {
                name: 'mfe-XXX', //The name used when importing the microfrontend on the application\
                chunkLocation: 'http://pudim.com.br', //The location of the microfrontend chunk with the microfrontend definition
                externals: { //The shared dependencies through the referenced microfrontends. Required so dependencies are not unecessarly bundled on multiple applications.
                    'DependencyOne': 'CDN',
                    'DependencyTwo': 'CDN'
                }
            },
            //...Other definitions
        ])
        //...other plugins
    ]
}
```

## Referencing the microfrontend on the code: 
### React

For referencing other microfrontends inside a React application you can use the single-spa-react component 'Parcel'

```javascript

import Parcel from 'single-spa-react/Parcel';
import {mountRootParcel} from 'single-spa';

//...Inside the render routine

//As a config property you pass a function that return a import promise from SystemJS
//The imported name should match the provided name on the webpack plugin microfrontend definition

//The other props will be passed as the propos for the root component of the microfrontend (if done in react)
<Parcel config={() => window.System.import('mfe-XXX')} mountParcel={mountRootParcel} {...otherProps}/>
```