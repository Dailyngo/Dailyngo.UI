import { useState, useEffect, use } from 'react';
import { IMinSec } from './page';

interface CountdownButtonProps {
  initialMinutes: IMinSec; // Kaç dakika geri sayım yapılacağı
  timeZone?: 'local' | 'utc';
  handleReSend: () => void;
}

const CountdownButton = ({ 
  initialMinutes, 
  timeZone = 'local',
  handleReSend
}: CountdownButtonProps) => {
  const calculateTargetDate = (minSec: IMinSec) => {
    const now = timeZone === 'utc' 
      ? Date.now() 
      : new Date().getTime();
      
    return new Date(now + minSec.minutes * 60 * 1000 + minSec.seconds * 1000);
  };

  const [targetDate, setTargetDate] = useState(() => 
    calculateTargetDate(initialMinutes)
  );
  const [timeLeft, setTimeLeft] = useState({ 
    minutes: initialMinutes.minutes, 
    seconds: initialMinutes.seconds 
  });
  const [isDisabled, setIsDisabled] = useState(true);

  const updateTimeLeft = () => {
    const now = timeZone === 'utc' 
      ? Date.now() 
      : new Date().getTime();
      
    const difference = targetDate.getTime() - now;

    if (difference > 0) {
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setIsDisabled(true);
      return { minutes, seconds };
    }
    
    setIsDisabled(false);
    return { minutes: 0, seconds: 0 };
  };

  useEffect(() => {
    setTargetDate(calculateTargetDate(initialMinutes));
  } , [initialMinutes]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(updateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const handleClick = () => {
    console.log("isDisabled", isDisabled);
    if (!isDisabled) {
      if(timeLeft.minutes === 0 && timeLeft.seconds === 0) {
        handleReSend();
        setTargetDate(calculateTargetDate(initialMinutes));
      }else{
        setIsDisabled(true);
      }
    }
  };

  const formatTime = (time: number) => 
    time < 10 ? `0${time}` : time;

  return (
		<button
			type="button"
			onClick={handleClick}
			disabled={isDisabled}
			className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{isDisabled
				? `${formatTime(timeLeft.minutes)}:${formatTime(
						timeLeft.seconds
				  )}`
				: "Tekrar Gönder"}
		</button>
  );
};

export default CountdownButton;