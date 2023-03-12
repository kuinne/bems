import { defineComponent, ref, watch, Ref, computed, PropType, watchEffect } from 'vue'
import { DasDialog, DasSpin, vOverlay, DasButton, DasMessage, DasSelectList, DasTree, DasSearch } from '@/das-fe/ui'
import type { Props, Emits } from './type'
import { getDimension, getMeterInfoList, getObjTree } from '@/views/energyFee/apis'
import styles from './style.module.scss'
import { i18n } from '@/utils/i18n'
import Tab from './Tab.vue'
import { Table } from '@/views/energyFee/common/components/Table'
import type { TableProps } from '@/views/energyFee/common/components/Table'
import StatusTag from '../../StatusTag.vue'
function useTabs({ energyType }: { energyType: Ref<any> }) {
  const data = ref<any[]>([])
  const dimensionId = ref<string>('')
  const fetchData = async () => {
    data.value = []
    const params = {
      energyTypeId: energyType.value.id,
    }
    const [error, res] = await getDimension(params)

    if (!error) {
      data.value = res

      if (res.length > 0) {
        dimensionId.value = res[0].id
      }
    }
  }
  const render = () => (
    <div class={styles['energy-dimension']}>
      <div class={styles['label']}>{i18n('能源维度' as any).value}</div>
      <Tab options={data.value} v-model={dimensionId.value} key-name="id" label-name="name" />
    </div>
  )
  return {
    fetchData,
    dimensionId,
    render,
  }
}

function useTree({ energyType, dimensionId }: { energyType: Ref<any>; dimensionId: Ref<string> }) {
  const data = ref<any[]>([])
  const dasTreeRef = ref()
  const checkedKeys = ref<any[]>([])

  const checkedNodes = ref<any[]>([])

  const handleClickAll = (node: any) => {
    if (node.data.isSelectAll) {
      node.data.isSelectAll = false
      const removedKeys = (node.childNodes || []).map((item: any) => item.data.id)
      checkedKeys.value = checkedKeys.value.filter((key: any) => !removedKeys.includes(key))
    } else {
      node.data.isSelectAll = true

      checkedKeys.value.push(...(node.childNodes || []).map((item: any) => item.data.id))
    }
  }

  const handleCheckChange = (data: any) => {
    const curNode = dasTreeRef.value?.treeRef?.getNode(data.id)

    if (curNode) {
      const parentNode = curNode.parent
      if (parentNode) {
        const isAllChildNodeChecked = parentNode.childNodes?.every((item: any) => item.checked)
        if (isAllChildNodeChecked) {
          parentNode.data.isSelectAll = true
        } else {
          parentNode.data.isSelectAll = false
        }
      }
    }
  }

  const handleSearch = () => {
    checkedNodes.value = dasTreeRef.value?.treeRef?.getCheckedNodes() || []
  }

  const fetchData = async () => {
    const params = {
      energyTypeId: energyType.value.id,
      dimensionId: dimensionId.value,
    }

    const [error, res] = await getObjTree(params)

    if (!error) {
      data.value = res
    }
  }

  watch(
    () => [energyType.value.id, dimensionId.value],
    () => {
      if (energyType.value.id && dimensionId.value) {
        checkedKeys.value = []
        fetchData()
      }
    },
    {
      immediate: true,
    },
  )

  const render = () => (
    <>
      <div
        class={styles['tree-container']}
        {...{
          directives: {
            overLay: vOverlay,
          },
        }}
      >
        <DasTree
          check-strictly
          checkboxType="default"
          ref={dasTreeRef}
          data={data.value}
          v-model={checkedKeys.value}
          show-checkbox
          node-key="id"
          default-expand-all={false}
          expand-on-click-node={false}
          props={{
            label: 'name',
            children: 'childs',
          }}
          onCheck={handleCheckChange}
        >
          {{
            default: (scope: any) => (
              <span class={styles['custom-tree-node']}>
                <span class={styles['node-label']}>{scope?.data?.name}</span>
                <div v-if="!node.isLeaf" class={[styles['select-all-btn'], { [styles['is-active']]: scope?.node?.data?.isSelectAll }]} onClick={($event) => handleClickAll(scope?.node)}>
                  ALL
                </div>
              </span>
            ),
          }}
        </DasTree>
      </div>
      <div class={styles['tree-footer']}>
        <DasButton class={styles['search-btn']} btnType="primary" onClick={handleSearch}>
          {i18n('查询' as any).value}
        </DasButton>
      </div>
    </>
  )

  return {
    data,
    checkedNodes,
    checkedKeys,
    fetchData,
    render,
  }
}

function useTable({ checkedNodes, energyType, dimensionId }: { checkedNodes: Ref<any[]>; energyType: Ref<any>; dimensionId: Ref<string> }) {
  const page = ref({
    curPage: 1,
    pageSize: 20,
  })
  const total = ref(0)
  const data = ref<any[]>([])
  const selectionRows = ref<any[]>([])
  const keywords = ref('')

  const columns = ref<TableProps['columns']>([
    {
      label: '表计名称',
      prop: 'meterName',
    },
    {
      label: '表计编码',
      prop: 'meterCode',
    },
    {
      label: '表计类型',
      prop: 'meterTypeName',
    },
    {
      label: '表计状态',
      prop: 'status',
      render: ({ row }) => <StatusTag status={row.status} />,
    },
  ])

  const fetchData = async () => {
    selectionRows.value = []
    data.value = []
    const params = {
      pageIndex: page.value.curPage,
      pageSize: page.value.pageSize,
      list: checkedNodes.value.map((item: any) => ({
        typeCode: energyType.value.code,
        dimensionId: dimensionId.value || '-1',
        objId: item.id,
        gradationId: item.orgId || '-1',
        objectName: item.name,
      })),
    }
    const [error, res] = await getMeterInfoList(params)
    if (!error) {
      data.value = res.records
      total.value = res.total
    }
  }

  const handleSearch = () => {
    page.value.curPage = 1
    fetchData()
  }

  const handleCurrentPageChange = () => {
    fetchData()
  }

  const handlePageSizeChange = () => {
    page.value.curPage = 1
    fetchData()
  }

  watch(
    () => checkedNodes.value,
    () => {
      page.value.curPage = 1
      fetchData()
    },
    { deep: true },
  )

  const render = () => (
    <Table
      columns={columns.value}
      data={data.value}
      total={total.value}
      actions={[]}
      paginationProps={{ layout: 'prev,next,sizes' }}
      v-model:page={page.value}
      v-model:selection-rows={selectionRows.value}
      onCurrentPageChange={handleCurrentPageChange}
      onPageSizeChange={handlePageSizeChange}
    >
      {{
        ['pagination-left']: () => (
          <DasSearch width="200px" v-model={keywords.value} isIconLeft searchType="basis" placeholder="搜索表计名称/编码" onSearch={handleSearch} onPressEnter={handleSearch} onChange={handleSearch} />
        ),
      }}
    </Table>
  )

  return {
    fetchData,
    selectionRows,
    render,
  }
}

function useSelectList({ selectionRows }: { selectionRows: Ref<any[]> }) {
  const handleItemRemove = () => {}

  const handleRemoveAll = () => {}
  const render = () => (
    <DasSelectList labelKey="meterName" valueKey="id" v-model={selectionRows.value} width="200px" height="480px" onItemRemove={handleItemRemove} onRemoveAll={handleRemoveAll}></DasSelectList>
  )
  return {
    render,
  }
}

interface EnergyType {
  id: string
  name: string
  code: string
}

export default defineComponent({
  props: {
    energyType: {
      type: Object as PropType<EnergyType>,
      required: true,
    },
    visible: Boolean,
  },
  setup(props, { emit }) {
    const visible = ref(false)
    const loading = ref(false)

    const energyType = computed(() => props.energyType)

    watchEffect(() => {
      console.log('energyType', energyType.value)
    })
    const {
      dimensionId,
      fetchData: fetchDimensionData,
      render: Tabs,
    } = useTabs({
      energyType,
    })

    const {
      checkedKeys,
      checkedNodes,
      render: Tree,
    } = useTree({
      energyType,
      dimensionId,
    })

    const {
      selectionRows,
      fetchData: fetchTableData,
      render: Table,
    } = useTable({
      energyType,
      checkedNodes,
      dimensionId,
    })

    const { render: SelectList } = useSelectList({
      selectionRows,
    })

    const handleClose = () => {
      emit('close')
    }

    const handleSubmit = () => {
      if (selectionRows.value.length === 0) {
        DasMessage.warning({
          message: '请选择表计',
        })
        return
      }
      emit(
        'submit',
        selectionRows.value.map((item) => item.id),
      )
    }

    watch(
      () => props.visible,
      () => {
        visible.value = props.visible
        if (props.visible) {
          fetchDimensionData()
        } else {
          checkedKeys.value = []
          selectionRows.value = []
        }
      },
    )

    const Left = () => (
      <div class={styles['left']}>
        <div class={styles['energy-type']}>
          <div class={styles['label']}>{i18n('能源类型' as any).value}</div>
          <div class={styles['box']}>{energyType.value.name}</div>
        </div>
        <Tabs />
        <Tree />
      </div>
    )

    const Main = () => (
      <div class={styles['main']}>
        <Table />
      </div>
    )

    const Right = () => (
      <div class={styles['right']}>
        <SelectList />
      </div>
    )

    const render = () => (
      <DasDialog title="新增表计" v-model={visible.value} width="960px" height="580px" onClose={handleClose}>
        {{
          default: () => (
            <>
              <DasSpin full spinning={loading.value}>
                <div ref="$myDialogBody" class={styles['layout-container']}>
                  <Left />
                  <Main />
                  <Right />
                </div>
              </DasSpin>
            </>
          ),
          footer: () => (
            <>
              <DasButton class={styles['submit-btn']} btnType="primary" onClick={handleSubmit}>
                {i18n('提交' as any).value}
              </DasButton>
              <DasButton onClick={handleClose}>{i18n('取消' as any).value}</DasButton>
            </>
          ),
        }}
      </DasDialog>
    )

    return render
  },
})
