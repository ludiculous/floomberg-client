export const SelectStyles = {
  option: (provided, state) => ({
    color: '#808080',
    padding: '5px',
    width: '100%'
  }),
  control: (provided)=>({
    ...provided,
    marginTop: '5px',
    color: '#808080',
    backgroundColor: '#2e2f37',
    borderRadius: '0px'
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: '#808080',
  })
}