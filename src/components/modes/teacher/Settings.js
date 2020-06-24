import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import Modal from '@material-ui/core/Modal';
import Switch from '@material-ui/core/Switch';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withTranslation } from 'react-i18next';
import { closeSettings, patchAppInstance } from '../../../actions';
import Loader from '../../common/Loader';

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
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
    const { moodleApiEndpoint, moodleUsername, moodlePassword } = settings;

    const moodleApiToken = '';
    const moodleAvailableCourses = [];
    const moodleSelectedCourse = '';
    const connectionEstablished = false;
    // Indicates the user how to proceed or what went wrong to establish a connection
    const connectionUserHint = 'Establish a connection to proceed';
    return {
      moodleApiEndpoint,
      moodleUsername,
      moodlePassword,
      moodleAvailableCourses,
      moodleSelectedCourse,
      connectionEstablished,
      moodleApiToken,
      connectionUserHint,
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
      headerVisible: PropTypes.bool.isRequired,
      moodleApiEndpoint: PropTypes.string,
      moodleUsername: PropTypes.string,
      moodlePassword: PropTypes.string,
    }).isRequired,
    t: PropTypes.func.isRequired,
    dispatchCloseSettings: PropTypes.func.isRequired,
    dispatchPatchAppInstance: PropTypes.func.isRequired,
    i18n: PropTypes.shape({
      defaultNS: PropTypes.string,
    }).isRequired,
    onImportData: PropTypes.func.isRequired,
  };

  saveSettings = settingsToChange => {
    const { settings, dispatchPatchAppInstance } = this.props;
    const newSettings = {
      ...settings,
      ...settingsToChange,
    };
    dispatchPatchAppInstance({
      data: newSettings,
    });
  };

  handleChangeHeaderVisibility = () => {
    const {
      settings: { headerVisible },
    } = this.props;
    const settingsToChange = {
      headerVisible: !headerVisible,
    };
    this.saveSettings(settingsToChange);
  };

  handleClose = () => {
    const { dispatchCloseSettings } = this.props;
    dispatchCloseSettings();
  };

  isSaveDisabled = () => {
    return false;
  };

  handleSave = () => {
    const { moodleApiEndpoint, moodleUsername, moodlePassword } = this.state;
    const settingsToChange = {
      moodleApiEndpoint,
      moodleUsername,
      moodlePassword,
    };
    this.saveSettings(settingsToChange);
  };

  handleMoodleApiChange = event => {
    this.setState({ moodleApiEndpoint: event.target.value });
  };

  handleMoodleUsernameChange = event => {
    this.setState({ moodleUsername: event.target.value });
  };

  handleMoodlePasswordChange = event => {
    this.setState({ moodlePassword: event.target.value });
  };

  handleSelectCourse = event => {
    this.setState({
      moodleSelectedCourse: event.target.value,
    });
  };

  importCourseData = () => {
    const { onImportData } = this.props;
    const {
      moodleApiEndpoint,
      moodleSelectedCourse,
      moodleApiToken,
    } = this.state;
    const moodleDataExportEndpoint = `${moodleApiEndpoint}/webservice/rest/server.php?wstoken=${moodleApiToken}&wsfunction=local_wstemplate_get_course_data&moodlewsrestformat=json&courseids[0]=${moodleSelectedCourse}`;
    fetch(moodleDataExportEndpoint)
      .then(response => response.json())
      .then(data => onImportData(data))
      .then(() => this.handleClose());
  };

  establishConnection = () => {
    const { moodleApiEndpoint, moodleUsername, moodlePassword } = this.state;
    const { t } = this.props;
    // the name of the web service in moodle, which will then be used for the export/import of data
    const moodleService = 'myservice';
    const moodleTokenEndpoint = `${moodleApiEndpoint}login/token.php?username=${moodleUsername}&password=${moodlePassword}&service=${moodleService}`;
    // get the token to be authenticated later
    fetch(moodleTokenEndpoint)
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          this.setState({
            moodleApiToken: data.token,
          });
          this.getAvailableCourses();
        } else if (data.errorcode === 'invalidlogin') {
          // Display wrong login credential
          this.setState({
            connectionUserHint: t('Invalid login credentials'),
            connectionEstablished: false,
          });
        } else {
          // Indicate other problem and just print errorcode
          this.setState({
            connectionUserHint: t(
              'Problem establishing the connection, maybe a wrong configuration in Moodle or a typo in the API endpoint?',
            ),
            connectionEstablished: false,
          });
        }
      });
  };

  getAvailableCourses = () => {
    const { moodleApiEndpoint, moodleApiToken } = this.state;
    const moodleAvailableCoursesEndpoint = `${moodleApiEndpoint}/webservice/rest/server.php?wstoken=${moodleApiToken}&wsfunction=local_wstemplate_get_available_courses&moodlewsrestformat=json`;
    fetch(moodleAvailableCoursesEndpoint)
      .then(res => res.json())
      .then(res => {
        this.setState({
          connectionEstablished: true,
          moodleAvailableCourses: res,
        });
        // check if a result is found to define the default value of the select
        if (res.length > 0) {
          this.setState({
            moodleSelectedCourse: res[0].courseid,
          });
        }
      });
  };

  renderAvailableCourses() {
    const { t, classes } = this.props;
    const {
      moodleSelectedCourse,
      moodleAvailableCourses,
      connectionEstablished,
      connectionUserHint,
    } = this.state;

    const menuItems = [];
    moodleAvailableCourses.forEach(course => {
      menuItems.push(
        <MenuItem value={course.courseid} key={course.courseid}>
          {course.shortname}
        </MenuItem>,
      );
    });

    let output = '';
    if (connectionEstablished) {
      output = (
        <FormControl className={classes.formControl}>
          <InputLabel id="select-course-label">
            {t('Select Course to Import')}
          </InputLabel>
          <Select
            labelId="select-course-label"
            id="select-course"
            value={moodleSelectedCourse}
            onChange={this.handleSelectCourse}
            fullWidth
          >
            {menuItems}
          </Select>
        </FormControl>
      );
    } else {
      output = <p>{connectionUserHint}</p>;
    }
    return output;
  }

  // Only rendered when the connection is established
  renderImportButton() {
    const { t, classes } = this.props;
    const { connectionEstablished } = this.state;

    let output = '';
    if (connectionEstablished) {
      output = (
        <Button
          variant="contained"
          className={classes.button}
          color="secondary"
          onClick={this.importCourseData}
        >
          {t('Import Course Data')}
        </Button>
      );
    }
    return output;
  }

  // Renders the save and cancel button
  renderButtons() {
    const { t } = this.props;

    const saveDisabled = this.isSaveDisabled();

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
    const { t, settings, activity, classes } = this.props;
    const { headerVisible } = settings;

    const {
      moodleApiEndpoint,
      moodleUsername,
      moodlePassword,
      connectionEstablished,
    } = this.state;

    if (activity) {
      return <Loader />;
    }

    const switchControl = (
      <Switch
        color="primary"
        checked={headerVisible}
        onChange={this.handleChangeHeaderVisibility}
        value="headerVisibility"
      />
    );

    return (
      <>
        <FormControlLabel
          control={switchControl}
          label={t('Show Header to Students')}
        />

        <TextField
          id="moodleApiEndpoint"
          label={t('Moodle Endpoint (with trailing "/" at the end)')}
          value={moodleApiEndpoint}
          onChange={this.handleMoodleApiChange}
          className={classes.textField}
          fullWidth
        />

        <TextField
          id="moodleUsername"
          label={t('Moodle Username')}
          value={moodleUsername}
          onChange={this.handleMoodleUsernameChange}
          className={classes.textField}
          fullWidth
        />

        <TextField
          id="moodlePassword"
          label={t('Moodle Password')}
          value={moodlePassword}
          onChange={this.handleMoodlePasswordChange}
          className={classes.textField}
          fullWidth
        />

        <Button
          variant="contained"
          className={classes.button}
          color={connectionEstablished ? 'primary' : 'secondary'}
          onClick={this.establishConnection}
        >
          {!connectionEstablished
            ? t('Establish Connection')
            : t('Connection established')}
        </Button>

        <hr />

        {this.renderAvailableCourses()}

        {this.renderImportButton()}

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
