const Activity = require('./Activity');
const Diet = require('./Diet');
const User = require('./User');
const AppointmentRequest = require('./AppointmentRequest');


Activity.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Activity, { foreignKey: 'user_id', as: 'activities' });


Diet.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Diet, { foreignKey: 'user_id', as: 'diets' });


Activity.belongsTo(AppointmentRequest, { foreignKey: 'request_id', as: 'appointment' });
AppointmentRequest.hasMany(Activity, { foreignKey: 'request_id', as: 'activities' });


Diet.belongsTo(AppointmentRequest, { foreignKey: 'request_id', as: 'appointment' });
AppointmentRequest.hasMany(Diet, { foreignKey: 'request_id', as: 'diets' });

module.exports = {
  Activity,
  Diet,
  User,
  AppointmentRequest,
};
