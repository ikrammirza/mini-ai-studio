process.env.NODE_ENV = 'test'; // must be before importing controllers

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { createGenerationController, getGenerationsController } from '../src/controllers/generationsController';

import * as controllers from '../src/controllers/generationsController';
console.log(controllers);

const app = express();
app.use(bodyParser.json());

app.use((req: any, res, next) => {
  req.user = { id: 1 };
  next();
});

app.post('/generations', createGenerationController);
app.get('/generations', getGenerationsController);

describe('Generation Controllers', () => {
  it('should create a generation', async () => {
    const res = await request(app).post('/generations').send({
      prompt: 'A cat on Mars',
      style: 'Cyberpunk',
      width: 512,
      height: 512,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('prompt', 'A cat on Mars');
  });

  it('should fetch generation history', async () => {
    const res = await request(app).get('/generations').query({ limit: 5 });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
