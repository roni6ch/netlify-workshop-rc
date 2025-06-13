import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Users from '~/components/Users';
import CompanyInfo from '~/components/CompanyInfo';
import { useState } from 'react';
import OnboardingGuide from '~/components/OnboardingGuide';
import { Button, Chip, Stack, Paper, Typography, Container, AppBar, Toolbar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ENV } from '~/assets/onboardingGuide.util';
import UiComponents from '~/components/UiComponents';
import { TabStateContext } from '../context/TabStateContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BasicTabs() {
  const [value, setValue] = useState(0);
  const [user, setUser] = useState({ email: '' });
  const [token, setToken] = useState('');
  const [onboardingGuide, setOnboardingGuide] = useState({});
  const [isEligible, setIsEligible] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


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

  return (
    <TabStateContext.Provider value={{ 
      user, 
      token, 
      setUser, 
      setToken,
      onboardingGuide,
      setOnboardingGuide
    }}>
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: '#f5f5f5'
      }}>
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Growth Helper - Staging Prime
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Tabs 
              value={value} 
              onChange={handleChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '1rem',
                  minHeight: 48
                }
              }}
            >
              <Tab label="Users" />
              <Tab label="Company Info" />
              <Tab label="Onboarding Guide" />
              <Tab label="UI Components" />
            </Tabs>
          </Paper>

          <Paper elevation={2} sx={{ p: 3 }}>
            <CustomTabPanel value={value} index={0}>
              <Users onEligibleChange={setIsEligible} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              {isEligible && <CompanyInfo />}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              {isEligible && <OnboardingGuide />}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              <UiComponents />
            </CustomTabPanel>
          </Paper>

          {(user?.email || token) && (
            <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
              <Stack spacing={2}>
                {user?.email && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="subtitle1" sx={{ minWidth: 60 }}>Email:</Typography>
                    <Chip 
                      label={user?.email} 
                      sx={{ 
                        bgcolor: 'primary.light',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.main' }
                      }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => copyToKeyboard(user?.email)}
                      startIcon={<ContentCopyIcon />}
                    >
                      Copy
                    </Button>
                  </Box>
                )}
                
                {token && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="subtitle1" sx={{ minWidth: 60 }}>Token:</Typography>
                    <Chip 
                      label={token}
                      sx={{ 
                        maxWidth: '60%',
                        bgcolor: 'secondary.light',
                        color: 'white',
                        '&:hover': { bgcolor: 'secondary.main' }
                      }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => copyToKeyboard(token)}
                      startIcon={<ContentCopyIcon />}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={openPrimeUserWindow}
                      startIcon={<SendIcon />}
                      color="primary"
                    >
                      Copy + Prime
                    </Button>
                  </Box>
                )}
              </Stack>
            </Paper>
          )}
        </Container>
      </Box>
    </TabStateContext.Provider>
  );
}
