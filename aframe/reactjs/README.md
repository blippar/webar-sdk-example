# ReactJS - AFrame - WebAR sdk Example

## Overview

- AFrame and WebARsdk `<script>` tags are included in the `public/index.html` template, so that the global `WEBARSDK` variable is accessible in the reactjs components.
- A local copy of the `webar-sdk/` files are placed in the `public/` folder.

- Example has the following  React components:
  - `<SceneLoader/>` to load the sdk, scene assets, license validation, etc
  - `<SceneView/>` to display a 3d model on the detected surface.
  - `<UiView/>` to display a button to reset tracking using webarsdk API calls via window.WEBARSDK.*

## Available Scripts

In the project directory, you can run:

### `npm start`

##### Note: Before running this command, make sure to [generate ss cert/key files](https://docs.blippar.com/webar-sdk/publish-your-creation/develop-locally#h_01fgy5weh1q3mw5x8y8nfr5ycb) for your PC and modify `npm start` command in package.json
Runs the app in the development mode.\
Open [https://local-ipaddress:3000](https://<local-ipaddress>:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
