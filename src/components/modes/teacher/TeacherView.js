import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Fab from '@material-ui/core/Fab';
import SettingsIcon from '@material-ui/icons/Settings';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import Select from 'react-select';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import './TeacherView.css';
import {
  patchAppInstanceResource,
  postAppInstanceResource,
  deleteAppInstanceResource,
  openSettings,
} from '../../../actions';
import { getUsers } from '../../../actions/users';
import { addQueryParamsToUrl } from '../../../utils/url';
import Settings from './Settings';

/**
 * helper method to render the rows of the app instance resource table
 * @param appInstanceResources
 * @param dispatchPatchAppInstanceResource
 * @param dispatchDeleteAppInstanceResource
 * @returns {*}
 */
const renderAppInstanceResources = (
  appInstanceResources,
  { dispatchPatchAppInstanceResource, dispatchDeleteAppInstanceResource },
) => {
  // if there are no resources, show an empty table
  if (!appInstanceResources.length) {
    return (
      <TableRow>
        <TableCell colSpan={4}>No App Instance Resources</TableCell>
      </TableRow>
    );
  }
  // map each app instance resource to a row in the table
  return appInstanceResources.map(({ _id, appInstance, data }) => (
    <TableRow key={_id}>
      <TableCell scope="row">{_id}</TableCell>
      <TableCell>{appInstance}</TableCell>
      <TableCell>{data.value}</TableCell>
      <TableCell>
        <IconButton
          color="primary"
          onClick={() => {
            dispatchPatchAppInstanceResource({
              id: _id,
              data: { value: Math.random() },
            });
          }}
        >
          <RefreshIcon />
        </IconButton>
        <IconButton
          color="primary"
          onClick={() => dispatchDeleteAppInstanceResource(_id)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  ));
};

const generateRandomAppInstanceResource = ({
  dispatchPostAppInstanceResource,
}) => {
  dispatchPostAppInstanceResource({
    data: { value: Math.random() },
  });
};

export class TeacherView extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchOpenSettings: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string,
      table: PropTypes.string,
      main: PropTypes.string,
      button: PropTypes.string,
      message: PropTypes.string,
      fab: PropTypes.string,
    }).isRequired,
    dispatchGetUsers: PropTypes.func.isRequired,
    // inside the shape method you should put the shape
    // that the resources your app uses will have
    appInstanceResources: PropTypes.arrayOf(
      PropTypes.shape({
        // we need to specify number to avoid warnings with local server
        _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        appInstanceId: PropTypes.string,
        data: PropTypes.object,
      }),
    ),
    // this is the shape of the select options for students
    studentOptions: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
      }),
    ).isRequired,
    // the import settings
    settings: PropTypes.shape({
      moodleApiEndpoint: PropTypes.string,
      moodleUsername: PropTypes.string,
      moodlePassword: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    appInstanceResources: [],
  };

  static styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    main: {
      textAlign: 'center',
      margin: theme.spacing(),
    },
    button: {
      marginTop: theme.spacing(3),
    },
    table: {
      minWidth: 700,
    },
    message: {
      padding: theme.spacing(),
      backgroundColor: theme.status.danger.background[500],
      color: theme.status.danger.color,
      marginBottom: theme.spacing(2),
    },
    fab: {
      margin: theme.spacing(),
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  });

  state = {
    selectedStudent: null,
    dataImported: false,
    data: [],
    actionFilter: [],
    useridFilter: '',
    targetFilter: '',
    uniqueActions: [],
    uniqueTargets: [],
  };

  constructor(props) {
    super(props);
    const { dispatchGetUsers } = this.props;
    dispatchGetUsers();
  }

  handleChangeStudent = value => {
    this.setState({
      selectedStudent: value,
    });
  };

  handleActionFilter = event => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    this.setState({
      actionFilter: value,
    });
  };

  onImportData = data => {
    // Create sets for each filtarable column
    const allActions = [];
    const allTargets = [];
    data.forEach(entry => {
      allActions.push(entry.action);
      allTargets.push(entry.target);
    });
    const uniqueActions = [...new Set(allActions)];
    const uniqueTargets = [...new Set(allTargets)];
    this.setState({ dataImported: true, data, uniqueActions, uniqueTargets });
  };

  renderCourseLog() {
    const { t } = this.props;
    const {
      dataImported,
      data,
      actionFilter,
      useridFilter,
      targetFilter,
    } = this.state;

    // Construct table rows to print later
    const tableRows = [];
    // Attributes that will be displayed in a column. Corresponds to keys of the data attribute in the state. The order is important!
    const columnsToInclude = ['action', 'target', 'userid', 'timecreated'];
    let rowCounter = 0;

    const filteredData = data
      .filter(
        row => actionFilter.length === 0 || actionFilter.includes(row.action),
      )
      .filter(row => useridFilter === '' || row.userid === useridFilter)
      .filter(row => row.target.includes(targetFilter));
    filteredData.forEach(row => {
      const columns = [];
      let columnCounter = 0;
      columnsToInclude.forEach(column => {
        const generatedColumnKey = `row-${rowCounter}-column-${columnCounter}`;
        columnCounter += 1;
        if (column !== 'timecreated') {
          columns.push(
            <TableCell key={generatedColumnKey}>{row[column]}</TableCell>,
          );
        } else {
          columns.push(
            <TableCell key={generatedColumnKey}>
              {new Date(row[column] * 1000).toLocaleString()}
            </TableCell>,
          );
        }
      });
      const generatdeRowKey = `row-${rowCounter}`;
      rowCounter += 1;
      tableRows.push(<TableRow key={generatdeRowKey}>{columns}</TableRow>);
    });
    let output = '';
    if (dataImported) {
      output = <TableBody>{tableRows}</TableBody>;
    } else {
      output = (
        <TableBody>
          <TableRow>
            <TableCell colSpan={4}>{t('No data imported yet')}</TableCell>
          </TableRow>
        </TableBody>
      );
    }
    return output;
  }

  renderMultiSelect = (
    labelText,
    placeholderText,
    values,
    options,
    onChange,
  ) => {
    return (
      <Autocomplete
        multiple
        filterSelectedOptions
        options={options}
        values={values}
        onChange={onChange}
        getOptionLabel={option => option}
        renderInput={params => (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            variant="standard"
            label={labelText}
            placeholder={placeholderText}
          />
        )}
      />
    );
  };

  render() {
    // extract properties from the props object
    const {
      // this property allows us to do styling and is injected by withStyles
      classes,
      // this property allows us to do translations and is injected by i18next
      t,
      // these properties are injected by the redux mapStateToProps method
      appInstanceResources,
      studentOptions,
      dispatchOpenSettings,
    } = this.props;
    const {
      selectedStudent,
      actionFilter,
      uniqueActions,
      uniqueTargets,
      targetFilter,
    } = this.state;
    return (
      <>
        <Grid container spacing={0}>
          <Grid item xs={12} className={classes.main}>
            <Paper className={classes.message}>
              {t(
                'This is the teacher view. Switch to the student view by clicking on the URL below.',
              )}
              <a href={addQueryParamsToUrl({ mode: 'student' })}>
                <pre>
                  {`${window.location.host}/${addQueryParamsToUrl({
                    mode: 'student',
                  })}`}
                </pre>
              </a>
            </Paper>
            <Typography variant="h5" color="inherit">
              {t('View the Students in the Sample Space')}
            </Typography>
            <Select
              className="StudentSelect"
              value={selectedStudent}
              options={studentOptions}
              onChange={this.handleChangeStudent}
              isClearable
            />
            <hr />
            <Typography variant="h6" color="inherit">
              {t(
                'This table illustrates how an app can save resources on the server.',
              )}
            </Typography>
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>App Instance</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renderAppInstanceResources(appInstanceResources, this.props)}
                </TableBody>
              </Table>
            </Paper>
            <Button
              color="primary"
              className={classes.button}
              variant="contained"
              onClick={() => generateRandomAppInstanceResource(this.props)}
            >
              {t('Save a Random App Instance Resource via the API')}
            </Button>
            <hr />
            <Typography variant="h6" color="inherit">
              {t('This table shows the sample output of the imported data')}
            </Typography>

            <Typography variant="body1">Filter options</Typography>
            <Grid container spacing={2}>
              <Grid item sm={6} md={3} lg={2}>
                {this.renderMultiSelect(
                  t('Actions'),
                  t('Select an option'),
                  actionFilter,
                  uniqueActions,
                  (event, newValue) => {
                    this.setState({ actionFilter: newValue });
                  },
                )}
              </Grid>
              <Grid item sm={6} md={3} lg={2}>
                {this.renderMultiSelect(
                  t('Target'),
                  t('Select an option'),
                  targetFilter,
                  uniqueTargets,
                  (event, newValue) => {
                    this.setState({ targetFilter: newValue });
                  },
                )}
              </Grid>
              <Grid item sm={6} md={3} lg={2}>
                Tes12
              </Grid>
            </Grid>

            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Action</TableCell>
                    <TableCell>Target</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Time Created</TableCell>
                  </TableRow>
                </TableHead>
                {this.renderCourseLog()}
              </Table>
            </Paper>
          </Grid>
        </Grid>

        <Settings onImportData={data => this.onImportData(data)} />
        <Fab
          color="primary"
          aria-label={t('Settings')}
          className={classes.fab}
          onClick={dispatchOpenSettings}
        >
          <SettingsIcon />
        </Fab>
      </>
    );
  }
}

// get the app instance resources that are saved in the redux store
const mapStateToProps = ({ users, appInstanceResources, appInstance }) => ({
  // we transform the list of students in the database
  // to the shape needed by the select component
  studentOptions: users.content.map(({ id, name }) => ({
    value: id,
    label: name,
  })),
  appInstanceResources: appInstanceResources.content,
  settings: appInstance.content.settings,
});

// allow this component to dispatch a post
// request to create an app instance resource
const mapDispatchToProps = {
  dispatchGetUsers: getUsers,
  dispatchPostAppInstanceResource: postAppInstanceResource,
  dispatchPatchAppInstanceResource: patchAppInstanceResource,
  dispatchDeleteAppInstanceResource: deleteAppInstanceResource,
  dispatchOpenSettings: openSettings,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TeacherView);

const StyledComponent = withStyles(TeacherView.styles)(ConnectedComponent);

export default withTranslation()(StyledComponent);
