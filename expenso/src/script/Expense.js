import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faSliders, faXmark, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import FilterDiv from "./Filter";
import { Loader , categoryIcons , Btn} from "./tools";
import ExpenseForm from "./ExpenseForm";
import moment from 'moment';

export function Expense({onSelectedSection, userId, personalExpenseCategory, currencyCategory, onUserInfo}) {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState('');

  const refCategoryFilter = useRef('');
  const refTotalCurrencyFilter = useRef('');
  const refReimbursableFilter = useRef('');
  const refOrder = useRef('-date');
  const refDateBefore = useRef('');
  const refDateAfter = useRef('');

  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [filterTrigger, setFilterTrigger] = useState(0);
  const [filterPanel, setFilterPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [numberOfPage, setNumberOfPage] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [deleteTrigger, setDeleteTrigger] = useState(0);
  
  async function handleDelete() {
    const deleteConfirming = window.confirm("Do you want to delete")
    if(!deleteConfirming) return;
      try{
        setIsLoading(true);
        setError('');
        const url = `http://localhost:9000/expense/user-id/${userId}/`;
        const res = await fetch(url,
          {method: 'DELETE', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ids : selectedItems})}
        );
        if(!res.ok) {throw new Error("Server Error")};
        setDeleteTrigger(tr => (tr + 1))
      }
      catch(err) {
        if(err.name === "AbortError") return;
        if(err.message === 'Failed to fetch')
          setError('Check the internet');
        else
          setError(err.message || 'Something went wrong');
      }
      setIsLoading(false);
  }

  useEffect(() => {
    setPage(1)
  }, [search, filterTrigger])

  useEffect(() => {
    const controller = new AbortController();
    async function fetching() {
      setIsLoading(true);
      setError('');
      try{
        const queryParams = new URLSearchParams({
          category: refCategoryFilter.current,
          total_currency: refTotalCurrencyFilter.current,
          reimbursable: refReimbursableFilter.current,
          date_after: refDateAfter.current,
          date_before: refDateBefore.current,
          q: search,
          ordered: refOrder.current,
          page: page
        }).toString();
        const url = `http://localhost:9000/expense/user-id/${userId}/?${queryParams}`;
        const res = await fetch(url,{signal: controller.signal});
        const data  = await res.json();
        if(!res.ok) {throw new Error(data.message || "Server Error")};
        if (data.Response === false) {throw new Error("No data return")};
        setExpenses(data.results || []);
        setNumberOfPage(Math.ceil(data.count/6));
      }
      catch(err) {
        if(err.name === "AbortError") return;
        if(err.message === 'Failed to fetch')
          setError('Check the internet');
        else
          setError(err.message || 'Something went wrong');
      }
      setIsLoading(false);
    }
    fetching();
    return () => controller.abort();
  }, [search, filterTrigger, page, deleteTrigger])

  return (
    <>
      {filterPanel && 
        <FilterDiv 
          setFilterPanel = {setFilterPanel}
          personalExpenseCategory={personalExpenseCategory}
          currencyCategory={currencyCategory}
          refCategoryFilter = {refCategoryFilter}
          refTotalCurrencyFilter = {refTotalCurrencyFilter}
          refDateBefore = {refDateBefore}
          refDateAfter = {refDateAfter}
          refReimbursableFilter = {refReimbursableFilter}
          refOrder = {refOrder}
          setFilterTrigger = {setFilterTrigger}
        />}

      <div className="Expense-head">
        <h1>Expense</h1>
        <div className="search_bar">
          <input value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search" placeholder="Search"/>
          <FontAwesomeIcon icon={faSearch} aria-hidden="true"/>
        </div>
        <div className="Expense-btn">
          <Btn icon ={faPlus} onSet={() => onSelectedSection("NewExpense")} name ={"New Expense"}/>
          <Btn icon ={faSliders} onSet={() => setFilterPanel(true)} name ={""}/>
          <Btn icon ={faTrash} onSet={() => handleDelete()} name ={""}/>
        </div>
      </div>
      {(<>
        {isLoading ? ( <Loader/> ) : (
          <ExpensesTable 
            expenses={expenses} 
            onSelectedSection={onSelectedSection}
            error={error}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            onUserInfo={onUserInfo}
            isLoading={isLoading}
          />
        )}

        {numberOfPage >= 1 && (
          <div className="page_container">
            {page > 1 && <button onClick={() => setPage(p => p - 1)}>{'<'}</button>}
            {Array.from({length: numberOfPage}, (_, i) => (
              <button 
                key={i} 
                className={`${page === i + 1 ? 'active' : ''}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            {page < numberOfPage && <button onClick={() => setPage(p => p + 1)}>{'>'}</button>}
          </div>
        )}
      </>)}
    </>
  )
}

function ExpensesTable({ expenses, onSelectedSection, error , selectedItems, setSelectedItems, onUserInfo, isLoading}) {
  const allSelected = selectedItems.length === expenses.length && expenses.length > 0;

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedItems([]); 
    } else {
      const allIds = expenses.map((item) => item.id); 
      setSelectedItems(allIds); 
    }
  };

  function toggleSelectItem(id) {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  return (
    <div className="table_container">
      <div className="table_head">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleSelectAll}
        />
        <p>Detail</p>
        <p>Merchant</p>
        <p>Amount</p>
        <p>Status</p>
      </div>

      <div className="table_body">
        {error || expenses.length === 0 ? (
          <div className="table_error">{error || "There is no data"}</div>
        ) : (
          expenses.map((val, expenseId) => (
            <TableItem val={val} selectedItems = {selectedItems} toggleSelectItem = {toggleSelectItem} key={expenseId} theKey = {expenseId} onClick = { () =>{
              onSelectedSection('UpdateExpense')
              onUserInfo({...val, expenseId})
            }}/>
          ))
        )}
      </div>
    </div>
  );
}

function TableItem({val, selectedItems, toggleSelectItem, theKey, onClick}) {
  return(
    <div 
      className={`table_item ${(theKey % 2 === 0) && 'second'}`} 
      key={val.id}
      onClick={onClick}  
    >
      <input
        type="checkbox"
        checked={selectedItems.includes(val.id)}
        onClick={(e) => e.stopPropagation()}
        onChange={() => toggleSelectItem(val.id)}
      />
      <div className="detail_container">
        <p className="icon">
          <FontAwesomeIcon icon = {categoryIcons[val.category.toUpperCase()]}/>
        </p>
        <div>
          <span>{moment(val.date).format('DD/MM/YYYY')}</span>
          <span>{val.subject}</span>
        </div>
      </div>
      <p>{val.merchant}</p>
      <p>{val.total_amount} {val.total_currency}</p>
      <p className={`reimburs ${val.reimbursable ? 'green' : 'red'}`}>{(val.reimbursable ? '' : 'Not ')}Submitted</p>
    </div>
  )
}

export function NewExpense({onSelectedSection, userId, personalExpenseCategory, currencyCategory}) {
  const [error, setError] = useState("")
  async function AddExpense(formData) {
    formData.append('user', userId)
    try{
      const response = await fetch(`http://localhost:9000/expense/user-id/${userId}/`, {
        method: 'POST',
        body: formData,
      });
      const responseData = await response.json(); 
      if (!response.ok) {
        throw new Error(`Failed to submit form: ${JSON.stringify(responseData)}`);
      }
      onSelectedSection('Expense')
    } catch(error) {
      return error.message; 
    }

  };

  return (
    <>
      <div className="Expense-head">
        <h1>New Expense</h1>
        <div className="Expense-btn">
          <Btn icon={faXmark} onSet={() => onSelectedSection("Expense")} name ={""}/>
        </div>
      </div>
      <ExpenseForm 
        onSubmit={AddExpense} 
        personalExpenseCategory = {personalExpenseCategory} 
        currencyCategory = {currencyCategory}
        error = {error}
        setError = {setError}
      />
    </>
  )
}

export function UpdateExpense({onSelectedSection, personalExpenseCategory, currencyCategory, user}) {
  const [error, setError] = useState("")
  async function UpdateExpense(formData) {
    formData.append('user', user.user)
    try{
      const response = await fetch(`http://localhost:9000/expense/${user.id}/`, {
        method: 'Put',
        body: formData,
      });
      const responseData = await response.json(); 
      if (!response.ok) {
        throw new Error(`Failed to submit form: ${JSON.stringify(responseData)}`);
      }
      onSelectedSection('Expense')
    } catch(error) {
      setError(error.message);
    }
  };
  return (
    <>
      <div className="Expense-head">
        <h1>Update Expense</h1>
        <div className="Expense-btn">
          <Btn icon={faXmark} onSet={() => onSelectedSection("Expense")} name ={""}/>
        </div>
      </div>
      <ExpenseForm 
        uSubject = {user.subject}
        uMerchant = {user.merchant} 
        uDate = {user.date} 
        uCategory = {user.category}
        uReimbursable = {user.reimbursable}
        uTotalAmount = {user.total_amount}
        uTotalCurrency = {user.total_currency}
        uDescription = {user.description}
        uFile = {user.invoice}
        onSubmit={UpdateExpense} 
        personalExpenseCategory = {personalExpenseCategory} 
        currencyCategory = {currencyCategory}
        error = {error}
        setError = {setError}
      />
    </>
  )
}