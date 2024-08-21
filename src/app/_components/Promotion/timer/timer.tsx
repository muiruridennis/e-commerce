import React, { useEffect, useState } from 'react';
import classes from '../index.module.scss';

const Timer = (props) => {
  const { setIsExpired, endDate } = props;
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(endDate).getTime();

    const timerInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const timeDifference = Math.max(targetDate - currentTime, 0);

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      setTime({ days, hours, minutes, seconds });

      if (timeDifference === 0) {
        clearInterval(timerInterval);
        setIsExpired(true);
      }
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, [endDate, setIsExpired]);

  return (
    <ul className={classes.stats}>
      <StatBox label="Days" value={time.days} />
      <StatBox label="Hours" value={time.hours} />
      <StatBox label="Minutes" value={time.minutes} />
      <StatBox label="Seconds" value={time.seconds} />
    </ul>
  );
};

const StatBox = ({ label, value }) => (
  <li className={classes.statBox}>
    <h4>{value}</h4>
    <p>{label}</p>
  </li>
);

export default Timer;
