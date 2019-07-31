<a href="https://lightelligence.io" align="right">
    <img src="/resources/logo.png" alt="logo" title="logo" align="right" />
</a>

# BrowserSDK

[![Build Status](https://img.shields.io/travis/com/lightelligence-io/browser-sdk.svg)](https://travis-ci.com/lightelligence-io/browser-sdk/branches)
[![Code Coverage](https://img.shields.io/coveralls/github/lightelligence-io/browser-sdk.svg)](https://coveralls.io/github/lightelligence-io/browser-sdk)
[![Dependencies](https://img.shields.io/david/lightelligence-io/browser-sdk.svg)](https://david-dm.org/lightelligence-io/browser-sdk)
[![npm (scoped)](https://img.shields.io/npm/v/@lightelligence/browser-sdk.svg)](https://www.npmjs.com/package/@lightelligence/browser-sdk)

> The Lightelligence API JavaScript Client for the Browser

## Installation

```
npm install @lightelligence/browser-sdk
```

## Features

The BrowserSDK allows you to access most of the Lightelligence API end-points and manages the
user authentication flow for your client side application.

## Usage

In order to authenticate with the BrowserSDK you will need to create an 
application via our [Lightelligence portal](https://portal.lightelligence.io/developer)
and obtain a public client ID.

```js
import BrowserSDK, { Device } from '@lightelligence/browser-sdk';

const browserSDK = new BrowserSDK({
  environment: 'prod', // Target enviroment (either `dev`, `preview` or `prod`)
  clientId: '', // The public client ID of the application your created in our [Lightelligence portal](https://portal.lightelligence.io/developer)
});

browserSDK.getCurrentUser().then(user => {

  if ( !user ) { return browserSDK.login(); }
  
  // Will print all devices of the tenant
  Device.getDevices().then( devices => console.log( devices ) );
  
} )
```

Check out [the API reference](https://lightelligence-io.github.io/browser-sdk/) 
to see the full documentation.

## License

MIT
