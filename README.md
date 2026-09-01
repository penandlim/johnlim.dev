# [johnlim.dev](https://johnlim.dev/)

![Website Preview](https://user-images.githubusercontent.com/4276174/66977915-9e007b80-f05c-11e9-8631-610cb9621104.png "Website Preview")

My personal website featuring some of my past works and projects.

## Prerequisites

* [Node](https://nodejs.org/en/)

## Getting started

Clone the repository with its optional Unity helper submodule:

```bash
git clone --recurse-submodules https://github.com/penandlim/johnlim.dev.git
cd johnlim.dev
```

For an existing checkout, initialize the submodule with:

```bash
git submodule update --init --recursive
```

The `johnlim.dev-Unity-Helper` submodule is kept as a separate git repository. It is not required to run the website locally or build the static site.

## Development

Install the locked dependencies and start the webpack development server:

```bash
npm ci
npm start
```

## Deployment

Install the locked dependencies and generate the `dist/` folder:

```bash
npm ci
npm run build
```

If webpack reports `ERR_OSSL_EVP_UNSUPPORTED` on a Node/OpenSSL 3 installation, rerun the affected command with the legacy provider enabled:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm start
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

## Built With

* [three.js](https://github.com/mrdoob/three.js/) - Displays 3D Models on the website.
* [React](https://reactjs.org/) - Used to parse and load the list of past works from [works.json](src/works.json).
* [Bootstrap 4](https://github.com/twbs/bootstrap) - Used the base css for supporting desktop, mobile, and tablet resolutions.
* [Webpack](https://github.com/webpack/webpack) - Tree shaking & packing resources for production.

## Authors

* **Jongseung John Lim** - [Github](https://github.com/penandlim)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
