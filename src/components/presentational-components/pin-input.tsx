/* {
  
} */
import { SyntheticEvent, useRef } from "react";

interface PinInputProps {
  length: number;
  inputClass?: string;
  inputStyle?: React.CSSProperties;
  autoFocus?: boolean;
  mask?: boolean;
  placeholder?: string;
  onChange?: (value: string | number, index: number) => void;
  onComplete?: (
    value: string | number,
    index: number,
    values: Array<string | number>
  ) => void;
  values?: Array<string | number>;
}
export const PinInput = (props: PinInputProps) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  let valuesArr = new Array(props.length || 4).fill("");
  valuesArr = valuesArr.map((val, i) => props?.values?.[i] || "");

  const focusBack = (idx: number) => {
    if (idx !== 0) inputRefs.current[idx - 1].focus();
  };

  const focusForward = (idx: number) => {
    if (idx < valuesArr.length - 1) inputRefs.current[idx + 1].focus();
  };

  const checkIfComplete = (value: string | number, index: number) => {
    let isComplete = true;
    for (const index in valuesArr) {
      if ([undefined, null, ""].includes(valuesArr[index]) && isComplete) {
        isComplete = false;
      }
    }

    if (isComplete) {
      props?.onComplete?.(value, index, valuesArr);
    }
  };

  const inputChanged = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = (e.target as HTMLInputElement).value;

    props?.onChange?.(value, index);
    valuesArr[index] = value;

    checkIfComplete(value, index);
  };

  const keyDownEvent = (e: React.KeyboardEvent, index: number) => {
    const key = e.key;
    setTimeout(() => {
      if (key === "Backspace") {
        focusBack(index);
      } else {
        focusForward(index);
      }
    }, 100);
  };

  return (
    <section className="flex justify-center items-center gap-2">
      {valuesArr.map((value, idx) => (
        <input
          value={value}
          onChange={(e) => inputChanged(e, idx)}
          onKeyDown={(e) => keyDownEvent(e, idx)}
          className="h-14 w-14 text-center border-2 outline-sky-600 border-neutral-300 rounded-xl focus:shadow-2xl"
          style={props.inputStyle || {}}
          type={props.mask ? "password" : "number"}
          autoFocus={props.autoFocus && idx === 0 ? true : false}
          autoComplete="new-password"
          ref={(element) => {
            if (element) {
              inputRefs.current[idx] = element;
            }
          }}
        />
      ))}
    </section>
  );
};
