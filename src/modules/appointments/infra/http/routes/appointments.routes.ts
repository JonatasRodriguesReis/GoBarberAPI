/* eslint-disable camelcase */
/* eslint-disable no-shadow */
import Router from 'express';
import EnsureAuthenticated from '@shared/infra/http/midleware/ensureAuthenticated';
import AppointmentConstroller from '@modules/appointments/infra/controllers/AppointmentController';

const appointmentsRouter = Router();

appointmentsRouter.use(EnsureAuthenticated);

const appointmentController = new AppointmentConstroller();

/* appointmentsRouter.get('/', async (request, response) => {
    const appointments = await appointmentsRepository.find();

    console.log(request.user);

    return response.status(200).json(appointments);
}); */

appointmentsRouter.post('/', appointmentController.create);
export default appointmentsRouter;
