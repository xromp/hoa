import { createApprovers } from '.';
import { createUser } from '../../user.controller';
import { getResponseByEndpoint } from '../utils';
import createUserLogging from './createUserLogging';
import mapContactToUser from './mapContactToUser';

const getContactInfo = async(contactId) => {
  return await getResponseByEndpoint(`api/v2/clientcontact/${contactId}`);
}

const createBoardMembers = async({ client_id, property_id }, { decodedId }) => {
  console.log(`[Caliber] Uploading Board Members...`);
  const createdUsers = [];
  const contactGroups = await getResponseByEndpoint(`api/v2/client/${client_id}/clientcontactgroups`);
  const { ClientContactGroupID } = contactGroups[0];
  const boardMembers = await getResponseByEndpoint(`api/v2/clientcontactgroup/${ClientContactGroupID}/members/current`);
  if (!boardMembers) throw new Error ('Invalid Client ID');

  for (const member of boardMembers) {
    const { ClientContactID } = member;
    const contact = await getContactInfo(ClientContactID);
    const user = mapContactToUser(contact);
    console.log(`[Caliber] Processing Board Member ${user.email}`);
    const createdUser = await createUser(user);
    createUserLogging({
      caliber_user_id: ClientContactID,
      user_id: createdUser.id,
      last_modified_by: 'caliber',
    });
    createdUsers.push(createdUser);
  }
  createApprovers(createdUsers.map(({ id:user_id, email }) => ({ user_id, email, property_id })));
  console.log(`[Caliber] Board Member created ${boardMembers.length}/${boardMembers.length}`);
  return createdUsers;
}

export default createBoardMembers;