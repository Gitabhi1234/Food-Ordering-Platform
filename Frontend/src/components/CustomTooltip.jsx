 import React from "react";

 const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white border rounded-lg shadow-md p-3">
          <p className="font-semibold">{label}</p>
          <p className="text-green-600">
            Earnings : ₹{payload[0].value}
          </p>
        </div>
      );
    }
    return null;
 };
 
export default CustomTooltip;