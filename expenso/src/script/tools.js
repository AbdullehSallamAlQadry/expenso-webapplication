import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faUtensils, faCar, faHouse, faBolt, faShoppingBag, faTheaterMasks, faQuestionCircle,  } from "@fortawesome/free-solid-svg-icons";

export const categoryIcons = {
  FOOD: faUtensils,
  TRANSPORT: faCar,
  RENT: faHouse,
  BILLS: faBolt,
  SHOPPING: faShoppingBag,
  ENTERTAINMENT: faTheaterMasks,
  OTHER: faQuestionCircle,
};

export const personalExpenseCategory = Object.freeze({
  FOOD: "Food",
  TRANSPORT: "Transport",
  RENT: "Rent",
  BILLS: "Bills",
  SHOPPING: "Shopping",
  ENTERTAINMENT: "Entertainment",
  OTHER: "Other",
});

export function Loader() {
  return(
    <div className="loader">
      <FontAwesomeIcon icon={faSpinner}/>
    </div>
  )
}

export function Btn({icon, onSet, name}) {
  return(
    <button onClick={onSet}>
      <FontAwesomeIcon icon={icon}/> {name && name}
    </button>
  )
}