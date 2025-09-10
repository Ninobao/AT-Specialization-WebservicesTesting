const Joi = require("joi");

const newBooking = {
  firstname: "Eric",
  lastname: "RuizFlores",
  totalprice: 111,
  depositpaid: true,
  bookingdates: {
    checkin: "2024-05-05",
    checkout: "2024-05-10",
  },
  additionalneeds: "TV",
};

const updatedFields = {
  totalprice: 222,
  additionalneeds: "Breakfast",
};

const updatedBooking = {
  firstname: "John",
  lastname: "Doe",
  totalprice: 333,
  depositpaid: false,
  bookingdates: {
    checkin: "2024-06-06",
    checkout: "2024-06-10",
  },
  additionalneeds: "Jacuzzi",
};

const bookingSchema = Joi.object({
  firstname: Joi.string().valid("John").required(),
  lastname: Joi.string().valid("Doe").required(),
  totalprice: Joi.number().valid(333).required(),
  depositpaid: Joi.boolean().valid(false).required(),
  bookingdates: Joi.object({
    checkin: Joi.string().valid("2024-06-06").required(),
    checkout: Joi.string().valid("2024-06-10").required(),
  }).required(),
  additionalneeds: Joi.string().valid("Jacuzzi").required(),
});

module.exports = { newBooking, updatedFields, updatedBooking, bookingSchema };
