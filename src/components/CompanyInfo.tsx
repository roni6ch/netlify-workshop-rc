import React, { useState, useContext, useEffect, useRef } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, CircularProgress, Box, Typography } from "@mui/material";
import { TabStateContext } from "../context/TabStateContext";
import { decodeJwtToken } from "../utils/jwt";

export default function CompanyInfo() {
    const { token } = useContext(TabStateContext);
    const [companyUuid, setCompanyUuid] = useState('');
    const [companyInfo, setCompanyInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const lastFetchedUuid = useRef('');

    const keysToDisplay = [
        "dateCreated",
        "domain",
        "status",
        "category",
        "companySelfOnboardingAccountSegment",
        "liquidEnabled",
        "navanExpenseTabEnabled",
        "selfSell",
        "growthSelfSellState",
        "onboardingGuideEnabled",
        "keepOnboardingGuideOpen",
        "accountType",
        "selfSellSource",
        "creationFlow"
    ];

    useEffect(() => {
        if (token) {
            const decodedToken = decodeJwtToken(token);
            if (decodedToken?.companyUuid) {
                setCompanyUuid(decodedToken.companyUuid);
                // Only fetch if we haven't fetched this UUID before
                if (decodedToken.companyUuid !== lastFetchedUuid.current) {
                    handleSubmit();
                }
            }
        }
    }, [token]);

    const getCompanyInfo = async () => {
        try {
            if (companyUuid) {
                setLoading(true);
                const response = await fetch(`/api/company-info?companyUuid=${companyUuid}`);
                const { data } = await response.json();
                setCompanyInfo(data?.company);
                lastFetchedUuid.current = companyUuid;
            }
        } catch (error) {
            console.error("Error fetching company info:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        getCompanyInfo();
    };

    const filteredData = companyInfo ? Object.fromEntries(
        Object.entries(companyInfo).filter(([key]) => keysToDisplay.includes(key))
    ) : {};

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
                Company Info
            </Typography>
            {/* <FormGroup>
                <FormControlLabel control={<Switch />} label="Prod?" checked={isProd} onChange={(e) => setIsProd((e.target as HTMLInputElement).checked)} />
            </FormGroup> */}
            <Box display="flex" alignItems="center" gap={2}>
                <TextField
                    label="Company UUID"
                    fullWidth
                    variant="outlined"
                    value={companyUuid}
                    onChange={(e) => setCompanyUuid(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading || !companyUuid}
                >
                    {loading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
            </Box>
            {companyInfo && !loading && <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Key</strong></TableCell>
                            <TableCell><strong>Value</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(filteredData).map(([key, value]) => (
                            <TableRow key={key}>
                                <TableCell>{key}</TableCell>
                                <TableCell>{value !== null && value !== undefined ? value.toString() : "N/A"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            }
            <br />
            {loading && <CircularProgress size={24} />}
        </div>
    );
}
