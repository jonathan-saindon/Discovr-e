import {CALL_API, getJSON} from 'redux-api-middleware'
import {normalize} from 'normalizr';

import {API_URL} from '../Root'

export const fetchData = (schema, url) => {
  return {
    [CALL_API]: {
      types: ['REQUEST',
        {
          type: 'SUCCESS',
          payload: (action, state, res) => getJSON(res).then((json) => normalize(json, schema))
        },
        'FAILURE'],
      method: 'GET',
      endpoint: API_URL + url + '/'
    }
  }
}

export const postOrPutData = (schema, url, data, partial = false) => {
  let isUpdate = data.hasOwnProperty('id')
  let method = isUpdate ? (partial ? "PATCH": "PUT") : "POST"
  if (isUpdate){
    url = url + '/' + data.id
  }
  if (url.indexOf("http") == -1){
    url = API_URL + url + '/'
  }
  let payload = (action, state, res) => getJSON(res).then((json) => json)
  if (schema){
    payload = (action, state, res) => getJSON(res).then((json) => normalize(json, schema))
  }
  return {
    [CALL_API]: {
      types: ['REQUEST',
        {
          type: 'SUCCESS',
          payload: payload
        },
        'FAILURE'],
      method: method,
      body: JSON.stringify(data),
      endpoint: url
    }
  }
}

export const deleteData = (schema, url, id) => {
  return {
    [CALL_API]: {
      types: ['REQUEST',
        {
          type: 'SUCCESS',
          payload: (action, state, res) => getJSON(res).then((json) => normalize(json, schema))
        },
        'FAILURE'],
      method: "DELETE",
      endpoint: API_URL + url + '/' + id + '/'
    }
  }
}