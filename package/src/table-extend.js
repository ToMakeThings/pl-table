import ElementUi, {
  Table
} from 'element-ui'

import Mousewheel from 'element-ui/lib/directives/mousewheel'
import { hasClass, addClass, removeClass } from 'element-ui/src/utils/dom';

import VirtualTableBodyRender from './virtual-table-body-render.js'
import VirtualTableHeaderRender from './virtual-table-header-render.js'
import VirtualTableFooterRender from './virtual-table-footer-render.js'

const ElTableBody = Table.components.TableBody // 表体
const ElTableHeader = Table.components.TableHeader // 头部
const ElTableFooter = Table.components.TableFooter // 表尾

function trans (version) {
  const versionNums = version.toString().split('.')
  let result = Array.from({ length: 3 })

  result = result.map((_, idx) => {
    const num = versionNums[idx]

    if (!num) {
      return '00'
    } else {
      return +num < 10 ? `0${num}` : num
    }
  }).join('')

  return +result
}
const ElementUiVersion = trans(ElementUi.version) >= trans(2.8)

ElTableBody.directives = {
  Mousewheel
}

const oldDataComputed = ElTableBody.computed.data
ElTableBody.computed.data = function () {
  const { table } = this
  const tableData = oldDataComputed.call(this)
  if (table.useVirtual) {
    return tableData.slice(table.start, table.end)
  } else {
    return tableData
  }
}

const oldHoverRowHandler = ElTableBody.watch && ElTableBody.watch['store.states.hoverRow']
if (oldHoverRowHandler) {
  ElTableBody.watch['store.states.hoverRow'] = function (newVal, oldVal) {
    if (!this.table.useVirtual) {
      oldHoverRowHandler && oldHoverRowHandler.call(this, newVal, oldVal)
    }
  }
}

ElTableBody.methods.getIndex = function (index) {
  return this.table.start + index;
}

const oldGetRowClassHandler = ElTableBody.methods.getRowClass
ElTableBody.methods.getRowClass  = function (row, rowIndex) {
  let classes = oldGetRowClassHandler.call(this, row, rowIndex)
  if (row.disabled) {
    classes.push('pl-disabled')
  }
  if (this.table.useVirtual && rowIndex === this.store.states.hoverRow && (this.table.rightFixedColumns.length || this.table.fixedColumns.length)) {
    // 兼容element-ui低版本
    if (ElementUiVersion && Object.prototype.toString.call(classes) === '[object Array]') {
      classes.push('hover-row')
    } else if (typeof classes === 'string') {
      classes += ' hover-row'
    }
  }
  return classes
}

// 修改ele表体源码 （进行重新渲染）
const oldRender = ElTableBody.render
ElTableBody.render = function (h) {
  if (this.table.useVirtual) {
    return VirtualTableBodyRender.call(this, h)
  } else {
    return oldRender.call(this, h)
  }
}

const headerRender = ElTableHeader.render
// 修改ele头部源码 （进行重新渲染）
ElTableHeader.render = function (h) {
  const { table } = this
  // headerDragStyle,通过pl-table插件传递
  if (table.headerDragStyle) {
    if (table.$el) {
      const doms = document.querySelector('.ant-table-scroll')
      // 隐藏ele头部拖动的边框线
      doms.classList.add('pl-table-header-border-right-none')
    }
    return VirtualTableHeaderRender.call(this, h)
  } else {
    return headerRender.call(this, h)
  }
}

// 修改ele表体拖动方法(改变拖动手指样式)
ElTableHeader.methods.handleMouseMove = function (event, column) {
  const { table } = this
  if (column.children && column.children.length > 0) return;
  let target = event.target;
  while (target && target.tagName !== 'TH') {
    target = target.parentNode;
  }

  if (!column || !column.resizable) return;

  if (!this.dragging && this.border) {
    let rect = target.getBoundingClientRect();

    const bodyStyle = document.body.style;
    if (rect.width > 12 && rect.right - event.pageX < 8) {
      // 是否修改ele表体拖动方法(改变拖动手指样式) 通过pl-table插件传递
      if (table.headerDragStyle) {
        bodyStyle.cursor = 'ew-resize';
        if (hasClass(target, 'is-sortable')) {
          target.style.cursor = 'ew-resize';
        }
      } else {
        bodyStyle.cursor = 'col-resize';
        if (hasClass(target, 'is-sortable')) {
          target.style.cursor = 'col-resize';
        }
      }
      this.draggingColumn = column;
    } else if (!this.dragging) {
      bodyStyle.cursor = '';
      if (hasClass(target, 'is-sortable')) {
        target.style.cursor = 'pointer';
      }
      this.draggingColumn = null;
    }
  }
}

// 修改ele拖动bug, 当设置column.resizable = false 的时候不让拖动
ElTableHeader.methods.handleMouseDown = function (event, column) {
  if (this.$isServer) return;
  if (column.children && column.children.length > 0) return;
  /* istanbul ignore if */
  if (this.draggingColumn && this.border && column.resizable) {
    this.dragging = true;

    this.$parent.resizeProxyVisible = true;

    const table = this.$parent;
    const tableEl = table.$el;
    const tableLeft = tableEl.getBoundingClientRect().left;
    const columnEl = this.$el.querySelector(`th.${column.id}`);
    const columnRect = columnEl.getBoundingClientRect();
    const minLeft = columnRect.left - tableLeft + 30;

    addClass(columnEl, 'noclick');

    this.dragState = {
      startMouseLeft: event.clientX,
      startLeft: columnRect.right - tableLeft,
      startColumnLeft: columnRect.left - tableLeft,
      tableLeft
    };

    const resizeProxy = table.$refs.resizeProxy;
    resizeProxy.style.left = this.dragState.startLeft + 'px';

    document.onselectstart = function() { return false; };
    document.ondragstart = function() { return false; };

    const handleMouseMove = (event) => {
      const deltaLeft = event.clientX - this.dragState.startMouseLeft;
      const proxyLeft = this.dragState.startLeft + deltaLeft;

      resizeProxy.style.left = Math.max(minLeft, proxyLeft) + 'px';
    };

    const handleMouseUp = () => {
      if (this.dragging) {
        const {
          startColumnLeft,
          startLeft
        } = this.dragState;
        const finalLeft = parseInt(resizeProxy.style.left, 10);
        const columnWidth = finalLeft - startColumnLeft;
        column.width = column.realWidth = columnWidth;
        table.$emit('header-dragend', column.width, startLeft - startColumnLeft, column, event);

        this.store.scheduleLayout();

        document.body.style.cursor = '';
        this.dragging = false;
        this.draggingColumn = null;
        this.dragState = {};

        table.resizeProxyVisible = false;
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.onselectstart = null;
      document.ondragstart = null;

      setTimeout(function() {
        removeClass(columnEl, 'noclick');
      }, 0);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }
}

// 修改ele尾部源码 （进行重新渲染）
const footerRender = ElTableFooter.render
ElTableFooter.render = function (h) {
  if (this.table.addfence) {
    return VirtualTableFooterRender.call(this, h)
  } else {
    return footerRender.call(this, h)
  }
}

// 修改固定列的高度
Table.computed.fixedHeight = function () {
  const { table } = this
  if (this.maxHeight) {
    if (this.showSummary) {
      return {
        bottom: 0
      };
    }
    return {
      bottom: (this.layout.scrollX && this.data.length) ? this.layout.gutterWidth + 'px' : ''
    };
  } else {
    if (this.showSummary) {
      return {
        height: this.layout.tableHeight ? (this.layout.tableHeight + 1) + 'px' : ''
      };
    }
    return {
      height: this.layout.viewportHeight ? this.layout.viewportHeight + 'px' : ''
    };
  }
}
