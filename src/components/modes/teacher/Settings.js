import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
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
    margin: theme.spacing(),
  },
  textField: {
    marginTop: theme.spacing(3),
  },
});

class Settings extends Component {
  state = (() => {
    const { settings } = this.props;
    const { moodleApiEndpoint, moodleUsername, moodlePassword } = settings;
    return {
      moodleApiEndpoint,
      moodleUsername,
      moodlePassword,
    };
  })();

  static propTypes = {
    classes: PropTypes.shape({
      paper: PropTypes.string,
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
    console.log('Saves');
    const { moodleApiEndpoint, moodleUsername, moodlePassword } = this.state;
    const settingsToChange = {
      moodleApiEndpoint: moodleApiEndpoint,
      moodleUsername: moodleUsername,
      moodlePassword: moodlePassword,
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

  // Renders the save and cancel button
  renderButtons() {
    const { t } = this.props;

    const saveDisabled = this.isSaveDisabled();

    return (
      <>
        <Tooltip title={t('Save')} key="save">
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

    const { moodleApiEndpoint, moodleUsername, moodlePassword } = this.state;

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
          label={t('Moodle Endpoint (t.b.d.)')}
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
