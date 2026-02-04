/**
 * Global Inquiry Utilities
 */

const inquiry = {
    whatsapp: (productName, code) => {
        const phone = '263770000000'; // Replace with actual sales line
        const refNo = `JP-${Math.floor(Date.now() / 1000).toString().slice(-6)}`;
        const date = new Date().toLocaleDateString('en-GB');

        const messageStr = `*REQUEST FOR QUOTATION*
---------------------------------------
*Ref:* ${refNo}
*Date:* ${date}

*Client Information:*
[Please provide Facility Name]

*Product Inquiry:*
*Item:* ${productName}
*Catalog Code:* ${code}
*Quantity Required:* [Please specify quantity]

*Additional Notes:*
---------------------------------------
Please provide current trade availability and wholesale pricing for the above items.

*Just Pharmaceuticals Trade Desk*`;

        const message = encodeURIComponent(messageStr);
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }
};
