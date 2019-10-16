const convertToRows = (originColumns) => {
  let maxLevel = 1;
  const traverse = (column, parent) => {
    if (parent) {
      column.level = parent.level + 1;
      if (maxLevel < column.level) {
        maxLevel = column.level;
      }
    }
    if (column.children) {
      let colSpan = 0;
      column.children.forEach((subColumn) => {
        traverse(subColumn, column);
        colSpan += subColumn.colSpan;
      });
      column.colSpan = colSpan;
    } else {
      column.colSpan = 1;
    }
  };

  originColumns.forEach((column) => {
    column.level = 1;
    traverse(column);
  });

  const rows = [];
  for (let i = 0; i < maxLevel; i++) {
    rows.push([]);
  }

  const allColumns = getAllColumns(originColumns);

  allColumns.forEach((column) => {
    if (!column.children) {
      column.rowSpan = maxLevel - column.level + 1;
    } else {
      column.rowSpan = 1;
    }
    rows[column.level - 1].push(column);
  });

  return rows;
};
const getAllColumns = (columns) => {
  const result = [];
  columns.forEach((column) => {
    if (column.children) {
      result.push(column);
      result.push.apply(result, getAllColumns(column.children));
    } else {
      result.push(column);
    }
  });
  return result;
};
export default function render (h) {
  const originColumns = this.store.states.originColumns;
  const columnRows = convertToRows(originColumns, this.columns);
  // 是否拥有多级表头
  const isGroup = columnRows.length > 1;
  if (isGroup) this.$parent.isGroup = true;
  return (
        <table
    class="el-table__header"
      cellspacing="0"
      cellpadding="0"
      border="0">
        <colgroup>
        {
          this.columns.map(column => <col name={ column.id } key={column.id} />)
    }
      {
        this.hasGutter ? <col name="gutter" /> : ''
      }
    </colgroup>
      <thead class={ [{ 'is-group': isGroup, 'has-gutter': this.hasGutter }] }>
        {
          this._l(columnRows, (columns, rowIndex) =>
        <tr
      style={ this.getHeaderRowStyle(rowIndex) }
    class={ this.getHeaderRowClass(rowIndex) }
    >
      {
        columns.map((column, cellIndex) => (<th
        colspan={ column.colSpan }
        rowspan={ column.rowSpan }
        on-mousemove={ ($event) => this.handleMouseMove($event, column) }
        on-mouseout={ this.handleMouseOut }
        on-mousedown={ ($event) => this.handleMouseDown($event, column) }
        on-click={ ($event) => this.handleHeaderClick($event, column) }
        on-contextmenu={ ($event) => this.handleHeaderContextMenu($event, column) }
        style={ this.getHeaderCellStyle(rowIndex, cellIndex, columns, column) }
      class={ this.getHeaderCellClass(rowIndex, cellIndex, columns, column) }
        key={ column.id }>
        {/* 修改源码 添加拖动图标 */}
        {
          column.resizable
            ? <span class="pltableDragIcon"> <i></i> </span>
        : ''
        }
      <div class={ ['cell', column.filteredValue && column.filteredValue.length > 0 ? 'highlight' : '', column.labelClassName] }>
        {
          column.renderHeader
            ? column.renderHeader.call(this._renderProxy, h, { column, $index: cellIndex, store: this.store, _self: this.$parent.$vnode.context })
            : column.label
        }
        {
          column.sortable ? (<span
            class="caret-wrapper"
          on-click={ ($event) => this.handleSortClick($event, column) }>
        <i class="sort-caret ascending"
          on-click={ ($event) => this.handleSortClick($event, column, 'ascending') }>
        </i>
        <i class="sort-caret descending"
          on-click={ ($event) => this.handleSortClick($event, column, 'descending') }>
        </i>
        </span>) : ''
        }
        {
          column.filterable ? (<span
            class="el-table__column-filter-trigger"
          on-click={ ($event) => this.handleFilterClick($event, column) }>
        <i class={ ['el-icon-arrow-down', column.filterOpened ? 'el-icon-arrow-up' : ''] }></i>
        </span>) : ''
        }
      </div>
      </th>))
      }
      {
        this.hasGutter ? <th class="gutter"></th> : ''
      }
    </tr>
    )
    }
    </thead>
      </table>
    );
}
