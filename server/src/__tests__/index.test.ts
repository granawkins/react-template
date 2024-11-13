import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import { createDatabase } from '../db.js';
import Database from 'better-sqlite3';

// Add test database setup and teardown
let testDb: Database.Database;

beforeEach(() => {
  // Create an in-memory database for testing
  testDb = createDatabase(':memory:');
  // Replace the app's database connection with our test database
  app.locals.db = testDb;
});

afterEach(() => {
  // Close the test database connection
  testDb.close();
});

describe('Server API Tests', () => {
  it('GET /api/notes should return all notes', async () => {
    const response = await request(app).get('/api/notes').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /api/notes should create a new note', async () => {
    const noteData = { content: 'Test note' };
    const response = await request(app).post('/api/notes').send(noteData).expect(201);

    expect(response.body).toMatchObject({
      content: noteData.content,
      id: expect.any(Number),
      timestamp: expect.any(String),
    });
  });

  it('POST /api/notes should return 400 if content is missing', async () => {
    await request(app).post('/api/notes').send({}).expect(400);
  });

  it('should handle non-existent routes', async () => {
    await request(app).get('/non-existent-route').expect(404);
  });
});
