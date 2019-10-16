# pl-table  当前版本: "version": "2.3.6"
> 一个表格插件（完美解决万级数据渲染卡顿问题）

> 流畅渲染万级数据并不会影响到 element-ui el-table组件的原有功能，并且新增了一些功能，具体请看属性配置

> element版本兼容：目前测试能兼容的element-ui的版本为 2.3.9 - 2.12.0(不代表高版本就不能使用)

> author: pengLei （如有问题请加QQ：403802162）


# 安装方式 and 引入方式
  ** npm方式安装 **
``` javascript
  // npm i pl-table vuedraggable

  // npm引入方式 如下
  // main.js
  // 注：需要在Vue.use(ElementUi) 之前引入 （因为基于ele，所以需要安装element）
  import ElementUI from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import plTable from 'pl-table'
  Vue.use(ElementUI);
  Vue.use(plTable);

  new Vue({
    el: '#app',
    render: h => h(App)
  });
```

  ** CDN方式 **
``` javascript
  <!--引入element-ui的样式-->
  <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">

  <!--引入plTable的样式-->
  <link rel="stylesheet" href="https://unpkg.com/pl-table/themes/plTableStyle.css">

  <!-- import Vue before Element -->
  <script src="https://unpkg.com/vue/dist/vue.js"></script>

  <!--element的cdn方式可以不用引入，（当然你也可以引入）-->
  <!--<script src="https://unpkg.com/element-ui/lib/index.js"></script>-->

  <!--注意你只需要引入如下文件，就可以使用element的所有组件，里面包含了pl-table组件哦-->
  <script src="https://unpkg.com/pl-table/lib/index.js"></script>
```

# 报错(使用注意点, cdn方式请跳过)
  原因：内置组件采用JSX写法
```shell
    error  in ./node_modules/pl-table/package/src/virtual-table-header-render.js
    Module parse failed: Unexpected token (64:8)
    You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
    |   if (isGroup) this.$parent.isGroup = true;
    |   return (
    >         <table
    |     class="el-table__header"
    |       cellspacing="0"
```

# 解决上诉问题（cdn方式请跳过）
   **如果你使用的是vue-cli 2.x  配置如下**

   第一步:
   npm install babel-plugin-transform-vue-jsx babel-plugin-syntax-jsx --save-dev

   ![image](https://github.com/livelyPeng/pl-table/blob/master/assets/method2.png)

   第二步: （前提是必须安装了 babel-loader）

   ![image](https://github.com/livelyPeng/pl-table/blob/master/assets/method.png)


   **如果你使用的是vue-cli 3.x  配置如下**

   第一步:

   npm install @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props --save-dev

   第二步:

   ![image](https://github.com/livelyPeng/pl-table/blob/master/assets/vue3method3.png)

   第三步:

   ![image](https://github.com/livelyPeng/pl-table/blob/master/assets/vue3method2.png)



# 用前须知
   **如果你使用 use-virtual（渲染大数据）请看下面， 当然如果你不用use-virtual属性（可以跳过须知），因为它就不存在下面的情况啦**

   1. 使用use-virtual渲染大数据属性: 暂不支持树形数据与懒加载与展开行

   2. 请看如下图
   ![image](https://github.com/livelyPeng/pl-table/blob/master/assets/tishi.png)


# pl-table表格的API
  https://github.com/penglei1996/pl-table/wiki/Component-API


# 实例文件（基础用法）
>  https://github.com/livelyPeng/pl-table/blob/master/Example/index.vue // npm方式实例
>  https://github.com/livelyPeng/pl-table/blob/master/index.html  // cdn方式实例
  
  
# 更新日志
 **2.3.6**
 1.解决渲染大数据不能排序问题

 **2.3.5**
 1. 修改表格bug, 优化表格 2. 添加行被禁用选择样式功能

 **2.3.4**
 1. 添加cdn引入方式

 **2.3.2**
 1. 修改表格的bug

 **2.3.1**
 1. 修改表格的bug 2. 新增表格方法 3. 优化表格事件 4. 完善功能

 **2.3.0**
 1. 修改表格的bug

 **2.2.9**
 1. 修改表格的bug 2. 新增表格方法

 **2.2.8**
 1. 增加了表格自适应高度，不给高度（具体请看表格 height-switch属性）  2. 修改表格的bug

 **2.2.7**
 1. 添加自定义的合计计算方法 2. 修改ele表格的bug 3. 添加更多表格属性
