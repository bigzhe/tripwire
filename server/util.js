// export const stringToDate = (str) => {
//   DateFormat df = new SimpleDateFormat("mm/dd/yyyy");
// }
const insertWithDefault = (array, elem) => {
  array = array || []
  array.push(elem)
}

export const unzipMODEL = (MODEL) => {

  let UserView = {}, StateView = {}
  MODEL.forEach(({user_id, state_id, expiration_time}) => {
    // update UserView
    UserView[user_id] = UserView[user_id] || []
    UserView[user_id].push({
      id: state_id,
      expirationTime: expiration_time
    })

    // update StateView
    StateView[state_id] = StateView[state_id] || []
    StateView[state_id].push(user_id)
  })

  return {UserView, StateView}
}