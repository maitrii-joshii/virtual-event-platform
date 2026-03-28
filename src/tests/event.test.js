process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

const request = require("supertest");
const app = require("../app");
const userRepository = require("../repositories/userRepository");
const eventRepository = require("../repositories/eventRepository");

const AUTH_BASE = "/api/v1/auth";
const EVENT_BASE = "/api/v1/events";

const resetRepositories = () => {
	userRepository.storage.clear();
	userRepository.currentId = 1;
	eventRepository.storage.clear();
	eventRepository.currentId = 1;
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
	title: "Tech Conference",
	description: "A deep dive into modern web development.",
	date: "2026-04-10",
	time: "11:30",
	location: "Mumbai",
	participants: ["Alice", "Bob"],
	...overrides
});

describe("Event API", () => {
	beforeEach(() => {
		resetRepositories();
	});

	describe("POST /api/events", () => {
		it("organizer can create event successfully", async() => {
			const { token } = await createUserAndToken("organizer");
			const payload = buildEventPayload();

			const response = await request(app)
				.post(EVENT_BASE)
				.set("Authorization", `Bearer ${token}`)
				.send(payload);

			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty("success", true);
			expect(response.body).toHaveProperty("message", "Event created successfully");
			expect(response.body).toHaveProperty("event");
			expect(response.body.event).toMatchObject({
				title: payload.title,
				description: payload.description,
				date: payload.date,
				time: payload.time,
				location: payload.location
			});
			expect(response.body.event).toHaveProperty("id");
		});

		it("attendee cannot create event", async() => {
			const { token } = await createUserAndToken("attendee");
			const payload = buildEventPayload();

			const response = await request(app)
				.post(EVENT_BASE)
				.set("Authorization", `Bearer ${token}`)
				.send(payload);

			expect(response.status).toBe(403);
			expect(response.body).toHaveProperty("message", "User access denied");
		});

		it("validation error if required fields missing", async() => {
			const { token } = await createUserAndToken("organizer");
			const payload = { title: "" };

			const response = await request(app)
				.post(EVENT_BASE)
				.set("Authorization", `Bearer ${token}`)
				.send(payload);

			expect(response.status).toBe(400);
			expect(response.body).toHaveProperty("message");
			expect(response.body.message).toContain("title");
		});
	});

	describe("GET /api/events", () => {
		it("should return list of events", async() => {
			const { token } = await createUserAndToken("organizer");
			const payload = buildEventPayload();

			await request(app)
				.post(EVENT_BASE)
				.set("Authorization", `Bearer ${token}`)
				.send(payload);

			const response = await request(app)
				.get(EVENT_BASE)
				.set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("success", true);
			expect(response.body).toHaveProperty("events");
			expect(Array.isArray(response.body.events)).toBe(true);
			expect(response.body.events.length).toBe(1);
		});

		it("should require authentication", async() => {
			const response = await request(app).get(EVENT_BASE);

			expect(response.status).toBe(401);
			expect(response.body).toHaveProperty("message", "User is unauthorized");
		});
	});

	describe("GET /api/events/:eventId", () => {
		it("should return event", async() => {
			const { token } = await createUserAndToken("organizer");
			const payload = buildEventPayload();

			const createResponse = await request(app)
				.post(EVENT_BASE)
				.set("Authorization", `Bearer ${token}`)
				.send(payload);

			const eventId = createResponse.body.event.id;

			const response = await request(app)
				.get(`${EVENT_BASE}/${eventId}`)
				.set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("success", true);
			expect(response.body).toHaveProperty("event");
			expect(response.body.event).toMatchObject({
				id: eventId,
				title: payload.title
			});
		});

		it("should return 404 if event not found", async() => {
			const { token } = await createUserAndToken("organizer");

			const response = await request(app)
				.get(`${EVENT_BASE}/999`)
				.set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty("message", "Event not found");
		});
	});

	describe("PUT /api/events/:eventId", () => {
		it("organizer can update event", async() => {
			const { token } = await createUserAndToken("organizer");
			const payload = buildEventPayload();

			const createResponse = await request(app)
				.post(EVENT_BASE)
				.set("Authorization", `Bearer ${token}`)
				.send(payload);

			const updatedPayload = buildEventPayload({
				title: "Updated Conference",
				description: "Updated description for the event."
			});

			const response = await request(app)
				.put(`${EVENT_BASE}/${createResponse.body.event.id}`)
				.set("Authorization", `Bearer ${token}`)
				.send(updatedPayload);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("success", true);
			expect(response.body).toHaveProperty("message", "Event updated successfully");
			expect(response.body.event).toMatchObject({
				title: updatedPayload.title,
				description: updatedPayload.description
			});
		});

		it("should return 404 if event not found", async() => {
			const { token } = await createUserAndToken("organizer");
			const updatedPayload = buildEventPayload({
				title: "Missing Event"
			});

			const response = await request(app)
				.put(`${EVENT_BASE}/999`)
				.set("Authorization", `Bearer ${token}`)
				.send(updatedPayload);

			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty("message", "Event not found");
		});
	});

	describe("DELETE /api/events/:eventId", () => {
		it("organizer can delete event", async() => {
			const { token } = await createUserAndToken("organizer");
			const payload = buildEventPayload();

			const createResponse = await request(app)
				.post(EVENT_BASE)
				.set("Authorization", `Bearer ${token}`)
				.send(payload);

			const response = await request(app)
				.delete(`${EVENT_BASE}/${createResponse.body.event.id}`)
				.set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(204);
		});

		it("should return 404 if event not found", async() => {
			const { token } = await createUserAndToken("organizer");

			const response = await request(app)
				.delete(`${EVENT_BASE}/999`)
				.set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty("message", "Event not found");
		});
	});
});
