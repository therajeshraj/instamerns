
// module.exports = {
//     MONGOURI:"mongodb+srv://testing:2WM5MsmwDK87MLlK@testing.xrnno.mongodb.net/<dbname>?retryWrites=true&w=majority",
//     JWT_SECRET: "64saf6a4sf8a6s74g8as4ga56sdg748a97sg4a56sdgvba8d74b8sd47g"
// }

if(process.env.NODE_ENV === 'production') {
    module.exports = require('./prod')
} else {
    module.exports = require('./dev')
}