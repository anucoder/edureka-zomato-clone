import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../Header";

function WallPaper() {
  let [locationList, setLocationList] = useState([]);
  let [disabled, setDisabled] = useState(true);

  let getLocationList = async () => {
    try {
      let { data } = await axios.get(
        "http://localhost:5003/api/get-location-list"
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
          `http://localhost:5003/api/get-restaurants-by-loc-id/${value}`
        );
        // console.log(data);
        if (data.status === true) {
          if (data.restaurantListByLoc.length === 0) setDisabled(true);
          else setDisabled(false);
        }
        // setLocationList([...data.loclist]);
        // else setLocationList([]);
      } catch (error) {
        console.log(error);
        alert("Server error");
      }
    }
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
          <Header color=""/>
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
            <div className="w-75 input-group">
              <span className="input-group-text bg-white">
                <i className="fa fa-search text-primary"></i>
              </span>
              <input
                disabled={disabled}
                type="text"
                className="form-control py-2 px-3"
                placeholder="Search for restaurants"
              />
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default WallPaper;
