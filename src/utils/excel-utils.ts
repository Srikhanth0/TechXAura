import * as ExcelJS from 'exceljs';

export interface Registration {
    id: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    userCollege: string;
    events: {
        eventName: string;
        teamName?: string;
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
        { header: 'Team Name', key: 'teamName', width: 20 },
        { header: 'Team Member Name', key: 'memberName', width: 25 },
        { header: 'Team Member Email', key: 'memberEmail', width: 30 },
        { header: 'Team Member Phone', key: 'memberPhone', width: 15 },
        { header: 'Team Member College', key: 'memberCollege', width: 25 },
        { header: 'Amount', key: 'amount', width: 10 },
        { header: 'Status', key: 'paymentStatus', width: 15 },
        { header: 'Screenshot', key: 'paymentScreenshot', width: 20 },
        { header: 'Date', key: 'createdAt', width: 20 },
    ];

    // Make headers bold
    worksheet.getRow(1).font = { bold: true };

    registrations.forEach(reg => {
        // DEFENSIVE SYSTEM DESIGN: Deduplicate events array based on eventName.
        // If a user has two "Design-O-Mania" objects due to a DB bug, this filters it to one.
        const uniqueEventsMap = new Map<string, typeof reg.events[0]>();
        if (reg.events) {
            reg.events.forEach(event => {
                uniqueEventsMap.set(event.eventName, event);
            });
        }
        const cleanEvents = Array.from(uniqueEventsMap.values());

        cleanEvents.forEach(event => {
            let memberNames = '-';
            let memberEmails = '-';
            let memberPhones = '-';
            let memberColleges = '-';

            if (event.teamMembers && event.teamMembers.length > 0) {
                const names = event.teamMembers.map(m => m.name);
                const emails = event.teamMembers.map(m => m.email);
                const phones = event.teamMembers.map(m => m.phone);
                const colleges = event.teamMembers.map(m => m.college);

                memberNames = names.join('\n');
                memberEmails = emails.join('\n');
                memberPhones = phones.join('\n');

                const uniqueColleges = Array.from(new Set(colleges));
                if (uniqueColleges.length === 1) {
                    memberColleges = uniqueColleges[0];
                } else {
                    memberColleges = colleges.join('\n');
                }
            }

            const row = worksheet.addRow({
                userName: reg.userName,
                userEmail: reg.userEmail,
                userPhone: reg.userPhone,
                userCollege: reg.userCollege,
                eventName: event.eventName,
                teamName: event.teamName || '-',
                memberName: memberNames,
                memberEmail: memberEmails,
                memberPhone: memberPhones,
                memberCollege: memberColleges,
                amount: reg.amount,
                paymentStatus: reg.paymentStatus,
                paymentScreenshot: reg.paymentScreenshot ? { text: 'View Screenshot', hyperlink: reg.paymentScreenshot } : '',
                createdAt: reg.createdAt ? new Date(reg.createdAt).toLocaleString() : '',
            });

            // CRUCIAL: Enable text wrapping so the '\n' creates visible line breaks in Excel
            row.alignment = { wrapText: true, vertical: 'top' };
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}