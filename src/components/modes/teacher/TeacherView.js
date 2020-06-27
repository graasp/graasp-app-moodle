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
        <TableCell colSpan={5}>No App Instance Resources</TableCell>
      </TableRow>
    );
  }
  // map each app instance resource to a row in the table
  return appInstanceResources.map(({ _id, appInstance, data }) => (
    <TableRow key={_id}>
      <TableCell scope="row">{_id}</TableCell>
      <TableCell>{appInstance}</TableCell>
      <TableCell>{data.source}</TableCell>
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
  dataSource,
  { dispatchPostAppInstanceResource },
) => {
  dispatchPostAppInstanceResource({
    data: { importedData, source: dataSource },
    type: MOODLE_DATA,
    visibility: PUBLIC_VISIBILITY,
  });
};

const availableColumns = [
  'userid',
  'courseid',
  'role',
  'edulevel',
  'eventname',
  'action',
  'target',
  'relateduserid',
  'timecreated',
];

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
    dataSource: '',
    selectedColumns: [
      'userid',
      'courseid',
      'role',
      'action',
      'target',
      'timecreated',
    ],
    filters: {},
  };

  constructor(props) {
    super(props);
    const { dispatchGetUsers } = this.props;
    dispatchGetUsers();
  }

  /**
   * Prepare filters based on the imported data and persist data to the state.
   * @param {string} sourceUrl where the data is imported from
   * @param {*[]} data where each element shall have at least the following attributes: action, target, userid, courseid
   */
  onImportData = (sourceUrl, data) => {
    const allValues = {};
    availableColumns.forEach(column => {
      allValues[column] = [];
    });
    data.forEach(entry => {
      // Convert timecreated to readable datetime string
      entry.timecreated = new Date(entry.timecreated * 1000).toLocaleString(); // eslint-disable-line no-param-reassign
      // Add all values to the list of possible values for this column
      availableColumns.forEach(column => {
        allValues[column].push(entry[column]);
      });
    });
    const filters = {};
    Object.keys(allValues).forEach(key => {
      const uniqueValues = [...new Set(allValues[key])];
      filters[key] = {}; // required befor defining the attributes
      filters[key].options = uniqueValues;
      // set initial value to contain all possible values
      filters[key].selection = uniqueValues;
    });
    this.setState({
      dataImported: true,
      data,
      dataSource: sourceUrl,
      filters,
    });
  };

  /**
   * Render the Table for the course log
   */
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

  /**
   * Render the actual TableBody with selected columns and applied filters.
   * If no data is imported yet or no data matches the filter criterion, a specific message is displayed.
   */
  renderCourseLogContent() {
    const { t } = this.props;
    const { dataImported, data, selectedColumns, filters } = this.state;

    // Construct table rows to print later
    const tableRows = [];
    // Filter rows that don't pass their filter (if one is set)
    const filteredData = data.filter(row => {
      return availableColumns.every(
        column =>
          filters[column].selection.length === 0 ||
          filters[column].selection.includes(row[column]),
      );
    });
    filteredData.forEach((row, i) => {
      const columns = [];
      selectedColumns.forEach((column, j) => {
        const generatedColumnKey = `row-${String(i)}-column-${String(j)}`;
        columns.push(
          <TableCell key={generatedColumnKey}>{row[column]}</TableCell>,
        );
      });
      const generatdeRowKey = `row-${String(i)}`;
      tableRows.push(<TableRow key={generatdeRowKey}>{columns}</TableRow>);
    });
    let output = '';
    if (dataImported) {
      if (filteredData.length > 0) {
        output = <TableBody>{tableRows}</TableBody>;
      } else {
        output = (
          <TableBody>
            <TableRow>
              <TableCell colSpan={4}>
                {t('No data matching the filter criterion')}
              </TableCell>
            </TableRow>
          </TableBody>
        );
      }
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

  /**
   * Render a filter option for each selected column
   */
  renderCourseLogFilters = () => {
    const { t } = this.props;
    const { selectedColumns, filters } = this.state;
    const renderedFilters = [];
    if (Object.keys(filters).length !== 0 && filters.constructor === Object) {
      selectedColumns.forEach(column => {
        renderedFilters.push(
          <Grid item sm={6} md={3} lg={2}>
            <Autocomplete
              id={`filter-${column}`}
              multiple
              filterSelectedOptions
              options={filters[column].options}
              values={filters[column].selection}
              onChange={(event, newValue) => {
                // 1. Make a shallow copy of the items
                const updatedFilters = { ...filters };
                // 2. Make a shallow copy of the item you want to mutate
                const filter = { ...updatedFilters[column] };
                // 3. Replace the property you're intested in
                filter.selection = newValue;
                // 4. Put it back into our array
                updatedFilters[column] = filter;
                // 5. Set the state to our new copy
                this.setState({ filters: updatedFilters });
              }}
              getOptionLabel={option => String(option)}
              renderInput={params => (
                <TextField
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...params}
                  variant="standard"
                  label={column}
                  placeholder={t('Select an option')}
                />
              )}
            />
          </Grid>,
        );
      });
    }
    return renderedFilters;
  };

  /**
   * Render the possible configurations such as columns to display and available filters.
   */
  renderCourseLogConfiguration() {
    const { t } = this.props;
    const { selectedColumns } = this.state;

    return (
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Autocomplete
            multiple
            filterSelectedOptions
            options={availableColumns}
            values={selectedColumns}
            onChange={(event, newValue) => {
              this.setState({ selectedColumns: newValue });
            }}
            defaultValue={selectedColumns}
            getOptionLabel={option => option}
            renderInput={params => (
              <TextField
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...params}
                variant="standard"
                label={t('Columns')}
                placeholder={t('Select an option')}
              />
            )}
          />
        </Grid>

        {this.renderCourseLogFilters()}
      </Grid>
    );
  }

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
    const { data, dataSource } = this.state;
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
                    <TableCell>Source</TableCell>
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
              {this.renderCourseLogConfiguration()}

              <Button
                color="primary"
                id="saveAsAppInstanceButton"
                className={classes.button}
                disabled={data.length === 0}
                variant="contained"
                onClick={() => {
                  saveAsAppInstanceResource(data, dataSource, this.props);
                }}
              >
                {t('Save as App Instance')}
              </Button>

              {this.renderCourseLog()}
            </Paper>
          </Grid>
        </Grid>

        <Settings
          onImportData={(source, importedData) => {
            this.onImportData(source, importedData);
          }}
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
const mapStateToProps = ({ appInstanceResources, appInstance }) => ({
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
