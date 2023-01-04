<template>
  <div>    
    <vs-input class="inputx tree-search-input float-left mr-2" placeholder="Search..." v-model.lazy="searchword" />
    <vs-button color="primary" type="filled" @click="search" class="mb-3">Search</vs-button>
    <v-tree ref='tree' :canDeleteRoot="true" :data='treeData' :draggable='true' :tpl='tpl' :halfcheck='true' :multiple="true"/>
  </div>
</template>

<script>
import { VTree, VSelectTree}  from 'vue-tree-halower'
import axios from '@/axios'

export default {
  data() {
    return {
      searchword: '',
      treeData: [{
        title: 'Documents',
        expanded: true,
        children: []
      }],
      newTree: [],
      // treeData: [{
      //   title: 'node1',
      //   expanded: true,
      //   children: [{
      //     title: 'node 1-1',
      //     expanded: true,
      //     children: [{
      //       title: 'node 1-1-1'
      //     }, {
      //       title: 'node 1-1-2'
      //     }, {
      //       title: 'node 1-1-3'
      //     }]
      //   }, {
      //     title: 'node 1-2',
      //     children: [{
      //       title: "<span style='color: red'>node 1-2-1</span>"
      //     }, {
      //       title: "<span style='color: red'>node 1-2-2</span>"
      //     }]
      //   }]
      // }]
    }
  },
  created () {
    this.loadTree()
  }, 
  methods: {
    async loadTree(node, index, parent) {
      
      var id = node === undefined ? 1 : node.id
      console.log('id ', id)
      const resMain = await axios.get(`/docs/folder/list`, {
        params: {
          id: id
        }
      })
      const resSub = await axios.get(`/docs/file/list`, {
        params: {
          id: id
        }
      })
      console.log('resSub ', resSub)
      console.log('resMain ', resMain)
      

      if (id == 1 ) {        
        for (const [key, value] of Object.entries(resMain.data)) {
          this.treeData[0]['children'].push({
            id: value.id,
            title: value.name,
            expanded: true
          })
        }
      } 
      else {
        for (const  [key, value] of Object.entries(resMain.data)) {
          if (node['children'] === undefined) {
            this.$refs.tree.addNode(node, {
              id: value.id,
              title: value.name,
              expanded: true  
            })            
          } else {
            const matchingKey = Object.keys(node['children']).find(key => node['children'][key]['id'] === value.id);
            
            if (!Boolean(matchingKey)) {
              this.$refs.tree.addNode(node, {
                id: value.id,
                title: value.name,
                expanded: true  
              })
            }
          }
        }
      }

      if (id == 1 ) {        
        for (const [key, value] of Object.entries(resSub.data)) {
          this.treeData[0]['children'].push({
            id: value.file_name,
            title: value.file_name,
            expanded: true
          })
        }
      } 
      else {
        for (const  [key, value] of Object.entries(resSub.data)) {
          if (node['children'] === undefined) {
            this.$refs.tree.addNode(node, {
              id: value.file_name,
              title: value.file_name,
              expanded: true  
            })            
          } else {
            const matchingKey = Object.keys(node['children']).find(key => node['children'][key]['id'] === value.file_name);
            
            if (!Boolean(matchingKey)) {
              this.$refs.tree.addNode(node, {
                id: value.file_name,
                title: value.file_name,
                expanded: true  
              })
            }
          }
        }
      }      

            // var matchingKey = true
            // for (const key of Object.keys(node['children'])) {
            //   matchingKey = false
            //   console.log("node['children'][key]['id'] ", node['children'][key]['id'])
            //   if (node['children'][key]['id'] === value.id) {

            //     matchingKey = true
            //     break
            //   }
            // }

            // console.log('Boolean ', Boolean(matchingKey) )
            // console.log('value.id ', value.id)
            
            // var k = 0
            // Object.keys(node['children']).find((key) => { 
            //   k = node['children'][key]['id'] == value.id
            //   console.log('nc key ', key)              
            //   console.log('c k ', k)
            //   console.log("node['children'][key]['id'] ", node['children'][key]['id'])                
            //   console.log('value.id ', value.id)

            //   if (!k) {                            
            //     console.log('value.name ', value.name)
            //     this.$refs.tree.addNode(node, {
            //       id: value.id,
            //       title: value.name,
            //       expanded: true  
            //     })
            //   } else {
            //     return
            //   }
            // })

          // if (node['children'] !== undefined) {
          //   for (const  [nodeKey, nodeValue] of Object.entries(node['children'])) {

          //     if (nodeValue != value.id) {
          //       this.$refs.tree.addNode(node, {
          //         id: value.id,
          //         title: value.name,
          //         expanded: true  
          //       })
          //     }
              
          //   }
          // } else {
          // }
          

          
          // console.log('value.id ', value.id)
          // console.log('node ', node)
          // parent['children'][index]['children'].push({
          //   id: value.id,
          //   title: value.name,
          //   expanded: true  
          // })
          // parent['children'][index]['children'] = [{
          //   id: value.id,
          //   title: value.name,
          //   expanded: true  
          // }]
          // this.treeData[0]['children'].push({
          //   id: value.id,
          //   title: value.name,
          //   expanded: true
          // })
        // this.treeData[0] = parent

      // console.log('this.treeData ', this.treeData)
      // console.log('resMain ', resMain)
    },
    search () {
      this.$refs.tree.searchNodes(this.searchword)
    },
    tpl (...args) {
      let {0: node, 2: parent, 3: index} = args
      let titleClass = node.selected ? 'node-title node-selected' : 'node-title'
      if (node.searched) titleClass += ' node-searched'
      return <span>
        
         <span class={titleClass} domPropsInnerHTML={node.title} onClick={() => this.loadTree(node, index, parent) }></span>      
      <button class="btn-delete text-danger border-none cursor-pointer px-2 py-1 rounded" onClick={() => this.$refs.tree.delNode(node, parent, index)}>delete</button>
      </span>
    }
  },
  components: {
    VTree,
    VSelectTree
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/vuexy/extraComponents/tree.scss";

button.btn-async{
  background: rgba(var(--vs-warning),0.15);
}

button.btn-delete{
  background: rgba(var(--vs-danger),0.15);
}

span.inputCheck.box-checked, 
span.inputCheck.box-unchecked,
span.inputCheck.box-halfchecked {
  display: none;
}

.tree-expand {
  height: 20px !important;
  width: 20px !important;
}
</style>