const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
    const verificationToken = uuid()
    const { email, displayName, password } = ctx.request.body;

    const user = await User.findOne({ email: email });

    if (!user) {
        console.log('create new user');
        await User.create({ email, displayName, password, verificationToken });
        const mails = await sendMail({
            template: 'confirmation',
            locals: { token: verificationToken },
            to: email,
            subject: 'Подтвердите почту',
        });
        console.log(mails);

        ctx.body = { status: 'ok' };

    } else {
        console.log('user allready exyst');
        ctx.body = { errors: { email: 'Такой email уже существует' } }
    }
};

module.exports.confirm = async (ctx, next) => {
    const user = await User.findOne({
        verificationToken: ctx.request.body.verificationToken,
    });
    console.log(
        ctx.request.body.verificationToken
    );

    if (!user) {
        ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
    }

    user.verificationToken = undefined;
    await user.save();

    const token = uuid();

    ctx.body = { token };

};
