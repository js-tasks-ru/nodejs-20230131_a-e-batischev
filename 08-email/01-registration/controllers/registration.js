const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
    const verificationToken = uuid()
    const { email, displayName, password } = ctx.request.body;

    const newUser = new User({ email, displayName, verificationToken });

    await newUser.setPassword(password)
    await newUser.save()

    await sendMail({
        template: 'confirmation',
        locals: { token: verificationToken },
        to: email,
        subject: 'Подтвердите почту',
    });


    ctx.body = { status: 'ok' };

};

module.exports.confirm = async (ctx, next) => {
    const user = await User.findOne({
        verificationToken: ctx.request.body.verificationToken,
    });

    if (!user) {
        ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
    }

    user.verificationToken = undefined;
    await user.save();

    const token = uuid();

    ctx.body = { token };


};
