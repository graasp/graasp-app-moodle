import React from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { Analytics } from '@graasp/moodle';

const VisualizationButton = ({ id, context }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { dev } = context;
  const devAsString = dev.toString();

  return (
    <>
      <IconButton color="primary" onClick={() => handleOpen()}>
        <AssessmentIcon />
      </IconButton>
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <Analytics
          context={{
            ...context,
            dev: devAsString,
            appInstanceResourceId: id,
          }}
        />
      </Dialog>
    </>
  );
};

VisualizationButton.propTypes = {
  id: PropTypes.string.isRequired,
  context: PropTypes.shape({
    dev: PropTypes.bool.isRequired,
  }).isRequired,
};

// get the app instance resources that are saved in the redux store
const mapStateToProps = ({ context }) => ({
  context,
});

const ConnectedComponent = connect(mapStateToProps, null)(VisualizationButton);

export default ConnectedComponent;
