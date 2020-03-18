import {
  EXPORT_DATA,
  UPLOAD_DATA,
  DOWNLOAD_EXCEL,
  HIDE_DL,
  HIDE_UP
} from '../../actions/types';

const Initial_State = {
  fileurl: '',
  showDL: false,
  showUP: false
}

export default (state = Initial_State, action) => {
  switch (action.type) {
    case EXPORT_DATA:
    console.log("Uploading data from reducer");
    return {...state, filename:action.payload.filename, showDL: true}

    case HIDE_DL:
    console.log('closing dl');
    return {...state, showDL: false}

    case UPLOAD_DATA:
    return {...state, showUP: true}

    case HIDE_UP:
    return {...state, showUP: false}

    default:
    return state
  }
}