import { Box, TextField, Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import React, { useContext, useState } from "react";
import { TabStateContext } from "~/context/TabStateContext";
import { Typography } from "@mui/material";

export default function UiComponents() {
    const { token, setToken } = useContext(TabStateContext);
    const [loading, setLoading] = useState(false);
    const [uiComponentKey, setUiComponentKey] = useState('');
    const [componentState, setComponentState] = useState('false');
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleUiComponentSubmit = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/.netlify/functions/ui-components?key=${uiComponentKey}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `TripActions ${token.replace(/^"|"$/g, '')}`
                },
                body: JSON.stringify({ state: componentState })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update UI component');
            }
            
            await response.json();
            setNotification({
                open: true,
                message: 'UI component updated successfully',
                severity: 'success'
            });
            setUiComponentKey('');
        } catch (error) {
            console.error("Error updating UI component:", error);
            setNotification({
                open: true,
                message: 'Failed to update UI component',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    return (
        <div>
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
                UI Components
            </Typography>
            <br />
            <Box display="flex" alignItems="center" gap={2}>
                <TextField
                    label="USER TOKEN"
                    fullWidth
                    variant="outlined"
                    value={token}
                    onChange={(e) => setToken(e.target.value.toString())}
                />
            </Box>
            <br />
            <Box display="flex" alignItems="center" gap={2}>
                <TextField
                    label="Component Key"
                    fullWidth
                    variant="outlined"
                    value={uiComponentKey}
                    onChange={(e) => setUiComponentKey(e.target.value.toString())}
                    placeholder="group-travel-tour-guide-displayed"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && uiComponentKey && token) {
                            handleUiComponentSubmit();
                        }
                    }}
                />
                <TextField
                    label="State"
                    variant="outlined"
                    value={componentState}
                    onChange={(e) => setComponentState(e.target.value.toString())}
                    placeholder="false"
                    sx={{ width: '150px' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUiComponentSubmit}
                    disabled={loading || !token || !uiComponentKey}
                >
                    {loading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
            </Box>

            <Snackbar 
                open={notification.open} 
                autoHideDuration={6000} 
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseNotification} 
                    severity={notification.severity}
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </div>
    );
} 