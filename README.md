# [johnlim.dev](https://johnlim.dev/)

![Website Preview](https://user-images.githubusercontent.com/4276174/66977915-9e007b80-f05c-11e9-8631-610cb9621104.png "Website Preview")

My personal website featuring some of my past works and projects.

## Prerequisites

* [Bun](https://bun.sh/) 1.4 or newer
* [Node.js](https://nodejs.org/) 22.18 or newer

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
bun install --frozen-lockfile
bun run start
```

## Deployment

Install the locked dependencies and generate the `dist/` folder:

```bash
bun install --frozen-lockfile
bun run build
```


## Built With

* [three.js](https://github.com/mrdoob/three.js/) - Displays 3D Models on the website.
* [React](https://reactjs.org/) - Used to parse and load the list of past works from [works.json](src/works.json).
* [Bootstrap 5](https://github.com/twbs/bootstrap) - Used the base CSS for supporting desktop, mobile, and tablet resolutions.
* [Webpack](https://github.com/webpack/webpack) - Tree shaking & packing resources for production.

## Authors

* **Jongseung John Lim** - [Github](https://github.com/penandlim)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
