/*
 *  List All The Endpoints Here
 *  Use createAPI() function to create the endpoints
 *  If we have the header, just pass in the header
 */
import Header from "./headerConfig";
// TODO: put node server api url here
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://secondhand-api.herokuapp.com"
    : "http://localhost:4000";
const createAPI = (endpoint) => `${BASE_URL}${endpoint}`;

const GET_LISTING = (pagenum, limit) =>
  createAPI(`/listings?page=${pagenum}&limit=${limit}`);
const POST_NEW_LISTING = createAPI("/listings/new");
const GET_ONE_LISTING = (id) => createAPI(`/listings/${id}`);
const GET_PROFILE = (netid) => createAPI(`/user/${netid}`);
const GET_USER_LISTING = (netid) => createAPI(`/listings/netid/${netid}`);
const GET_CHATS = createAPI("/chat");
const GET_ONE_CHAT = (id) => createAPI(`/chat/${id}`);
const DELETE_CHAT = (id) => createAPI(`/chat/${id}`);
const CREATE_CHAT = createAPI("/chat");
const UPDATE_USER = (netid) => createAPI(`/user/${netid}`);
const LOGIN_USER = (netid) => createAPI(`/user/login/${netid}`);
const GET_PURCHASE = (sessionId) => createAPI(`/purchases/${sessionId}`);
const GET_PURCHASE_BY_SELLER = (netid) =>
  createAPI(`/purchases/netid/${netid}`);
const COMPLETE_PURCHASE = (id) => createAPI(`/purchases/complete/${id}`);

const CHECKOUT = createAPI(`/checkout/create-checkout-session`);

// Category
const GET_CATEGORY_LIST = createAPI("/category/");
const GET_CATEGORY_BY_ID = (id) => createAPI(`/category/${id}`);

export {
  GET_LISTING,
  POST_NEW_LISTING,
  GET_ONE_LISTING,
  GET_PROFILE,
  GET_USER_LISTING,
  GET_CHATS,
  GET_ONE_CHAT,
  DELETE_CHAT,
  CREATE_CHAT,
  UPDATE_USER,
  LOGIN_USER,
  GET_CATEGORY_LIST,
  GET_CATEGORY_BY_ID,
  GET_PURCHASE,
  GET_PURCHASE_BY_SELLER,
  COMPLETE_PURCHASE,
  CHECKOUT,
};
