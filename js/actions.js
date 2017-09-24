const toggleSetting = ({key, value}) => {
  return {
    type:   'TOGGLE_SETTING',
    key,
    value,
  }
}

const filterChar = query => {
  return {
    type:   'FILTER_CHAR',
    query,
  }
}

export {
  toggleSetting,
  filterChar,
}
