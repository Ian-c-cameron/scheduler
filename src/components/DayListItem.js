import React from "react";
import classNames from "classnames"
import "components/DayListItem.scss";

export default function DayListItem(props) {
  const dayListClasses = classNames("day-list__item",{
    "day-list__item--selected": props.selected,
    "day-list__item--full": (props.spots === 0)
  })

  const formatSpots = function(spots) {
    let output = " spots remaining"
    if (spots === 0){
      output = "no" + output;
    } else if (spots > 1) {
      output = spots + output;
    } else if (spots === 1) {
      output = "1 spot remaining";
    }
    return output;
  }

  return (
    <li className={dayListClasses} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}