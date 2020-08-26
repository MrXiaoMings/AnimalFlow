<template>
  <div id="decision-flow-list-info">
    <div class="node-template">
      <ul>
        <template v-for="node in nodesTemplate">
          <li :key="node.id" :id="node.id">
            <i class="iconfont option-font" v-html="node.icon"></i>
            <span>{{node.text}}</span>
          </li>
        </template>
      </ul>
    </div>
    <div class="node-container node-container-edit">
      <div class="canvas-box">
        <div class="stageOperate">
          <el-tooltip content="等比例" placement="right">
            <el-button @click="initScale" type="text"><i class="iconfont">&#xe60c;
            </i>
            </el-button>
          </el-tooltip>
          <el-tooltip content="居中" placement="right">
            <el-button @click="autoCenter" type="text"><i class="iconfont">&#xe617;</i>
            </el-button>
          </el-tooltip>
          <el-tooltip content="放大" placement="right">
            <el-button @click="scaleOut" type="text" ><i class="iconfont">&#xe614;</i>
            </el-button>
          </el-tooltip>
          <el-tooltip content="缩小" placement="right">
            <el-button @click="scaleIn" type="text"><i class="iconfont">&#xe610;</i>
            </el-button>
          </el-tooltip>
        </div>
        <ul id="menuPaste" class="pop-menu">
          <li>粘贴</li>
        </ul>
        <ul id="contextmenu" class="pop-menu">
          <template>
            <li>删除</li>
            <li>重命名</li>
          </template>
        </ul>
        <img src='../../lib/img/cha.png' style="display:none; z-index:10001; position:absolute;" id="lineDel"/>
        <textarea id="jtopo_textfield" style="width: 60px; position: absolute; display: none;"
                  onkeydown="if(event.keyCode==13)this.blur();" @mousemove.stop=""></textarea>
        <canvas id="canvas"></canvas>
      </div>
    </div>
  </div>
</template>
<!--suppress LossyEncoding -->
<script>
/* eslint-disable */
import NodesTemplate from '../mock/node-template.mock'
import bus from '../../scripts/bus'
import NodeType from '../mock/node-type.mock'
import * as $ from 'jquery'
import * as _ from 'lodash'
//require('../lib/jTopo')

let url = require('../scripts/url')
const pathUrl = require('path')


export default {
  data () {
    return {
      nodesTemplate: NodesTemplate,
      version: {
        versionId: parseInt(this.$route.params.versionId),
        engineId: parseInt(this.$route.params.engineId)
      },
      stage: {},
      scene: {},
      link: null,
      newNode: {},
      newNodeCode: '',
      nodeMaxOrder: -1,
      scaleCount: 0,
      currentNode: {},
      isNodeMove: false,
      isNodeClick: false,
      copyVersionId: '',
      copyNodeActive: false,
      operateLink: {},
      operateNode: {data: {nodeType: 0}},
      pasteNodeX: {},
      pasteNodeY: {},
      canvasOffset: {
        x: 210,
        y: 40
      },
      tableColumnData: [],
      fieldInputFormData: {},
      isShowFieldInputForRunDialog: false,
      isShowSingleRunDialog: false,
      singleResultData: {},
      isShowBatchRunDialog: false,
      runNode: null,
      batchRunUrl: '',
      batchResultUrl: '',
      batchRunResultState: 0,
      isShowBatchRunResultDialog: false,
      testTitle: '',
      templattUrl: '',
      // 连线判断
      currentLinkData: {}
    }
  },
  watch: {
    currentNode () {
      this.$emit('currentNodeChange', this.currentNode, this.version)
    },
    '$route' (to, from) {
      let versionId = parseInt(to.params.versionId)
      if (this.version.versionId !== versionId) {
        this.version = {
          versionId: parseInt(this.$route.params.versionId),
          engineId: parseInt(this.$route.params.engineId)
        }
        this.currentNode = {}
      }
    }
  },
  computed: {
    startNode () {
      return _.find(this.version.nodeList, {nodeType: NodeType.START})
    }
  },
  mounted () {
    this.initScene()
  },
  created () {
    this.runNode = null
    window.vm = this
    bus.$on('nodeDataChange', this.saveNode)
  },
  beforeDestroy () {
    bus.$off('nodeDataChange', this.saveNode)
  },
  methods: {
    scaleOut () {
      window.vm.stage.zoomOut(0.8)
      this.scaleCount++
    },
    scaleIn () {
      window.vm.stage.zoomIn(0.8)
      this.scaleCount--
    },
    initScale () {
      if (this.scaleCount >= 0) {
        for (var i = 0; i < this.scaleCount; i++) {
          window.vm.stage.zoomIn(0.8)
        }
        this.scaleCount = 0
      } else {
        for (i = 0; i < Math.abs(this.scaleCount); i++) {
          window.vm.stage.zoomOut(0.8)
        }
        this.scaleCount = 0
      }
    },
    autoCenter () {
      window.vm.stage.centerAndZoom(1)
    },
    resizeCanvas () {
      var canvasParent = $('.canvas-box')
      var leftListEl = $('.node-template')
      var documentHeight = $(document).height()
      if (documentHeight < 420) {
        canvasParent.css({ height: '400px'})
        leftListEl.css({ height: '400px'})
      } else {
        canvasParent.css({ height: $(document).height() - 20 + 'px'})
        leftListEl.css({ height: $(document).height() - 20 + 'px'})
      }
      var canvas = document.getElementById('canvas')
      console.log(canvasParent.height())
      if (canvasParent && canvas) {
        canvas.width = canvasParent.width()
        canvas.height = canvasParent.height()
      }
    },
    returnBatch () {
      this.isShowBatchRunDialog = true
      this.isShowBatchRunResultDialog = false
    },
    saveNode (data,reName) {
      console.log(data, reName)
    },
    removeNode (data) {
      if (this.currentNode.nodeId === data.nodeId) {
        this.currentNode = this.startNode
        bus.$emit('versionChange')
      }
    },
    saveLink (beginNode, endNode) {
      var link = new JTopo.Link(beginNode, endNode)
      link.arrowsRadius = 10
      link.strokeColor = '87,87,87'
      link.dashedPattern = 2
      link.lineWidth = '0.5'
      link.fontColor = '0,0,0'
      this.scene.add(link)
      this.scene.remove(this.link)
      link.addEventListener('click', function (event) {
        window.vm.operateLink = link
        let nodeA_x = link.nodeA.x
        let nodeZ_x = link.nodeZ.x
        let nodeA_y = link.nodeA.y
        let nodeZ_y = link.nodeZ.y
        let imgX = nodeA_x + (nodeZ_x - nodeA_x) / 2
        let imgY = nodeA_y + (nodeZ_y - nodeA_y) / 2
        $('#lineDel').css({
          display: 'block',
          left: imgX + window.vm.scene.translateX,
          top: imgY + window.vm.scene.translateY
        })
      })
    },
    removeLink () {
      this.scene.remove(this.operateLink)
    },
    initScene () {
      var beginNode = null
      console.log($(document).height(), 'clientHeight')
      var canvasParent = $('.canvas-box')
      var leftListEl = $('.node-template')
      var documentHeight = $(document).height()
      if (documentHeight < 420) {
        canvasParent.css({ height: '400px'})
        leftListEl.css({ height: '400px'})
      } else {
        canvasParent.css({ height: $(document).height() - 20 + 'px'})
        leftListEl.css({ height: $(document).height() - 20 + 'px'})
      }
      var canvas = document.getElementById('canvas')
      canvas.width = canvasParent.width()
      canvas.height = canvasParent.height()
      this.stage = new JTopo.Stage(canvas)
      this.scene = new JTopo.Scene(this.stage)
      window.addEventListener('resize', this.resizeCanvas)
//      this.scene.addEventListener('dbclick', function (event) {
//        if (event.target instanceof JTopo.Node) { // 画布点击元素为节点时
//          if (event.target.data.nodeType === NodeType.START) {
//            return
//          }
////          window.vm.scene.remove(link)
//          beginNode = null
//          window.vm.currentNode = event.target.data
//          window.vm.drawScene(window.vm.version.nodeList)
//        } else if (event.target == null) {
//          // 双击画布空白部分
//          window.vm.currentNode = _.find(vm.scene.getDisplayedNodes(), {text: '开始'}).data
//          window.vm.drawScene(vm.version.nodeList)
//        }
//      })
      window.vm.stage.addEventListener('click', function (e) {
        if (e.button == 0) {
          $('#contextmenu').hide()
          $('#menuPaste').hide()
        }
      })
      // 节点连线
      var tempNodeA = new JTopo.Node('tempA')
      tempNodeA.setSize(1, 1)
      var tempNodeZ = new JTopo.Node('tempZ')
      tempNodeZ.setSize(1, 1)
      this.link = new JTopo.Link(tempNodeA, tempNodeZ)
      this.link.arrowsRadius = 10
      this.link.strokeColor = '87,87,87'
      this.link.dashedPattern = 2
      this.link.lineWidth = '0.5'
      this.link.fontColor = '0,0,0'
      this.scene.mouseup(function (e) {
        $('#lineDel').hide()
        if (window.vm.isNodeMove) {
          window.vm.isNodeMove = false
          var data = e.target.data
          data.nodeX = e.target.x
          data.nodeY = e.target.y
          return
        }
        if (e.target != null && e.target instanceof JTopo.Node) { // click is node
          if (e.button === 2) {
            if (e.target.data.nodeType !== NodeType.START) {
              window.vm.operateNode = e.target
              var left = window.vm.operateNode.cx + 10 + window.vm.scene.translateX
              var top = window.vm.operateNode.cy + 10 + window.vm.scene.translateY
              var canvasBoxWidth = $('.canvas-box').width()
              var canvasBoxHeight = $('.canvas-box').height()
              var widthDecreaseValue = canvasBoxWidth - left
              var heightDecreaseValue = canvasBoxHeight - top
              if (widthDecreaseValue < 87) {
                left = left - 87
              }
              if (heightDecreaseValue < 137) {
                top = top - 137
              }
              $('#contextmenu').css({
                position: 'absolute',
                top: top,
                left: left,
                zIndex: 9999
              }).show()
            }
          } else if (e.button === 0) {
            if (beginNode === null) { // 开始节点为空
              beginNode = e.target // 点击节点为开始节点
              if (beginNode.outLinks === null || (_.isArray(beginNode.outLinks) && beginNode.outLinks.length < 1)) {
                window.vm.scene.add(window.vm.link) // 开始划线
                tempNodeA.setLocation(e.x, e.y)
                tempNodeZ.setLocation(e.x, e.y)
              } else {
                beginNode = null
              }
            } else if (beginNode !== e.target && e.target.data.nodeType !== 1) { // 点击节点不是开始节点
              var endNode = e.target // 点击节点为结束节点
              if (endNode.inLinks === null || (_.isArray(endNode.inLinks) && endNode.data.nodeType !== NodeType.START && endNode.inLinks.length < 1)) {
                window.vm.beforeSaveLink(beginNode, endNode)
                beginNode = null
              } else {
                beginNode = null
              }
            } else if (beginNode === e.target) {
              beginNode = null
            } else {
              beginNode = null
            }
          }
        } else {
          if (e.button === 2) { // 显示粘贴
            if (window.vm.copyNodeActive && (window.vm.copyVersionId === window.vm.version.versionId)) {
              $('#menuPaste').css({
                position: 'absolute',
                top: e.pageY - window.vm.canvasOffset.y,
                left: e.pageX - window.vm.canvasOffset.x,
                zIndex: 9999
              }).show()
              var pageX = e.pageX
              var pageY = e.pageY
              var canvasX = pageX - window.vm.canvasOffset.x - window.vm.scene.translateX
              var canvasY = pageY - window.vm.canvasOffset.y - window.vm.scene.translateY
              window.vm.pasteNodeX = canvasX
              window.vm.pasteNodeY = canvasY
            }
          }
        }
      })
      this.scene.mousedown(function (e) {
        if (e.target == null || e.target === beginNode || e.target === window.vm.link) {
          window.vm.scene.remove(window.vm.link)
          beginNode = null
        }
      })
      this.scene.mousemove(function (e) {
        tempNodeZ.setLocation(e.x, e.y)
      })
      $('.node-template').on('mousedown', 'li', function (event) {
        let index = $(this).attr('id')
        let imgUrl = `./static/lib/img/node/edit/${NodesTemplate[index].img}`
        window.vm.newNode = {
          nodeType: NodesTemplate[index].type,
          nodeName: vm.generateUniqNodeName(NodesTemplate[index].type)
        }
        let img = $('<img id="testImg" src="' + imgUrl + '" alt=""  style="display: none; width: 52px;height: 52px; opacity: 0.5"/>')
        $('body').append(img)
        let pageX = event.pageX
        let pageY = event.pageY
        $('#testImg').css({
          position: 'absolute',
          left: pageX - 20 + 'px',
          top: pageY - 20 + 'px'
        }).show()
      })
      $(document).on('mouseup', function (event) {
        event.preventDefault()
        let img = $('#testImg')
        if (img.length === 1) {
          let canvasBox = $('.canvas-box')
          let maxX = window.vm.canvasOffset.x + canvasBox.width()
          let minX = window.vm.canvasOffset.x
          let maxY = window.vm.canvasOffset.y + canvasBox.height()
          let minY = window.vm.canvasOffset.y
          let pageX = event.pageX
          let pageY = event.pageY
          if (pageX > minX && pageX < maxX && pageY > minY && pageY < maxY) {
            let canvasX = pageX - window.vm.canvasOffset.x - window.vm.scene.translateX
            let canvasY = pageY - window.vm.canvasOffset.y - window.vm.scene.translateY
            window.vm.newNode['nodeX'] = canvasX
            window.vm.newNode['nodeY'] = canvasY
            window.vm.newNode['versionId'] = window.vm.version.versionId
            window.vm.newNode['nodeOrder'] = ++window.vm.nodeMaxOrder
            window.vm.newNode['nodeCode'] = 'ND_' + window.vm.nodeMaxOrder
            window.vm.drawNode(window.vm.newNode)
          }
          img.remove()
        }
      })
      $(document).on('mousemove', function (event) {
        event.preventDefault()
        let img = $('#testImg')
        if (img.length === 1) {
          let pageX = event.pageX
          let pageY = event.pageY
          img.css({
            position: 'absolute',
            left: pageX - 20 + 'px',
            top: pageY - 20 + 'px'
          })
        }
      })
      $('#contextmenu').on('click','li', function () {
        var text = $(this).html()
        switch (text) {
          case '删除':
            window.vm.$confirm('确定删除此节点?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              window.vm.scene.remove(window.vm.operateNode)
            }).catch(() => {
              window.vm.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
            break
          case '重命名':
            var textfield = $('#jtopo_textfield')
            textfield.css({
              top: window.vm.operateNode.y + window.vm.scene.translateY + 20,
              left: window.vm.operateNode.x + window.vm.scene.translateX
            }).show()
            textfield.attr('value', window.vm.operateNode.text).val(window.vm.operateNode.text).focus()
            break
          case '复制':
            window.vm.copyVersionId = window.vm.version.versionId
            window.vm.copyNodeActive = true
            break
          default:
            break
        }
        $('#contextmenu').hide()
      })
      $('#jtopo_textfield').blur(function (event) {
        let value = this.value
        if (window.vm.operateNode.data.nodeName !== this.value) {
          if ($.trim(this.value) === '') {
            window.vm.$message('节点名不能为空！')
          } else if (!(/^[a-zA-z0-9_\u4E00-\u9FA5]+$/.test(this.value))) {
            window.vm.$message('节点名称只支持中英文、数字及‘_’！')
          } else if (this.value.indexOf('_') === 0) {
            window.vm.$message('节点名称不能以\'_\'开头！')
          } else if (this.value.length > 30) {
            window.vm.$message('节点名称不能超过30个字符！')
          } else {
            window.vm.operateNode.text = value
          }
        }
        $(this).hide()
      })
      //删线操作
      $('#lineDel').on('click', function () {
        if (window.vm.operateLink) {
          window.vm.removeLink()
        }
        $(this).hide()
      })
    },
    generateUniqNodeName (nodeType) {
      let nodes = this.version.nodeList
      let filterNodes = _.filter(nodes, {nodeType: nodeType})
      let nodeName = _.find(NodesTemplate, {type: nodeType}).text
      let maxNumber = filterNodes.length + 1
      while (_.find(filterNodes, {nodeName: `${nodeName}_${maxNumber}`})) {
        maxNumber++
      }
      return `${nodeName}_${maxNumber}`
    },
    beforeSaveLink (start, end, link) {
      let data = _.cloneDeep(start.data)
      let nextNodes = _.compact(_.split(data.nextNodes, ','))
      nextNodes.push(end.data.nodeCode)
      data.nextNodes = nextNodes.join(',')
      data.targetId = end.data.nodeId
      this.saveLink(start, end, link)
    },
    drawScene (nodesData, isRemove) {
      this.scene.clear()
      let nodeList = []
      let nodeMap = {}
      _.forEach(nodesData, (nodeDate) => {
        let node = this.drawNode(nodeDate)
        nodeList.push(node)
        nodeMap[node.data.nodeCode] = node
      })
      _.forEach(nodeList, (node) => {
        let nextNodeCodes = _.split(node.data.nextNodes, ',')
        _.forEach(nextNodeCodes, (nextNodeCode) => {
          let nextNode = nodeMap[nextNodeCode]
          if (!_.isEmpty(nextNode)) {
            this.drawLink(node, nextNode)
          }
        })
      })
      if (isRemove) {
        window.vm.$message.success('删除成功！')
      }
    },
    drawNode (nodeData) {
      console.log(nodeData, 'nodeData')
      let node = new JTopo.Node(nodeData.nodeName)
      node.setImage(this.getNodeImg(nodeData), false)
      node.text = nodeData.nodeName
      node.setLocation(nodeData.nodeX, nodeData.nodeY)
      node.data = nodeData
      node.showSelected = false
      node.fontColor = '0,0,0'
      if (nodeData.nodeId === this.currentNode.nodeId) {
        node.setSize(52, 52)
      } else {
        node.setSize(35, 35)
      }
      this.scene.add(node)
      node.addEventListener('mousedown', (e) => {
        window.vm.isNodeClick = true
      })
      node.addEventListener('mousedrag', (e) => {
        if (window.vm.isNodeClick) {
          window.vm.isNodeMove = true
        }
      })
      node.addEventListener('mouseup', (e) => {
        window.vm.isNodeClick = false

      })
      return node
    },
    drawLink (beginNode, endNode) {
      let linkMessage = this.getLinkMessage(beginNode.data, endNode.data)
      let link = new JTopo.Link(beginNode, endNode, linkMessage)
      link.arrowsRadius = 10
      link.strokeColor = '87,87,87'
      link.dashedPattern = 2
      link.lineWidth = '0.5'
      link.fontColor = '0,0,0'
      this.scene.add(link)
      link.addEventListener('click', function (event) {
        window.vm.operateLink = link
        let nodeA_x = link.nodeA.x
        let nodeZ_x = link.nodeZ.x
        let nodeA_y = link.nodeA.y
        let nodeZ_y = link.nodeZ.y
        let imgX = nodeA_x + (nodeZ_x - nodeA_x) / 2
        let imgY = nodeA_y + (nodeZ_y - nodeA_y) / 2
        $('#lineDel').css({
          display: 'block',
          left: imgX + window.vm.scene.translateX,
          top: imgY + window.vm.scene.translateY
        })
      })
      return link
    },
    getLinkMessage: function (beginNodeData, endNodeData) {
      let linkMessage = ''
      let linkMessageObject = {}
      let hasLinkMessageNodeType = [NodeType.SAND_BOX, NodeType.CUSTOMER_SORT]
      if (_.includes(hasLinkMessageNodeType, beginNodeData.nodeType) && !_.isEmpty(beginNodeData.nodeJson)) {
        linkMessageObject = _.find(JSON.parse(beginNodeData.nodeJson), {nextNode: endNodeData.nodeCode}) || {}
        switch (beginNodeData.nodeType) {
          case NodeType.CUSTOMER_SORT:
            linkMessage = linkMessageObject.groupName || ''
            break
          case NodeType.SAND_BOX:
            linkMessage = linkMessageObject.proportion ? `${linkMessageObject.sandbox} ${linkMessageObject.proportion}%` : linkMessageObject.sandbox
            break
          default:
            break
        }
      }
      return linkMessage
    },
    getNodeImg: function (node) {
      console.log(pathUrl.resolve(__dirname, '/dist/static'), 'path')
      let path = `./${url.rootPath}/lib/img/node`
      if (node.nodeId === this.currentNode.nodeId) {
        path = `${path}/edit`
      } else {
        path = `${path}/view`
      }

      if (node.nodeType === NodeType.START) {
        return `${path}/rat.png`
      }
      let value = _.find(this.nodesTemplate, {type: node.nodeType})
      if (_.isEmpty(value)) {
        return ''
      } else {
        return `${path}/${value.img}`
      }
    }
  }
}
</script>
<style lang="scss">
  #decision-flow-list-info {
    height: 100%;
    width: 100%;
    font-size: 14px;
    overflow: hidden;
    position: relative;
    #jtopo_textfield {
      user-select: all;
    }
    ul {
      padding: 0;
      margin: 0;
      list-style: none;
    }
    .node-template {
      height: 100%;
      width: 180px;
      float: left;
      border: 1px solid #e7e7e7;
      background-color: #FFFFFF;
      color: #666666;
      li {
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        &:hover {
          background-color: #e7e7e7;
        }
        span {
          margin-left: 10px;
          width: 58px;
          display: inline-block;
        }
      }
      .option-font {
        color: #398dee;
        font-size: 25px;
        position: relative;
        top: 4px;
        right: 5px;
      }
    }
    .node-container {
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      float: left;
      border-top: 1px solid #e7e7e7;
      border-right: 1px solid #e7e7e7;
      border-bottom: 1px solid #e7e7e7;
      .canvas-box {
        position: relative;
        height: calc(100% - 36px);
        width: 100%;
        box-sizing: border-box;
        .stageOperate {
          position: absolute;
          top: 40px;
          right: 30px;
          width: 30px;
          height: 200px;
          .el-button + .el-button {
            margin-left: 0px;
          }
          i {
            font-size: 20px;
          }
        }
      }
      .operate-box {
        border-bottom: 1px solid #e7e7e7;
        padding-left: 10px;
        height: 37px;
        line-height: 37px;
        box-sizing: border-box;
        .el-button {
          padding: 0;
        }
      }
    }

    .node-container-edit {
      width: calc(100% - 230px);
    }

    .pop-menu {
      display: none;
      background: white;
      border: 1px solid #e7e7e7;
      li {
        padding: 8px 12px;
        border-bottom: 1px solid #e7e7e7;
        text-align: center;
        font-size: 12px;
        cursor: pointer;
        color: #20A0FF
      }
      li:nth-last-child(1) {
        border: none;
      }
      li:hover {
        background: #e7e7e7;
      }
    }
  }
</style>
