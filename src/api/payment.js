import request from '@/utils/request'

export function outPaymentSave(form) {
  return request({
    url: '/sys/out/order/paymentSave',
    method: 'post',
    data: form
  })
}
