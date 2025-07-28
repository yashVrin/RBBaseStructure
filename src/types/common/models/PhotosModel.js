/**
 * @typedef {Object} Geo
 * @property {string} lat - Latitude coordinate
 * @property {string} lng - Longitude coordinate
 */

/**
 * @typedef {Object} Address
 * @property {string} street - Street name
 * @property {string} suite - Suite or apartment number
 * @property {string} city - City name
 * @property {string} zipcode - ZIP code
 * @property {Geo} geo - Geographic coordinates
 */

/**
 * @typedef {Object} Company
 * @property {string} name - Company name
 * @property {string} catchPhrase - Company catch phrase
 * @property {string} bs - Business slogan or services
 */

/**
 * @typedef {Object} Photos
 * @property {number} id - Unique user ID
 * @property {string} name - Full name of the user
 * @property {string} username - Username used by the user
 * @property {string} email - Email address of the user
 * @property {Address} address - User's physical address
 * @property {string} phone - Phone number
 * @property {string} website - Website URL
 * @property {Company} company - Company information
 */

/**
 * Example PhotosModel object (used for reference or default)
 * @type {Photos}
 */
const PhotosModel = {
  id: 0,
  name: '',
  username: '',
  email: '',
  address: {
    street: '',
    suite: '',
    city: '',
    zipcode: '',
    geo: {
      lat: '',
      lng: '',
    },
  },
  phone: '',
  website: '',
  company: {
    name: '',
    catchPhrase: '',
    bs: '',
  },
};

export default PhotosModel;
