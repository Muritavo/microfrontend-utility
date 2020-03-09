(function(Object, GOPS, global) {
  /**
   * Mapping of the externalized dependencies
   * @type {{
   *  [key: string]: string
   * }} */
  var externals;
  /** externals-insertion-point */

  /**
   * Mapping of the consumed microfrontends
   * @type {{
   *  [key: string]: string
   * }}
   */
  var microfrontends;
  /** microfrontends-insertion-point */

  let scriptNodes = [];
  let importMapNode;
  document.head.childNodes.forEach(childNode => {
    if (childNode.nodeName.toLowerCase() === "script") {
      scriptNodes.push(childNode);
      if (childNode.getAttribute("type") === "systemjs-importmap") {
        importMapNode = childNode;
      }
    }
  });
  if (importMapNode === undefined) {
    importMapNode = document.createElement('script');
    importMapNode.setAttribute('type', 'systemjs-importmap');
    importMapNode.innerHTML = JSON.stringify({
      imports: {}
    });
    const meta = document.createElement('meta');
    meta.setAttribute('name', "importmap-type");
    meta.setAttribute('content', "systemjs-importmap");
    document.head.appendChild(meta);
    document.head.appendChild(importMapNode);
  }
  const importMap = JSON.parse(importMapNode.innerHTML);
  Object.keys(externals).forEach(key => {
    if (!importMap[key]) {
      importMap['imports'][key] = externals[key];
    }
  });
  Object.keys(microfrontends).forEach(mfeName => {
    if (!importMap[mfeName]) {
      importMap['imports'][mfeName] = microfrontends[mfeName];
    } else {
      //There is an error mapping the microfrontend name
      if (importMap[mfeName] !== microfrontends[mfeName])
        console.error(
          "There is already a microfrontend named " +
            mfeName +
            " with a different host. It is advised to rename the microfrontend name."
        );
    }
  });
  importMapNode.innerHTML = JSON.stringify(importMap, null, 4);
}(Object, "getOwnPropertySymbols", this));
