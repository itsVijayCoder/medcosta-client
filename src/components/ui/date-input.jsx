import React from "react";
import { Input } from "@/components/ui/input";

const DateInput = ({ value, onChange, ...props }) => {
  const handleDateChange = (e) => {
    const date = e.target.value;
    onChange({
      target: {
        name: props.name,
        value: date
      }
    });
  };

  return (
    <Input
      type="date"
      value={value}
      onChange={handleDateChange}
      {...props}
    />
  );
};

export default DateInput;