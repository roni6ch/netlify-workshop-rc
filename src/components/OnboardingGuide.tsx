import { Box, TextField, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React, { useState } from "react";
import { AccountType, ENV, OnboardingCategory, OnboardingGuides, TaskId } from "~/assets/onboardingGuide.util";

export default function OnboardingGuide() {
    const [userToken, setUserToken] = useState('');
    const [onboardingGuide, setOnboardingGuide] = useState<OnboardingGuides>({});
    const [loading, setLoading] = useState(false);

    const getOnboardingGuideTasks = async () => {
        try {
            if (userToken) {
                setLoading(true);
                const response = await fetch(`/api/onboarding-guide?token=${userToken}`);
                const { data } = await response.json();
                setOnboardingGuide(data);
            }
        } catch (error) {
            console.error("Error fetching company info:", error);
        } finally {
            setLoading(false);
        }
    };

    const OnboardingGuideTable = ({ title, categories, selectedAccountType }: { title: string; categories: OnboardingCategory[], selectedAccountType: AccountType }) => {
        return (
            <div>
                <h3>{title}</h3>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell sx={{ width: "100px" }}>State</TableCell>
                                <TableCell sx={{ width: "90px" }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories?.[0]?.tasks?.flatMap((task) =>
                                (task?.subTasks && task.subTasks.length > 0 ? task?.subTasks : [task])?.map((subTask) => (
                                    <TableRow key={subTask.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <TableCell component="th" scope="row">{subTask?.id}</TableCell>
                                        <TableCell>{subTask?.title || task?.title}</TableCell>
                                        <TableCell>{subTask?.state || task?.state}</TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => handleCTAClick(subTask?.id, selectedAccountType)}
                                                disabled={subTask?.state === "COMPLETED" || loading}
                                            >
                                                Complete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    };

    const handleCTAClick = async (taskId: string, selectedAccountType: AccountType) => {
        let newToken = '';
        switch (taskId) {
            case TaskId.OFFICES_AND_LEGAL_ENTITIES:
                newToken = await setAddress();
                break;
        }
        await completeTask(taskId, selectedAccountType, newToken);
        await getOnboardingGuideTasks();
    };

    const setAddress = async () => {
        const address = { companyLegalName: "company-name", city: "London", country: "GB", address1: "Oxford", address2: "", zipCode: "07086" }
        const headers = { 'Content-Type': 'application/json', Authorization: `TripActions ${userToken}` };
        const response = await fetch(`${ENV}/api/admin/growth/configureCompany`, {
            method: 'POST',
            headers,
            body: JSON.stringify(address)
        });
        const { token } = await response?.json();
        return token;
    }

    const completeTask = async (taskId: string, selectedAccountType: AccountType, newToken?: string) => {
        try {
            setLoading(true);
            const headers = { 'Content-Type': 'application/json', Authorization: `TripActions ${newToken || userToken}` };
            const scope = selectedAccountType === AccountType.COMPANY ? AccountType.COMPANY : AccountType.USER;
            const body = {
                id: taskId,
                state: 'COMPLETED',
                scope,

            }
            await fetch(`${ENV}/api/selfSetup/task/update`, { headers, body: JSON.stringify(body), method: 'POST' });
        } catch (error) {
            console.error("Error completeTask:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Staging Prime - Onboarding Guide</h1>
            <br />
            <Box display="flex" alignItems="center" gap={2}>
                <TextField
                    label="USER TOKEN"
                    fullWidth
                    variant="outlined"
                    value={userToken}
                    onChange={(e) => setUserToken(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={getOnboardingGuideTasks}
                    disabled={loading || !userToken}
                >
                    {loading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
            </Box>
            <br /><hr />
            {(onboardingGuide?.companyOnboardingGuide || onboardingGuide?.userOnboardingGuide) && <>
                <div>
                    {!!onboardingGuide?.companyOnboardingGuide?.categories && (
                        <OnboardingGuideTable
                            title="Company Onboarding Guide"
                            selectedAccountType={AccountType.COMPANY}
                            categories={onboardingGuide?.companyOnboardingGuide?.categories}
                        />
                    )}
                    {!!onboardingGuide.userOnboardingGuide?.categories && (
                        <OnboardingGuideTable
                            title="User Onboarding Guide"
                            selectedAccountType={AccountType.USER}
                            categories={onboardingGuide?.userOnboardingGuide?.categories}
                        />
                    )}
                </div>
            </>}
        </div>
    );
}