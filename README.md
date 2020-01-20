# loopback.io-search

## Overview

This repository tracks the code deployed to [IBM Cloud Functions](https://www.ibm.com/cloud/functions) to serve as a
proxy for Watson Discovery. The endpoint is called by [loopback.io](https://loopback.io).

The proxy is intended to hide Watson Discovery credentials (as the service doesn't offer readonly
credentials). The proxy also formats the request as a Watson Discovery query setting the appropriate
filter metadata if `sidebar` value is present in the call.

## Deployment

Any changes made to this repository will need to be reflect in IBM Cloud by updating the
Function code. Currently deployed to a Node 10 runtime.

Make sure you have Watson Discovery service created on IBM Cloud. 

1. Create a Cloud function in https://cloud.ibm.com/functions/
2. Go to Parameters tab, set the following parameters:

| Parameter Name    | Parameter Value |
| ----------------- |:-------------:| 
| discovery_url     | `url` in Watson Discovery service credentials    | 
| discovery_apikey  | `apikey` in Watson Discovery service credentials |   
  
3. Go to Code tab, copy content in `search.js` in the text area.
4. Go to Endpoints tab, Make sure the checkbox "Enable as Web Action" is checked. In this case, you'll have a public API.

The Cloud function is set up and ready to run.

## Contributions

* [Guidelines](./CONTRIBUTING.md)
* [Join the team](https://github.com/strongloop/loopback-next/issues/110)

## Contributors

See [all contributors](https://github.com/strongloop/loopback.io-search/graphs/contributors).

## License

MIT
