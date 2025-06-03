import request from '@/utils/request'

// 查询学习规划安排列表
export function listPlan(query) {
  return request({
    url: '/plan/plan/list',
    method: 'get',
    params: query
  })
}

// 查询学习规划安排详细
export function getPlan(id) {
  return request({
    url: '/plan/plan/' + id,
    method: 'get'
  })
}

// 新增学习规划安排
export function addPlan(data) {
  console.log(data);
  return request({
    url: '/plan/plan',
    method: 'post',
    data: data
  })
}

// 修改学习规划安排
export function updatePlan(data) {
  return request({
    url: '/plan/plan',
    method: 'put',
    data: data
  })
}

// 删除学习规划安排
export function delPlan(id) {
  return request({
    url: '/plan/plan/' + id,
    method: 'delete'
  })
}
