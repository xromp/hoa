import property from '../../../routes/properties';
import { bulkCreate, createUser, getTemporaryPassword } from '../../user.controller';
import { bulkCreate as bulkCreateUserOrgRole } from '../../user_org_role.controller';
import { getUserRoleByQuery } from '../../user_role.controller';
import { findPropertyById } from '../../property.controller';

import { getResponseByEndpoint } from '../utils';
import createUserLogging from './createUserLogging';
import ownerMapUser from './mapOwnerToUser';
import { webMobileEmailNotification } from '../../notification.controller';
import createBoardMembers from './createBoardMembers';

const isValidUser = (user) =>{
  return !!user.email;
}

const getOwnerPayerRoleId = async({ property_id, slug }) => {
  const { id } = await getUserRoleByQuery({ slug, property_id });
  return id;
}


const notifUser = async ({ title, message, property_id, user_id, email, sender_id }) => {
  const notif = {
    title,
    webBody: message,
    mobileBody: message,
    emailBody: message,
    propertyId: property_id,
    propertyResId: property_id,
    decodedId: user_id,
    send_by: sender_id,
    user_id,
    email,
    updatedAt: new Date(),
    createdAt: new Date(),
  }
  return webMobileEmailNotification(notif)
}

const sendNotif = async ({ id:user_id, email, temporaryPassword }, { propertyName, property_id, decodedId: sender_id }) => {
  const notif = {
    title: `Welcome aboard, ${propertyName}`,
    message: `Please use this temporary password ${temporaryPassword} to set up all the necessary configuration for your property.`,
    property_id,
    user_id,
    email,
    sender_id,
  };
  notifUser(notif);
}

const createUsersFromClient = async({ client_id, property_id, parent_org_id:pmc_id, }, { decodedId }) => {
  try {
    console.log(`[Caliber] Uploading Owners...`);
    const owners = await getResponseByEndpoint(`api/v2/client/${client_id}/owners/all`);
    if (!owners) throw new Error ('Invalid Client ID');
    const ownerRoleId = await getOwnerPayerRoleId({ property_id, slug: 'user_owner_payer' });
    const boardMemberRoleId = await getOwnerPayerRoleId({ property_id, slug: 'staff_board_member' });
    const { name: propertyName } = await findPropertyById({ id: property_id });
    const createdUsers = [];

    for (const owner of owners) {
      const user = ownerMapUser({ ...owner, user_role_id: ownerRoleId });

      if (isValidUser(user)) {
        const data = await createUser(user);
        createUserLogging({
          caliber_user_id: user.caliber_contact_id,
          user_id: data.id,
          last_modified_by: 'caliber',
        });
        createdUsers.push(data);
        // sendNotif(data, { propertyName, property_id, decodedId });
        console.log(`[Caliber] Processing owner ${user.email}`);
      }
    }
    console.log(`[Caliber] Users created ${createdUsers.length}/${owners.length}`);
  
    const createdBoardMembers = await createBoardMembers({ client_id, property_id }, { decodedId });
    const ownerUserOrgRoles = createdUsers.map(({ id: user_id }) => ({
      user_id,
      user_role_id: ownerRoleId,
      property_id,
      pmc_id,
    }));
    const boardMemberUserOrgRoles = createdBoardMembers.map(({ id: user_id }) => ({
      user_id,
      user_role_id: boardMemberRoleId,
      property_id,
      pmc_id,
    }))
    await bulkCreateUserOrgRole([ ...ownerUserOrgRoles, ...boardMemberUserOrgRoles ]);
    console.log(`[Caliber] User Org Role created`);
    return { 
      owners: createdUsers, 
      boardMembers: createdBoardMembers,
    };
  } catch (error) {
    console.log(`[Caliber] ${error}`);
  }
}

export default createUsersFromClient;