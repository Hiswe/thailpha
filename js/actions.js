const toggleSetting = event => {
  const { target } = event
  return {
    type:   'TOGGLE_SETTING',
    key:    target.id,
    value:  target.checked,
  }
}  

export {
  toggleSetting,
}
