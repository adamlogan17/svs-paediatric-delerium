- [svs-paediatric-delerium](#svs-paediatric-delerium)
  - [How to start the project](#how-to-start-the-project)
    - [Using Docker](#using-docker)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [Initialising DB](#initialising-db)
  - [How to use server](#how-to-use-server)
  - [Useful links](#useful-links)
    - [Setting up project](#setting-up-project)
    - [REST APIs](#rest-apis)
    - [Docker](#docker)
    - [D3.js](#d3js)
    - [Connecting to postgres in nodejs](#connecting-to-postgres-in-nodejs)
    - [SQL commands](#sql-commands)
  - [Useful vscode extension ids](#useful-vscode-extension-ids)

# svs-paediatric-delerium 
## How to start the project
### Using Docker
* ```docker-compose up```
### Frontend 
* ```cd example-frontend```
* ```npm run start```

Before the first time you run the program you need to use the command ```npm install```
### Backend
* ```cd APIs\example-api```
* ```npm run start:dev```

Before the first time you run the program you need to use the command ```npm install```
## Initialising DB
If you would like to change the setup of the database alter the ```.sql``` files within the relevant database folder within the ```sql``` folder.
## How to use server
"See the message from IT admin. EEECS students can login to my server (143.117.69.4) machine in ECIT using their existing EEECS accounts. When they login the format at the login screen is studentnumber@eeecs.qub.ac.uk - they use the password they use when they login to the machines in the CSB or the Ashby.  We can't give access to the ECIT VPN to undergrad students. So students will need to access this machine from the campus."
## Useful links
### Setting up project
* https://khalilstemmler.com/blogs/typescript/node-starter-project/
* https://khalilstemmler.com/blogs/typescript/eslint-for-typescript/ 
* https://www.toptal.com/nodejs/secure-rest-api-in-nodejs
### REST APIs
* https://medium.com/swlh/interacting-with-restful-apis-using-typescript-react-hooks-and-axios-part-1-af52920ae3e4
* https://www.freecodecamp.org/news/how-to-consume-rest-apis-in-react/
### Docker
* https://medium.com/bb-tutorials-and-thoughts/dockerizing-react-app-with-nodejs-backend-typescript-version-55a40389b0ac
* https://www.youtube.com/watch?v=gAkwW2tuIqE
* https://wkrzywiec.medium.com/how-to-run-database-backend-and-frontend-in-a-single-click-with-docker-compose-4bcda66f6de
* https://saasbase.dev/blog/dockerfile-for-react-and-typescript
* https://rsbh.dev/blogs/rest-api-express-typescript-docker
### D3.js
* https://www.pluralsight.com/guides/using-d3.js-inside-a-react-app
### Connecting to postgres in nodejs
* https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/#what-node-postgres
* https://dev.to/chandrapantachhetri/docker-postgres-node-typescript-setup-47db
* https://node-postgres.com/features/connecting
* https://stackoverflow.com/questions/58254717/returning-the-result-of-a-node-postgres-query
* https://stackoverflow.com/questions/61871242/how-to-call-result-out-side-the-pool-query-in-node-js
* https://levelup.gitconnected.com/creating-and-filling-a-postgres-db-with-docker-compose-e1607f6f882f
### SQL commands
* https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-upsert/
## Useful vscode extension ids
* formulahendry.auto-rename-tag
* ms-azuretools.vscode-docker
* dsznajder.es7-react-js-snippets
* dbaeumer.vscode-eslint
* eamodio.gitlens
* ecmel.vscode-html-css
* ms-vscode.vscode-typescript-next
* Orta.vscode-jest
* yzhang.markdown-all-in-one
* waderyan.nodejs-extension-pack
* christian-kohler.path-intellisense
* rangav.vscode-thunder-client
