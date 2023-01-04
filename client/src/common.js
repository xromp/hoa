import moment from "moment";
let timezoneOffset = new Date().getTimezoneOffset() / -60;

export default {
  formatDate(strDate) {
    let objDate = moment(strDate,"YYYY-MM-DD HH:mm");
    if(!objDate.isValid()){
      return "";
    }
    return objDate.format("MMM DD YYYY");
    // return objDate.format("YYYY-MM-DD HH:mm");
  },
  formatDate2(strDate) {
    let objDate = moment(strDate,"YYYY-MM-DD HH:mm:ss");
    if(!objDate.isValid()){
      return "";
    }
    return objDate.format("YYYY-MM-DD HH:mm");
  },
  formatDate3(strDate) {
    let objDate = moment(strDate,"YYYY-MM-DD HH:mm:ss");
    if(!objDate.isValid()){
      return "";
    }
    return objDate.format("YYMMDD-HHmm");
  },
  formatDate4(strDate) {
    let objDate = moment(strDate,"YYYY-MM-DD HH:mm:ss");
    if(!objDate.isValid()){
      return "";
    }
    return objDate.format("YYYY-MM-DD");
  },
  formatDate5(strDate) {
    let objDate = moment(strDate,"YYYY-MM-DD HH:mm:ss");
    if(!objDate.isValid()){
      return "";
    }
    return objDate.format("YYMMDD");
  },
  formatTime(strDate) {
    let objDate = moment(strDate,"YYYY-MM-DD HH:mm");
    if(!objDate.isValid()){
      return "";
    }
    return objDate.format("HH:mm");
  },
  formatTime2(strDate) {
    let objDate = moment(strDate,"YYYY-MM-DD HH:mm");
    if(!objDate.isValid()){
      return "";
    }
    return objDate.format("hh:mm A");
  },
  formatTime3(strDate) {
    let objDate = moment(strDate,"YYYY-MM-DD HH:mm");
    if(!objDate.isValid()){
      return "";
    }
    return objDate.format("hh:mmA");
  },
  addTime(strDate, h, t) {
    let objDate = moment(strDate).add(h, t).format('hh:mmA');
    return objDate
  },   
  addTime2(strDate, h, t) {
    let objDate = moment(strDate).add(h, t).format('YYYY-MM-DD HH:mm');
    return objDate
  }, 
  addTime3(strDate, h, t) {
    let objDate = moment(strDate).add(h, t).format('YYYY-MM-DD HH:mm');
    return new Date(objDate)
  }, 
  subtractTime(strDate, h, t) {
    let objDate = moment(strDate).subtract(h, t).format('YYYY-MM-DD HH:mm');
    return objDate
  },
  addHours(strDate, h) {
    let objDate = moment(strDate).add(h, 'hours').format('YYYY-MM-DD HH:mm');
    return objDate
  },  
  subtractHours(strDate, h) {
    let objDate = moment(strDate).subtract(h, 'hours').format('YYYY-MM-DD HH:mm');
    return objDate
  },
  addDays(strDate, d) {
    let objDate = moment(strDate).add(d, 'days').format('YYYY-MM-DD HH:mm');
    return objDate
  },  
  timeToDate(d, t) {
    let strDate = new Date(d + ' ' + t)
    return strDate;
  },
  convertT(t, d) {
    let isAm = t.indexOf("AM") !== -1
    let isPm = t.indexOf("PM") !== -1

    let nStartTime = null
    if (isAm) {
      nStartTime = t.replace('AM', '')
      nStartTime = new Date(d + ' ' + nStartTime)
    } else if (isPm) {
      nStartTime = t.replace('PM', '')
      nStartTime = new Date(d + ' ' + nStartTime)

      if (nStartTime.getHours() !== 12) {
        nStartTime.setHours(nStartTime.getHours()+12)
      }
    }

    return nStartTime
  },
  setNewTZ(d) {
    let objDate = d.setHours(d.getHours()+timezoneOffset)
    return objDate    
  },
  getWeek(d) {
    let objDate = moment(d,"YYYY-MM-DD HH:mm");
    if(!objDate.isValid()){
      return "";
    }
    return objDate.format("w");
  }
};
