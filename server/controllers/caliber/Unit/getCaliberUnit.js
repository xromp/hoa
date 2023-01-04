import CaliberUnit from '../../../models/caliber_unit';

const getUnitByCaliberUnitId = async(caliber_unit_id) => {
  return await CaliberUnit.findOne({ 
    where: { caliber_unit_id },
    order: [ [ 'createdAt', 'DESC' ]]
  });
}

export {
  getUnitByCaliberUnitId,
};