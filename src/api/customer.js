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

export function addCustomer(form) {
  return request({
    url: '/sys/customer/add',
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

