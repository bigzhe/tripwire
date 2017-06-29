// const URL = 'http://localhost:3000/api/'
import { TARGET_URL } from '../config'
const URL = TARGET_URL + 'api/'

export const fetchModel = () => {
  const request = new Request(URL+'model', {
    method: 'GET',
  });
  return fetch(request).then((response) => {
    return response.json()
  }).then(json => {
    return json
  }).catch(error => error)
}

