import { DasTree } from '@/das-fe/ui'
import { ref, watchEffect } from 'vue'
import { getEnergyType } from '@/views/energyFee/apis'
const mockData = [
  {
    id: '1',
    name: 'ffff',
    children: [
      {
        id: '1-1',
        name: 'fdsfsd',
      },
    ],
  },
  {
    id: '2',
    name: '得到的',
  },
]
const getTree = () => {
  return new Promise<[any, any]>((resolve) => {
    setTimeout(() => {
      resolve(['', mockData])
    }, 300)
  })
}

export function useTree() {
  const data = ref<any>([])
  const loading = ref(false)
  const currentNodeKey = ref<string>('-1')
  const energyTypeOptions = ref<any>()
  const fetchData = async () => {
    loading.value = true
    const [error, res] = await getEnergyType()
    if (!error) {
      // data.value = [
      //   {
      //     name: '全部标准',
      //     id: '-1',
      //     children: res,
      //   },
      // ]
      data.value = [
        {
          name: 'Level one 1',
          children: [
            {
              name: 'Level two 1-1',
              children: [
                {
                  name: 'Level three 1-1-1',
                },
              ],
            },
          ],
        },
        {
          name: 'Level one 2',
          children: [
            {
              name: 'Level two 2-1',
              children: [
                {
                  name: 'Level three 2-1-1',
                },
              ],
            },
            {
              name: 'Level two 2-2',
              children: [
                {
                  name: 'Level three 2-2-1',
                },
              ],
            },
          ],
        },
        {
          name: 'Level one 4',
          children: [
            {
              name: 'Level two 4-1',
              children: [
                {
                  name: 'Level three 4-1-1',
                },
              ],
            },
            {
              name: 'Level two 4-2',
              children: [
                {
                  name: 'Level three 4-2-1',
                },
              ],
            },
          ],
        },
        {
          name: 'Level one 3',
          children: [
            {
              name: 'Level two 3-1',
              children: [
                {
                  name: 'Level three 3-1-1',
                },
              ],
            },
            {
              name: 'Level two 3-2',
              children: [
                {
                  name: 'Level three 3-2-1',
                },
              ],
            },
          ],
        },
        {
          name: 'Level one 5',
          children: [
            {
              name: 'Level two 5-1',
              children: [
                {
                  name: 'Level three 5-1-1',
                },
              ],
            },
            {
              name: 'Level two 5-2',
              children: [
                {
                  name: 'Level three 5-2-1',
                },
              ],
            },
          ],
        },
        {
          name: 'Level one 6',
          children: [
            {
              name: 'Level two 6-1',
              children: [
                {
                  name: 'Level three 6-1-1',
                },
              ],
            },
            {
              name: 'Level two 6-2',
              children: [
                {
                  name: 'Level three 6-2-1',
                },
              ],
            },
          ],
        },
        {
          name: 'Level one 6',
          children: [
            {
              name: 'Level two 6-1',
              children: [
                {
                  name: 'Level three 6-1-1',
                },
              ],
            },
            {
              name: 'Level two 6-2',
              children: [
                {
                  name: 'Level three 6-2-1',
                },
              ],
            },
          ],
        },
        {
          name: 'Level one 6',
          children: [
            {
              name: 'Level two 6-1',
              children: [
                {
                  name: 'Level three 6-1-1',
                },
              ],
            },
            {
              name: 'Level two 6-2',
              children: [
                {
                  name: 'Level three 6-2-1',
                },
              ],
            },
          ],
        },
        {
          name: 'Level one 6',
          children: [
            {
              name: 'Level two 6-1',
              children: [
                {
                  name: 'Level three 6-1-1',
                },
              ],
            },
            {
              name: 'Level two 6-2',
              children: [
                {
                  name: 'Level three 6-2-1',
                },
              ],
            },
          ],
        },
      ]
      energyTypeOptions.value = res.map((item) => ({
        value: item.id,
        label: item.name,
      }))
    }
    loading.value = false
  }

  const Tree = () => <DasTree default-expand-all={false} data={data.value} v-model={currentNodeKey.value}></DasTree>
  fetchData()
  return {
    Tree,
    currentNodeKey,
    energyTypeOptions,
  }
}
