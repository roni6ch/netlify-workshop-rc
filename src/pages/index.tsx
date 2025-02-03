
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { SetStateAction, useEffect } from 'react';
import { useState } from 'react';

export const ENV = 'https://staging-prime.navan.com';

enum SignUpReason {
  TRAVEL_SOLUTION = "TRAVEL_SOLUTION",
  TRAVEL_AND_EXPENSE_SOLUTION = "TRAVEL_AND_EXPENSE_SOLUTION",
  TEAM_OFFSITE = "TEAM_OFFSITE",
  BOOK_FOR_OTHERS = "BOOK_FOR_OTHERS",
  BOOK_TRIP = "BOOK_TRIP",
}
enum CompanySegmentType {
  GROWTH = 'GROWTH',
  SMB = 'SMB',
  ENTERPRISE = 'ENTERPRISE',
  COMMERCIAL = 'COMMERCIAL',
  MIDMARKET = 'MID-MARKET'
}
enum CompanyAccountType {
  TRAVEL = 'TRAVEL',
  LIQUID = 'LIQUID',
  TRAVEL_AND_LIQUID = 'TRAVEL_AND_LIQUID'
}

export default function Index() {
  const [token, setToken] = useState('');
  const [userName, setUserName] = useState('');
  const [traditionalAccountType, setTraditionalAccountType] = useState(CompanyAccountType.TRAVEL_AND_LIQUID);
  const [initiated, setInitiated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [withAddress, setWithAddress] = useState(true);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});

  const checkSplitView = async (user: string) => {
    try {
      const response = await fetch(`${ENV}/api/splits/GROWTH_DEBUG_VIEW?userEmail=${user}`);
      const data = await response.json();
      setIsEligible(data.enabled);
      setInitiated(true);
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('userName') || Math.random().toString(36).substring(2, 8);
    setUserName(user);
    checkSplitView(user);
  }, []);

  const handleUsernameChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setUserName(event.target.value);
  };

  const handleSaveUsername = () => {
    localStorage.setItem('userName', userName);
  };

  const handleSelfSellApiCall = async (signupReason: SignUpReason) => {
    try {
      setIsLoading(true);
      setLoadingStates(prevState => ({ ...prevState, [signupReason]: true }));
      const response = await fetch(`${ENV}/api/selfsell?signupReason=${signupReason}&userName=${userName}`);
      const data = await response.json();
      console.log(data.userToken);
      console.log(data.userEmail);
      setToken(data.userToken);
      openPrimeUserWindow(data.userToken);
      setLoadingStates(prevState => ({ ...prevState, [signupReason]: false }));
      setIsLoading(false);
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  const handleTraditionalApiCall = async (accountSegment: CompanySegmentType) => {
    try {
      setIsLoading(true);
      setLoadingStates(prevState => ({ ...prevState, [accountSegment]: true }));
      const response = await fetch(`${ENV}/api/traditional?accountSegment=${accountSegment}&accountType=${traditionalAccountType}&userName=${userName}&withAddress=${withAddress}`);
      const data = await response.json();
      console.log(data);
      loginRequest(data);
      setLoadingStates(prevState => ({ ...prevState, [accountSegment]: false }));
      setIsLoading(false);
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  const loginRequest = async ({ email }: { email: string }) => {
    try {
      const response = await fetch(`${ENV}/api/uaa/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Basic " + btoa(`${email}:Trip@123`)
        },
      });
      const { token } = await response.json();
      console.log(token);
      setToken(token);
      openPrimeUserWindow(token);
    } catch (error) {
      console.error("Error calling API:", error);
    }
  }

  const openPrimeUserWindow = (token: string) => {
    navigator.clipboard.writeText(token).then(() => {
      window.open(`${ENV}/app/user2`, '_blank');
    }).catch(err => {
      console.error('Unable to copy text', err);
      window.open(`${ENV}/app/user2`, '_blank');
    });
  };


  const selfSellSignupCompanies = [
    { reason: SignUpReason.TRAVEL_SOLUTION, label: 'Travel' },
    { reason: SignUpReason.TRAVEL_AND_EXPENSE_SOLUTION, label: 'Travel & Expense' },
    { reason: SignUpReason.TEAM_OFFSITE, label: 'Group Travel' },
    { reason: SignUpReason.BOOK_FOR_OTHERS, label: 'Book for Others' },
    { reason: SignUpReason.BOOK_TRIP, label: 'Book a Trip' },
  ];

  const traditionalSignupCompanies = [
    { accountSegment: CompanySegmentType.GROWTH, label: 'Growth' },
    { accountSegment: CompanySegmentType.SMB, label: 'SMB' },
    { accountSegment: CompanySegmentType.ENTERPRISE, label: 'Enterprise' },
    { accountSegment: CompanySegmentType.COMMERCIAL, label: 'Commercial' },
    { accountSegment: CompanySegmentType.MIDMARKET, label: 'Midmarket' },
  ];

  const traditionalAccountTypes = [
    { accountType: CompanyAccountType.TRAVEL, label: 'Travel' },
    { accountType: CompanyAccountType.LIQUID, label: 'Expense' },
    { accountType: CompanyAccountType.TRAVEL_AND_LIQUID, label: 'Travel & Expense' },
  ];

  return <>
    {initiated && <>
      {!isEligible && 'Please type your username'}
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
      {isEligible && <>
        <br />
        <br />
        <h3>Self sell</h3>
        <ButtonGroup variant="contained">
          {selfSellSignupCompanies.map(({ reason, label }) => (
            <Button
              key={reason}
              onClick={() => handleSelfSellApiCall(reason)}
              loading={loadingStates[reason]}
              loadingPosition="start"
              disabled={isLoading && !loadingStates[reason]}
            >
              {label}
            </Button>
          ))}
        </ButtonGroup>

        <br />
        <br />
        <hr />
        <h3>Traditional</h3>

        <FormGroup>
          <FormControlLabel control={<Switch defaultChecked />} label="With Address?" onChange={prevState => setWithAddress(!prevState)} />
        </FormGroup>
        <h6>Account Type</h6>
        <ButtonGroup variant="contained">
          {traditionalAccountTypes.map(({ accountType, label }) => (
            <Button
              key={accountType}
              onClick={() => setTraditionalAccountType(accountType)}
              variant={accountType === traditionalAccountType ? 'outlined' : 'contained'}
              disabled={isLoading}
            >
              {label}
            </Button>
          ))}
        </ButtonGroup>

        <h6>Account Segment</h6>
        <ButtonGroup variant="contained">
          {traditionalSignupCompanies.map(({ accountSegment, label }) => (
            <Button
              key={accountSegment}
              onClick={() => handleTraditionalApiCall(accountSegment)}
              loading={loadingStates[accountSegment]}
              loadingPosition="start"
              disabled={isLoading && !loadingStates[accountSegment]}
            >
              {label}
            </Button>
          ))}
        </ButtonGroup>
        <br /> <br />
        {token && <Box
          sx={() => ({
            p: 1,
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: 2,

          })}
        >
          {token}
        </Box>}
      </>}
    </>}
  </>
}