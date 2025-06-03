import request from '@/utils/request'

// 查询学习规划安排详情列表
export function listDetail(query) {
  return request({
    url: '/arrangement/detail/list',
    method: 'get',
    params: query
  })
}

export function listDetailByPlanId(query) {
  return request({
    url: '/plan/plan/detail/'+ query.planId,
    method: 'get',
    params: query
  })
}

// 查询学习规划安排详情详细
export function getDetail(id) {
  return request({
    url: '/arrangement/detail/' + id,
    method: 'get'
  })
}

// 新增学习规划安排详情
export function addDetail(data) {
  return request({
    url: '/arrangement/detail',
    method: 'post',
    data: data
  })
}

// 修改学习规划安排详情
export function updateDetail(data) {
  return request({
    url: '/arrangement/detail',
    method: 'put',
    data: data
  })
}

// 删除学习规划安排详情
export function delDetail(id) {
  return request({
    url: '/arrangement/detail/' + id,
    method: 'delete'
  })
}
