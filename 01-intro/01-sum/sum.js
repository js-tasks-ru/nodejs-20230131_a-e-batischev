// function sum(a, b) {
//   return typeof a === 'number' && typeof b === 'number'
//     ? a + b
//     : typeof a !== 'number'
//       ? a.throw(TypeError)
//       : typeof b !== 'number'
//         ? b.throw(TypeError)
//         : ''
// }

const sum = (a, b) => typeof a === 'number' && typeof b === 'number' ? a + b : a.throw(TypeError)




module.exports = sum;
