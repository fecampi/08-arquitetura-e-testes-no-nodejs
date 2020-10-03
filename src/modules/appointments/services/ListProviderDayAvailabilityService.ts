import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

type IResponseDTO = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderDayAvailability {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequestDTO): Promise<IResponseDTO> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        year,
        month,
        day,
      },
    );
    // primeira hora do dia de agendamento
    const hourStart = 8;
    // ultima hora do dia de agendamento
    const hourEnd = 17;
    // intervalo de hora
    const hourInterval = hourEnd + 1 - hourStart;

    const eachHourArray = Array.from(
      { length: hourInterval },
      // { length: 10 },
      (_, index) => index + hourStart,
    );

    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map(hour => {
      // Se eu tenho pelo menos um appointments nesse horário
      const hasAppointmentInHour = appointments.find(
        // Retorna o horário de uma data seja igual o de cima
        appointment => getHours(appointment.date) === hour,
        // se existir não está disponível
      );

      // horário de hoje
      const todayHour = new Date(year, month - 1, day, hour);

      return {
        hour,
        // se tiver !indisponível && depois de hoje
        available: !hasAppointmentInHour && isAfter(todayHour, currentDate),
      };
    });

    return availability;
  }
}
