import { useState, useRef, useEffect, use } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faRedo} from "@fortawesome/free-solid-svg-icons";

const API_BASE = "http://127.0.0.1:9000";

export default function ExpenseForm({
  uSubject, 
  uMerchant, 
  uDate, 
  uCategory, 
  uReimbursable, 
  uTotalAmount, 
  uTotalCurrency, 
  uDescription, 
  uFile, 
  onSubmit, 
  personalExpenseCategory, 
  currencyCategory, 
  error, 
  setError}) {
  // useStates to handle the form
  const [subject, setSubject] = useState(uSubject || '');
  const [merchant, setMerchant] = useState(uMerchant || '');
  const [date, setDate] = useState(uDate && (new Date(`${uDate}T13:22:45.000Z`).toISOString().split("T")[0]));
  const [category, setCategory] = useState(uCategory || 'Food');
  const [reimbursable, setReimbursable] = useState(uReimbursable || false);
  const [totalAmount, setTotalAmount] = useState(uTotalAmount || '');
  const [totalCurrency, setTotalCurrency] = useState(uTotalCurrency || 'YER');
  const [description, setDescription] = useState(uDescription || '');
  const [file, setFile] = useState(uFile || null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  
  const imageFormats = ".jpg,.png";

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // useEffect to handle an input file
  useEffect(() => {
    if (file && file instanceof Blob) {
      const objectUrl = URL.createObjectURL(file);
      setFilePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof file === "string") {
      console.log("File is a string:", file);
      if (file.startsWith("/media/")) {
        console.log("Prepending base URL:", `${API_BASE}${file}`);
        setFilePreview(`${API_BASE}${file}`);
      } else {
        setFilePreview(file);
      }
    } else {
      setFilePreview(null);
    }
  }, [file]);
  
  // to handle validation and then send it to the backend
  function validation(e) {
    setError("")
    e.preventDefault();
    try {
      if (!subject.trim() || !merchant.trim() || !date || !category || !totalAmount) {
        throw new Error('Please fill in all required fields');
      }
      if (isNaN(totalAmount) || totalAmount <= 0) {
        throw new Error("The total must be a valid number greater than zero");
      }
      if(!Object.values(personalExpenseCategory).includes(category)) {
        throw new Error("The category must be from the option")
      }
      if(!Object.values(currencyCategory).includes(totalCurrency)) {
        throw new Error("The category must be from the option")
      }
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('merchant', merchant);
      const isoDate = new Date(date).toISOString().split('T')[0];
      formData.append('date', isoDate);
      formData.append('category', category);
      formData.append('reimbursable', reimbursable);
      formData.append('total_amount', totalAmount);
      formData.append('total_currency', totalCurrency);
      description && formData.append('description', description);
      if (file && file instanceof Blob) {
        formData.append("invoice", file);
      }
      onSubmit(formData);
    }
    catch(err) {
      setError(err)
    }
  }

  return (
    <div className="ExpenseForm">
      <form onSubmit={ validation }>
        <div className="form-container">
          <div className="label-input">

            <div className="field">
              <label htmlFor="subject">Subject*</label>
              <input 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                id="subject" 
                name = "subject" 
                type="text" 
                required
                placeholder="subject"
              />
            </div>
            
            <div className="field">
              <label htmlFor="merchant">Merchant*</label>
              <input 
                value={merchant} 
                onChange={(e) => setMerchant(e.target.value)} 
                id="merchant" 
                name = "merchant"
                type="text" 
                required
                placeholder="merchant"
              />
            </div>
            
            <div className="field">
              <label htmlFor="date">Date*</label>
              <input 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                id="date"
                name="date" 
                type="date" 
                required
              />
            </div>
            
            <div className="field">
              <label htmlFor="category">Category*</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                id="category" 
                name="category" 
                required
              >
                {Object.entries(personalExpenseCategory).map(([key, value]) =>
                  <option key={key} value={value}>
                    {value}
                  </option>
                )}
              </select>
            </div>
            
           <div className="field">
            <label htmlFor="reimbursable">Reimbursable</label>
            <input 
              id="reimbursable" 
              name="reimbursable" 
              type="checkbox"
              checked={reimbursable} // ✅ استخدم checked
              onChange={(e) => setReimbursable(e.target.checked)} // ✅ استخدم checked
            />
          </div>
            
            <div className="field total">
              <label htmlFor="total">Total*</label>
              <input 
                value={totalAmount} 
                onChange={(e) => setTotalAmount(e.target.value)} 
                id ="total" 
                name="total-amount" 
                required
                placeholder="0.00"
              />
              <select
                value={totalCurrency} 
                onChange={(e) => setTotalCurrency(e.target.value)} 
                name="total-currency"
              >
                {Object.entries(currencyCategory).map(([key, value]) =>
                  <option key={key} value={value}>
                    {value}
                  </option>
                )}
              </select>
            </div>
            
            <div className="field description">
              <label htmlFor="description">Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                id="description" 
                name="description"
                rows={4} 
                placeholder="description"
              ></textarea>
            </div>
          </div>
          
          {filePreview &&
          <div className="file-preview">
            <button 
              type="button" 
              onClick={() => fileInputRef.current.click()}
            >
              <FontAwesomeIcon icon={faRedo}/>
            </button>
            <button 
              type="button" 
              onClick={handleRemoveFile}
            >
              <FontAwesomeIcon icon={faTrash}/>
            </button>
          </div>}
          <button 
            className="img-btn" 
            type="button" 
            onClick={() => fileInputRef.current.click()}
          > 
            {file ? 
                <img src={filePreview} alt="Invoice preview" />
              :
                <><FontAwesomeIcon icon={faPlus}/>Upload an Invoice</>}
          </button>
          <input 
            onChange={(e) => {setFile(e.target.files[0])}} 
            name="invoice-img" 
            ref={fileInputRef} 
            type="file" 
            style={{display:"none"}} 
            accept={imageFormats}
          />
        </div>
        <div className="form-footer">
          <p>{error && error}</p>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  )
}