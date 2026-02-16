import * as ExcelJS from 'exceljs';

export interface Registration {
    id: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    userCollege: string;
    events: {
        eventName: string;
        teamName?: string; // Added Team Name
        teamMembers: {
            name: string;
            email: string;
            phone: string;
            college: string;
        }[];
    }[];
    amount: number;
    paymentStatus: string;
    paymentScreenshot?: string;
    createdAt: string;
}

export async function generateRegistrationExcel(registrations: Registration[]): Promise<Blob> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registrations');

    worksheet.columns = [
        { header: 'Registered By (Name)', key: 'userName', width: 20 },
        { header: 'Registered By (Email)', key: 'userEmail', width: 30 },
        { header: 'Registered By (Phone)', key: 'userPhone', width: 15 },
        { header: 'Registered By (College)', key: 'userCollege', width: 25 },
        { header: 'Event Name', key: 'eventName', width: 25 },
        { header: 'Team Name', key: 'teamName', width: 25 }, // Added Team Name Column
        { header: 'Team Member Name', key: 'memberName', width: 20 },
        { header: 'Team Member Email', key: 'memberEmail', width: 30 },
        { header: 'Team Member Phone', key: 'memberPhone', width: 15 },
        { header: 'Team Member College', key: 'memberCollege', width: 25 },
        { header: 'Amount', key: 'amount', width: 10 },
        { header: 'Status', key: 'paymentStatus', width: 15 },
        { header: 'Screenshot', key: 'paymentScreenshot', width: 40 },
        { header: 'Date', key: 'createdAt', width: 20 },
    ];

    registrations.forEach(reg => {
        reg.events.forEach(event => {
            if (event.teamMembers && event.teamMembers.length > 0) {
                event.teamMembers.forEach(member => {
                    worksheet.addRow({
                        userName: reg.userName,
                        userEmail: reg.userEmail,
                        userPhone: reg.userPhone,
                        userCollege: reg.userCollege,
                        eventName: event.eventName,
                        teamName: event.teamName || '-', // Map Team Name
                        memberName: member.name,
                        memberEmail: member.email,
                        memberPhone: member.phone,
                        memberCollege: member.college,
                        amount: reg.amount,
                        paymentStatus: reg.paymentStatus,
                        paymentScreenshot: reg.paymentScreenshot ? { text: 'View Screenshot', hyperlink: reg.paymentScreenshot } : '',
                        createdAt: reg.createdAt ? new Date(reg.createdAt).toLocaleString() : '',
                    });
                });
            } else {
                // If no team members (fallback), just list the event with empty member details
                worksheet.addRow({
                    userName: reg.userName,
                    userEmail: reg.userEmail,
                    userPhone: reg.userPhone,
                    userCollege: reg.userCollege,
                    eventName: event.eventName,
                    teamName: event.teamName || '-', // Map Team Name
                    memberName: '-',
                    memberEmail: '-',
                    memberPhone: '-',
                    memberCollege: '-',
                    amount: reg.amount,
                    paymentStatus: reg.paymentStatus,
                    paymentScreenshot: reg.paymentScreenshot ? { text: 'View Screenshot', hyperlink: reg.paymentScreenshot } : '',
                    createdAt: reg.createdAt ? new Date(reg.createdAt).toLocaleString() : '',
                });
            }
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export interface TeamMember {
    name: string;
    email: string;
    phone_number: string;
    screenshot_url: string;
}

export async function generateTeamExcel(members: TeamMember[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('TeamMembers');

    worksheet.columns = [
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Phone', key: 'phone_number', width: 15 },
        { header: 'Screenshot URL', key: 'screenshot_url', width: 40 },
    ];

    members.forEach(member => {
        worksheet.addRow({
            name: member.name,
            email: member.email,
            phone_number: member.phone_number,
            screenshot_url: member.screenshot_url,
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as unknown as Buffer;
}
