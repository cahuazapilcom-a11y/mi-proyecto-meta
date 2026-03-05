const userState = {};

function getUserState(phone) {

  if (!userState[phone]) {
    userState[phone] = {};
  }

  return userState[phone];
}

function clearUserState(phone) {
  delete userState[phone];
}

module.exports = {
  getUserState,
  clearUserState
};