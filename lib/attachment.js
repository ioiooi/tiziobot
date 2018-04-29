exports.createAttachment = (inArr, outArr) => {
  return [
    {
      fallback: 'Oops. That was not supposed to happen.',
      color: 'good',
      text: 'You in or you out?!',
      callback_id: 'tizio_lunch',
      attachment_type: 'default',
      actions: [
        {
          name: 'tizio_in',
          text: createActionText(':spaghetti:', inArr),
          type: 'button',
          style: 'primary',
          value: 0
        },
        {
          name: 'tizio_out',
          text: createActionText(':no_pedestrians:', outArr),
          type: 'button',
          value: 1
        }
      ],
      fields: [createFieldObject('In', inArr), createFieldObject('Out', outArr)]
    }
  ];
};

const createActionText = (text, userArr) => {
  if (userArr.length === 0) return text;
  return `${text} ${userArr.length}`;
};

const createFieldObject = (text, userArr) => {
  if (userArr.length === 0) {
    return {};
  }

  const title = `${text} (${userArr.length})`;
  const value = userArr.map(user => `<@${user}>`).join(', ');

  return {
    title,
    value
  };
};
