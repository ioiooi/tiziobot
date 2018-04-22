const express = require('express');
const router = express.Router();

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
  const fields = message.attachments[0].fields;
  const index = fieldIndexOfUser(fields, userId);

  if (index < 0) {
    // new user
    addUser(fields[action], userId);
  } else if (index != action) {
    // user switch
    removeUser(fields[index], userId);
    addUser(fields[action], userId);
  }
  updateFieldsTitle(fields);
  updateButtons(message);
};

/**
 * Search for user id in fields array
 * @param {Array} fields Array of field objects
 * @param {string} userId User id
 * @returns {number} The index of the field otherwise -1
 */
const fieldIndexOfUser = (fields, userId) => {
  return fields.findIndex(field => {
    return field.value.includes(userId);
  });
};

const addUser = (field, userId) => {
  field.value = createFieldValue(addUserToArray(field, userId));
};

const removeUser = (field, userId) => {
  field.value = createFieldValue(removeUserFromArray(field, userId));
};

const createFieldValue = userArray => {
  if (userArray.length === 0) {
    return '';
  }

  return userArray.join(', ');
};

/**
 * @param {Object} field Field Object
 * @returns {Array} Array of matches, or empty array if there were no matches
 */
const createUserArray = field => {
  if (!field.value.match(/<@\w{9}>/g)) {
    return [];
  }

  return field.value.match(/<@\w{9}>/g);
};

const addUserToArray = (field, userId) => {
  const arr = createUserArray(field);
  arr.push(`<@${userId}>`);
  return arr;
};

const removeUserFromArray = (field, userId) => {
  const userArray = createUserArray(field);
  const index = userArray.findIndex(ele => ele.includes(userId));
  userArray.splice(index, 1);
  return userArray;
};

const updateFieldsTitle = fields => {
  const inArray = createUserArray(fields[0]);
  const outArray = createUserArray(fields[1]);
  if (inArray.length === 0) {
    fields[0].title = '';
  } else {
    fields[0].title = `In (${inArray.length})`;
  }

  if (outArray.length === 0) {
    fields[1].title = '';
  } else {
    fields[1].title = `Out (${outArray.length})`;
  }
};

const updateButtons = message => {
  const actions = message.attachments[0].actions;
  const inArray = createUserArray(message.attachments[0].fields[0]);
  const outArray = createUserArray(message.attachments[0].fields[1]);
  if (inArray.length === 0) {
    actions[0].text = ':spaghetti:';
  } else {
    actions[0].text = `:spaghetti: ${inArray.length}`;
  }

  if (outArray.length === 0) {
    actions[1].text = ':no_pedestrians:';
  } else {
    actions[1].text = `:no_pedestrians: ${outArray.length}`;
  }
};

module.exports = router;
