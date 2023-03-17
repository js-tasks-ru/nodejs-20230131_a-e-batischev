const User = require('../../models/User')


module.exports = async function authenticate(strategy, email, displayName, done) {

  try {
    console.log(1);
    if (!email) return done(null, false, 'Не указан email')

    const user = await User.findOne({ email: email })

    if (!user) {
      console.log('email', email);
      const newUser = await User.create({ email, displayName })
      done(null, newUser)
    } else {
      done(null, user)
    }
  } catch (error) {
    console.log(2);
    // console.log(error);
    done(error, false, 'Некорректный email.')
  }
};
