import { Platform, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";

export default function DatePicker() {
  const [date, setDate] = useState(new Date());
  return (
    <>
      <DateTimePicker
        value={date}
        mode="datetime"
        display="default"
        onChange={() => setDate(date)}
      />
      <Text>{date.toLocaleDateString()}</Text>
    </>
  );
}
