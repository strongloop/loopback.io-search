# loopback.io-search

## Overview

This repository tracks the code deployed to [IBM Cloud Functions](https://www.ibm.com/cloud/functions) to serve as a
proxy for Watson Discovery. The endpoint is called by [loopback.io](https://loopback.io).

The proxy is intended to hide Watson Discovery credentials (as the service doesn't offer readonly
credentials). The proxy also formats the request as a Watson Discovery query setting the appropriate
filter metadata if `sidebar` value is present in the call.

## Deployment

Any changes made to this repository will need to be reflect in IBM Cloud by updating the
Function code. Currently deployed to a Node 8 runtime.

## Contributions

* [Guidelines](./CONTRIBUTING.md)
* [Join the team](https://github.com/strongloop/loopback-next/issues/110)

## Contributors

See [all contributors](https://github.com/strongloop/loopback.io-search/graphs/contributors).

## License

MIT
