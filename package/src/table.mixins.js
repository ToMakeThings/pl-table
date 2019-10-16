export default {
  props: {
    rowHeight: {
      type: Number,
      default: 60
    },
    excessRows: {
      type: Number,
      default: 3
    },
    headerDragStyle: {
      type: Boolean,
      default: false
    },
    tooltipPlacement: {
      default: 'top',
      type: String
    },
    addfence: {
      type: Boolean,
      default: false
    },
    fenceMethod: Function,
    useVirtual: Boolean
  },
  data () {
    return {
      scrollTop: 0,
      innerTop: 0,
      start: 0,
      end: 0
    }
  },
  computed: {
    visibleCount () {
      return Math.ceil(this.height / this.rowHeight)
    },

    virtualBodyHeight () {
      return this.data.length * this.rowHeight
    }
  },
  watch: {
    scrollTop: {
      immediate: true,
      handler (top) {
        this.computeScrollToRow(top)
      }
    },

    virtualBodyHeight () {
      setTimeout(this.doLayout, 10)
    },

    height () {
      this.computeScrollToRow(this.scrollTop)
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.useVirtual) {
        const tableBodyWrapper = this.$el.querySelector('.el-table__body-wrapper')
        tableBodyWrapper.addEventListener('scroll', this.handleScroll)
        tableBodyWrapper.addEventListener('DOMMouseScroll', this.handleScroll)
      }
    })
  },
  activated () {
    if (this.useVirtual) {
      this.computeScrollToRow(0)
    }
  },
  methods: {
    // 表体滚动到什么位置
    pagingScrollTop (top) {
      const tableBodyWrapper = this.$el.querySelector('.el-table__body-wrapper')
      if (tableBodyWrapper) {
        tableBodyWrapper.scrollTop = top
        tableBodyWrapper.scrollLeft = 0
      }
    },

    computeScrollToRow (scrollTop) {
      let startIndex = parseInt(scrollTop / this.rowHeight)

      const { start, end } = this.getVisibleRange(startIndex)
      this.start = start
      this.end = end
      this.innerTop = this.start * this.rowHeight
    },

    getVisibleRange (expectStart) {
      const start = expectStart - this.excessRows

      return {
        start: start >= 0 ? start : 0,
        end: expectStart + this.visibleCount + this.excessRows
      }
    },

    handleScroll (e) {
      const ele = e.srcElement || e.target
      let { scrollTop } = ele
      const bodyScrollHeight = this.visibleCount * this.rowHeight

      // 解决 滚动时 行hover高亮的问题
      this.store.states.hoverRow = null

      if (this.virtualBodyHeight < scrollTop + bodyScrollHeight) {
        scrollTop = this.virtualBodyHeight - bodyScrollHeight
      }

      this.scrollTop = scrollTop
    }
  }
}
