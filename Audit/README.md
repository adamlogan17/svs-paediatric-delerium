- [Audit](#audit)
  - [Summary](#summary)
  - [How to start the project](#how-to-start-the-project)
  - [File Structure Explanation](#file-structure-explanation)
  - [Available Scripts](#available-scripts)
    - [```npm start```](#npm-start)
    - [```npm test```](#npm-test)
    - [```npm run build```](#npm-run-build)
    - [```npm run eject```](#npm-run-eject)
  - [Learn More](#learn-more)

# Audit

## Summary

This is the frontend for an Audit system which will display compliance data for delerium treatment within PICUs across the UK & ROI. If ran locally any 'backend' features will not work as this requires the APIs to be launched alongside this. A database is also required to provide full functionality.

## How to start the project

Run the below commands.

```console
npm install
npm start
```

## File Structure Explanation

- The ```index.tsx``` file contains the page routes and is responsible for RBAC of the pages
- The ```shared``` folder contains anything which is shared across pages or components, such as shared styles
- All pages of the application are under the ```pages``` folder
  - Each page has its own folder which contains the tests, page itself and styles for that page
- Hooks are contained within the ```hooks``` folder
- The components are within the ```components``` folder
  - Each component has its own folder which contains the tests, component itself and styles for that component
- All assets are within the ```assets``` folder with these being broken down further depending on the type of asset

## Available Scripts

In the project directory, you can run:

### ```npm start```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### ```npm test```

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### ```npm run build```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### ```npm run eject```

**Note: this is a one-way operation. Once you ```eject```, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can ```eject``` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use ```eject```. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
