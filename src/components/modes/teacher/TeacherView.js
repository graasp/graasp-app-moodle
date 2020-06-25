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
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { MOODLE_DATA } from '../../../config/appInstanceResourceTypes';
import './TeacherView.css';
import {
  postAppInstanceResource,
  deleteAppInstanceResource,
  openSettings,
} from '../../../actions';
import { getUsers } from '../../../actions/users';
import { addQueryParamsToUrl } from '../../../utils/url';
import Settings from './Settings';
import { PUBLIC_VISIBILITY } from '../../../config/settings';

/**
 * helper method to render the rows of the app instance resource table
 * @param appInstanceResources
 * @param dispatchDeleteAppInstanceResource
 * @returns {*}
 */
const renderAppInstanceResources = (
  appInstanceResources,
  { dispatchDeleteAppInstanceResource },
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
      <TableCell>{data.importedData.length}</TableCell>
      <TableCell>
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

const saveAsAppInstanceResource = (
  importedData,
  { dispatchPostAppInstanceResource },
) => {
  dispatchPostAppInstanceResource({
    data: { importedData },
    type: MOODLE_DATA,
    visibility: PUBLIC_VISIBILITY,
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
      sectionTitle: PropTypes.string,
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
    sectionTitle: {
      marginTop: theme.spacing(3),
    },
    fab: {
      margin: theme.spacing(),
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  });

  state = {
    dataImported: false,
    data: [],
    actionFilter: [],
    useridFilter: '',
    targetFilter: '',
    uniqueActions: [],
    uniqueTargets: [],
    selectedColumns: [
      'userid',
      'courseid',
      'role',
      'action',
      'target',
      'timecreated',
    ],
  };

  constructor(props) {
    super(props);
    const { dispatchGetUsers } = this.props;
    dispatchGetUsers();
  }

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
    const { classes } = this.props;
    const { selectedColumns } = this.state;
    const headers = [];
    selectedColumns.forEach(column => {
      headers.push(<TableCell key={`column-${column}`}>{column}</TableCell>);
    });
    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>{headers}</TableRow>
        </TableHead>
        {this.renderCourseLogContent()}
      </Table>
    );
  }

  renderCourseLogContent() {
    const { t } = this.props;
    const {
      dataImported,
      data,
      actionFilter,
      useridFilter,
      targetFilter,
      selectedColumns,
    } = this.state;

    // Construct table rows to print later
    const tableRows = [];
    const filteredData = data
      .filter(
        row => actionFilter.length === 0 || actionFilter.includes(row.action),
      )
      .filter(row => useridFilter === '' || row.userid === useridFilter)
      .filter(row => row.target.includes(targetFilter));
    filteredData.forEach((row, i) => {
      const columns = [];
      selectedColumns.forEach((column, j) => {
        const generatedColumnKey = `row-${String(i)}-column-${String(j)}`;
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
      const generatdeRowKey = `row-${String(i)}`;
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
    defaultValue = [],
  ) => {
    return (
      <Autocomplete
        multiple
        filterSelectedOptions
        options={options}
        values={values}
        onChange={onChange}
        defaultValue={defaultValue}
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
      dispatchOpenSettings,
    } = this.props;
    const {
      actionFilter,
      uniqueActions,
      uniqueTargets,
      targetFilter,
      data,
      selectedColumns,
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

            <Typography
              variant="h6"
              color="inherit"
              className={classes.sectionTitle}
            >
              {t('This table illustrates the saved resources on the server.')}
            </Typography>
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>App Instance</TableCell>
                    <TableCell>Data Entries</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renderAppInstanceResources(appInstanceResources, this.props)}
                </TableBody>
              </Table>
            </Paper>

            <Typography
              variant="h6"
              color="inherit"
              className={classes.sectionTitle}
            >
              {t('This table shows the sample output of the imported data')}
            </Typography>
            <Paper className={classes.root}>
              <Grid container spacing={2}>
                <Grid item sm={12}>
                  {this.renderMultiSelect(
                    t('Columns'),
                    t('Select an option'),
                    selectedColumns,
                    [
                      'userid',
                      'courseid',
                      'role',
                      'edulevel',
                      'eventname',
                      'action',
                      'target',
                      'relateduserid',
                      'timecreated',
                    ],
                    (event, newValue) => {
                      this.setState({ selectedColumns: newValue });
                    },
                    selectedColumns,
                  )}
                </Grid>
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
                  <Button
                    color="primary"
                    className={classes.button}
                    variant="contained"
                    onClick={() => saveAsAppInstanceResource(data, this.props)}
                  >
                    {t('Save as App Instance')}
                  </Button>
                </Grid>
              </Grid>

              {this.renderCourseLog()}
            </Paper>
          </Grid>
        </Grid>

        <Settings
          onImportData={importedData => this.onImportData(importedData)}
        />
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
  dispatchDeleteAppInstanceResource: deleteAppInstanceResource,
  dispatchOpenSettings: openSettings,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TeacherView);

const StyledComponent = withStyles(TeacherView.styles)(ConnectedComponent);

export default withTranslation()(StyledComponent);
