import CaliberUser from '../../../models/caliber_user';

const createUserLogging = async(data) => {
  return await CaliberUser.create(data);
}

export default createUserLogging;