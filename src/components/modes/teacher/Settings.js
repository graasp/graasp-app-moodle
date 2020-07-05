import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import Modal from '@material-ui/core/Modal';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { closeSettings, patchAppInstance } from '../../../actions';
import Loader from '../../common/Loader';
import MoodleApiRequests from '../../../apiRequests/MoodleApiRequests';

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = (theme) => ({
  paper: {
    position: 'absolute',
    width: theme.spacing(50),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
  },
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  textField: {
    marginTop: theme.spacing(3),
  },
  formControl: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
});

class Settings extends Component {
  state = (() => {
    const { settings } = this.props;
    const { apiEndpoint, username, password } = settings;

    const availableCourses = [];
    const selectedCourse = [];
    const connectionEstablished = false;
    // Indicates the user how to proceed or what went wrong to establish a connection
    const connectionUserHint = 'Establish a connection to proceed';
    const apiRequests = new MoodleApiRequests();
    return {
      apiEndpoint,
      username,
      password,
      availableCourses,
      selectedCourse,
      connectionEstablished,
      connectionUserHint,
      apiRequests,
    };
  })();

  static propTypes = {
    classes: PropTypes.shape({
      paper: PropTypes.string,
      textField: PropTypes.string,
      formControl: PropTypes.string,
      button: PropTypes.string,
    }).isRequired,
    open: PropTypes.bool.isRequired,
    activity: PropTypes.bool.isRequired,
    settings: PropTypes.shape({
      apiEndpoint: PropTypes.string,
      username: PropTypes.string,
      password: PropTypes.string,
    }).isRequired,
    t: PropTypes.func.isRequired,
    dispatchCloseSettings: PropTypes.func.isRequired,
    dispatchPatchAppInstance: PropTypes.func.isRequired,
    i18n: PropTypes.shape({
      defaultNS: PropTypes.string,
    }).isRequired,
    onImportData: PropTypes.func.isRequired,
  };

  saveSettings = (settingsToChange) => {
    const { settings, dispatchPatchAppInstance } = this.props;
    const newSettings = {
      ...settings,
      ...settingsToChange,
    };
    dispatchPatchAppInstance({
      data: newSettings,
    });
  };

  handleClose = () => {
    const { dispatchCloseSettings } = this.props;
    dispatchCloseSettings();
  };

  handleSave = () => {
    const { apiEndpoint, username, password } = this.state;
    const settingsToChange = {
      apiEndpoint,
      username,
      password,
    };
    this.saveSettings(settingsToChange);
  };

  handleApiEndpointChange = (event) => {
    this.setState({ apiEndpoint: event.target.value });
  };

  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  /**
   * Establish a connection to the specified API endpoint.
   * Therefore, retrieve a token for future authentication and store it in the state.
   * If connection is successfully established, getAvailableCourses() is executed.
   * Else, the connectionUserHint is updated with an error related message.
   */
  establishConnection = async () => {
    const { t } = this.props;
    const { apiEndpoint, username, password, apiRequests } = this.state;

    const requestSucceeded = await apiRequests.getToken(
      apiEndpoint,
      username,
      password,
    );
    if (requestSucceeded) {
      const availableCourses = await apiRequests.getAvailableCourses();
      if (availableCourses) {
        this.setState({
          connectionEstablished: true,
          availableCourses,
        });
      }
    } else {
      this.setState({
        connectionUserHint: t(
          'Problem establishing the connection, maybe a wrong configuration in LMS or a typo in the API endpoint?',
        ),
        connectionEstablished: false,
      });
    }
  };

  /**
   * Load data for selected courses through API.
   * Calls the callback passed in by the parant component.
   */
  importCourseData = async () => {
    const { onImportData } = this.props;
    const { selectedCourse, apiRequests } = this.state;

    const result = await apiRequests.getCourseData(selectedCourse);
    if (result) {
      const { sourceUrl, data } = result;
      onImportData(sourceUrl, data);
      this.handleClose();
    } else {
      console.error('A problem occured when importing the data');
    }
  };

  /**
   * Renders a Autocomplete Component containing all the available courses and an import button.
   * If the connection is not yet established, a feedback over the progress
   * for the establishement is rendered.
   */
  renderAvailableCourses() {
    const { t, classes } = this.props;
    const {
      selectedCourse,
      availableCourses,
      connectionEstablished,
      connectionUserHint,
    } = this.state;

    let output = '';
    if (connectionEstablished) {
      if (availableCourses.length > 0) {
        output = (
          <>
            <Autocomplete
              id="courseSelection"
              multiple
              filterSelectedOptions
              options={availableCourses}
              values={selectedCourse}
              onChange={(event, newValue) => {
                this.setState({ selectedCourse: newValue });
              }}
              getOptionLabel={(option) => option.shortname}
              renderInput={(params) => (
                <TextField
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...params}
                  variant="standard"
                  label={t('Select Course to Import')}
                  placeholder={t('Select an option')}
                />
              )}
            />
            <Button
              id="importCourse"
              variant="contained"
              className={classes.button}
              color="secondary"
              onClick={this.importCourseData}
              disabled={selectedCourse.length === 0}
            >
              {t('Import Course Data')}
            </Button>
          </>
        );
      } else {
        output = (
          <p>{t('Sorry, there are no courses available for you to import')}</p>
        );
      }
    } else {
      output = <p>{connectionUserHint}</p>;
    }
    return output;
  }

  /**
   * Renders the save and cancel button
   */
  renderButtons() {
    const { t } = this.props;
    const { apiEndpoint, username } = this.state;

    const saveDisabled = apiEndpoint === '' || username === '';

    return (
      <>
        <Tooltip title={t('Save configuration for next Session')} key="save">
          <IconButton
            size="small"
            onClick={this.handleSave}
            disabled={saveDisabled}
          >
            <SaveIcon color="secondary" opacity={saveDisabled ? 0.5 : 1} />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('Cancel')} key="cancel">
          <IconButton size="small" onClick={this.handleClose}>
            <CancelIcon />
          </IconButton>
        </Tooltip>
      </>
    );
  }

  renderModalContent() {
    const { t, activity, classes } = this.props;

    const {
      apiEndpoint,
      username,
      password,
      connectionEstablished,
    } = this.state;

    if (activity) {
      return <Loader />;
    }

    return (
      <>
        <TextField
          id="apiEndpoint"
          label={t('LMS Base URL (with trailing "/" at the end)')}
          value={apiEndpoint}
          onChange={this.handleApiEndpointChange}
          className={classes.textField}
          fullWidth
        />

        <TextField
          id="username"
          label={t('Username')}
          value={username}
          onChange={this.handleUsernameChange}
          className={classes.textField}
          fullWidth
        />

        <TextField
          id="password"
          label={t('Password')}
          value={password}
          type="password"
          onChange={this.handlePasswordChange}
          className={classes.textField}
          fullWidth
        />

        <Button
          id="establishConnection"
          variant="contained"
          className={classes.button}
          color={connectionEstablished ? 'primary' : 'secondary'}
          onClick={this.establishConnection}
          disabled={apiEndpoint === '' || username === ''}
        >
          {!connectionEstablished
            ? t('Establish Connection')
            : t('Connection Established')}
        </Button>

        <hr />

        {this.renderAvailableCourses()}

        <hr />

        {this.renderButtons()}
      </>
    );
  }

  render() {
    const { open, classes, t } = this.props;

    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="h5" id="modal-title">
              {t('Settings')}
            </Typography>
            {this.renderModalContent()}
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = ({ layout, appInstance }) => {
  return {
    open: layout.settings.open,
    settings: appInstance.content.settings,
    activity: Boolean(appInstance.activity.length),
  };
};

const mapDispatchToProps = {
  dispatchCloseSettings: closeSettings,
  dispatchPatchAppInstance: patchAppInstance,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
const TranslatedComponent = withTranslation()(ConnectedComponent);

export default withStyles(styles)(TranslatedComponent);
