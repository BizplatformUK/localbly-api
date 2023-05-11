const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const stringSimilarity = require('string-similarity');
require('dotenv').config()

function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

function getAbbreviation(text) {
    if (typeof text != 'string' || !text) {
      return '';
    }
    const acronym = text
      .match(/[\p{Alpha}\p{Nd}]+/gu)
      .reduce((previous, next) => previous + ((+next === 0 || parseInt(next)) ? parseInt(next): next[0] || ''), '')
      .toUpperCase()
    return acronym;
}

function generateID(){
    return uuidv4();
}

function createDate(date){
    if(date == null){
        const currentDate = new Date().toLocaleString('en-KE', {day:'numeric', month:'long', year:'numeric', hour: '2-digit', minute: '2-digit', second:'2-digit'});
        return currentDate
    }
    
    const formattedDate = new Date(date).toLocaleString('en-KE', {day:'numeric', month:'long', year:'numeric'});
    return formattedDate

}

function roundToNearest(decimalValue) {
    return Math.round(decimalValue / 0.5) * 0.5;
}

function isValidPhoneNumber(phoneNumber) {
    var phoneNumberRegex = /^(07|\+254)[0-9]{8}$/;
    return phoneNumberRegex.test(phoneNumber);
}

function isValidEmail(email) {
    // Email address regular expression
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
}

function isValidEmailOrNumber(string){
    var phoneNumberRegex = /^(07|\+254)[0-9]{8}$/;
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!phoneNumberRegex.test(string) && !emailRegex.test(string)){
        return false
    }
    if(!phoneNumberRegex.test(string) || emailRegex.test(string)){
        return {login:string, type: 'email login'} 
    }
    if(phoneNumberRegex.test(string) || !emailRegex.test(string)){
        return {login:string, type: 'number login'} 
    }
    
}


function generateToken(){
    const secret = process.env.REFRESH_TOKEN;
    const token = crypto.createHmac('sha256', secret)
                   .update('I am a secure token')
                   .digest('hex');
    return token
}

function generateCouponCodes(string) {
    const abbr = getAbbreviation(string)
    let code = crypto.randomBytes(2).toString('hex');
    const coupon = abbr + code;
    return coupon
}

function checkDataType(value, dataType) {
    return typeof value === dataType;
}

function isArray(value) {
    return Array.isArray(value);
}

function checkMultipleDataTypes(values, dataType) {
    return values.every(value => typeof value === dataType);
}



function getDiscountPrice(origPrice, discount){
    let discountTotal = (discount/100)*origPrice;
    let roundedTotal = Math.round(discountTotal/0.5) * 0.5;
    let discountPrice = (origPrice - roundedTotal);

    return discountPrice;
}

function extractFileNameFromUrl(url) {
    const parts = url.split('/');
    return parts[parts.length - 1];
}

function compareStrings(str1, str2) {
    const similarity = stringSimilarity.compareTwoStrings(str1, str2);
    return similarity > 0.5;
}

const piclink = `https://localblyimages.blob.core.windows.net/images/logo.png`

module.exports = {
    slugify, 
    getAbbreviation, 
    generateID, 
    createDate, 
    roundToNearest, 
    isValidPhoneNumber, 
    isValidEmail, 
    isValidEmailOrNumber, 
    generateToken, 
    generateCouponCodes, 
    checkDataType, 
    isArray,
    checkMultipleDataTypes,
    checkDataType,
    getDiscountPrice,
    extractFileNameFromUrl,
    piclink,
    compareStrings
}