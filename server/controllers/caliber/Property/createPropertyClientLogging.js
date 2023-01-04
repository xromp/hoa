import CaliberPropery from '../../../models/caliber_property';

const createPropertyClientLogging = async(data) => {
  return await CaliberPropery.create(data);
}
export default createPropertyClientLogging;