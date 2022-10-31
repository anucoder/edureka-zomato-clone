import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../Header";

function WallPaper() {
  let [locationList, setLocationList] = useState([]);
  let [disabled, setDisabled] = useState(true);
  let [restaurantList, setRestaurantList] = useState([]);
  let [restbyLocation,setrestByLocation] = useState([]);

  let getLocationList = async () => {
    try {
      let { data } = await axios.get(
        "https://zomato-clone-int-project.herokuapp.com/api/get-location-list"
      );
      if (data.status === true) setLocationList([...data.loclist]);
      else setLocationList([]);
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  let getLocationId = async (event) => {
    let value = event.target.value;
    if (value !== "") {
      try {
        let { data } = await axios.get(
          `https://zomato-clone-int-project.herokuapp.com/api/get-restaurants-by-loc-id/${value}`
        );
        // console.log(data);
        if (data.status === true) {
          if (data.restaurantListByLoc.length === 0) setDisabled(true);
          else {
            setDisabled(false);
            setRestaurantList([...data.restaurantListByLoc]);
            // console.log(restaurantList)
          }
        }
        // setLocationList([...data.loclist]);
        else setRestaurantList([]);
      } catch (error) {
        console.log(error);
        alert("Server error");
      }
    }
  };

  let getRestaurantList = async (event) => {
    let searchName = event.target.value;
    // console.log(searchName)
    if(searchName!==""){
    let results = restaurantList.filter((restaurant) => {
      return restaurant.name.toLowerCase().includes(searchName.toLowerCase());
    });
    setrestByLocation([...results]);
  }
  else setrestByLocation([])
    // console.log(restbyLocation)
  };

  useEffect(() => {
    getLocationList();
  }, []);

  return (
    <>
      <section className="row main-section align-content-start">
        <header className="col-12 py-3">
          {/* <div className="container d-lg-flex justify-content-end d-none">
            <button className="btn text-white me-3">Login</button>
            <button className="btn text-white border border-white">
              Create an account
            </button>
          </div> */}
          <Header color="" logo={false}/>
        </header>
        <section className="col-12 d-flex flex-column align-items-center justify-content-center">
          <p className="brand-name fw-bold my-lg-2 mb-0">e!</p>
          <p className="h1 text-white my-3 text-center">
            Find the best restaurants, cafés, and bars
          </p>
          <div className="search w-50 d-flex mt-3">
            <select
              className="form-select mb-3 mb-lg-0 w-50 me-lg-3 py-2 px-3"
              onChange={getLocationId}
            >
              <option value="">Please select a location</option>
              {locationList.map((location, index) => {
                return (
                  <option key={index} value={location.location_id}>
                    {location.name},{location.city}
                  </option>
                );
              })}
              ;
            </select>
            <div className="w-75 relative">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="fa fa-search text-primary"></i>
              </span>
              <input
                disabled={disabled}
                type="text"
                className="form-control py-2 px-3"
                placeholder="Search for restaurants"
                onChange={(event) => {
                  getRestaurantList(event);
                }}
              />
            </div>
            <div className="dd2-restaurants bg-white d-none d-lg-block">
              <ul className="ps-0 mb-0">
                {restbyLocation.map((restaurant,index)=>{
                return (<li key={index}>
                  <div className="dd2-result">
                    <img src={"images/" + restaurant.image} alt="breakfast" />
                    <div className="dd2-result-text ms-3">
                      <p className="dd2-title fw-bold mb-0">{restaurant.name}</p>
                      <p className="dd2-sub-title">{restaurant.locality},{restaurant.city}</p>
                    </div>
                  </div>
                </li>);
              })}
              </ul>
            </div>
          </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default WallPaper;
