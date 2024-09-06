import Cookie from "js-cookie"
import { BOOKING_USER_PAYLOAD, USER_PAYMENT_OPTION } from "../constants"



//set user-booking-details
export function setUserBookingDetails(payload: any) {
    // , role: any
    // , role
    Cookie.set(BOOKING_USER_PAYLOAD, JSON.stringify({ payload }))
}
//get user-booking-details
export function getUserBookingDetails() {
    let payload
    payload = Cookie.get(BOOKING_USER_PAYLOAD)

    if (payload) {
        return JSON.parse(payload)
    }
    return { payload: null }
}


//set user-booking-details
export function setPaymentOption(payload: string) {
    // , role: any
    // , role
    Cookie.set(USER_PAYMENT_OPTION, JSON.stringify({ payload }))
}
//get user-booking-details
export function getPaymentOption() {
    let payload
    payload = Cookie.get(USER_PAYMENT_OPTION)

    if (payload) {
        return JSON.parse(payload)
    }
    return { payload: null }
}
