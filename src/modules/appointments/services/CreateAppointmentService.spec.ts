import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  // deve ser capaz de criar um novo Appointment '
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123456789',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456789');
  });

  it('should be not able to create two appointments on the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointmentDate = new Date(2020, 8, 25, 8);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123456',
    });

    expect(
      // criando outro com a mesma data
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '123456',
      }),
      // espero que rejeite e que a resposta seja um erro
    ).rejects.toBeInstanceOf(AppError);
  });
});