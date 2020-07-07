import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export class ImportedDataTable extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      table: PropTypes.string,
    }).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  static styles = () => ({
    table: {
      minWidth: 700,
    },
  });

  /**
   * Render the actual TableBody with selected columns and applied filters.
   * If no data is imported yet or no data matches the filter criterion, a specific message is displayed.
   */
  renderImportedDataTableContent() {
    const { t, data, selectedColumns } = this.props;

    // Construct table rows to print later
    const tableRows = [];
    data.forEach((row, i) => {
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
    if (data.length > 0) {
      return <TableBody>{tableRows}</TableBody>;
    }
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={selectedColumns.length}>
            {t('No imported or data matching the filter criterion')}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  render() {
    const { classes, selectedColumns } = this.props;
    const headers = [];
    selectedColumns.forEach((column) => {
      headers.push(<TableCell key={`column-${column}`}>{column}</TableCell>);
    });
    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>{headers}</TableRow>
        </TableHead>
        {this.renderImportedDataTableContent()}
      </Table>
    );
  }
}

const StyledComponent = withStyles(ImportedDataTable.styles)(ImportedDataTable);

export default withTranslation()(StyledComponent);
