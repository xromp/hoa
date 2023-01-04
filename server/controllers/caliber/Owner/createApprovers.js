import { createApprover } from '../../approvers.controller';

const approvers = async (users) => {
  for (const [i, { user_id, property_id }] of users.entries()) {
    await createApprover({
      user_id, 
      property_id,
      is_creator: false,
    })
  }
}

export default approvers;