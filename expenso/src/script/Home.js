import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import { Loader, personalExpenseCategory , categoryIcons} from './tools';

export function Home({userId}) {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [categoryCounter, setCategoryCounter] = useState({});
  const [expenseCounter, setExpenseCounter] = useState({})
  const [expenseChart, setExpenseChart] = useState([])

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(`http://localhost:9000/expense/info/user-id/${userId}`);
        const data = await response.json();
        if(!response.ok) {throw new Error(data.message ||"Server Error")};
        if (data.Response === false) {throw new Error("No data return")};
        setCategoryCounter(data.category_count);
        setExpenseCounter(data.expense_count);
        setExpenseChart(data.monthly_expenses);
      } catch(err) {
        if(err.name === "AbortError") return;
        if(err.message === 'Failed to fetch')
          setError('Check the internet');
        else
          setError(err.message || 'Something went wrong');
      }
      finally{
        setIsLoading(false);
      }
    }
    fetchData();
  }, [])

  return (
    <>
    {(
        <div className="home_container">
          <div className="Home-head">
            <h1>Home</h1>
          </div>
          {isLoading ? 
          <Loader/> : error ? <div className="error">{error}</div> : <>
            <div className="counterContainer">
              <CategoryCounter categoryCounter={categoryCounter}/>  
              <ExpenseList expenseCounter={expenseCounter}/>
            </div>  
            <ExpenseChart expenseChart = {expenseChart}/>
          </>}
        </div>
      )
    }
    </>
  )
}

function ExpenseChart({expenseChart}) {
  const startMonth =  expenseChart[0]?.month || '';
  const startYear = expenseChart[0]?.year || '';
  const endMonth =  expenseChart[expenseChart.length -1]?.month || '';
  const endYear = expenseChart[expenseChart.length -1]?.year || '';

  return (
    <div className="Expense-chart">
      <p>{endMonth}/{endYear}-{startMonth}/{startYear}</p>
      <hr/>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart
          width={400}
          height={350}
          data={expenseChart}
          margin={{
            top: 5,
            right: 5,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="total" stroke="hsl(115, 41%, 43%)" fill="hsl(115, 41%, 43%)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ExpenseList({expenseCounter}) {
  return(
    <div className="ExpenseCounter counter">
      <p>Expense</p>
      <hr/>
      <ul className="CounterList">
        {expenseCounter && Object.entries(expenseCounter).map(([name, counter]) => (
          <li className="CounterListItem">
            <span className="CounterListItemName">{name}</span>
            <span className="CounterListItemCount">{counter}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CategoryCounter({categoryCounter}) {
  return(
    <div className="CategoryCounter counter">
      <p>Categorys</p>
      <hr/>
      <ul className="CounterList">
        {categoryCounter && Object.entries(personalExpenseCategory).map(([key, name]) => (
          <li className="CounterListItem" key={key}>
            <span className="CounterListItemIcon"><FontAwesomeIcon icon={categoryIcons[key]}/> {name && name}</span>
            <span className="CounterListItemCount">{categoryCounter?.[key] || 0}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}