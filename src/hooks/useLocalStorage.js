import { useState } from "react";

function getInitialValue(key, initialValue) {
    try {
        const savedValue = localStorage.getItem(key);

        return savedValue !== null ? JSON.parse(savedValue) : initialValue;
    } catch {
        return initialValue;
    }
}

function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() =>
        getInitialValue(key, initialValue),
    );

    const updateValue = (newValue) => {
        setValue((currentValue) => {
            const valueToStore =
                typeof newValue === "function"
                    ? newValue(currentValue)
                    : newValue;

            try {
                localStorage.setItem(key, JSON.stringify(valueToStore));
            } catch (error) {
                console.error("Failed to save data to LocalStorage:", error);
            }

            return valueToStore;
        });
    };

    return [value, updateValue];
}

export default useLocalStorage;
