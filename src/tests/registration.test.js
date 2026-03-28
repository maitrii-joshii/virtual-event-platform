process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

jest.mock("../services/mailService", () => ({
	sendRegistrationConfirmationEmail: jest.fn().mockResolvedValue(undefined)
}));

const request = require("supertest");
const app = require("../app");
const userRepository = require("../repositories/userRepository");
const eventRepository = require("../repositories/eventRepository");
const registrationRepository = require("../repositories/registrationRepository");

const AUTH_BASE = "/api/v1/auth";
const EVENT_BASE = "/api/v1/events";
const REGISTRATION_BASE = "/api/v1";

const resetRepositories = () => {
	userRepository.storage.clear();
	userRepository.currentId = 1;
	eventRepository.storage.clear();
	eventRepository.currentId = 1;
	registrationRepository.storage.clear();
	registrationRepository.currentId = 1;
};

let userCounter = 1;
const createUserAndToken = async(role) => {
	const user = {
		name: `User ${userCounter}`,
		email: `user${userCounter}@example.com`,
		password: "password123",
		role
	};
	userCounter++;

	await request(app).post(`${AUTH_BASE}/register`).send(user);

	const loginResponse = await request(app)
		.post(`${AUTH_BASE}/login`)
		.send({
			email: user.email,
			password: user.password,
			role: user.role
		});

	return { token: loginResponse.body.token, user };
};

const buildEventPayload = (overrides = {}) => ({
	title: "Platform Meetup",
	description: "A detailed session on platform engineering.",
	date: "2026-04-12",
	time: "14:00",
	location: "Delhi",
	participants: ["Alice", "Bob"],
	...overrides
});

const buildRegistrationPayload = (overrides = {}) => ({
	ticketType: "General",
	notes: "Looking forward to the event.",
	...overrides
});

const createEventAsOrganizer = async() => {
	const { token } = await createUserAndToken("organizer");
	const payload = buildEventPayload();
	const response = await request(app)
		.post(EVENT_BASE)
		.set("Authorization", `Bearer ${token}`)
		.send(payload);
	return { eventId: response.body.event.id, organizerToken: token };
};

describe("Event Registration API", () => {
	beforeEach(() => {
		resetRepositories();
	});

	describe("POST /api/events/:eventId/registrations", () => {
		it("attendee can register for event", async() => {
			const { eventId } = await createEventAsOrganizer();
			const { token } = await createUserAndToken("attendee");
			const payload = buildRegistrationPayload();

			const response = await request(app)
				.post(`${REGISTRATION_BASE}/events/${eventId}/registrations`)
				.set("Authorization", `Bearer ${token}`)
				.send(payload);

			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty("success", true);
			expect(response.body).toHaveProperty("message", "Event registration created successfully");
			expect(response.body).toHaveProperty("registration");
			expect(response.body.registration).toMatchObject({
				eventId,
				ticketType: payload.ticketType,
				notes: payload.notes
			});
		});

		it("should fail if event does not exist", async() => {
			const { token } = await createUserAndToken("attendee");
			const payload = buildRegistrationPayload();

			const response = await request(app)
				.post(`${REGISTRATION_BASE}/events/999/registrations`)
				.set("Authorization", `Bearer ${token}`)
				.send(payload);

			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty("message", "Event not found");
		});

		it("should return validation error for missing fields", async() => {
			const { eventId } = await createEventAsOrganizer();
			const { token } = await createUserAndToken("attendee");

			const response = await request(app)
				.post(`${REGISTRATION_BASE}/events/${eventId}/registrations`)
				.set("Authorization", `Bearer ${token}`)
				.send({});

			expect(response.status).toBe(400);
			expect(response.body).toHaveProperty("message");
		});
	});

	describe("GET /api/events/:eventId/registrations", () => {
		it("organizer can view registrations", async() => {
			const { eventId, organizerToken } = await createEventAsOrganizer();
			const { token } = await createUserAndToken("attendee");
			const payload = buildRegistrationPayload();

			await request(app)
				.post(`${REGISTRATION_BASE}/events/${eventId}/registrations`)
				.set("Authorization", `Bearer ${token}`)
				.send(payload);

			const response = await request(app)
				.get(`${REGISTRATION_BASE}/events/${eventId}/registrations`)
				.set("Authorization", `Bearer ${organizerToken}`);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("success", true);
			expect(response.body).toHaveProperty("registrations");
			expect(Array.isArray(response.body.registrations)).toBe(true);
			expect(response.body.registrations.length).toBe(1);
		});
	});

	describe("GET /api/registrations", () => {
		it("attendee can view their registrations", async() => {
			const { eventId } = await createEventAsOrganizer();
			const { token } = await createUserAndToken("attendee");
			const payload = buildRegistrationPayload();

			await request(app)
				.post(`${REGISTRATION_BASE}/events/${eventId}/registrations`)
				.set("Authorization", `Bearer ${token}`)
				.send(payload);

			const response = await request(app)
				.get(`${REGISTRATION_BASE}/registrations`)
				.set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("success", true);
			expect(response.body).toHaveProperty("registrations");
			expect(Array.isArray(response.body.registrations)).toBe(true);
			expect(response.body.registrations.length).toBe(1);
		});
	});

	describe("DELETE /api/events/:eventId/registrations/:registrationId", () => {
		it("attendee can cancel registration", async() => {
			const { eventId } = await createEventAsOrganizer();
			const { token } = await createUserAndToken("attendee");
			const payload = buildRegistrationPayload();

			const createResponse = await request(app)
				.post(`${REGISTRATION_BASE}/events/${eventId}/registrations`)
				.set("Authorization", `Bearer ${token}`)
				.send(payload);

			const registrationId = createResponse.body.registration.id;

			const response = await request(app)
				.delete(`${REGISTRATION_BASE}/events/${eventId}/registrations/${registrationId}`)
				.set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(204);
		});

		it("should return 404 if registration not found", async() => {
			const { eventId } = await createEventAsOrganizer();
			const { token } = await createUserAndToken("attendee");

			const response = await request(app)
				.delete(`${REGISTRATION_BASE}/events/${eventId}/registrations/999`)
				.set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty("message", "Registration not found");
		});
	});
});
