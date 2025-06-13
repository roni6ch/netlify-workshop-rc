import { Box, TextField, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React, { useContext, useState } from "react";
import { AccountType, ENV, OnboardingCategory, TaskId } from "~/assets/onboardingGuide.util";
import { TabStateContext } from "../context/TabStateContext";

export default function OnboardingGuide() {
    const { token, setToken, onboardingGuide, setOnboardingGuide } = useContext(TabStateContext);
    const [loading, setLoading] = useState(false);

    const getOnboardingGuideTasks = async () => {
        try {
            if (token) {
                setLoading(true);
                const response = await fetch(`/api/onboarding-guide?token=${token.replace(/^"|"$/g, '')}`);
                const { data } = await response.json();
                setOnboardingGuide(data);
            }
        } catch (error) {
            console.error("Error fetching company info:", error);
        } finally {
            setLoading(false);
        }
    };

    const OnboardingGuideTable = ({ title, categories, selectedAccountType }: {
        title: string;
        categories: OnboardingCategory[];
        selectedAccountType: AccountType;
    }) => {

        return (
            <div>
                <h3>{title}</h3>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <TableContainer component={Paper} sx={{ width: 'auto', minWidth: '1000px' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: '300px', minWidth: '300px' }}>ID</TableCell>
                                    <TableCell width="25%">Name</TableCell>
                                    <TableCell width="40%">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories?.[0]?.tasks?.flatMap((task) =>
                                    (task?.subTasks || [task])?.map((subTask) => (
                                        <TableRow key={subTask.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row" sx={{ width: '300px', minWidth: '300px' }}>{subTask?.id}</TableCell>
                                            <TableCell sx={{ wordBreak: 'break-word' }}>{subTask?.title || task?.title}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'nowrap' }}>
                                                    <Button
                                                        onClick={() => handleCTAClick(subTask?.id, selectedAccountType, 'NOT_STARTED')}
                                                        disabled={subTask?.state === "NOT_STARTED" || loading}
                                                        variant="contained"
                                                        size="small"
                                                        sx={{ 
                                                            minWidth: '100px',
                                                            bgcolor: '#d32f2f !important',
                                                            '&:hover': {
                                                                bgcolor: '#b71c1c !important'
                                                            }
                                                        }}
                                                    >
                                                        Not Started
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleCTAClick(subTask?.id, selectedAccountType, 'IN_PROGRESS')}
                                                        disabled={subTask?.state === "IN_PROGRESS" || loading}
                                                        variant="contained"
                                                        size="small"
                                                        sx={{ 
                                                            minWidth: '100px',
                                                            bgcolor: '#ed6c02 !important',
                                                            '&:hover': {
                                                                bgcolor: '#e65100 !important'
                                                            }
                                                        }}
                                                    >
                                                        In Progress
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleCTAClick(subTask?.id, selectedAccountType, 'COMPLETED')}
                                                        disabled={subTask?.state === "COMPLETED" || loading}
                                                        variant="contained"
                                                        size="small"
                                                        sx={{ 
                                                            minWidth: '100px',
                                                            bgcolor: '#2e7d32 !important',
                                                            '&:hover': {
                                                                bgcolor: '#1b5e20 !important'
                                                            }
                                                        }}
                                                    >
                                                        Completed
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        );
    };

    const handleCTAClick = async (taskId: string, selectedAccountType: AccountType, newState: string) => {
        let newToken = '';
        switch (taskId) {
            case TaskId.OFFICES_AND_LEGAL_ENTITIES:
                newToken = await setAddress();
                break;
        }
        await completeTask(taskId, selectedAccountType, newState, newToken);
        await getOnboardingGuideTasks();
    };

    const setAddress = async () => {
        const address = { companyLegalName: "company-name", city: "London", country: "GB", address1: "Oxford", address2: "", zipCode: "07086" }
        const headers = { 'Content-Type': 'application/json', Authorization: `TripActions ${token.replace(/^"|"$/g, '')}` };
        const response = await fetch(`${ENV}/api/admin/growth/configureCompany`, {
            method: 'POST',
            headers,
            body: JSON.stringify(address)
        });
        const { token: newTokenResponse } = await response.json();
        return newTokenResponse;
    }

    const completeTask = async (taskId: string, selectedAccountType: AccountType, newState: string, newToken?: string) => {
        try {
            setLoading(true);
            const headers = { 'Content-Type': 'application/json', Authorization: `TripActions ${newToken || token.replace(/^"|"$/g, '')}` };
            const scope = selectedAccountType === AccountType.COMPANY ? AccountType.COMPANY : AccountType.USER;
            const body = {
                id: taskId,
                state: newState,
                scope,
            }
            await fetch(`${ENV}/api/selfSetup/task/update`, { headers, body: JSON.stringify(body), method: 'POST' });
        } catch (error) {
            console.error("Error completeTask:", error);
        } finally {
            setLoading(false);
        }
    };

    const completeAllTasks = async () => {
        try {
            setLoading(true);
            
            const { companyOnboardingGuide, userOnboardingGuide } = onboardingGuide;
            
            const collectIncompleteTasks = (categories: OnboardingCategory[], accountType: AccountType) => 
                categories.reduce<Array<{ taskId: string; accountType: AccountType }>>((acc, category) => {
                    const tasks = category.tasks.reduce<Array<{ taskId: string; accountType: AccountType }>>((taskAcc, task) => {
                        if (task.subTasks?.length) {
                            const incompleteSubTasks = task.subTasks
                                .filter(subTask => subTask.state !== 'COMPLETED')
                                .map(subTask => ({ taskId: subTask.id, accountType }));
                            return [...taskAcc, ...incompleteSubTasks];
                        }
                        if (task.state !== 'COMPLETED') {
                            return [...taskAcc, { taskId: task.id, accountType }];
                        }
                        return taskAcc;
                    }, []);
                    return [...acc, ...tasks];
                }, []);

            const tasksToComplete = [
                ...(companyOnboardingGuide?.categories ? collectIncompleteTasks(companyOnboardingGuide.categories, AccountType.COMPANY) : []),
                ...(userOnboardingGuide?.categories ? collectIncompleteTasks(userOnboardingGuide.categories, AccountType.USER) : [])
            ];

            // Process tasks in parallel with a concurrency limit
            const concurrencyLimit = 5;
            for (let i = 0; i < tasksToComplete.length; i += concurrencyLimit) {
                const batch = tasksToComplete.slice(i, i + concurrencyLimit);
                await Promise.all(
                    batch.map(({ taskId, accountType }) => completeTask(taskId, accountType, 'COMPLETED'))
                );
            }

            // Refresh the tasks after completing all
            await getOnboardingGuideTasks();
        } catch (error) {
            console.error("Error completing all tasks:", error);
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
                    value={token}
                    onChange={(e) => setToken(e.target.value.toString())}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && token) {
                            getOnboardingGuideTasks();
                        }
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={getOnboardingGuideTasks}
                    disabled={loading || !token}
                >
                    {loading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={completeAllTasks}
                    disabled={loading || !token || !onboardingGuide?.companyOnboardingGuide?.categories}
                >
                    {loading ? <CircularProgress size={24} /> : "Complete All Tasks"}
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