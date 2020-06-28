import { useState } from "react";

const useFormState = (inititalValue:any) => {
    const [value, setValue] = useState(inititalValue);
    const handleChange = (e:any) => {
        setValue(e.target.value);
    }

    return {
        value: value,
        onChange: handleChange
    };
}

export default useFormState;