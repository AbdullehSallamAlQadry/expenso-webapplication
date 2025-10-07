import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark , faSortAlphaDown, faSortAlphaUp, faSortAmountDown, faSortAmountUp, faSortUp, faSortDown, faCalendarDay} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function FilterDiv({setFilterPanel, personalExpenseCategory, currencyCategory, refCategoryFilter, refTotalCurrencyFilter, refReimbursableFilter, refOrder, refDateBefore, refDateAfter, setFilterTrigger}) {
  const personalExpenseCategoryFilter =  {ALL: 'All', ...personalExpenseCategory}
  const currencyCategoryFilter = {ALL: 'All', ...currencyCategory}

  const [categoryFilter, setCategoryFilter] = useState(refCategoryFilter.current);
  const [totalCurrencyFilter, setTotalCurrencyFilter] = useState(refTotalCurrencyFilter.current);
  const [reimbursableFilter, setReimbursableFilter] = useState(refReimbursableFilter.current);
  const [dateAfterFilter, setDateAfterFilter] = useState(refDateAfter.current);
  const [dateBeforeFilter, setDateBeforeFilter] = useState(refDateBefore.current);
  const [Order, setOrder] = useState(refOrder.current);
  
  const [dateRangeLabel, setDateRangeLabel] = useState('');
  const orderOptions = [
    {value: '-date', icon: <><FontAwesomeIcon icon={faCalendarDay} /> <FontAwesomeIcon icon={faSortDown} /></> },
    {value: 'date', icon: <><FontAwesomeIcon icon={faCalendarDay} /> <FontAwesomeIcon icon={faSortUp} /></> },
    {value: '-subject', icon: <FontAwesomeIcon icon={faSortAlphaDown} /> },
    {value: 'subject', icon: <FontAwesomeIcon icon={faSortAlphaUp} /> },
    {value: 'total_amount', icon: <FontAwesomeIcon icon={faSortAmountDown} /> },
    {value: '-total_amount', icon: <FontAwesomeIcon icon={faSortAmountUp} /> },
  ];

  const handleRangeSelect = (range) => {
    setDateRangeLabel(range);
    const now = new Date();
    let startDate = '';

    if (range) {
      const past = new Date();
      // Calculate start date based on range
      switch (range) {
        case 'day': past.setDate(now.getDate() - 1); break;
        case 'week': past.setDate(now.getDate() - 7); break;
        case 'month': past.setMonth(now.getMonth() - 1); break;
        case 'year': past.setFullYear(now.getFullYear() - 1); break;
        default : ;
      }
      startDate = past.toISOString().split('T')[0];
    }

    setDateAfterFilter(startDate);  // Use meaningful name
    setDateBeforeFilter(range ? now.toISOString().split('T')[0] : '');
  };

  function handlerSubmit(e) {
    e.preventDefault();
    refCategoryFilter.current = (categoryFilter === 'All' ? '' : categoryFilter);
    refTotalCurrencyFilter.current = (totalCurrencyFilter === 'All' ? '' : totalCurrencyFilter);
    refReimbursableFilter.current = reimbursableFilter === '' ? '' : reimbursableFilter === 'Yes';
    refOrder.current = Order;
    refDateAfter.current = dateAfterFilter;   
    refDateBefore.current = dateBeforeFilter; 
    setFilterTrigger(prev => prev + 1);
    setFilterPanel(false)
  }

  return(
    <div className="fliter_container">
      <div className="filter_form">
        <div className="btn_panel">
          <button onClick={() => setFilterPanel(false)}>
            <FontAwesomeIcon icon={faXmark}/> 
          </button>
        </div>
        <form onSubmit={handlerSubmit}>
          <div className="filter_feild">
            <h6>Category</h6>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} name="category_filter">
              {Object.entries(personalExpenseCategoryFilter).map(([key, value]) =>
                <option 
                  key={key} 
                  value={value}
                >
                {value}
              </option>
              )}
            </select>
          </div>
          <div className="filter_feild">
            <h6>Currency</h6>
            <select value={totalCurrencyFilter} onChange={(e) => setTotalCurrencyFilter(e.target.value)} name="total-currency_filter">
              {Object.entries(currencyCategoryFilter).map(([key, value]) =>
                <option 
                  key={key} 
                  value={value}
                >
                {value}
              </option>
              )}
            </select>
          </div>
          <div className="filter_feild">
            <h6>Reimbursable</h6>
            <div className="reimbursable_filter">
              {['Yes', 'No', ''].map((val, idx) => {
                const labelText = val === '' ? 'Both' : val;
                const isActive = reimbursableFilter === val;
                return (
                  <label
                    key={idx}
                    className={`reimbursable_filter_btn ${isActive ? 'active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="reimbursable_filter"
                      value={val}
                      checked={isActive}
                      onChange={(e) => setReimbursableFilter(e.target.value)}
                      style={{ display: 'none' }} 
                    />
                    {labelText}
                  </label>
                );
              })}
            </div>
          </div>
            
          <div className="filter_feild">
            <h6>Date Range</h6>
            <select
              value={dateRangeLabel}
              onChange={(e) => handleRangeSelect(e.target.value)}
              className="date_range_select"
            >
              <option value="">All Time</option>
              <option value="day">Last Day</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          <div className="filter_feild">
            <h6>Sort Order</h6>
            <div className="order_filter_container">
              {orderOptions.map((option, idx) => (
              <label 
                  key={idx} 
                  className={`order_filter_btn ${Order === option.value ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="order_filter"
                    value={option.value}
                    checked={Order === option.value}  
                    onChange={(e) => setOrder(e.target.value)}
                    style={{ display: 'none' }}
                  />
                  {option.icon}
                </label>
              ))}
            </div>
          </div>
          
          <div className="btn_panel">
            <button className="submit_btn" type="submit">Filter</button>
          </div>
        </form>
      </div>
      <div onClick={() => setFilterPanel(false)} className="filter_bg"></div>
    </div>
  )
}