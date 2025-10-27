import { useState } from "react";
import Select from "react-select";

const PaymentCountSelect = ({ changeRecentPayments }) => {
  const options = [
    { value: 1, label: "1 건" },
    { value: 5, label: "5 건" },
    { value: 10, label: "10 건" },
    { value: 999, label: "전체" },
  ];

  const [selectedCount, setSelectedCount] = useState({
    value: 1,
    label: "1 건",
  });

  const handleChange = (selectedOption) => {
    console.log("changed to: ", selectedOption.value);
    setSelectedCount(selectedOption);
    changeRecentPayments(selectedOption.value);
  };

  return (
    <Select
      value={selectedCount}
      options={options}
      placeholder="건수"
      onChange={handleChange}
    />
  );
};

export default PaymentCountSelect;
