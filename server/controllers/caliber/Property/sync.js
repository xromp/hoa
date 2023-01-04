import CaliberPropery from '../../../models/caliber_property';
import Property from '../../../models/property';
import { getTemporaryPassword } from '../../user.controller';
import { optionalChaning } from '../utils';


export default class Sync {
  constructor(clientId) {
    this.clientId = clientId;
  }

  async getClient() {
    return await CaliberPropery.findOne({ where: { client_id: this.clientId } });
  }

  async isSync() {
    const { property_id, last_modified } = await this.getClient();
    const { updatedAt } = await Property.findOne({ where: { id: property_id } });
  }

  async compare() {

  }

  async start() {

  }
}