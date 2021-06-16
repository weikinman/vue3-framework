import AxiosService from '../packages/http/lib'


AxiosService.fetch('/api', {}).then(res => {
    console.log('fetch', res)
})