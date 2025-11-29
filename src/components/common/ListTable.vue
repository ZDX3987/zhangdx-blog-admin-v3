<script setup lang="ts">

import {ListTableConfig} from "../../type/common/ListTableConfig.ts";
import {onMounted, ref, type Slot, watch} from "vue";
import {ElMessage, type TableColumnCtx} from "element-plus";
import {dateFormat} from "../../utils/moment-date.ts";


const pageSize = ref<number>(15)
const currentPage = ref<number>(1)
const total = ref<number>(0)
const tableData = ref<any[]>([])

const props = defineProps({
  listTableConfig: {
    type: ListTableConfig
  }
})

onMounted(() => {

})

watch(props, (newConfig) => {
  if (newConfig !== undefined) {
    queryTableData(1, pageSize.value)
  }
})

function queryTableData(current: number, queryPageSize: number) {
  if (props.listTableConfig === undefined) {
    return
  }
  let queryConfig = props.listTableConfig.queryConfig || undefined
  if (queryConfig === undefined || queryConfig.queryFunc === undefined) {
    return
  }
  queryConfig.queryFunc(current, queryPageSize).then(res => {
    let page = res.data
    tableData.value = page.records
    currentPage.value = page.current
    pageSize.value = queryPageSize
    total.value = page.total
  }).catch(() => ElMessage.error('数据查询失败'))
}

function tableDateFormat(row: any, column: TableColumnCtx<any>, cellValue: any) {
  let isDate: boolean = column.rawColumnKey['isDate']
  if (!isDate) {
    return cellValue
  }
  let datePattern: string | undefined = column.rawColumnKey['datePattern']
  return dateFormat(cellValue, datePattern)
}

function doEdit(row: any) {
  let id = row.id
  if (id === undefined) {
    return
  }
  let editFunc = props.listTableConfig?.editConfig.editFunc
  editFunc(id)
}

function doDelete(row: any) {
  let id = row.id
  if (id === undefined) {
    return
  }
  let deleteFunc = props.listTableConfig.deleteConfig.deleteFunc
  deleteFunc(id).then(res => {
    ElMessage.success('删除成功')
  }).catch(() => ElMessage.error('删除失败'))
}

function sizeChange(changePageSize: number) {
  queryTableData(currentPage.value, changePageSize)
}

function currentChange(changePage: number) {
  queryTableData(changePage, pageSize.value)
}

</script>

<template>
<div class="list_table_wrapper" v-if="listTableConfig">
  <div class="list_table_table">
    <el-table :data="tableData">
      <el-table-column v-for="mapping in listTableConfig.tableMappings" :key="mapping" :prop="mapping.prop" :label="mapping.label"
                       :type="mapping.isIndex ? 'index' : 'default'" :width="mapping.width" :formatter="tableDateFormat"
                       :align="mapping.align">
        <template v-for="(slotName, slotType) in mapping.slotTemplates" #[slotType]="slotProps">
          <slot :name="slotName" v-bind="slotProps"/>
        </template>
      </el-table-column>
      <el-table-column v-if="listTableConfig.needShowOperator()" label="操作" fixed="right" align="center">
        <template #default="scope">
          <el-button v-if="listTableConfig.editConfig" type="primary" @click="doEdit(scope.row)">修改</el-button>
          <el-popconfirm v-if="listTableConfig.deleteConfig"  width="200"
                         title="确定删除吗？"
                         @confirm="doDelete(scope.row)">
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="list_table_pager" v-if="listTableConfig.pagerConfig">
    <el-pagination background layout="total, prev, pager, next, sizes, jumper" :current-page="currentPage" :page-size="pageSize"
                   :total="total" :page-sizes="[5,10,15,30]" @size-change="sizeChange" @current-change="currentChange" />
  </div>
</div>
</template>

<style scoped>
.list_table_pager {
  margin-top: 20px;
}
</style>