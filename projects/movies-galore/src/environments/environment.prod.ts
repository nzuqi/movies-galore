const packageJson = require('../../../../package.json');

export const environment = {
  appName: 'Movies Galore',
  envName: 'PROD',
  production: true,
  test: false,
  i18nPrefix: '',
  serverUrl: 'https://movies-galore-server.martin.co.ke:5304',
  versions: {
    app: packageJson.version,
    angular: packageJson.dependencies['@angular/core'],
    ngrx: packageJson.dependencies['@ngrx/store'],
    material: packageJson.dependencies['@angular/material'],
    bootstrap: packageJson.dependencies.bootstrap,
    rxjs: packageJson.dependencies.rxjs,
    ngxtranslate: packageJson.dependencies['@ngx-translate/core'],
    fontAwesome:
      packageJson.dependencies['@fortawesome/fontawesome-free-webfonts'],
    angularCli: packageJson.devDependencies['@angular/cli'],
    typescript: packageJson.devDependencies['typescript'],
    cypress: packageJson.devDependencies['cypress']
  },
  google: {
    client_id:
      '291363061336-geu1va34udea5botjkjgmjhlehq6lg47.apps.googleusercontent.com',
    client_secret: 'eLTWYvpfcYPnfEduaCl0bYAn'
  }
};
