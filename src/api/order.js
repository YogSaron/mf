import request from '@/utils/request'

export function orderSave(form) {
  return request({
    url: '/sys/out/order/orderSave',
    method: 'post',
    data: form
  })
}

export function entireOrderUpdate(form) {
  return request({
    url: '/sys/out/order/orderUpdate',
    method: 'post',
    data: form
  })
}

export function getOrderByCustomerId(form) {
  return request({
    url: '/sys/out/order/detailByCustomerId',
    method: 'get',
    params: form
  })
}
export function getOrderById(oid) {
  return request({
    url: '/sys/out/order/detail',
    method: 'post',
    data: { id: oid }
  })
}

export function getOrderListByType(form) {
  return request({
    url: '/sys/out/order/list',
    method: 'post',
    data: form
  })
}

export function deleteOneOrder(oid) {
  return request({
    url: '/sys/out/order/deleteOneOrder',
    method: 'post',
    data: { id: oid }
  })
}

export function getEntireOrderById(oid) {
  return request({
    url: '/sys/out/order/detailById',
    method: 'get',
    params: { id: oid }
  })
}

export function getSumAmount(form) {
  return request({
    url: '/sys/out/order/getSumAmount',
    method: 'post',
    params: form
  })
}

