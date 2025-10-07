import { useEffect, useRef, useState } from "react";
import { personalExpenseCategory} from "./tools";
import { Expense , NewExpense, UpdateExpense} from "./Expense";
import { Home } from "./Home";

export default function MainContainer({user, selectedSection ,onSelectedSection}) {
  const [userInfo, setUserInfo] = useState([]);
  
  const currencyCategory = Object.freeze({
    yemen : "YER",
    USE: "USD",
  })

  return (
    <div className="seletion-container">
      {
      (selectedSection) === "Home" ? <Home
        userId = {user.id}
      /> :
      (selectedSection) === "Expense" ? <Expense
        personalExpenseCategory = {personalExpenseCategory}
        currencyCategory = {currencyCategory}
        onSelectedSection = {onSelectedSection}
        userId = {user.id}
        onUserInfo = {setUserInfo}
      /> :
      (selectedSection) === "Setting" ? <Setting
      
      /> :
      (selectedSection) === "Support" ? <Support
      
      /> :
      (selectedSection) === "NewExpense" ? <NewExpense 
        personalExpenseCategory = {personalExpenseCategory}
        currencyCategory = {currencyCategory}
        onSelectedSection = {onSelectedSection}
        userId = {user.id}
      /> :
      (selectedSection) === "UpdateExpense" ? <UpdateExpense
        personalExpenseCategory = {personalExpenseCategory}
        currencyCategory = {currencyCategory}
        onSelectedSection = {onSelectedSection}
        user = {userInfo}
      />:
      null
      }
    </div>
  )
}

function Setting() {
  return (
    <div className="Settings-head">
      <h1>Settings</h1>
    </div>
  )
}

function Support() {
  return (
    <h1>Support</h1>
  )
}