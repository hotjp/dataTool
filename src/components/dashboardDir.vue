<template>
  <div id="dashboardDir">
    <div class="fix dirTreeTitle">
      仪表盘
      <i class="el-icon-more r"></i>
      <i class="el-icon-plus r"  @click="showDialog"></i>
      <!-- TODO: 搜索 -->
      <!-- <i class="el-icon-search r"></i> -->
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
        <li class="dirChildren right" :class="{active:child.active,hover:hoverIndex == childIndex}"  v-for="(child,childIndex) in dashboardList" :key="childIndex">
          <el-tooltip class="item" effect="light" :content="'名称：'+child.text" placement="right">
            <div>
              <div class="childrenText" @click="changeDashborad(childIndex)">
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
    dirs: [
      {
        text: "仪表盘示例",
        childrenShow: true,
        children: [
          {
            text: "微信运营分析(2017-12-04 08:29:19)"
          },
          {
            text: "销售业绩报表"
          }
        ]
      },
      {
        text: "仪表盘示例2",
        childrenShow: true,
        children: [
          {
            text: "微信运营分析(1990-12-04 08:29:19)"
          },
          {
            text: "销售业绩报表2"
          }
        ]
      }
    ],
    dragObj: {},
    hoverIndex:null
  }),
  props: ["dashboardList"],
  methods: {
    onSelectstart() {
      //禁止被选中  拖拽元素
      return false;
    },
    onDragstart(item, index) {
      //          拖拽开始  拖拽元素
      this.dragObj = {
        dragIndex: index,
        dragItem: item
      };

      //          console.log(ev);
      //          ev.dataTransfer.effectAllowed = "move";
      //          ev.dataTransfer.setData("text", ev.target.innerHTML);
      //          ev.dataTransfer.setDragImage(ev.target, 0, 0);
      //          eleDrag = ev.target;
      return true;
    },
    onDragend() {
      //          拖拽结束  拖拽元素
      return false;
    },
    onDragover(ev) {
      //          console.log(ev);
      //          拖拽元素在目标元素头上移动的时候，目标元素
      ev.preventDefault();
      return true;
    },
    onDragenter() {
      //          拖拽元素进入目标元素头上的时候，目标元素

      return true;
    },
    onDrop() {
      //          拖拽元素进入目标元素头上，同时鼠标松开的时候,目标元素
      //          this.$set(this.charts.option.series[0].data, 0, a);
      let oldIndex = this.dragObj.dragIndex;
      // this.leftTree[treeIndex].leafs.splice(oldIndex, 1);
      // this.leftTree[treeIndex].leafs.splice(index, 0, this.dragObj.dragItem);

      return false;
    },
    dirToggleChildren(dirIndex) {
      this.dirs[dirIndex]["childrenShow"] = !this.dirs[dirIndex][
        "childrenShow"
      ];
      // if (this.leafsShow == treeIndex) {
      //   this.leafsShow = -1;
      // } else {
      //   this.leafsShow = treeIndex;
      // }
    },
    // onDragstart(tree, treeIndex) {
    //   //          拖拽开始  拖拽元素
    //   this.dragObj = {
    //     dragTreeIndex: treeIndex,
    //     dragIndex: -1,
    //     dragItem: tree
    //   };

    //          console.log(ev);
    //          ev.dataTransfer.effectAllowed = "move";
    //          ev.dataTransfer.setData("text", ev.target.innerHTML);
    //          ev.dataTransfer.setDragImage(ev.target, 0, 0);
    //          eleDrag = ev.target;
    //   return true;
    // }
    showDialog() {
      this.$emit("showDialog", true);
    },
    // dashboard切换,跳转页面
    changeDashborad(index) {
      this.$router.push({
        path: "/empty",
        query: { link: "/dashboard/" + this.dashboardList[index].id }
      });
    },
    mouseenter(index){
      this.hoverIndex = index;
    },
    mouseleave(){
      this.hoverIndex = null;
    },
    editDashboard(index){
      this.$emit("showEditor", {status:true,index:index});
    }
  },
  mounted() {}
};
</script>
<style scoped>

</style>
