import request from '@/utils/request'

// 查询课程评论列表
export function listComment(query) {
  return request({
    url: '/comment/comment/list',
    method: 'get',
    params: query
  })
}

//根据用户id查询课程评论列表
export function listCommentByUserId(query, userId) {
  return request({
    url: '/comment/comment/listByUserId/'+userId,
    method: 'get',
    params: query
  })
}

// 查询课程评论详细
export function getComment(commentId) {
  return request({
    url: '/comment/comment/' + commentId,
    method: 'get'
  })
}

// 新增课程评论
export function addComment(data) {
  return request({
    url: '/comment/comment',
    method: 'post',
    data: data
  })
}

// 修改课程评论
export function updateComment(data) {
  return request({
    url: '/comment/comment',
    method: 'put',
    data: data
  })
}

// 删除课程评论
export function delComment(commentId) {
  return request({
    url: '/comment/comment/' + commentId,
    method: 'delete'
  })
}
