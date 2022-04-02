// import { useState, useRef } from "react";

// function unwrapValue(x) {
//     if (typeof x === "object" && x.target) {
//         x = x.target.value;
//     }
//     return x;
// }


// export function useFormDetail(formObject: FormObject) {
//     const [hashForm, setHashForm] = useState(formObject);
//     const setters = useRef(null)
//     if (!setters.current) {
//         setters.current = {
//             setDataToHash(dataToHash);
//setHashForm(hashForm => ({...hashForm, dataToHash}))
//         }
//     }
//     return [hashForm, setters.current]
// }