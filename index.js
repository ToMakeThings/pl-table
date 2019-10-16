import './package/index'
import plTable from './src/components/plTable'
export default {
  install (Vue, opts = {}) {
    Vue.component('plTable', plTable);
  }
}
