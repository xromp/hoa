import { createApprover } from '../../approvers.controller';

const approvers = async (users) => {
  for (const { email, user_id, propertyid } of users) {
    await createApprover({
      user_id, 
      propertyid,
      is_creator: email === "tixek91349@fxseller.com",
    })
  }
}

export default approvers;