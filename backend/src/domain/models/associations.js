const Activity = require('./Activity');
const User = require('./User');
const AppointmentRequest = require('./AppointmentRequest');

Activity.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Activity, { foreignKey: 'user_id' });

Activity.belongsTo(AppointmentRequest, { foreignKey: 'request_id' });
AppointmentRequest.hasMany(Activity, { foreignKey: 'request_id' });

module.exports = { Activity, User, AppointmentRequest };
