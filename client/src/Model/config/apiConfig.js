/*
 *  List All The Endpoints Here
 *  Use createAPI() function to create the endpoints
 *  If we have the header, just pass in the header
 */
import Header from "./headerConfig";
// TODO: put node server api url here
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "nodeserver api url"
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
const UPDATE_USER = (netid) => createAPI(`/user/${netid}`);

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
  UPDATE_USER,
  GET_CATEGORY_LIST,
  GET_CATEGORY_BY_ID,
};
