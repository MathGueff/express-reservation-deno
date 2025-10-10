/* eslint-disable */

import dayjs from 'https://esm.sh/dayjs@1.11.13'
import utc from 'https://esm.sh/dayjs@1.11.13/plugin/utc'
import timezone from 'https://esm.sh/dayjs@1.11.13/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export type HolidayOptions = {
  previousYear?: boolean | undefined
  nextYear?: boolean | undefined
  setYear?: number | undefined
}

class Time {
  static ISODate = (date: string) => new Date(date)

  static currentTime = (
    date: dayjs.ConfigType = new Date(),
    format?: dayjs.OptionType,
    locale?: string,
    strict?: boolean,
  ): dayjs.Dayjs => {
    const time = dayjs(date, format, locale, strict)
    return time.subtract(3, 'hours')
  }

  static now = () => this.currentTime()

  static start = (
    date: dayjs.ConfigType,
    unit: dayjs.OpUnitType,
  ): dayjs.Dayjs => {
    return dayjs.tz(date, 'UTC').startOf(unit)
  }

  static end = (
    date: dayjs.ConfigType,
    unit: dayjs.OpUnitType,
  ): dayjs.Dayjs => {
    return dayjs.tz(date, 'UTC').endOf(unit)
  }

  static startOfMonth = () => {
    return this.now().startOf('month')
  }

  static endOfMonth = () => {
    return this.now().endOf('month').endOf('day')
  }
}

export const ISODate = Time.ISODate

export { Time }
