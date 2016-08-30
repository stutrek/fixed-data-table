/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

"use strict";

var FakeObjectDataListStore = require('./helpers/FakeObjectDataListStore');
var FixedDataTable = require('fixed-data-table');
var React = require('react');

const {Table, Column, Cell} = FixedDataTable;

const TextCell = ({rowIndex, data, columnKey, ...props}) => (
  <Cell {...props}>
    {data.getObjectAt(rowIndex)[columnKey]}
  </Cell>
);

var columnTitles = {
  'firstName': 'First Name',
  'lastName': 'Last Name',
  'sentence': 'Sentence',
  'companyName': 'Company',
  'city': 'City',
  'street': 'Street',
  'zipCode': 'Zip Code',
  'email': 'Email'

};

class ReorderExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataList: new FakeObjectDataListStore(1000000),
      columnWidths: {
        firstName: 240,
        lastName: 150,
        sentence: 140,
        companyName: 260,
      },
      columnOrder: [
        'firstName',
        'lastName',
        'sentence',
        'companyName',
        'city',
        'street',
        'zipCode',
        'email'
      ],
    };

    this._onColumnReorderEndCallback = this._onColumnReorderEndCallback.bind(this);
    this._onColumnResizeEndCallback = this._onColumnResizeEndCallback.bind(this);
  }

  _onColumnResizeEndCallback(newColumnWidth, columnKey) {
    this.setState(({columnWidths}) => ({
      columnWidths: {
        ...columnWidths,
        [columnKey]: newColumnWidth,
      }
    }));
  }

  _onColumnReorderEndCallback(event) {
    console.log('column reorder end', event);
    var columnOrder = this.state.columnOrder.filter((columnKey) => {
      return columnKey !== event.reorderColumn;
    });
    console.log(columnOrder.toString());
    if (event.columnAfter) {
      var index = columnOrder.indexOf(event.columnAfter);
      columnOrder.splice(index, 0, event.reorderColumn);
    } else {
      columnOrder.push(event.reorderColumn);
    }
    console.log(columnOrder.toString());
    this.setState({
      columnOrder: columnOrder
    });
  }

  render() {
    console.log('rendering', this.state.columnOrder.toString());
    var {dataList} = this.state;

    function cellClick (event) {
      console.log('cell click', event);
    }

    return (
      <Table
        rowHeight={30}
        headerHeight={50}
        rowsCount={dataList.getSize()}
        onColumnResizeEndCallback={this._onColumnResizeEndCallback}
        onColumnReorder={this._onColumnReorderEndCallback}
        width={1000}
        height={500}
        {...this.props}>
        {this.state.columnOrder.map((columnKey, i) => {
          return <Column
            columnKey={columnKey}
            key={columnKey}
            header={<Cell onClick={cellClick}>{columnTitles[columnKey]}</Cell>}
            cell={<TextCell data={dataList} />}
            fixed={i === 0}
            width={this.state.columnWidths[columnKey] || 150}
            isResizable={true}
           />;
        })}
       </Table>
    );
  }
}

module.exports = ReorderExample;
