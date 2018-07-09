import request from '@/utils/request'

export function getCustomerList() {
  return request({
    url: '/sys/customer/list',
    type: 'post'
  })
}
