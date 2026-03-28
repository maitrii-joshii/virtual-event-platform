process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

const request = require("supertest");
const app = require("../app");
const userRepository = require("../repositories/userRepository");

const AUTH_BASE = "/api/v1/auth";

const resetUserRepository = () => {
	userRepository.storage.clear();
	userRepository.currentId = 1;
};

describe("Auth API", () => {
	beforeEach(() => {
		resetUserRepository();
	});

	describe("POST /api/auth/register", () => {
		it("should register a new user successfully", async() => {
			const payload = {
				name: "Test User",
				email: "test.user@example.com",
				password: "password123",
				role: "organizer"
			};

			const response = await request(app)
				.post(`${AUTH_BASE}/register`)
				.send(payload);

			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty("success", true);
			expect(response.body).toHaveProperty("message", "User registered successfully");
			expect(response.body).toHaveProperty("user");
			expect(response.body.user).toMatchObject({
				name: payload.name,
				email: payload.email,
				role: payload.role
			});
			expect(response.body.user).toHaveProperty("id");
		});

		it("should fail if email already exists", async() => {
			const payload = {
				name: "Test User",
				email: "existing.user@example.com",
				password: "password123",
				role: "attendee"
			};

			await request(app).post(`${AUTH_BASE}/register`).send(payload);

			const response = await request(app)
				.post(`${AUTH_BASE}/register`)
				.send(payload);

			expect(response.status).toBe(401);
			expect(response.body).toHaveProperty("message", "User already exists");
		});

		it("should fail if validation fails", async() => {
			const payload = {
				name: "",
				email: "not-an-email",
				password: "123",
				role: "invalid"
			};

			const response = await request(app)
				.post(`${AUTH_BASE}/register`)
				.send(payload);

			expect(response.status).toBe(400);
			expect(response.body).toHaveProperty("message");
			expect(response.body.message).toContain("email");
		});
	});

	describe("POST /api/auth/login", () => {
		it("should login successfully with correct credentials", async() => {
			const payload = {
				name: "Test User",
				email: "login.user@example.com",
				password: "password123",
				role: "organizer"
			};

			await request(app).post(`${AUTH_BASE}/register`).send(payload);

			const response = await request(app)
				.post(`${AUTH_BASE}/login`)
				.send({
					email: payload.email,
					password: payload.password,
					role: payload.role
				});

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("success", true);
			expect(response.body).toHaveProperty("message", "User logged in successfully");
			expect(response.body).toHaveProperty("token");
			expect(typeof response.body.token).toBe("string");
		});

		it("should fail with incorrect password", async() => {
			const payload = {
				name: "Test User",
				email: "wrong.password@example.com",
				password: "password123",
				role: "attendee"
			};

			await request(app).post(`${AUTH_BASE}/register`).send(payload);

			const response = await request(app)
				.post(`${AUTH_BASE}/login`)
				.send({
					email: payload.email,
					password: "wrongpassword",
					role: payload.role
				});

			expect(response.status).toBe(401);
			expect(response.body).toHaveProperty("message", "Invalid Email or Password");
		});

		it("should fail if user does not exist", async() => {
			const response = await request(app)
				.post(`${AUTH_BASE}/login`)
				.send({
					email: "missing.user@example.com",
					password: "password123",
					role: "organizer"
				});

			expect(response.status).toBe(401);
			expect(response.body).toHaveProperty("message", "Invalid Email or Password");
		});
	});
});
