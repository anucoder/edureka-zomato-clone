import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function SearchPageResult() {
  let { meal_id } = useParams();
  // console.log(meal_id);
  let navigate = useNavigate();
  let mealname = "Breakfast";

  switch (Number(meal_id)) {
    case 1:
      mealname = "Breakfast";
      break;

    case 2:
      mealname = "Lunch";
      break;

    case 3:
      mealname = "Dinner";
      break;

    case 4:
      mealname = "Snacks";
      break;

    case 5:
      mealname = "Drinks";
      break;

    case 6:
      mealname = "NightLife";
      break;
  }

  let [restaurantList, setRestaurantList] = useState([]);
  let [locationList, setLocationList] = useState([]);
  let [filter, setFilter] = useState({ meal_type: meal_id });
  let [pages, setPages] = useState([0]);

  let filterOperation = async (filter) => {
    console.log(filter);
    let URL = "https://zomato-clone-be.up.railway.app/api/filter/";
    try {
      let { data } = await axios.post(URL, filter);
      if (data.status === true) {
        setPages([...Array(data.pages).keys()]);
        setRestaurantList([...data.result_page]);
      } else {
        setRestaurantList([]);
        setPages([]);
      }
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  let makeFilteration = (event, type) => {
    let value = event.target.value;
    let _filter = { ...filter };
    switch (type) {
      case "location":
        _filter["page"]=1;
        if (Number(value) > 0) _filter["location"] = Number(value);
        else delete _filter["location"];
        break;
      case "sort":
        _filter["page"]=1;
        _filter["sort"] = Number(value);
        break;
      case "cost-for-two":
        _filter["page"]=1;
        let costfortwo = value.split("-");
        _filter["lcost"] = costfortwo[0];
        _filter["hcost"] = costfortwo[1];
        break;
      case "cuisine":
        _filter["page"]=1;
        let _cuisine = [];
        if (_filter["cuisine"] !== undefined)
          _cuisine = [..._filter["cuisine"]];
        if (event.target.checked) _cuisine.push(Number(value));
        else {
          let index = _cuisine.indexOf(Number(value));
          _cuisine.splice(index, 1);
        }
        // console.log(_cuisine);
        if (_cuisine.length === 0) delete _filter["cuisine"];
        else _filter["cuisine"] = [..._cuisine];
        break;
    }
    setFilter({ ..._filter });
    filterOperation(_filter);
  };

  //pagination
  let pagination = (page) => {
    let _filter = { ...filter };
    _filter["page"] = page;
    setFilter({ ..._filter });
    filterOperation(_filter);
  };

  let getLocationList = async () => {
    try {
      let { data } = await axios.get(
        "https://zomato-clone-be.up.railway.app/api/get-location-list"
      );
      if (data.status === true) setLocationList([...data.loclist]);
      else setLocationList([]);
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  useEffect(() => {
    filterOperation(filter);
    getLocationList();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-12 px-5 pt-4">
          <p className="h3">{mealname} Places In Delhi</p>
        </div>
        {/* <!-- food item --> */}
        <div className="col-12 d-flex flex-wrap px-lg-5 px-md-5 pt-4">
          <div className="food-shadow col-12 col-lg-3 col-md-4 me-5 p-3 mb-4">
            <div className="d-flex justify-content-between">
              <p className="fw-bold m-0">Filters</p>
              <button
                className="d-lg-none d-md-none btn"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFilter"
                aria-controls="collapseFilter"
              >
                <span className="fa fa-eye"></span>
              </button>
            </div>
            {/* <!-- Collapse start  --> */}
            <div className="collapse show" id="collapseFilter">
              <div>
                <label htmlFor="" className="form-label">
                  Select Location
                </label>
                <select
                  onChange={(event) => makeFilteration(event, "location")}
                  className="form-select form-select-sm"
                >
                  <option value="-1">------Select-----</option>
                  {locationList.map((location, index) => {
                    return (
                      <option key={index} value={location.location_id}>
                        {location.name},{location.city}
                      </option>
                    );
                  })}
                  ;
                </select>
              </div>
              <p className="mt-4 mb-2 fw-bold">Cuisine</p>
              <div>
                <div className="ms-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    value="1"
                    onChange={(event) => makeFilteration(event, "cuisine")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    North Indian
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    value="2"
                    onChange={(event) => makeFilteration(event, "cuisine")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    South Indian
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    value="3"
                    onChange={(event) => makeFilteration(event, "cuisine")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    Chineese
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    value="4"
                    onChange={(event) => makeFilteration(event, "cuisine")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    Fast food
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    value="5"
                    onChange={(event) => makeFilteration(event, "cuisine")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    Street food
                  </label>
                </div>
              </div>
              <p className="mt-4 mb-2 form-check fw-bold">Cost for Two</p>
              <div>
                <div className="ms-1">
                  <input
                    type="radio"
                    name="costfortwo"
                    className="form-check-input"
                    value="0-500"
                    onChange={(event) => makeFilteration(event, "cost-for-two")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    less then 500
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="radio"
                    name="costfortwo"
                    className="form-check-input"
                    value="500-1000"
                    onChange={(event) => makeFilteration(event, "cost-for-two")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    500 to 1000
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="radio"
                    name="costfortwo"
                    className="form-check-input"
                    value="1000-1500"
                    onChange={(event) => makeFilteration(event, "cost-for-two")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    1000 to 1500
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="radio"
                    name="costfortwo"
                    className="form-check-input"
                    value="1500-2000"
                    onChange={(event) => makeFilteration(event, "cost-for-two")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    1500 to 2000
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="radio"
                    name="costfortwo"
                    className="form-check-input"
                    value="2000-100000"
                    onChange={(event) => makeFilteration(event, "cost-for-two")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    2000+
                  </label>
                </div>
              </div>
              <p className="mt-4 mb-2 fw-bold">Sort</p>
              <div>
                <div className="ms-1 form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="sort"
                    value="1"
                    onChange={(event) => makeFilteration(event, "sort")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    Price low to high
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="sort"
                    value="-1"
                    onChange={(event) => makeFilteration(event, "sort")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    Price high to low
                  </label>
                </div>
              </div>
            </div>
            {/* <!-- Collapse end --> */}
          </div>
          {/* <!-- search result --> */}
          <div className="col-12 col-lg-8 col-md-7">
            {restaurantList.map((restaurant, index) => {
              return (
                <div
                  className="col-12 food-shadow p-4 mb-4"
                  key={index}
                  onClick={() => {
                    navigate("/restaurant/" + restaurant._id);
                  }}
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={"/images/" + restaurant.image}
                      alt="meal"
                      className="food-item"
                    />
                    <div className="ms-5">
                      <p className="h4 fw-bold">{restaurant.name}</p>
                      <span className="fw-bold text-muted">
                        {restaurant.city}
                      </span>
                      <p className="m-0 text-muted">
                        <i
                          className="fa fa-map-marker fa-2x text-danger"
                          aria-hidden="true"
                        ></i>
                        {restaurant.locality}, {restaurant.city}
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex">
                    <div>
                      <p className="m-0">CUISINES:</p>
                      <p className="m-0">COST FOR TWO:</p>
                    </div>
                    <div className="ms-5">
                      <p className="m-0 fw-bold">
                        {restaurant.cuisine.reduce((pValue, cValue) => {
                          return pValue.name + ", " + cValue.name;
                        })}
                      </p>
                      <p className="m-0 fw-bold">
                        <i className="fa fa-inr" aria-hidden="true"></i>{" "}
                        {restaurant.min_price}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {pages.length > 1 ? (
              <div className="col-12 pagination d-flex justify-content-center">
                <ul className="pages">
                  {/* <li className="hand">&lt;</li> */}
                  {pages.map((page, index) => {
                    return (
                      <li
                        key={index}
                        className="hand"
                        onClick={() => pagination(page + 1)}
                      >
                        {page + 1}
                      </li>
                    );
                  })}
                  {/* <li className="hand">&gt;</li> */}
                </ul>
              </div>
            ) : pages.length == 0 ? (
              <div className="text-muted fw-bold fs-5"> No Results</div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchPageResult;
