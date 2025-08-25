const pdf = require("pdfkit");
const db = require("../config/db");
const path = require("path");
const arialBold = path.join(__dirname, "../fonts/arial/G_ari_bd.TTF");
const arial = path.join(__dirname, "../fonts/arial/arial.ttf");

const keys = [
    "College Code",
    "College Name with District",
    "Name of the Principal/Dean",
    "Address",
    "Taluk",
    "District",
    "Pincode",
    "Phone/Fax",
    "EMailID",
    "Website",
    "Anti-Ragging : ContactNo.",
    "Bank A/C No.",
    "Bank Name",
    "Minority Status",
    "Autonomous Status",
    "Distance in KMS from DistrictHQ.",
    "Nearest Railway Station",
    "Distance in KMS from Railway Station",
    "Transport Facility",
    "Transport",
    "Min. Transport Charges(Rs/Year)",
    "Max. Transport Charges(Rs/Year)"
];

const booleanFields = [
    'minority_status',
    'autonomous_status',
    'transport_facility',
    'b_accomodation',
    'g_accomodation',
];

const hostelKeyFields = [
    "Accomodation Available",
    "Hostel StayType",
    "Type of Mess",
    "Mess Bill(Rs/Month)",
    "Room Rent(Rs/Month)",
    "Electricity Charges(Rs/Month)",
    "Caution Deposit(Rs.)",
    "Establishment Charges(Rs/Year)",
    "Admission Fees(Rs/Year)"
]


const hostelFiels = [
    'accomodation',
    'hostel_stay_type',
    'type_of_mess',
    'mess_bill',
    'room_rent',
    'electricity_charges',
    'caution_deposit',
    'establishment_charges',
    'addmission_fees',
];



const collegeDetails = async (req, res) => {

    const name = req.user.name;
    const c_code = req.body?.collegeCode;
    if (!name) return res.status(404).json({ msg: "user not found" });

    const [[result]] = await db.query('SELECT * FROM college_info WHERE c_code = ?', [c_code])

    const doc = new pdf(
        { size: 'A4', margin: 40 }
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="college_details.pdf"');

    doc.pipe(res);

    doc.fontSize(18).text("COLLEGE DETAILS", { align: 'center' });
    doc.moveDown();

    const startX = 50;
    let startY = 80;
    // const rowHeight = 20;
    const keyWidth = 150;
    const valWidth = 350;
    // console.log(result);

    const entries = Object.entries(result);

    for (let index = 0; index < 22; index++) {

        const [key, value] = entries[index];


        const keyHeight = doc.heightOfString(keys[index], { width: keyWidth - 10 });
        const valueHeight = doc.heightOfString(result[key], { width: valWidth - 10 });

        const maxHeight = Math.max(keyHeight, valueHeight);
        const rowHeight = maxHeight + 17;

        if (startY + rowHeight > doc.page.height - doc.page.margins.bottom) {
            doc.addPage();
            startY = doc.page.margins.top
        }

        doc.rect(startX, startY, keyWidth, rowHeight).stroke();
        doc.rect(startX + keyWidth, startY, valWidth, rowHeight).stroke();

        doc.fontSize(10);


        doc.text(keys[index], startX + 5, startY + 7, {
            width: keyWidth - 10
        });

        const val = booleanFields.includes(key) ? (value == 1 ? "Yes" : "No") : value;

        doc.text(String(val), startX + keyWidth + 5, startY + 7, {
            width: valWidth - 10
        })

        startY += rowHeight;
    }

    doc.addPage();
    startY = doc.page.margins.top;

    const rowheight = 32;

    doc.rect(startX, startY, keyWidth, rowheight).stroke();
    doc.rect(startX + keyWidth, startY, valWidth / 2, rowheight).stroke();
    doc.rect(startX + keyWidth + valWidth / 2, startY, valWidth / 2, rowheight).stroke();

    doc.fontSize(10);


    doc.font(arialBold).text("Hostels", startX + 5, startY + 7, {
        width: keyWidth - 10,
        align: 'center'
    });


    doc.font(arialBold).text("Boys Hostel", startX + keyWidth + 5, startY + 7, {
        width: (valWidth - 10) / 2,
        align: 'center'
    })

    doc.font(arialBold).text("Girls Hostel", (valWidth - 10) / 2 + keyWidth + 60, startY + 7, {
        width: (valWidth - 10) / 2,
        align: 'center'
    })

    let i = 0;

    doc.font(arial);



    startY += rowheight;
    


    hostelFiels.forEach(element => {

        if (startY + rowheight > doc.page.height - doc.page.margins.bottom) {
            doc.addPage();
            startY = doc.page.margins.top
        }


        doc.rect(startX, startY, keyWidth, rowheight).stroke();
        doc.rect(startX + keyWidth, startY, valWidth / 2, rowheight).stroke();
        doc.rect(startX + keyWidth + valWidth / 2, startY, valWidth / 2, rowheight).stroke();

        doc.fontSize(10);


        doc.text(hostelKeyFields[i], startX + 5, startY + 7, {
            width: keyWidth - 10,
            align: 'center'
        });

        const boys = 'b_'+element;
        const girls = 'g_'+element;


        const boysVal = booleanFields.includes(boys) ? (result[boys] == 1 ? "Yes" : "No") : result[boys];
        const girlsVal = booleanFields.includes(girls) ? (result[girls] == 1 ? "Yes" : "No") : result[girls];

        doc.text(boysVal, startX + keyWidth + 5, startY + 7, {
            width: (valWidth - 10) / 2,
            align: 'center'
        })

        doc.text(girlsVal, (valWidth - 10) / 2 + keyWidth + 60, startY + 7, {
            width: (valWidth - 10) / 2,
            align: 'center'
        })

        i++;
        startY += rowheight;
    });


    doc.end();
};

module.exports = collegeDetails;
