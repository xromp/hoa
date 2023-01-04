import CaliberUnit from '../../../models/caliber_unit';

const createUnitLoggings = async(data) => {
  return await CaliberUnit.bulkCreate(data);
}

export default createUnitLoggings;