import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import SettingsIcon from '@material-ui/icons/Settings';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { MOODLE_DATA } from '../../../config/appInstanceResourceTypes';
import './TeacherView.css';
import DataTable from './DataTable';
import SavedAppInstancesResourcesTable from './SavedAppInstancesResourcesTable';
import {
  postAppInstanceResource,
  deleteAppInstanceResource,
  openSettings,
} from '../../../actions';
import { getUsers } from '../../../actions/users';
import Settings from './Settings';
import { PUBLIC_VISIBILITY } from '../../../config/settings';

const saveAsAppInstanceResource = (
  dataToStore,
  dataSource,
  isDataFiltered,
  { dispatchPostAppInstanceResource },
) => {
  dispatchPostAppInstanceResource({
    data: {
      importedData: dataToStore,
      source: dataSource,
      filtered: isDataFiltered,
    },
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
const defaultSelectedColumns = [
  'userid',
  'courseid',
  'role',
  'action',
  'target',
  'edulevel',
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
        /* eslint-disable react/forbid-prop-types */
        data: PropTypes.object,
        /* eslint-enable react/forbid-prop-types */
      }),
    ),

    // the import settings
    settings: PropTypes.shape({
      apiEndpoint: PropTypes.string,
      username: PropTypes.string,
      password: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    appInstanceResources: [],
  };

  static styles = (theme) => ({
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
    data: [],
    dataSource: '',
    selectedColumns: defaultSelectedColumns,
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
    console.log(sourceUrl);
    console.log(data);
    const allValues = {};
    availableColumns.forEach((column) => {
      allValues[column] = [];
    });
    data.forEach((entry) => {
      // Convert timecreated to readable datetime string
      if (entry.timecreated) {
        entry.timecreated = new Date(entry.timecreated * 1000).toLocaleString(); // eslint-disable-line no-param-reassign
      }
      // Add all values to the list of possible values for this column
      availableColumns.forEach((column) => {
        allValues[column].push(entry[column]);
      });
    });
    const filters = {};
    Object.keys(allValues).forEach((key) => {
      const uniqueValues = [...new Set(allValues[key])];
      filters[key] = {}; // required befor defining the attributes
      filters[key].options = uniqueValues;
      // set initial value to contain all possible values
      filters[key].selection = uniqueValues;
    });
    this.setState({
      data,
      dataSource: sourceUrl,
      filters,
    });
  };

  /**
   * Fillter the dataset by checking each column and its corresponding filter
   * @param {*} data
   */
  filterRows = (data) => {
    const { filters } = this.state;
    return data.filter((row) =>
      availableColumns.every(
        (column) =>
          filters[column].selection.length === 0 ||
          filters[column].selection.includes(row[column]),
      ),
    );
  };

  /**
   * Render a filter option for each selected column
   */
  renderCourseLogFilters = () => {
    const { t } = this.props;
    const { selectedColumns, filters } = this.state;
    const renderedFilters = [];
    if (Object.keys(filters).length !== 0 && filters.constructor === Object) {
      selectedColumns.forEach((column) => {
        // Skip the column time created. This would require a more suitable filter solution like a date range selector
        if (column === 'timecreated') return;
        renderedFilters.push(
          <Grid item sm={6} md={3} lg={2} key={`filter-${column}`}>
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
              getOptionLabel={(option) => String(option)}
              renderInput={(params) => (
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
            getOptionLabel={(option) => option}
            renderInput={(params) => (
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
    const { classes, t, dispatchOpenSettings } = this.props;
    const { data, dataSource, selectedColumns } = this.state;
    return (
      <>
        <Grid container spacing={0}>
          <Grid item xs={12} className={classes.main}>
            <SavedAppInstancesResourcesTable />

            <Typography
              variant="h6"
              color="inherit"
              className={classes.sectionTitle}
            >
              {t('Working Data')}
            </Typography>
            <Paper className={classes.root}>
              {this.renderCourseLogConfiguration()}
              <Button
                color="primary"
                id="saveRawAsAppInstanceResourceButton"
                className={classes.button}
                disabled={data.length === 0}
                variant="contained"
                onClick={() => {
                  saveAsAppInstanceResource(
                    data,
                    dataSource,
                    false,
                    this.props,
                  );
                }}
              >
                {t('Save Unfiltered')}
              </Button>
              <Button
                color="primary"
                id="saveFilteredAsAppInstanceResourceButton"
                className={classes.button}
                disabled={data.length === 0}
                variant="contained"
                onClick={() => {
                  saveAsAppInstanceResource(
                    this.filterRows(data),
                    dataSource,
                    true,
                    this.props,
                  );
                }}
              >
                {t('Save Filtered')}
              </Button>

              <DataTable
                data={this.filterRows(data)}
                selectedColumns={selectedColumns}
              />
            </Paper>
          </Grid>
        </Grid>

        <Settings onImportData={this.onImportData} />
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
