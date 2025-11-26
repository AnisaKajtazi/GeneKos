const slots = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00"
];


function isValidSlot(time) {
  return slots.includes(time);
}

module.exports = {
  slots,
  isValidSlot
};
