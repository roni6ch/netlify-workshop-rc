import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, CircularProgress, Box, FormGroup, Switch, FormControlLabel } from "@mui/material";

export default function CompanyInfo() {
    const [companyUuid, setCompanyUuid] = useState('');
    const [companyInfo, setCompanyInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isProd, setIsProd] = useState(false);

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

    const getCompanyInfo = async () => {
        try {
            if (companyUuid) {
                setLoading(true);
                const response = await fetch(`/api/companyInfo?companyUuid=${companyUuid}&isProd=${isProd}`);
                const { data } = await response.json();
                setCompanyInfo(data?.company);
            }
        } catch (error) {
            console.error("Error fetching company info:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = companyInfo ? Object.fromEntries(
        Object.entries(companyInfo).filter(([key]) => keysToDisplay.includes(key))
    ) : {};

    return (
        <div>
            <h1>Staging Prime - Company Info</h1>
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
                    onClick={getCompanyInfo}
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
};