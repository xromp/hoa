const PaymentMethod = require("../../models/payment/payment_method")


  exports.add = async (obj) => {
    //TODO: add more field validation
    try {
      
      let payload = await PaymentMethod.create(obj)
      return payload;
    } catch({ message }) {
      throw new Error(message);
    }
  }

  exports.updateById = async(id,obj) => {
    PaymentMethod.update(obj, {
      where: {
        id: id
      }
    })
    .then(result => {
      return {'message':'success'}
    })
    .catch(exception => {
      return {'message':'error','error':exception}
    })
  }
     //TODO:
  /*exports.setAsDefault = async(userId,id) => {
    //remove default setting of all
    PaymentMethod.update(obj, {
      where: {
        id: userId
      }
    })
    //set new one 
    .then(result => {
      return {'message':'success'}
    })
    .catch(error => {
      return {'message':'error','error':error}
    })
  }*/

  /*
  * DeleteById
  * Deletes a PaymentMethod   
  */
  exports.deleteById = async (id) => {
    try {
      let paymentMethodObj = await PaymentMethod.findOne({
        where: {
          id: id
        }
      });
      if(paymentMethodObj){
        let result = await paymentMethodObj.destroy();
        if(result)
          return {'message':'success'}
      }
    } catch(exception) {
      return { 'message':'error','error': exception }
    }
  }

  exports.findByUserId = async (userId) => {
    PaymentMethod.findAll({
      where: {
        user_id: userId
      }
    })
    .then(paymentMethods => {
      return paymentMethods;
    })
    .catch(exception => {
      return { 'message':'error','error': exception }
    })
  }
  //TODO: this is a placeholder/can be used for something else
  exports.findById = async (id) => {
    PaymentMethod.findOne({
      where: {
        id: id
      }
    })
    .then(paymentMethods => {
      return paymentMethod;
    })
    .catch(exception => {
      return { 'message':'error','error': exception }
    })
  
  }

  exports.view = async (id) => {
    PaymentMethod.findOne({
      where: {
        id: id
      }
    })
    .then(paymentMethods => {
      return paymentMethod;
    })
    .catch(exception => {
      return { 'message':'error','error': exception }
    })
  }

exports.getPaymentMethodByUserId = async (user_id) => {
  console.log({user_id})
  const payments = await PaymentMethod.findAll(
    { where: { 
      user_id,
      isActive: true,
      isDeleted: false,
    }, 
    raw: true
  });
  return payments;
}

exports.isPaymentByReferenceExist= async ({paymentReference, userId}) => {
  const payment = await PaymentMethod.findOne(
    { where: { 
      user_id: userId,
      paymentReference,
      isActive: true,
      isDeleted: false,
    }
  });
  return !!payment;
}