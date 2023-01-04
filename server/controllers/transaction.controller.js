import Transaction from '../models/transaction_v2';
import TransactionLine from '../models/transaction_line_v2';
import UnitUser from '../models/unit_user';
Transaction.hasMany(TransactionLine, { foreignKey: 'transaction_id' });

const getTransByPropertyId = async({ property_id }) => {
  return await Transaction.find({ 
    include: [TransactionLine],
    where: { property_id }
  });
}

const getTransByUserId = async({ user_id }) => {
  const units = await UnitUser.findAll({ 
    where: { user_id },
    raw: true,
  });
  const unitIds = units.map(({ unit_id }) => unit_id);
  return await Transaction.findAll({ 
    include: [{ model: TransactionLine }],
    where: { unit_id:unitIds },
  });
}

export {
  getTransByPropertyId,
  getTransByUserId,
}