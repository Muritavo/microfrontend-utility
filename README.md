# microfrontend-utility
This is a repository to store all utilities used to implement my vision of microfrontends

## Keywords
Consumer - A web application/microfrontend that references other microfrontends
Microfrontend - A standalone application that encapsulates a domain and can be run independently or can be run on the same context as the consumer

## Important notes
- It's important to externalize those dependencies that can take a lot of space of the final bundle.
### For example
- Libraries can make up a lot of the bundle: Libraries like React and React-DOM usually take up a lot of space and can be externalized. This can be done by providing the externalized name to the definition.js inside the project module.

- This project implements a very generic strategy of implementing/integrating microfrontends. The idea here is to improve the library as it gets used. The development must be taken carefully as since the microfrontends can be run on the same context, they can override some behaviors.
### For example
- CSS priority overrides (**Alwways preffix possible naming conflict with process.env.MICROFRONTEND_NAME**): 
While implementing a **P**roof **O**f **C**oncept both applications used the library MaterialUI. 
When the Consumer rendered the microfrontend the bootstrap from MaterialUI would override the custom styles made by the first application. It was required to set a custom name for the bootstrapped classes from MaterialUI so they would not conflict with the same appplication.

## Utilities

### @muritavo/microfrontend-webpack-plugin
Responsible for adding the dependencies used for this implementation of microfrontend along with adding import maps for the provided microfrontends

### @muritavo/microfrontend-cli
This **C**ommand **L**ine **U**tility is used to bootstrap a modular project that can be deployed as a microfrontend. It prepares and exposes the interface consumed by the webpack plugin and allows the project to be runnable independently from a consumer. Currently the project is bootstraped with React but as time goes, there can be PR so it can be bootstraped for other frameworks.
