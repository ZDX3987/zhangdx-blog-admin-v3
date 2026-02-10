<script setup lang="ts">

import {ListTableConfig} from "../../type/common/ListTableConfig.ts";
import {nextTick, onMounted, ref, type Slot, watch} from "vue";
import {ElMessage, ElTable, type TableColumnCtx} from "element-plus";
import {dateFormat} from "../../utils/moment-date.ts";


const pageSize = ref<number>(15)
const currentPage = ref<number>(1)
const total = ref<number>(0)
const tableData = ref<any[] | undefined>([])
const tableRef = ref<InstanceType<typeof ElTable>>()

const emit = defineEmits(['selectSingleRow'])

const props = defineProps({
  listTableConfig: {
    type: ListTableConfig
  },
  selectionChangeFunc: Function,
  selectedRowKeySet: {
    type: Array,
    default: []
  }
})

onMounted(() => {
  if (!props.listTableConfig?.isLocalDataSource()) {
    queryTableData(1, pageSize.value)
  }
})

watch(() => props.listTableConfig, (newConfig) => {
  if (!newConfig?.isLocalDataSource()) {
    queryTableData(1, pageSize.value)
  }
})
watch(() => props.listTableConfig?.tableData, (newTableData) => {
  if (tableData !== undefined) {
    tableData.value = newTableData
  }
})

async function queryTableData(current: number, queryPageSize: number) {
  if (props.listTableConfig === undefined) {
    return
  }
  let queryConfig = props.listTableConfig.queryConfig || undefined
  if (queryConfig === undefined || queryConfig.queryFunc === undefined) {
    return
  }
  let result = await queryConfig.queryFunc(current, queryPageSize)
  let page = result.data
  tableData.value = page.records
  currentPage.value = page.current
  pageSize.value = queryPageSize
  total.value = page.total
  await nextTick()
  selectRows(props.selectedRowKeySet)
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
  try {
    editFunc(id)
  } catch (error) {
    ElMessage.error('' + error)
  }
}

function doDelete(row: any) {
  let id = row.id
  if (id === undefined) {
    return
  }
  let deleteFunc = props.listTableConfig?.deleteConfig.deleteFunc
  if (deleteFunc) {
    deleteFunc(id).then(() => {
      ElMessage.success('删除成功')
      queryTableData(1, pageSize.value)
    }).catch(error => {
      ElMessage.error(error)
    })
  }
}

function doAdd() {
  let addFunc = props.listTableConfig?.addConfig.addFunc
  addFunc()
}

function sizeChange(changePageSize: number) {
  queryTableData(currentPage.value, changePageSize)
}

function currentChange(changePage: number) {
  queryTableData(changePage, pageSize.value)
}


function selectRows(rowKeySet: number[]) {
  if (!rowKeySet || rowKeySet.length === 0) {
    return
  }
  tableData.value.forEach(item => {
    if (rowKeySet.includes(item.id)) {
      tableRef.value.toggleRowSelection(item, true)
    }
  })
}

function tableCurrentChange(row: any) {
  emit('selectSingleRow', row)
}

</script>

<template>
  <div class="list_table_wrapper" v-if="listTableConfig">
    <div class="list_table_header" v-if="listTableConfig.addConfig">
      <el-button-group class="btn-group" v-if="listTableConfig.addConfig.showAddBtn">
        <el-button type="primary" @click="doAdd">{{ listTableConfig.addConfig.addBtnText }}</el-button>
      </el-button-group>
    </div>
    <div class="list_table_table">
      <el-table ref="tableRef" :data="tableData" @selection-change="selectionChangeFunc" row-key="id"
                :highlight-current-row="listTableConfig.highlightCurrentRow" @current-change="tableCurrentChange">
        <el-table-column v-for="mapping in listTableConfig.tableMappings" :key="mapping" :prop="mapping.prop"
                         :label="mapping.label"
                         :type="mapping.type" :width="mapping.width" :formatter="tableDateFormat"
                         :align="mapping.align">
          <template v-for="(slotName, slotType) in mapping.slotTemplates" #[slotType]="slotProps">
            <slot v-if="slotName" :name="slotName" v-bind="slotProps"/>
          </template>
        </el-table-column>
        <el-table-column v-if="listTableConfig.needShowOperator()" label="操作" fixed="right" align="center">
          <template #default="scope">
            <el-button v-if="listTableConfig.editConfig" type="primary" @click="doEdit(scope.row)">编辑</el-button>
            <el-popconfirm v-if="listTableConfig.deleteConfig" width="200"
                           :title="listTableConfig.deleteConfig.delConfirmText"
                           @confirm="doDelete(scope.row)">
              <template #reference>
                <el-button type="danger">{{ listTableConfig.deleteConfig.delBtnText }}</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="list_table_pager" v-if="listTableConfig.pagerConfig">
      <el-pagination background layout="total, prev, pager, next, sizes, jumper" :current-page="currentPage"
                     :page-size="pageSize"
                     :total="total" :page-sizes="[5,10,15,30]" @size-change="sizeChange"
                     @current-change="currentChange"/>
    </div>
  </div>
</template>

<style scoped>
.list_table_pager {
  margin-top: 20px;
}
</style>