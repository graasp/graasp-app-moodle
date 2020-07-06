import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { deleteAppInstanceResource } from '../../../actions';
import { getUsers } from '../../../actions/users';

export class SavedAppInstancesResourcesTable extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string,
      table: PropTypes.string,
      main: PropTypes.string,
      button: PropTypes.string,
      message: PropTypes.string,
      sectionTitle: PropTypes.string,
      fab: PropTypes.string,
    }).isRequired,
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
    dispatchDeleteAppInstanceResource: PropTypes.func.isRequired,
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
  });

  /**
   * helper method to render the rows of the app instance resource table
   * @param appInstanceResources
   * @param dispatchDeleteAppInstanceResource
   * @returns {*}
   */
  renderAppInstanceResources = () => {
    const {
      t,
      dispatchDeleteAppInstanceResource,
      appInstanceResources,
    } = this.props;
    // if there are no resources, show an empty table
    if (!appInstanceResources.length) {
      return (
        <TableRow>
          <TableCell colSpan={6}>{t('No App Instance Resources')}</TableCell>
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
        <TableCell>{data.filtered ? <CheckIcon /> : <ClearIcon />}</TableCell>
        <TableCell>
          <IconButton
            color="primary"
            className="deleteAppInstanceButton"
            onClick={() => dispatchDeleteAppInstanceResource(_id)}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  };

  render() {
    // extract properties from the props object
    const {
      // this property allows us to do styling and is injected by withStyles
      classes,
      // this property allows us to do translations and is injected by i18next
      t,
    } = this.props;
    return (
      <>
        <Typography
          variant="h6"
          color="inherit"
          className={classes.sectionTitle}
        >
          {t('Saved Resources')}
        </Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>{t('ID')}</TableCell>
                <TableCell>{t('App Instance')}</TableCell>
                <TableCell>{t('Source')}</TableCell>
                <TableCell>{t('Data Entries')}</TableCell>
                <TableCell>{t('Filtered')}</TableCell>
                <TableCell>{t('Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{this.renderAppInstanceResources()}</TableBody>
          </Table>
        </Paper>
      </>
    );
  }
}

// get the app instance resources that are saved in the redux store
const mapStateToProps = ({ appInstanceResources }) => ({
  appInstanceResources: appInstanceResources.content,
});

// allow this component to dispatch a post
// request to create an app instance resource
const mapDispatchToProps = {
  dispatchGetUsers: getUsers,
  dispatchDeleteAppInstanceResource: deleteAppInstanceResource,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SavedAppInstancesResourcesTable);

const StyledComponent = withStyles(SavedAppInstancesResourcesTable.styles)(
  ConnectedComponent,
);

export default withTranslation()(StyledComponent);
