import './mixins/index.js';
import plTable from './src/plTable';

/* istanbul ignore next */
plTable.install = function(Vue) {
  Vue.component(plTable.name, plTable);
};

export default plTable;
