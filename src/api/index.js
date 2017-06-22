const URL = 'http://localhost:3000/api/'

export const fetchMessages = () => {
  const request = new Request(URL+'messages', {
    method: 'GET',
  });
  return fetch(request).then((response) => {
    return response.json()
  }).then(json => {
    return json
  }).catch(error => error)
}

export const postNewMessage = (msg) => {
  const data = JSON.stringify({
    text: msg
  });
  console.log(data)
  const request = new Request(URL + 'messages', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: data,
  });
  return fetch(request).then((response) => {
    return response.json()
  }).then(json => {
    return json
  }).catch(error => error)
}

export const updateMessage = (_id, msg) => {
  const data = JSON.stringify({
    text: msg
  });
  console.log(data)
  const request = new Request(URL + 'messages/' + _id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: data,
  });
  return fetch(request).then((response) => {
    return response.json()
  }).then(json => {
    return json
  }).catch(error => error)
}

export const deleteMessage = (_id) => {
  const request = new Request(URL + 'messages/' + _id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return fetch(request).then((response) => {
    return response.json()
  }).then(json => {
    return json
  }).catch(error => error)
}

export const deleteAllMessage = () => {
  const request = new Request(URL + 'messages/', {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return fetch(request).then((response) => {
    return response.json()
  }).then(json => {
    return json
  }).catch(error => error)
}