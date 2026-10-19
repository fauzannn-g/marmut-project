import "./FormInput.css";

/**
 * type: "text" | "number" | "email" | "password" | "select" | "textarea"
 */
export default function FormInput({
  label,
  id,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required = false,
  options = [],
  min,
  max,
  rows = 3,
  error,
  hint,
  disabled = false,
}) {
  return (
    <div className="form-input-group">
      {label && (
        <label htmlFor={id} className="form-input-label">
          {label}
          {required && <span className="required-mark"> *</span>}
        </label>
      )}

      {type === "select" ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`form-input-field ${error ? "input-error" : ""}`}
        >
          <option value="">-- Pilih --</option>
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          rows={rows}
          className={`form-input-field form-textarea ${error ? "input-error" : ""}`}
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          className={`form-input-field ${error ? "input-error" : ""}`}
        />
      )}

      {error && <p className="input-error-msg">{error}</p>}
      {hint && !error && <p className="input-hint">{hint}</p>}
    </div>
  );
}
