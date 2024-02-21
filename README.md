# Installing the extension
## Option 1 (Firefox only) - Install through AMO
We are now available from on [addons.mozila.org](https://addons.mozilla.org/en-US/firefox/addon/pop-filter/)!

## Option 2 - Manually import GitHub release
1. Download the extension from the [GitHub releases page](https://github.com/newo-2001/pop-filter/releases).
2. Go to the extensions page of your browser and select the *Install extension from zip* option.

## Option 3 - Building from source
### Prerequisites
1. [Node.js](https://nodejs.org/en), tested for version 18.19.1, if you encounter any problems with an older version, please open a [GitHub](https://github.com/newo-2001/pop-filter) issue and I will consider backporting support to older versions.
2. A browser that supports extensions, Chrome and Firefox are officially supported.

### Building the extension
1. Run the command `npm install` from the project root directory to install any external dependencies.
2. Run `npm run build` to build the project.
3. Open your browser and add the `/dist` directory as an *unpacked extension* on the extensions page of your browser ([chrome://extensions/](chrome://extensions/) for Chrome). Alternatively import the extension archive from the `/release` directory.
