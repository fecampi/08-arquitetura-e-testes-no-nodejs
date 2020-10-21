import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  provider_id: string;
  month: number;
  year: number;
}

type IResponseDTO = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
  }: IRequestDTO): Promise<IResponseDTO> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        year,
        month,
      },
    );

    // Retornar o numero de dias no mes
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));
    // montar um array a partir das opções
    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    // Dia com horários livres
    const availability = eachDayArray.map(day => {
      // Momento atual(hoje).
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);

      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      return {
        day,
        available:
          // verificar se new date e depois de compare date
          isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
        // 10hs de trabalho, ele verifica quais tem pelo menos um horário livre, e se a data é futura
      };
    });

    return availability;
  }
}
