import {
  Table
} from 'element-ui'

import './src/table-extend'
import tableMixins from './src/table.mixins'
if (!Table.mixins) {
  Table.mixins = []
}
Table.mixins.push(tableMixins)
