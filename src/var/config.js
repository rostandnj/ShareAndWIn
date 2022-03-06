export const facebook = {
  client_id: '245511887163805',
  client_secret: 'f12957e36b2d6b001d54a53357d6a00b',
  callback_url: 'https://www.ushareandwin.com/oauth2/redirect',
  callback_urlbad:
    'https://ushareandwin.com:8089/oauth2/callback/{registrationId}',
};
export const google = {
  client_id:
    '851854832805-jbdqge5kiam3jiu1n61nl2e2m827qnsr.apps.googleusercontent.com',
  client_secret: 'ApVaxttbHNKQDuyI94O8bR5A',
  callback_url: 'https://www.ushareandwin.com:8089/oauth2/callback/google',
  callback_urlbad:
    'https://ushareandwin.com:8089/oauth2/callback/{registrationId}',
};
export const API_URL_BASE1 = 'https://backend.ushareandwin.com/';
export const API_URL_BASE2 = 'https://backend.ushareandwin.com/';
export const API_URL_BASE3 = 'https://backend.ushareandwin.com/'; //pic
export const API_URL_BASE4 = 'https://backend.ushareandwin.com/';
export const APP_NAME = '';
export const GCM_FCM_ID = '';
export const APP_NAME_SLUT = '';
export const API_REGISTRARTION = 'api/account/registration';
export const API_LOGIN = 'auth/login';
export const API_LOGIN_GOOGLE = 'mobileAuthUser/';
export const API_REGISTER = 'account/register';
export const API_RESET_PASSWORD = 'account/newPasswdMail';
export const API_USER_PROFILE = 'auth/me';
export const API_FILE = 'account/read/';
export const API_FILE_MINI = 'account/readMiniature/';
export const API_FILE_MEDIUM = 'account/readMedium/';
export const API_Loyality = 'company/offer/loyaltypoint/';
export const API_UPDATE_PROFILE = 'account/update/';
export const API_UPDATE_PROFILE_PICTURE = 'account/updateProfilPic';
export const API_COMPANY_OFFERS2 = 'company/offer/page';
export const API_COMPANY_OFFERS = 'company/offer/pageV2';
export const API_SEARCH_OFFER = 'company/filterOffer';
export const API_COMPANY_MAKE_REACTION = 'company/view/create';
export const API_COMPANY_GET_COMMENT_OLD = 'company/comments';
export const API_COMPANY_GET_COMMENT = 'company/offerCommentInOfferPage';
export const API_COMPANY_MAKE_COMMENT = 'company/offer/comment';
export const API_USER_GROUPS_OLD = 'group/usersGroupPage?iduser=';
export const API_USER_GROUPS = 'group/usersGroupDtoPage?iduser=';
export const API_ALL_GROUPS_OLD = 'group/pageDto/';
export const API_ALL_GROUPS = 'group/page/';
export const API_GROUP_SUBSCRIBE = 'group/member/create?idUser=';
export const API_GROUP_MEMBERS = 'group/membersInGroupPage?groupId=';
export const API_GROUP_OFFERS_OLD = 'group/offerByGroupPage';
export const API_GROUP_OFFERS = 'group/offerByGroupPage';
export const API_USER_NOTIFICATION =
  'chat/notificationListPage?enumNotifType=GROUP&userId=';
export const API_NOTIFICATION_UNREAD_NUMBER =
  'chat/unseenNotificationList?enumNotifState=UNSEEN&enumNotifType=GROUP&userId=';
export const API_SAVE_OFFERT = 'company/offer/savedOffer?offerId=';
export const API_REPORT_OFFERT = 'company/offer/reportedOffer?offerId=';
export const API_RE_MOVE_OFFERT = 'company/offer/removeSavedOffer?offerId';
export const API_LIST_SAVE_OFFERT = 'company/offer/listOfSavedOffer?userId';

const Config = {
  facebook,
  API_SAVE_OFFERT,
  API_REPORT_OFFERT,
  API_RE_MOVE_OFFERT,
  API_LIST_SAVE_OFFERT,
  google,
  API_URL_BASE1,
  API_URL_BASE2,
  API_URL_BASE3,
  API_URL_BASE4,
  APP_NAME,
  API_LOGIN,
  API_LOGIN_GOOGLE,
  API_REGISTER,
  API_RESET_PASSWORD,
  API_USER_PROFILE,
  API_FILE,
  API_FILE_MINI,
  API_FILE_MEDIUM,
  API_Loyality,
  API_UPDATE_PROFILE,
  API_UPDATE_PROFILE_PICTURE,
  API_COMPANY_OFFERS,
  API_COMPANY_MAKE_REACTION,
  API_COMPANY_GET_COMMENT,
  API_COMPANY_MAKE_COMMENT,
  API_USER_GROUPS,
  API_ALL_GROUPS,
  API_GROUP_SUBSCRIBE,
  API_GROUP_MEMBERS,
  API_USER_NOTIFICATION,
  API_NOTIFICATION_UNREAD_NUMBER,
  API_SEARCH_OFFER,
  API_GROUP_OFFERS,
};
export default Config;
