import request from '@/utils/request'

export function getOutSumByMonth(form) {
  return request({
    url: '/sys/out/order/sumByMonth',
    method: 'post',
    data: form
  })
}

export function getAmountInfo(form) {
  return request({
    url: '/sys/out/order/amountInfo',
    method: 'post',
    data: form
  })
}
