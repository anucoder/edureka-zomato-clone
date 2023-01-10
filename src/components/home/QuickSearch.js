import axios from "axios";
import { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';

function QuickSearch() {
  let [mealTypeList, setMealTypeList] = useState([]);

  let navigate = useNavigate();

  let getQuickSearchPage = (id)=>{
    navigate(`/search-page/${id}`);
  }
  let getMealTypes = async () => {
    try {
      let { data } = await axios.get(
        "https://zomato-clone-be.up.railway.app/api/get-meal-types"
      );
      if (data.status === true) setMealTypeList([...data.mealtypes]);
      else setMealTypeList([]);
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  useEffect(() => {
    getMealTypes();
  }, []);
  

  return (
    <>
      <section className="row justify-content-center">
        <section className="col-10 mt-3">
          <h3 className="fw-bold text-navy">Quick Searches</h3>
          <p className="text-secondary">Discover restaurants by type of meal</p>
        </section>
        <section className="col-10">
          <section className="row py-2">
            <section className="col-12 px-0 d-flex justify-content-between flex-wrap">
              {mealTypeList.map((mealType, index) => {
                return (
                  <section onClick={()=>{getQuickSearchPage(mealType.meal_type)}}
                    key={index}
                    className="px-0 d-flex border border-1 quick-search-item"
                  >
                    <img
                      src={"/images/" + mealType.image}
                      alt=""
                      className="image-item"
                    />
                    <div className="pt-3 px-2">
                      <h4 className="text-navy">{mealType.name}</h4>
                      <p className="small text-muted">{mealType.content}</p>
                    </div>
                  </section>
                );
              })}
            </section>
          </section>
        </section>
      </section>
    </>
  );
}

export default QuickSearch;
