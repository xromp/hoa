const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const http = require('http')
const Amenity = require('../models/amenity')
const AmenityReservation = require('../models/amenity_reservation')
const AmenityReservationDetail = require('../models/amenity_reservation_detail')
const Property = require('../models/property')
const User = require('../models/user')
const UserRole = require('../models/user_role')
const pushNotif = require('../controllers/push_notif')
const mailController = require('../controllers/mail')
const NotificationMessage = require('../models/notification_message')
const Notification = require('../models/notification')
const NotificationSent = require('../models/notification_sent')
const today = new Date()
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { getAmenityByPropertyRef } = require('./amenity.controller');
const { getUnits } = require('./unit.controller');
const amenityReservationController = require('./amenity_reservation.controller');
const mainController = require('../controllers/main')
let timezoneOffset = 0
//0
//new Date().getTimezoneOffset() / -60

let asAdmin = ['admin', 'parent', 'super', 'manager']
let asTenant = ['user']

// AmenityReservation.hasMany(AmenityReservationDetail, {foreignKey: 'amenity_reservation_id'})
// AmenityReservation.belongsTo(AmenityReservationDetail, {targetKey:'id',foreignKey: 'amenity_reservation_id'})
AmenityReservationDetail.belongsTo(AmenityReservation, {targetKey:'id',foreignKey: 'amenity_reservation_id'})

exports.getMaxUserAllowed = async (data) => {
  const listData = await amenityReservationController.getAmenityReservation(data)
  let optionAmenity = await getAmenityByPropertyRef(data.property_ref)
  let listReservations = listData.filter((res) => data.amenity_id === res['dataValues']['amenity_id'] )
  let start_date = mainController.convertTime('00:00AM', mainController.formatDate(new Date(data.startDate)) )
  let end_date = mainController.convertTime('00:00AM', mainController.formatDate(new Date(data.endDate)) )

  optionAmenity.filter((res) => {
    data.booking_limit = data.amenity_id !== res['id'] ? data.booking_limit : res['booking_limit']
    data.max_user_allowed = data.amenity_id !== res['id'] ? data.max_user_allowed : res['max_user_allowed']
    data.booking_limit_unit = data.amenity_id !== res['id'] ? data.booking_limit_unit : data.optionBookingLimitUnit.filter(booking_limit => booking_limit.id === res['booking_limit_unit'])
  })

  let number_of_users = 0
  listReservations.filter((res) => {
    let result_fromDate = new Date(res.from_date)
    if (data.booking_limit_unit[0]['id'] === 1 && result_fromDate.getDate() === start_date.getDate()) { //daily
      number_of_users = res.id === data.id ? number_of_users : res.people + number_of_users
    } else if (data.booking_limit_unit[0]['id'] === 2 && parseInt( mainController.getWeek(result_fromDate) ) == parseInt( mainController.getWeek(start_date) )) {//weekly
      number_of_users = res.id === data.id ? number_of_users : res.people + number_of_users
    } else if (data.booking_limit_unit[0]['id'] === 3 && result_fromDate.getMonth() === start_date.getMonth()) {//monthly
      number_of_users = res.id === data.id ? number_of_users : res.people + number_of_users
    }
  })

  const is_max = data.max_user_allowed < (number_of_users + parseInt(data.people))
  const remaining = data.max_user_allowed - number_of_users
  const total = data.max_user_allowed - (number_of_users + parseInt(data.people))

  return {is_max, max_user_allowed:data.max_user_allowed, remaining, total, data, listReservations}
}

exports.getBookingLimit = async (data) => {
  const listData = await amenityReservationController.getAmenityReservation(data)
  let optionAmenity = await getAmenityByPropertyRef(data.property_ref)
  let listReservations = listData.filter((res) => data.amenity_id === res['dataValues']['amenity_id'] )
  const start_date = mainController.convertTime('00:00AM', mainController.formatDate(new Date(data.startDate)) )

  optionAmenity.filter((res) => {
    data.booking_limit = data.amenity_id !== res['id'] ? data.booking_limit : res['booking_limit']
    data.booking_limit_unit = data.amenity_id !== res['id'] ? data.booking_limit_unit : data.optionBookingLimitUnit.filter(booking_limit => booking_limit.id === res['booking_limit_unit'])
  })

  listReservations = listReservations.filter((res) => {
    let result_fromDate = new Date(res.from_date)
    if (data.booking_limit_unit[0]['id'] === 1 && result_fromDate.getDate() === start_date.getDate()) { //daily
      return res
    } else if (data.booking_limit_unit[0]['id'] === 2 && parseInt( mainController.getWeek(result_fromDate) ) == parseInt( mainController.getWeek(start_date) )) {//weekly
      return res
    } else if (data.booking_limit_unit[0]['id'] === 3 && result_fromDate.getMonth() === start_date.getMonth()) {//monthly
      return res
    }
  })

  const result = data.booking_limit <= listReservations.length

  return result
}

exports.getMinMaxTime = async (data) => {
  let optionAmenity = await getAmenityByPropertyRef(data.property_ref)
  let amenity_min_time = null
  let amenity_max_time = null

  optionAmenity.filter((res) => {
    data.amenity_min_time = data.amenity_id !== res['id'] ? data.amenity_min_time : data.optionMinHours.filter(y => y.id === res['min_hours'])
    data.amenity_max_time = data.amenity_id !== res['id'] ? data.amenity_max_time : data.optionMaxHours.filter(y => y.id === res['max_hours'])
  })

  let data_fromTime = data.optionHoursStart.filter((res) => res.id === data.from_time)
  let data_toTime = data.optionHoursStart.filter((res) => res.id === data.to_time)
  let converted_fromTime = mainController.convertTime(data_fromTime[0]['val'].replace('12:', '00:'), '2021-01-01')
  let converted_toTime = mainController.convertTime(data_toTime[0]['val'].replace('12:', '00:'), '2021-01-01')
  let difference = Math.abs(converted_fromTime.getTime() - converted_toTime.getTime());
  let hourDifference = difference  / 1000 / 3600;
  
  data.isMin = data.amenity_min_time[0]['h'] <= hourDifference
  data.isMax = data.amenity_max_time[0]['h'] >= hourDifference

  const hoursValidations = {
    min: data.isMin,
    max: data.isMax,
  }
  return {isMinMax: hoursValidations, data_local:data};
}

exports.getAmenityReservationDetails = async (data) => {
  const property = await module.exports.findPropertyByPropertyRef(data.property_ref)
  data.property_id = property['dataValues']['id'] 
  const result = await module.exports.findAmenityReservationDetailByMultipleParams(data)

  return ({message:'time_overlap', result})
}

exports.getAmenityReservationDetailDuplicate = async (data) => {
  let isAdmin = asAdmin.includes(data.role_val)
  let isTenant = asTenant.includes(data.role_val)
  let optionAmenity = await getAmenityByPropertyRef(data.property_ref)
  let optionUnit = await getUnits(data)

  data.endDate = isTenant ? data.startDate : data.endDate

  optionAmenity.filter((res) => {
    data.amenity_name = data.amenity_id == res['id'] ? res['name'] : data.amenity_name
  })

  optionUnit.filter((res) => {
    data.unit_number = data.unit_id == res['id'] ? res['number'] : data.unit_number
  })

  data.optionHour.filter((res) => {
    data.from_time = data.from_time == res['id'] ? res['val'] : data.from_time
    data.to_time = data.to_time == res['id'] ? res['val'] : data.to_time
  })

  // data.endDate = data.is_block === 0 ? data.startDate : data.endDate
  let data_fromTime = data.from_time.toString().replace('12:', '00:');
  let data_toTime = data.to_time.toString().replace('12:', '00:');
  let converted_fromTime = mainController.convertTime(data_fromTime, mainController.formatDate(new Date(data.startDate)) )
  let converted_toTime = mainController.convertTime(data_toTime, mainController.formatDate(new Date(data.endDate)) )
  
  data.startDate = mainController.addHours(new Date(converted_fromTime), timezoneOffset)
  data.endDate = mainController.addHours(new Date(converted_toTime), timezoneOffset)
  let title1 = data.amenity_name + ": " + data.unit_number + " - (" + data.from_time + " to " + data.to_time + ")"
  let title2 = data.amenity_name + ": Blocked - (" + data.from_time + " to " + data.to_time + ")"
  data.title = data.is_block === 0 ? title1 : title2
  data.classes = `event-${  data.labelColor}`
  data.from_datetime = mainController.addHours(new Date(converted_fromTime), timezoneOffset)
  data.to_datetime = mainController.addHours(new Date(converted_toTime), timezoneOffset)
  data.from_date = mainController.formatDate2(converted_fromTime)
  data.to_date = mainController.formatDate2(converted_toTime)
  data.createdAt = mainController.addHours(new Date(), timezoneOffset)
  data.updatedAt = mainController.addHours(new Date(), timezoneOffset)

  let i = 0
  let temp_fromDate = null
  data.from_dates = []

  for (let fromDay = new Date(data.from_date).getDate(); fromDay <= (new Date(data.to_date).getDate()); fromDay++) {
    temp_fromDate = mainController.addDays(data.from_date, i) 
    data.from_dates.push(temp_fromDate)
    i++
  }

	const property = await module.exports.findPropertyByPropertyRef(data.property_ref)
	data.property_id = property['dataValues']['id']
  const result = await module.exports.findAmenityReservationDetailByMultipleParams(data)

  let requestedDates = []
  let reservedDates = []

  let converted_dataStartDate = mainController.convertTime(data.from_time.replace('12:', '00:'), mainController.formatDate(new Date(data.startDate)))
  let converted_dataEndDate = mainController.convertTime(data.to_time.replace('12:', '00:'), mainController.formatDate(new Date(data.endDate)))
  converted_dataStartDate = mainController.addTime3(converted_dataStartDate, 30, 'minutes')

  while (converted_dataEndDate.getTime() >= converted_dataStartDate.getTime()) {  
    requestedDates.push(converted_dataStartDate)
    converted_dataStartDate = mainController.addTime3(converted_dataStartDate, 30, 'minutes')
  }

  console.log('==============================================================')
  console.log('REQUESTEDDATES ', requestedDates)

  result.filter((res) => {
    res = res.dataValues
    if (res.id === data.id) return
    let converted_startFromDate = mainController.convertTime(res['from_time'].replace('12:', '00:'), res['from_date'])
    let converted_endFromDate = mainController.convertTime(res['to_time'].replace('12:', '00:'), res['from_date'])
    let converted_startToDate = mainController.convertTime(res['from_time'].replace('12:', '00:'), res['to_date'])
    let converted_endToDate = mainController.convertTime(res['to_time'].replace('12:', '00:'), res['to_date'])

    z = 0
    while (converted_endFromDate.getTime() >= converted_startFromDate.getTime()) {  
      reservedDates.push(converted_startFromDate )
      converted_startFromDate = mainController.addTime3(converted_startFromDate, 30, 'minutes')
      z++
    }
  })

  console.log('RESERVEDDATES ', reservedDates)  

  let overlapDates = []
  Object.values(requestedDates).map((value, key) => {
    reservedDates.filter((result) =>{    
        if (result.toString() === value.toString()) {
          overlapDates.push(result)
        }
      }
    )
  })

  console.log('OVERLAPDATES ', overlapDates)

  let isDuplicate = overlapDates.length > 0
  return isDuplicate

  result.filter((res) => {
    res = res.dataValues
    let converted_startFromDate = mainController.convertTime(res['from_time'].replace('12:', '00:'), res['from_date'])
    let converted_endFromDate = mainController.convertTime(res['to_time'].replace('12:', '00:'), res['from_date'])
    let converted_startToDate = mainController.convertTime(res['from_time'].replace('12:', '00:'), res['to_date'])
    let converted_endToDate = mainController.convertTime(res['to_time'].replace('12:', '00:'), res['to_date'])

    let data_fromTime = mainController.convertTime(data.from_time.replace('12:', '00:'), mainController.formatDate(new Date(data.startDate)) )
    let data_toTime = mainController.convertTime(data.to_time.replace('12:', '00:'), mainController.formatDate(new Date(data.endDate)) )

    if (data.amenity_reservation_id !== parseInt(res['amenity_reservation_id']) ) {  
      while (converted_endFromDate.getTime() > converted_startFromDate.getTime()) {  
        isDuplicate = data_fromTime.getTime() === converted_startFromDate.getTime() ? true : isDuplicate
        isDuplicate = data_toTime.getTime() === converted_startFromDate.getTime() ? true : isDuplicate
        converted_startFromDate = mainController.addTime3(converted_startFromDate, 30, 'minutes')
      }

      while (converted_endToDate.getTime() > converted_startToDate.getTime()) {  
        isDuplicate = data_fromTime.getTime() === converted_startToDate.getTime() ? true : isDuplicate
        isDuplicate = data_toTime.getTime() === converted_startToDate.getTime() ? true : isDuplicate
        converted_startToDate = mainController.addTime3(converted_startToDate, 30, 'minutes')
      }
    }
  })
}

exports.getAmenityReservationDetail = async (data) => {
  const userRole = await module.exports.findUserRole(data.decodedUserRoleId)
  const reservationByProperty = module.exports.findAmenityReservationDetailByPropertyRef(data.headersPropertyRef)
  const reservationByUser = module.exports.findAmenityReservationDetailByUserId(data.decodedId)
  const result = userRole['dataValues']['val'] === 'admin' ? reservationByProperty : reservationByUser

  return result
}

exports.getAmenityReservationDetailById = async (id) => {
	const result = await AmenityReservationDetail.findOne({
    where: {
      id
    },
    include: [    
      { model: Property },
    ],
    order: [
      ['id', 'DESC']
    ],
  })

  return result
}

exports.postAmenityReservationDetail = async (data) => {
	const amenityReservation = await module.exports.findAmenityReservationDetailByReservationId(data.amenity_reservation_id)

	// if (amenityReservation.length !== 0) {  
	// 	await module.exports.deleteAmenityReservationDetailById(data.amenity_reservation_id)      
	// }

	// const userRole = await module.exports.findUserRole(data.decodedUserRoleId)
	const property = await module.exports.findPropertyByPropertyRef(data.current_env.property_ref)
	let promises = [];
	let d = []

	data.from_dates.filter((res) => {
	  d = {
	    amenity_reservation_id: data.amenity_reservation_id,
	    amenity_id: data.amenity_id,
	    property_id: property['dataValues']['id'],
	    from_time: data.from_time,
	    to_time: data.to_time,
	    from_date: res,
	    to_date: data.to_date,
	  }

	  promises.push(module.exports.createAmenityReservationDetail(d));  
	})

  return ({message:'success'})
}

exports.deleteAmenityReservationDetailById = async (id) => {
	const result = await AmenityReservationDetail.destroy({
    where: {
      amenity_reservation_id: id
    }
  })

  return ({message:'success', result})
}

exports.findUserRole = async (id) => {
  const result = await UserRole.findOne({
    where: {
      id
    }
  })

  return result
}

exports.findAmenityReservationDetailByPropertyRef = async (ref) => {
  const result = await AmenityReservationDetail.findAll({
    include: [
      { model: Amenity },
      { 
        model: Property, 
        where: {
          ref
        } 
      },
    ],
    order: [
      ['updatedAt', 'ASC']
    ],
  })

  return result
}

exports.findAmenityReservationDetailByUserId = async (id) => {
  const result = await AmenityReservationDetail.findAll({
    where: {
      user_id: id
    },
    include: [
      { model: Property },
    ],
    order: [
      ['updatedAt', 'ASC']
    ],
  })

  return result
}

exports.findPropertyByPropertyRef = async (ref) => {
  const result = await Property.findOne({
    where: {
      ref
    },
  })

  return result
}

exports.findAmenityReservationDetailByMultipleParams = async (data) => {
  const result = await AmenityReservationDetail.findAll({
    include: [
      { 
        model: AmenityReservation, 
        where: {
          status: {
            [Op.notIn]: ['reject' , 'delete']
          }  
        },
      },
    ],      
    where: {
      from_date: data.from_dates,
      amenity_id: data.amenity_id,
      property_id: data.property_id,
    }
  })

  return result
}

exports.findAmenityReservationDetailByReservationId = async (id) => {
  const result = await AmenityReservationDetail.findAll({
	  where: {
	    amenity_reservation_id: id
	  }
	})

  return result
}

exports.createAmenityReservationDetail = async (data) => {
  const result = AmenityReservationDetail.create({
    amenity_reservation_id: data.amenity_reservation_id,
    amenity_id: data.amenity_id,
    property_id: data.property_id,
    from_time: data.from_time,
    to_time: data.to_time,
    from_date: data.from_date,
    to_date: data.to_date,
  })

	return result
}
