import { CircularProgress, Button, Skeleton, Typography, Alert, Snackbar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { ENV } from 'netlify/functions/util';
import { SetStateAction, useEffect, useContext } from 'react';
import { useState } from 'react';
import { TabStateContext } from '../context/TabStateContext';


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

export const plsAnnualTravelBudgetOption = [
  { key: 'UP_TO_50K', value: '$0 - $50,000 annually' },
  { key: 'UP_TO_400K', value: '$50,001 - $400,000 annually' },
  { key: 'ABOVE_400K', value: 'More than $400,000 annually' },
  { key: 'NOT_SPECIFIED', value: 'I don\'t know' },
];

interface UsersProps {
  onEligibleChange: (isEligible: boolean) => void;
}

export default function Users({ onEligibleChange }: UsersProps) {
  const { setUser, setToken } = useContext(TabStateContext);
  const [userName, setUserName] = useState('');
  const [traditionalAccountType, setTraditionalAccountType] = useState(CompanyAccountType.TRAVEL);
  const [initiated, setInitiated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [withAddress, setWithAddress] = useState(true);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [annualTravelBudget, setAnnualTravelBudget] = useState('UP_TO_400K');

  const checkSplitView = async (user: string) => {
    try {
      const response = await fetch(`/api/permissions?userEmail=${user}`);
      const { data } = await response.json();
      const url = new URL(window.location.href);
      const eligibleUser = url.searchParams.get('eligible') === 'true';
      setIsEligible(eligibleUser || data.enabled);
      onEligibleChange(eligibleUser || data.enabled);
      setInitiated(true);
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  useEffect(() => {
    function randomLetters(length = 6) {
      let result = '';
      while (result.length < length) {
        result += Math.random().toString(36).replace(/[^a-z]/g, '');
      }
      return result.substring(0, length);
    }
    const user = localStorage.getItem('userName') || randomLetters();
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
      const response = await fetch(`/api/selfsell?signupReason=${signupReason}&userName=${userName}&tbum=${annualTravelBudget}`);
      const data = await response.json();
      setUser(data);
      setToken(data.userToken);
      setLoadingStates(prevState => ({ ...prevState, [signupReason]: false }));
      setNotification({
        open: true,
        message: 'User created successfully!',
        severity: 'success'
      });
      
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    } catch (error) {
      console.error("Error calling API:", error);
      setNotification({
        open: true,
        message: 'Failed to create user',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTraditionalApiCall = async (accountSegment: CompanySegmentType) => {
    try {
      setIsLoading(true);
      setLoadingStates(prevState => ({ ...prevState, [accountSegment]: true }));
      const response = await fetch(`/api/traditional?accountSegment=${accountSegment}&accountType=${traditionalAccountType}&userName=${userName}&withAddress=${withAddress}`);
      const data = await response.json();
      setUser(data);
      loginRequest(data);
      setLoadingStates(prevState => ({ ...prevState, [accountSegment]: false }));
      setNotification({
        open: true,
        message: 'User created successfully!',
        severity: 'success'
      });
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    } catch (error) {
      console.error("Error calling API:", error);
      setNotification({
        open: true,
        message: 'Failed to create user',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
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
      setToken(token);
    } catch (error) {
      console.error("Error calling API:", error);
    }
  }

  const SkeletonAnimation = () => {
    return (
      <>
        <Typography component="div">
          <Skeleton />
        </Typography>
        <Box sx={{ width: 300 }}>
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
        </Box>
        <Typography component="div">
          <Skeleton />
        </Typography>
      </>
    );
  }


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
    {!initiated && SkeletonAnimation()}
    {initiated && <>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 3,
          fontWeight: 600,
          color: '#1976d2',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        User Generator
      </Typography>
      <hr />
      <br />
      <Box display="flex" alignItems="center" gap={2}>
        <TextField
          id="outlined-basic"
          label="User"
          variant="outlined"
          value={userName}
          onChange={handleUsernameChange}
          sx={{ minWidth: 200 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => checkSplitView(userName)}
          disabled={isLoading}
          sx={{ 
            minWidth: 100,
            '&:hover': {
              backgroundColor: 'primary.dark'
            }
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </Box>

      {isEligible && <>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>Self sell</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FormControl sx={{ minWidth: 300 }}>
              <InputLabel>Annual Travel Budget</InputLabel>
              <Select
                value={annualTravelBudget}
                label="Annual Travel Budget"
                onChange={(e) => setAnnualTravelBudget(e.target.value)}
                disabled={isLoading}
              >
                {plsAnnualTravelBudgetOption.map((option) => (
                  <MenuItem key={option.key} value={option.key}>
                    {option.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <ButtonGroup 
            variant="contained" 
            sx={{ 
              gap: 1,
              '& .MuiButton-root': {
                minWidth: 120,
                textTransform: 'none',
                backgroundColor: '#1976d2',
                outline: 'none',
                '&:hover': {
                  backgroundColor: '#1565c0',
                  outline: 'none'
                },
                '&:focus': {
                  outline: 'none',
                  boxShadow: 'none'
                }
              }
            }}
          >
            {selfSellSignupCompanies.map(({ reason, label }) => (
              <Button
                key={reason}
                onClick={() => handleSelfSellApiCall(reason)}
                disabled={isLoading && !loadingStates[reason]}
                sx={{ 
                  position: 'relative',
                  '&:disabled': {
                    backgroundColor: 'action.disabledBackground'
                  }
                }}
              >
                {loadingStates[reason] ? <CircularProgress size={20} sx={{ mr: 1 }} color="warning" /> : null}
                {label}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
        <br />
        <hr />

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>Traditional</Typography>
          
          <FormGroup sx={{ mb: 2 }}>
            <FormControlLabel 
              control={
                <Switch 
                  checked={withAddress} 
                  onChange={e => setWithAddress((e.target as HTMLInputElement).checked)}
                  disabled={isLoading}
                />
              } 
              label="With Address?" 
            />
          </FormGroup>

          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2,
              fontWeight: 500,
              color: '#424242'
            }}
          >
            Account Type
          </Typography>
          <ButtonGroup 
            variant="contained" 
            sx={{ 
              mb: 3,
              gap: 1,
              '& .MuiButton-root': {
                minWidth: 100,
                textTransform: 'none',
                backgroundColor: '#eb77ff',
                outline: 'none',
                '&:hover': {
                  backgroundColor: '#7b1fa2',
                  outline: 'none'
                },
                '&:focus': {
                  outline: 'none',
                  boxShadow: 'none'
                }
              }
            }}
          >
            {traditionalAccountTypes.map(({ accountType, label }) => (
              <Button
                key={accountType}
                size="small"
                color="secondary"
                onClick={() => setTraditionalAccountType(accountType)}
                variant={accountType === traditionalAccountType ? 'outlined' : 'contained'}
                disabled={isLoading}
                sx={{ 
                  minWidth: 100,
                  textTransform: 'none',
                  ...(accountType === traditionalAccountType && {
                    backgroundColor: 'gray',
                    color: '#424242',
                    borderColor: '#9e9e9e',
                    '&:hover': {
                      backgroundColor: '#bdbdbd',
                      borderColor: '#757575'
                    }
                  }),
                  ...(accountType !== traditionalAccountType && {
                    '&:hover': {
                      backgroundColor: '#7b1fa2'
                    }
                  })
                }}
              >
                {label}
              </Button>
            ))}
          </ButtonGroup>

          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2,
              fontWeight: 500,
              color: '#424242'
            }}
          >
            Account Segment
          </Typography>
          <ButtonGroup 
            variant="contained"
            sx={{ 
              gap: 1,
              '& .MuiButton-root': {
                minWidth: 120,
                textTransform: 'none',
                backgroundColor: '#2e7d32',
                outline: 'none',
                '&:hover': {
                  backgroundColor: '#1b5e20',
                  outline: 'none'
                },
                '&:focus': {
                  outline: 'none',
                  boxShadow: 'none'
                }
              }
            }}
          >
            {traditionalSignupCompanies.map(({ accountSegment, label }) => (
              <Button
                key={accountSegment}
                onClick={() => handleTraditionalApiCall(accountSegment)}
                disabled={isLoading && !loadingStates[accountSegment]}
                sx={{ 
                  position: 'relative',
                  '&:disabled': {
                    backgroundColor: 'action.disabledBackground'
                  }
                }}
              >
                {loadingStates[accountSegment] ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                {label}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
      </>}
    </>}

    <Snackbar 
      open={notification.open} 
      autoHideDuration={6000} 
      onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={() => setNotification(prev => ({ ...prev, open: false }))} 
        severity={notification.severity}
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  </>;
}