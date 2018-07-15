import request from '@/utils/request'

export function getCustomerList() {
  return request({
    url: '/sys/customer/list',
    method: 'post'
  })
}

export function getCustomerListByType(form) {
  return request({
    url: '/sys/customer/type/list',
    method: 'get',
    params: form
  })
}
// 添加用户
export function addCustomer(form) {
  return request({
    url: '/sys/customer/add',
    method: 'post',
    data: form
  })
}

// 删除用户
export function delCustomer(rid) {
  return request({
    url: '/sys/customer/delete',
    method: 'post',
    data: { id: rid }
  })
}
// 更新
export function updateCustomer(form) {
  return request({
    url: '/sys/customer/update',
    method: 'post',
    data: form
  })
}

export function getProductListByParentId(parentId) {
  return request({
    url: '/sys/out/cus/product/listByParentId',
    method: 'get',
    params: { parentId }
  })
}

export function addProduct(form) {
  return request({
    url: '/sys/out/cus/product/add',
    method: 'post',
    data: form
  })
}

export function updateProduct(form) {
  return request({
    url: '/sys/out/cus/product/update',
    method: 'post',
    data: form
  })
}
export function deleteProduct(pid) {
  return request({
    url: '/sys/out/cus/product/delete',
    method: 'post',
    data: { id: pid }
  })
}

