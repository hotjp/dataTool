<template>
  <div id="dashboardDir">
    <div class="fix dirTreeTitle">
      仪表盘
      <i class="el-icon-more r"></i>
      <i class="el-icon-plus r"  @click="showAddDialog"></i>
      <div class="search_box r">
        <i class="el-icon-search"></i>
        <input type="text" v-model="search" class="search_input">
      </div>
      
    </div>
    <!--  TODO: 目前仪表盘列表没有层级 -->
    <!-- <ul>
      <li class="right" @dragstart="onDragstart(dir,dirIndex)" v-for="(dir,dirIndex) in dirs" :key="dirIndex">
        <el-tooltip class="item" effect="light" placement="right">
          <div slot="content">名称：{{dir.text}}<br/>标签:<br/>备注:</div>
          <a href="javascript:;" class="dirText" @click.self="dirToggleChildren(dirIndex)">
            <i class="el-icon-menu"></i>{{dir.text}}
          </a>
        </el-tooltip>

        <ul v-if="dir.childrenShow"> -->
          <!-- selectstart 禁止被选中  拖拽元素-->
          <!-- dragstart 拖拽开始  拖拽元素-->
          <!-- dragend 拖拽结束  拖拽元素-->
          <!-- dragover 拖拽元素在目标元素头上移动的时候，目标元素-->
          <!-- dragenter拖拽元素进入目标元素头上的时候，目标元素 -->
          <!-- OnDrop拖拽元素进入目标元素头上，同时鼠标松开的时候,目标元素 -->
          <!-- <li class="dirChildren right" @drop="onDrop" @dragenter="onDragenter" @dragover="onDragover" @dragend="onDragend" @dragstart="onDragstart" @selectstart="onSelectstart" draggable="true" v-for="(child,childIndex) in dir.children" :key="childIndex">
            <el-tooltip class="item" effect="light" :content="'名称：'+child.text" placement="right">
              <div>
                <div class="childrenText">
                  <i class="el-icon-document"></i>
                  {{child.text}}
                </div>
                <i class="el-icon-more"></i>
              </div>

            </el-tooltip>

          </li>
        </ul>
      </li>
    </ul> -->

      <ul>
        <li class="dirChildren right" v-for="(child,childIndex) in dataList" :key="childIndex" v-if="child.show" :class="{active:child.active,hover:hoverIndex == childIndex,cur:child.id==activeId}"  >
          <el-tooltip class="item" effect="light" :content="'名称：'+child.text" placement="right">
            <div>
              <div class="childrenText" @click="itemClick(childIndex)">
                <i class="el-icon-document"></i>
                {{child.text}}
              </div>
              <i class="el-icon-more" @mouseenter="mouseenter(childIndex)" @mouseleave="mouseleave()" ></i>
              <div class="cover" @mouseenter="mouseenter(childIndex)" @mouseleave="mouseleave()" >
                <p class="cover_item" @click="editDashboard(childIndex)">编辑</p>
              </div>
            </div>
          </el-tooltip>
        </li>
      </ul>

  </div>
</template>
<script type="text/babel">
export default {
  data: () => ({
    // 仪表盘层级
    dirs: [
      {
        text: '仪表盘示例',
        childrenShow: true,
        children: [
          {
            text: '微信运营分析(2017-12-04 08:29:19)'
          },
          {
            text: '销售业绩报表'
          }
        ]
      }
    ],
    // 拖拽
    dragObj: {},
    // 仪表盘 指向索引
    hoverIndex:null,
    // 搜索用
    search:''
  }),
  watch: {
    search:function(val){
      for(let i=0;i<this.dataList.length;i++){
        if(this.dataList[i].text&&this.dataList[i].text.indexOf(val)<0){
          this.dataList[i].show=false;
        }else{
          this.dataList[i].show=true;          
        }
      }
    }
  },
  methods: {
    // 禁止被选中  拖拽元素
    onSelectstart() {
      return false;
    },
    // 拖拽开始  拖拽元素
    onDragstart(item, index) {
      this.dragObj = {
        dragIndex: index,
        dragItem: item
      };
      // ev.dataTransfer.effectAllowed = "move";
      // ev.dataTransfer.setData("text", ev.target.innerHTML);
      // ev.dataTransfer.setDragImage(ev.target, 0, 0);
      // eleDrag = ev.target;
      return true;
    },
    // 拖拽结束  拖拽元素
    onDragend() {
      return false;
    },
    // 拖拽元素在目标元素头上移动的时候，目标元素
    onDragover(ev) {
      ev.preventDefault();
      return true;
    },
    // 拖拽元素进入目标元素头上的时候，目标元素    
    onDragenter() {
      return true;
    },
    // 拖拽元素进入目标元素头上，同时鼠标松开的时候,目标元素    
    onDrop() {
      // this.$set(this.charts.option.series[0].data, 0, a);
      let oldIndex = this.dragObj.dragIndex;
      // this.leftTree[treeIndex].leafs.splice(oldIndex, 1);
      // this.leftTree[treeIndex].leafs.splice(index, 0, this.dragObj.dragItem);
      return false;
    },
    dirToggleChildren(dirIndex) {
      this.dirs[dirIndex]['childrenShow'] = !this.dirs[dirIndex][
        'childrenShow'
      ];
      // if (this.leafsShow == treeIndex) {
      //   this.leafsShow = -1;
      // } else {
      //   this.leafsShow = treeIndex;
      // }
    },
    // 打开父级弹窗
    showAddDialog() {
      this.$emit('toggleAddDashboardDialog', true);
    },
    // 列表点击，传id到浮层做处理
    itemClick(index) {
      this.$emit('itemClick', this.dataList[index].id);
    },
    // 鼠标指向
    mouseenter(index){
      this.hoverIndex = index;
    },
    // 鼠标离开
    mouseleave(){
      this.hoverIndex = null;
    },
    // 仪表盘编辑
    editDashboard(index){
      this.$emit('showTitleEditor', {status:true,index:index});
    }
  },
  props: ['dataList','activeId']  
};
</script>