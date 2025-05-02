import { TimeData } from '@/data/data';

const dateTexto = (seconds: number, hideLast?: boolean) => {
  const { meses, dias } = TimeData;
  const date = new Date(seconds * 1000);

  const dayNum = date.getDate();
  const textoDate = `${dias[date.getDay()]}, ${date.getDate()} de ${
    meses[date.getMonth()]
  }, ${date.getFullYear()}`;
  const addZero = (n: number) => {
    if (n < 10) return `0${n}`;
    return n;
  };
  const numDate = `${addZero(date.getDate())}/${addZero(
    date.getMonth() + 1
  )}/${date.getFullYear()}`;
  const hourDate = `${addZero(date.getHours())}:${addZero(
    date.getMinutes()
  )}:${addZero(date.getSeconds())}`;
  const noSecondsHourDate = hourDate
    .split(':')
    .filter((_, ind, arr) => ind !== arr.length - 1)
    .join(':');
  const noMonthNumDate = numDate
    .split('/')
    .filter((_, ind, arr) => ind !== arr.length - 1)
    .join('/');
  const slashDate = numDate.split('/').join('-');
  const noYearText = textoDate
    .split(',')
    .filter((_, ind, arr) => ind !== arr.length - 1)
    .join(',');
  return {
    textoDate: hideLast ? noYearText : textoDate,
    numDate: hideLast ? noMonthNumDate : numDate,
    hourDate: hideLast ? noSecondsHourDate : hourDate,
    slashDate,
    dayNum,
  };
};

export default dateTexto;
