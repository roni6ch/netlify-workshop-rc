
import { Chip, CircularProgress, Stack, Button } from '@mui/material';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { ENV } from 'netlify/functions/util';
import { SetStateAction, useEffect } from 'react';
import { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


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

interface UsersProps {
  onEligibleChange: (isEligible: boolean) => void;
}

export default function Users({ onEligibleChange }: UsersProps) {
  const [token, setToken] = useState('');
  const [userName, setUserName] = useState('');
  const [traditionalAccountType, setTraditionalAccountType] = useState(CompanyAccountType.TRAVEL_AND_LIQUID);
  const [initiated, setInitiated] = useState(false);
  const [response, setResponse] = useState({ email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [withAddress, setWithAddress] = useState(true);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});

  const checkSplitView = async (user: string) => {
    try {
      const response = await fetch(`${ENV}/api/splits/GROWTH_DEBUG_VIEW?userEmail=${user}`);
      const data = await response.json();
      setIsEligible(data.enabled);
      onEligibleChange(data.enabled);
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

  const handleUsernameChange = async (event: { target: { value: SetStateAction<string>; }; }) => {
    setUserName(event.target.value);
    localStorage.setItem('userName', event.target.value as string || '');
  };

  const handleSelfSellApiCall = async (signupReason: SignUpReason) => {
    try {
      setIsLoading(true);
      setLoadingStates(prevState => ({ ...prevState, [signupReason]: true }));
      const response = await fetch(`/api/selfsell?signupReason=${signupReason}&userName=${userName}`);
      const data = await response.json();
      console.log(data.userToken);
      console.log(data.email);
      setResponse(data);
      setToken(data.userToken);
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
      const response = await fetch(`/api/traditional?accountSegment=${accountSegment}&accountType=${traditionalAccountType}&userName=${userName}&withAddress=${withAddress}`);
      const data = await response.json();
      console.log(data);
      setResponse(data);
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
    } catch (error) {
      console.error("Error calling API:", error);
    }
  }

  const copyToKeyboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const openPrimeUserWindow = async () => {
    try {
      await copyToKeyboard(token);
      window.open(`${ENV}/app/user2`, '_blank');
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      window.open(`${ENV}/app/user2`, '_blank');
    }
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
      <h1>Staging Prime - Users Generator!</h1>
      <hr />
      <br />
      <Box display="flex" alignItems="center" gap={2}>
        <TextField
          id="outlined-basic"
          label="User"
          variant="outlined"
          value={userName}
          onChange={handleUsernameChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => checkSplitView(userName)}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </Box>

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
          <FormControlLabel control={<Switch />} label="With Address?" disabled={isLoading} checked={withAddress} onChange={e => setWithAddress((e.target as HTMLInputElement).checked)} />
        </FormGroup>
        <h6>Account Type</h6>
        <ButtonGroup variant="contained">
          {traditionalAccountTypes.map(({ accountType, label }) => (
            <Button
              key={accountType}
              size="small"
              color="secondary"
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
        <hr />
        {response?.email &&
          <Box display="flex" alignItems="center" gap={2}>
            Email <Stack direction="row" spacing={1}>
              <Chip label={response?.email} />
            </Stack>
            <Button
              variant="contained"
              color="primary"
              onClick={() => copyToKeyboard(response?.email)}
              endIcon={<ContentCopyIcon />}
            >
              Copy
            </Button>
          </Box>
        }
        <br />
        {token && <Box display="flex" alignItems="center" gap={2}>
          Token
          <Stack direction="row" spacing={1} sx={() => ({
            borderRadius: 1,
            width: '45%',
          })}>
            <Chip label={token} />
          </Stack>
          <Button
            variant="contained"
            color="primary"
            onClick={() => openPrimeUserWindow()}
            endIcon={<SendIcon />}
          >
            Copy + prime!
          </Button>
        </Box>}
      </>}
    </>}
  </>
}