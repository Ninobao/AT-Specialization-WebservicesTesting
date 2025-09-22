const axios = require("axios");

const testData = require("../data/test.data.js");
const {
  newBooking,
  updatedBooking,
  updatedFields,
  bookingSchema,
  validHeader,
  basicHeader,
  basicAuthHeader,
} = testData;

const { baseURL, admin } = require("../config.js");

let newBookingID; // BookingID for CRUD

describe("restful-booker API tests", () => {
  it("should create a new booking", async () => {
    const response = await axios.post(`${baseURL}/booking`, newBooking, {
      headers: validHeader,
    });

    newBookingID = response.data.bookingid; // Used in following tests

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("application/json");
    expect(response.data).toHaveProperty("bookingid");
  });

  it("should get the booking's IDs when filtering by name", async () => {
    const response = await axios.get(`${baseURL}/booking?firstname=Eric&lastname=RuizFlores`);

    expect(response.status).toBe(200);
    response.data.forEach((booking) => {
      expect(booking).toHaveProperty("bookingid");
    });
  });

  it("should partially update a booking", async () => {
    const response = await axios.patch(`${baseURL}/booking/${newBookingID}`, updatedFields, {
      auth: admin, // Basic auth
      headers: validHeader,
    });

    expect(response.status).toBe(200);
    expect(response.data.totalprice).toBe(222);
    expect(response.data.additionalneeds).toBe("Breakfast");
  });

  it("should fully update a booking", async () => {
    // Create token
    const responseToken = await axios.post(`${baseURL}/auth`, admin, {
      headers: basicHeader,
    });
    expect(responseToken.status).toBe(200);
    const token = responseToken.data.token;

    // Update Booking
    const response = await axios.put(baseURL + "/booking/" + newBookingID, updatedBooking, {
      headers: {
        ...validHeader,
        Cookie: `token=${token}`, // Token auth
      },
    });

    expect(response.status).toBe(200);

    const { error } = bookingSchema.validate(response.data, { abortEarly: false });
    expect(error).toBeUndefined();
  });

  it("should delete a booking", async () => {
    const response = await axios.delete(`${baseURL}/booking/${newBookingID}`, {
      headers: basicAuthHeader,
    });
    expect(response.status).toBe(201);
  });

  it("should create auth token under 1 second", async () => {
    const start = Date.now();

    const responseToken = await axios.post(`${baseURL}/auth`, admin, {
      headers: basicHeader,
    });
    expect(responseToken.status).toBe(200);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(1000);
  });
});
