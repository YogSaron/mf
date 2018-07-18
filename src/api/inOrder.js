import request from '@/utils/request'

export function orderSave(form) {
  return request({
    url: '/sys/in/order/orderSave',
    method: 'post',
    data: form
  })
}

export function entireOrderUpdate(form) {
  return request({
    url: '/sys/in/order/orderUpdate',
    method: 'post',
    data: form
  })
}

export function getOrderByCustomerId(form) {
  return request({
    url: '/sys/in/order/detailByCustomerId',
    method: 'get',
    params: form
  })
}
export function getOrderById(oid) {
  return request({
    url: '/sys/in/order/detail',
    method: 'post',
    data: { id: oid }
  })
}

export function getOrderListByType(form) {
  return request({
    url: '/sys/in/order/list',
    method: 'post',
    data: form
  })
}

export function deleteOneOrder(oid) {
  return request({
    url: '/sys/in/order/deleteOneOrder',
    method: 'post',
    data: { id: oid }
  })
}

export function getEntireOrderById(oid) {
  return request({
    url: '/sys/in/order/detailById',
    method: 'get',
    params: { id: oid }
  })
}

export function getSumAmount(form) {
  return request({
    url: '/sys/in/order/getSumAmount',
    method: 'post',
    params: form
  })
}
