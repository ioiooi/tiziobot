const express = require('express');
const router = express.Router();
const attachment = require('../lib/attachment');

router.post('/', (req, res) => {
  // extract action value, user id and original message
  const {
    actions: [{ value: action }],
    user: { id: userId },
    original_message: message
  } = JSON.parse(req.body['payload']);

  updateMessage(message, action, userId);

  res.json(message);
});

// menus actions with "data_source: external" get send here
router.post('/menus', (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

const updateMessage = (message, action, userId) => {
  const index = findUserField(message.attachments[0].fields, userId);

  if (index === parseInt(action)) {
    return;
  }

  const inArr = createUserArray(message.attachments[0].fields[0]);
  const outArr = createUserArray(message.attachments[0].fields[1]);

  // userId was found and action does not match field --> switch
  if (index >= 0 && index != action) {
    // remove userId from field
    index === 0
      ? removeUserFromArray(inArr, userId)
      : removeUserFromArray(outArr, userId);
  }

  // add user to 'In' or 'Out' depending on the action
  parseInt(action) === 0 ? inArr.push(userId) : outArr.push(userId);

  message.attachments = attachment.createAttachment(inArr, outArr);
};

/**
 * Searches for the provided user id in fields array
 * @param {Array} fields Array of objects
 * @param {string} userId User id
 * @returns {number} The index of the object the user was found in otherwise -1
 */
const findUserField = (fields, userId) => {
  return fields.findIndex(field => field.value.includes(userId));
};

/**
 * @param {Object} field Field Object
 * @returns {Array} Array of matches, or empty array if there were no matches
 */
const createUserArray = field => {
  if (!field.value.match(/\w{9}/g)) {
    return [];
  }

  return field.value.match(/\w{9}/g);
};

const removeUserFromArray = (array, user) => {
  const index = array.findIndex(string => string === user);
  array.splice(index, 1);
  return array;
};

module.exports = router;
