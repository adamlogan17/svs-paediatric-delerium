- [Audit](#audit)
  - [Summary](#summary)
  - [Technical Requirements](#technical-requirements)
  - [How to start the project](#how-to-start-the-project)
  - [File Structure Explanation](#file-structure-explanation)
  - [Documentation](#documentation)
    - [Production Build](#production-build)

# Audit

## Summary

This is the frontend for an Audit system which will display compliance data for delerium treatment within PICUs across the UK & ROI. If ran locally any 'backend' features will not work as this requires the APIs to be launched alongside this. A database is also required to provide full functionality.

## Technical Requirements

- [Node.Js vv20.10.0](https://nodejs.org/en/download)

## How to start the project

Run the below commands.

```console
npm install
npm start:nondocker
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

If the backend application is not working this will mean the `/login` endpoint is not available, and therefore, only the login page will be accessible.

## File Structure Explanation

- When the command `npm run docs` is executed:
  - The site can be viewed by opening `./docs/site/index.html` in a web browser
  - Markdown files can be viewed within the folder `./docs/markdown`
- Custom components made for the application can be found at `./src/components`
  - Each component has its own folder which contains the tests, component itself and styles for that component
- The pages of the site can be found in `./src/pages`
- The entry point of the applications is the `./src/index.tsx` files
- The routing can be found in `./src/AppRouter.tsx`
- All assets are within the `assets` folder with these being broken down further depending on the type of asset
  - Images, used for the site can be found in `./src/assets/images`
- The `shared` folder contains anything which is shared across pages or components, such as shared styles
- Custom hooks are contained within the `hooks` folder

## Documentation

 ```console
 npm run docs
 ```

Creates documentation for the site, based on the JSDOC comments within the code. See [here](https://typedoc.org/guides/overview/) for information on TypeDoc.

You can view the documentation within the following directories:

- The site can be viewed by opening `./docs/site/index.html` in a web browser
- Markdown files can be viewed within the folder `./docs/markdown`

### Production Build

```console
npm run build
```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
