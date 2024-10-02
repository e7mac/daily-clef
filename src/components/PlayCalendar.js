import { Card } from 'react-bootstrap';
import { DayPicker } from 'react-day-picker';
import React, { useState, useEffect } from 'react';
import 'react-day-picker/dist/style.css';

export default function PlayCalendar(props) {
  const [selectedDays, setSelectedDays] = useState([]);
  const [month, setMonth] = useState(new Date());

  const onDayClick = (day) => {
    console.log(day);
    const nextDay = new Date(day.getTime());
    nextDay.setDate(nextDay.getDate() + 1);
    const startTime = day.getTime() / 1000;
    const endTime = nextDay.getTime() / 1000;
    props.onTimeChanged(startTime, endTime);
  };

  const onMonthChange = (newMonth) => {
    setMonth(newMonth);
    const nextMonth = new Date(newMonth.getTime());
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const startTime = newMonth.getTime() / 1000;
    const endTime = nextMonth.getTime() / 1000;
    props.onTimeChanged(startTime, endTime);
    props.api.loadRawSessionFiles(startTime, endTime)
      .then((rawsessionfiles) => {
        const newSelectedDays = rawsessionfiles.map(item => new Date(item['date_played']));
        setSelectedDays(newSelectedDays);
      });
  };

  useEffect(() => {
    props.api.loadRawSessionFiles()
      .then((rawsessionfiles) => {
        const newSelectedDays = rawsessionfiles.map(item => new Date(item['date_played']));
        setSelectedDays(newSelectedDays);
      });
  }, [props.api]);

  return (
    <Card>
      <DayPicker
        mode="multiple"
        selected={selectedDays}
        onSelect={setSelectedDays}
        onDayClick={onDayClick}
        onMonthChange={onMonthChange}
        month={month}
      />
    </Card>
  );
}
