import request from '@/utils/request'

export function outPaymentSave(form) {
  return request({
    url: '/sys/out/order/paymentSave',
    method: 'post',
    data: form
  })
}

export function inPaymentSave(form) {
  return request({
    url: '/sys/in/order/paymentSave',
    method: 'post',
    data: form
  })
}
