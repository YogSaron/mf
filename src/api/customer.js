import request from '@/utils/request'

export function getCustomerList() {
  return request({
    url: '/sys/customer/list',
    method: 'post'
  })
}

export function addCustomer(form) {
  return request({
    url: '/sys/customer/add',
    method: 'post',
    data: form
  })
}
