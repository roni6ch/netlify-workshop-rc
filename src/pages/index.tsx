
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import { SetStateAction, useEffect } from 'react';
import { useState } from 'react';

enum SignUpReason {
  TRAVEL_SOLUTION = "TRAVEL_SOLUTION",
  TRAVEL_AND_EXPENSE_SOLUTION = "TRAVEL_AND_EXPENSE_SOLUTION",
  TEAM_OFFSITE = "TEAM_OFFSITE",
  BOOK_FOR_OTHERS = "BOOK_FOR_OTHERS",
  BOOK_TRIP = "BOOK_TRIP",
}


export default function Index() {
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const savedUsername = localStorage.getItem('userName');
    setUserName(savedUsername || Math.random().toString(36).substring(2, 8));
  }, []);

  const handleUsernameChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setUserName(event.target.value);
  };

  const handleSaveUsername = () => {
    localStorage.setItem('userName', userName);
  };

  const handleApiCall = async (signupReason: SignUpReason) => {
    try {
      setIsLoading(true);
      setLoadingStates(prevState => ({ ...prevState, [signupReason]: true }));
      const response = await fetch(`/api/actions?signupReason=${signupReason}&userName=${userName}`);
      const data = await response.json();
      openPrimeUserWindow(data.userToken);
      setLoadingStates(prevState => ({ ...prevState, [signupReason]: false }));
      setIsLoading(false);
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  const openPrimeUserWindow = (userToken: string) => {
    navigator.clipboard.writeText(userToken).then(() => {
      window.open('https://staging-prime.navan.com/app/user2', '_blank');
    }).catch(err => {
      console.error('Unable to copy text', err);
    });
  };


  const buttonDetails = [
    { reason: SignUpReason.TRAVEL_SOLUTION, label: 'Travel' },
    { reason: SignUpReason.TRAVEL_AND_EXPENSE_SOLUTION, label: 'Travel & Expense' },
    { reason: SignUpReason.TEAM_OFFSITE, label: 'Group Travel' },
    { reason: SignUpReason.BOOK_FOR_OTHERS, label: 'Book for Others' },
    { reason: SignUpReason.BOOK_TRIP, label: 'Book a Trip' },
  ];

  return <>
    <h1>Users Generator!</h1>
    <hr />
    <br />
    <TextField
      id="outlined-basic"
      label="User"
      variant="outlined"
      value={userName}
      onChange={handleUsernameChange}
      onBlur={handleSaveUsername}
    />
    <br />
    <br />
    <ButtonGroup variant="contained">
      <ButtonGroup variant="contained">
        {buttonDetails.map(({ reason, label }) => (
          <Button
            key={reason}
            onClick={() => handleApiCall(reason)}
            loading={loadingStates[reason]}
            loadingPosition="start"
            disabled={isLoading && !loadingStates[reason]} 
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>
    </ButtonGroup>
  </>
}