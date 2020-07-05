# Graasp App: Moodle

Import your learning interaction data from Moodle to this powerful Graasp Application. It allows you (currently) only to import and filter data. Later, you will be able to perform awesome learning analytics and gain insights into your students behavior. This will help you to provide a better learning experience and push your students to better learning results.

## Getting Started

To run this app locally you need to have [Node](https://nodejs.org) and
[NPM](https://www.npmjs.com) installed in your operating system. We strongly recommend that you
also have [Yarn](https://yarnpkg.com/). All of the commands that you will see here use `yarn`,
but they have an `npm` equivalent.

Download or clone the repository to your local machine, preferably using [Git](https://git-scm.com).

### Installation

Inside the project directory, run `yarn` to install the project dependencies.

You will also need to create a file called `.env.local` with the following contents.

```dotenv
REACT_APP_GRAASP_DEVELOPER_ID=
REACT_APP_GRAASP_APP_ID=
REACT_APP_GRAASP_DOMAIN=localhost
REACT_APP_HOST=
REACT_APP_VERSION=
REACT_APP_BASE=
```

### Running Locally

Navigate to the cloned or forked project directory using the command line, type `yarn install`, followed by `yarn start`.
The app will automatically run on `localhost:3000` with a local database running in parallel
on `localhost:3636`. Any changes you make should be automatically rendered in the browser.

When accessing the page in the browser, you will see that it's empty and doesn't stop loading.
This is because you have to provide some additional information as query parameters.
Try it once with `http://localhost:3000/?spaceId=5b56e70ab253020033364411&appInstanceId=6156e70ab253020033364411&mode=teacher&userId=5b56e70ab253020033364416&dev=true`. You should see now a basic interface with some empty tables.

### Configure the Import

Click on the Settings Button in the bottom right-hand corner.
Fill out the pop-up with the demanded information and click the "Establish Connection" Button.

- API Endpoint: the URL to your LMS instance where you installed the [WAFED Web Service Plugin](https://gitlab.forge.hefr.ch/uchendu.nwachukw/wafed_moodle_webservice_plugin).
- Username: the username which should be used for authentication. Note that only courses will be listed, where the user is enrolled as Teacher (editingteacher)
- Password: the password of the user.

Chooses one or more available courses and click "Import Data".
Congratulations! The table shows you now the imported data.

### Play Around

Explore the filter options, different columns to display or save some data as appInstanceResource. Have fun!
