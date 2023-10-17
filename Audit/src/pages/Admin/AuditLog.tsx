import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface AuditLogData {
    date: string;
    time: string;
    method: string;
    url: string;
    status: number;
    userIP: string;
    userAgent: string;
    username: string;
    userRole: string;
}

function getAPIData() {
    return axios.get(`${process.env.REACT_APP_API_URL}/audit/getall/api_log`, {
        headers: { 'Authorization': "bearer " + sessionStorage.getItem('TOKEN') } 
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return [];
        });
}

function AuditLog() {
    const [auditLogData, setAuditLogData] = useState<AuditLogData[]>([]);

    useEffect(() => {
        const fetchAuditLogData = async () => {
            const data = await getAPIData();
            setAuditLogData(data);
        };
        fetchAuditLogData();
    }, []);

    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Method</TableCell>
                            <TableCell>URL</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>User IP</TableCell>
                            <TableCell>User Agent</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>User Role</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {auditLogData.map((row) => (
                            <TableRow key={`${row.date}-${row.time}-${row.method}-${row.url}`}>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.time}</TableCell>
                                <TableCell>{row.method}</TableCell>
                                <TableCell>{row.url}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>{row.userIP}</TableCell>
                                <TableCell>{row.userAgent}</TableCell>
                                <TableCell>{row.username}</TableCell>
                                <TableCell>{row.userRole}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default AuditLog;