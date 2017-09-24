const toggleSetting = event => {
  const { target } = event
  return {
    type:   'TOGGLE_SETTING',
    key:    target.id,
    value:  target.checked,
  }
}

const filterChar = event => {
  const { target } = event
  return {
    type:   'FILTER_CHAR',
    query:  target.value,
  }
}

export {
  toggleSetting,
  filterChar,
}
