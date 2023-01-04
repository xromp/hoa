const Building = require('../models/building');

const bulkCreate = async(buildings) => {
	console.log('buildings ', buildings)
  return await Building.bulkCreate(buildings);
}

const bulkUpdate = async({property_id, buildings}) => {
  await Building.destroy({ where: { property_id }});
  return await bulkCreate(buildings);
}

export {
  bulkCreate,
  bulkUpdate,
}