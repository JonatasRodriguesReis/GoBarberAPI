import 'reflect-metadata';
import express from 'express';

import cors from 'cors';
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import usersRouter from '@modules/users/infra/http/routes//users.routes';
import authenticateRouter from '@modules/users/infra/http/routes/sessions.routes';
import UploadConfig from '@config/upload';
import '@shared/infra/typeorm';
import '@shared/container';
const app = express();

app.use(cors());
app.use(express.json());
app.use('/appointments', appointmentsRouter);
app.use('/users', usersRouter);
app.use('/session', authenticateRouter);
app.use('/files', express.static(UploadConfig.tmpFolder));

app.listen(3333, () => {
    console.log('Server started on port 3333');
});
