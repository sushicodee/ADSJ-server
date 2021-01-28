module.exports.validateRegisterInput = ({ username, email, password }) => {
  const errors = {};
  if (username.trim() === '') {
    errors.username = 'Username cannot be empty';
  }
  if (email.trim() === '') {
    errors.email = 'Email cannot be empty';
  } else {
    const regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address';
    }
  }
  if (password === '') {
    errors.password = 'Password cannot be empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === '') {
    errors.username = 'Username cannot be empty';
  }
  if (password === '') {
    errors.password = 'Password cannot be empty';
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
