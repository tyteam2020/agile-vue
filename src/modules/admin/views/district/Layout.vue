<template>
  <div class="box">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="搜索"
          size="small"
          suffix-icon="el-icon-search"
          v-model="keyword"
          clearable
        >
        </el-input>
        <hr class="spacer-xs" />
        <div class="text-right">
          <el-button
            :disabled="!$can('district/create')"
            title="创建根地区"
            size="mini"
            @click.native="handleDistrictCreate(0)"
            icon="el-icon-folder-add"
          >
            创建根地区
          </el-button>
        </div>
        <hr class="spacer-xs" />
        <el-tree
          v-show="isSearched"
          v-loading="loading"
          :data="searchedData"
          :highlight-current="true"
          :default-expand-all="true"
          ref="districtSearchTree"
          node-key="id"
        >
          <div class="district-tree-node" slot-scope="{ node, data }">
            <div class="district-tree-icon">
              <ag-icon v-if="data.icon" :path="data.icon" />
              <i v-else-if="data.code.length < 9" class="el-icon-folder" />
              <i v-else class="el-icon-map-location" />
              <span v-bind:title="'地区代码：' + data.code">{{
                data.name
              }}</span>
            </div>
            <el-button-group class="operate">
              <el-button
                size="mini"
                @click.stop="handleDistrictEdit(data)"
                :disabled="!$can('district/view')"
                icon="el-icon-edit-outline"
                title="查看编辑"
              />
              <el-button
                size="mini"
                @click.stop="handleDistrictCreate(data.id)"
                :disabled="!$can('district/create')"
                icon="el-icon-folder-add"
                title="新建子地区"
              />
            </el-button-group>
          </div>
        </el-tree>
        <el-tree
          v-show="!isSearched"
          :loading="loading"
          :highlight-current="true"
          :default-expanded-keys="districtExpanded"
          ref="districtTree"
          node-key="id"
          :lazy="true"
          :load="loadDistricts"
          :props="{
            isLeaf: 'leaf',
          }"
        >
          <div class="district-tree-node" slot-scope="{ node, data }">
            <div class="district-tree-icon">
              <ag-icon v-if="data.icon" :path="data.icon" />
              <i v-else-if="data.code.length < 9" class="el-icon-folder" />
              <i v-else class="el-icon-map-location" />
              <span v-bind:title="'地区代码：' + data.code">{{
                data.name
              }}</span>
            </div>
            <el-button-group class="operate">
              <el-button
                size="mini"
                @click.stop="handleDistrictEdit(data)"
                :disabled="!$can('district/view')"
                icon="el-icon-edit-outline"
                title="查看编辑"
              />
              <el-button
                size="mini"
                @click.stop="handleDistrictCreate(data.id)"
                :disabled="!$can('district/create')"
                icon="el-icon-folder-add"
                title="新建子地区"
              />
            </el-button-group>
          </div>
        </el-tree>
      </el-col>
      <el-col :span="18">
        <router-view
          @on-expanded="handleDistrictExpanded"
          @on-updated="handleDistrictUpdated"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import flatry from '@core/utils/flatry'
import MiscService from '@admin/services/MiscService'
import AgIcon from '@core/components/Icon'

export default {
  name: 'District',
  watch: {
    async keyword(keyword) {
      if (!keyword) {
        this.isSearched = false

        return
      }

      if (keyword.length < 2) {
        return
      }

      this.isSearched = true
      this.loading = true

      const { data } = await flatry(MiscService.districtSearchTree(keyword))

      if (data) {
        this.searchedData = data
      }

      this.loading = false
    },
  },
  components: { AgIcon },
  data() {
    return {
      loading: true,
      keyword: '',
      isSearched: false,
      searchedData: [],
      districtExpanded: [],
      districtCurrentId: 0,
    }
  },
  methods: {
    handleDistrictExpanded(expanded, currentId) {
      this.districtExpanded = expanded
      this.districtCurrentId = currentId
      this.$refs.districtTree.setCurrentKey(this.districtCurrentId)
      this.$refs.districtSearchTree.setCurrentKey(this.districtCurrentId)
    },
    handleDistrictUpdated(currentId, reloadId) {
      this.districtCurrentId = currentId

      const node = this.$refs.districtTree.getNode(reloadId)

      node.loaded = false
      node.expand()
    },
    handleDistrictCreate(parentId) {
      this.$router.push({
        name: 'DistrictCreate',
        params: { id: parentId },
      })
    },

    handleDistrictEdit(district) {
      this.$router.push({
        name: 'DistrictEdit',
        params: { id: district.id },
      })
    },

    async loadDistricts(node, resolve) {
      const parentId = (node.data && node.data.id) || 0

      this.loading = true

      const { data } = await flatry(MiscService.districts(parentId))

      const districts = data || []

      districts.forEach((item) => {
        item.leaf = item.code.length === 9
      })

      resolve(districts)

      this.$refs.districtTree.setCurrentKey(this.districtCurrentId)

      this.loading = false
    },
  },
  created() {},
}
</script>
<style lang="scss">
.district-tree-node {
  font-size: 14px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 7px;

  .district-tree-icon {
    [class^='el-icon-'] {
      margin-right: 3px;
    }
  }

  &:hover {
    .operate {
      visibility: visible;
    }
  }

  .operate {
    visibility: hidden;
    font-size: 12px;
    color: #a6a9ad;

    .el-button {
      padding: 3px 5px 2px 5px;
    }
  }
}
</style>