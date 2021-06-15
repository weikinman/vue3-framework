import AxiosService from '../packages/http/lib/http'


AxiosService.fetch('/api', {}).then(res => {
  console.log('fetch', res)
})
