import request from '@/utils/request'

export function orderSave(form) {
  return request({
    url: '/sys/out/order/orderSave',
    method: 'post',
    data: form
  })
}
