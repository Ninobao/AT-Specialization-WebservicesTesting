const axios = require("axios");

const testData = require("../data/test.data.js");
const { baseURL, admin } = require("../config.js");

let newBookingID; // BookingID for CRUD

describe("restful-booker API tests", () => {
  it("should create a new booking", async () => {
    const response = await axios.post(baseURL + "/booking", testData.newBooking, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    newBookingID = response.data.bookingid; // Used in following tests

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("application/json");
    expect(response.data).toHaveProperty("bookingid");
  });

  it("should get the booking's IDs when filtering by name", async () => {
    const response = await axios.get(baseURL + "/booking?firstname=Eric&lastname=RuizFlores");

    expect(response.status).toBe(200);
    response.data.forEach((booking) => {
      expect(booking).toHaveProperty("bookingid");
    });
  });

  it("should partially update a booking", async () => {
    const response = await axios.patch(
      baseURL + "/booking/" + newBookingID,
      testData.updatedFields,
      {
        auth: admin, // Basic auth
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    expect(response.status).toBe(200);
    expect(response.data.totalprice).toBe(222);
    expect(response.data.additionalneeds).toBe("Breakfast");
  });

  it("should fully update a booking", async () => {
    // Create token
    const responseToken = await axios.post(baseURL + "/auth", admin, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(responseToken.status).toBe(200);
    const token = responseToken.data.token;

    // Update Booking
    const response = await axios.put(
      baseURL + "/booking/" + newBookingID,
      testData.updatedBooking,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: `token=${token}`, // Token auth
        },
      }
    );

    expect(response.status).toBe(200);

    const { error } = testData.bookingSchema.validate(response.data, { abortEarly: false });
    expect(error).toBeUndefined();
  });

  it("should delete a booking", async () => {
    const response = await axios.delete(baseURL + "/booking/" + newBookingID, {
      headers: {
        Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=", // Basic auth
      },
    });
    expect(response.status).toBe(201);
  });

  it("should create auth token under 1 second", async () => {
    const start = Date.now();

    const responseToken = await axios.post(baseURL + "/auth", admin, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(responseToken.status).toBe(200);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(1000);
  });
});
