// Apiการจัดการแบบรวมศูนย์
const { http } = uni.$u

// อินเทอร์เฟซทั่วไปสำหรับแอปเพล็ต
export const wxLogin = code => http.get('/wxLogin/' + code)
export const wxGetUserInfo = params => http.post('/wxGetUserInfo', params)
export const wxGetPhoneNumber = (params, config = {}) =>
  http.post('/wxGetPhoneNumber', params, (config = {}))
